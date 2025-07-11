"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
const error_factory_js_1 = require("../../utils/error.factory.js");
const logger_js_1 = require("../../config/logger.js");
const cloudinary_js_1 = require("../../config/cloudinary.js");
class PostService {
    async createPost(authorId, data) {
        const { images, tags, ...postData } = data;
        return prisma_js_1.default.$transaction(async (tx) => {
            const createInput = {
                title: postData.title,
                description: postData.description,
                content: postData.content,
                category: postData.category,
                author: { connect: { id: authorId } },
                tags: {
                    create: tags.map((tag) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tag.name },
                                create: { name: tag.name },
                            },
                        },
                    })),
                },
                ...(postData.externalLink && { externalLink: postData.externalLink }),
                ...(postData.githubLink && { githubLink: postData.githubLink }),
            };
            const newPost = await tx.post.create({ data: createInput });
            if (images && images.length > 0) {
                await tx.postImage.createMany({
                    data: images.map((img, index) => ({
                        ...img,
                        postId: newPost.id,
                        order: index + 1,
                    })),
                });
            }
            logger_js_1.logger.info({ postId: newPost.id, authorId }, "New post created successfully.");
            return tx.post.findUniqueOrThrow({
                where: { id: newPost.id },
                include: {
                    images: { orderBy: { order: "asc" } },
                    tags: { include: { tag: true } },
                },
            });
        });
    }
    async getPostById(postId, userId) {
        const post = await prisma_js_1.default.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: { id: true, name: true, username: true, profileImage: true },
                },
                images: { orderBy: { order: "asc" } },
                tags: { include: { tag: true } },
                steps: {
                    orderBy: { order: "asc" },
                    include: {
                        sections: {
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        });
        if (!post) {
            return null;
        }
        if (userId) {
            const like = await prisma_js_1.default.postLike.findUnique({
                where: { userId_postId: { userId, postId } },
            });
            const save = await prisma_js_1.default.postSave.findUnique({
                where: { userId_postId: { userId, postId } },
            });
            return {
                ...post,
                isLikedByCurrentUser: !!like,
                isSavedByCurrentUser: !!save,
            };
        }
        return {
            ...post,
            isLikedByCurrentUser: false,
            isSavedByCurrentUser: false,
        };
    }
    async getAllPosts(filters, userId) {
        const limit = filters.limit ? parseInt(String(filters.limit), 10) : 10;
        const page = filters.page ? parseInt(String(filters.page), 10) : 1;
        const { q, category, sort = "newest", tags, authorId, likedByUserId, savedByUserId, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (authorId) {
            where.authorId = authorId;
        }
        if (likedByUserId) {
            where.likedBy = { some: { userId: likedByUserId } };
        }
        if (savedByUserId) {
            where.savedBy = { some: { userId: savedByUserId } };
        }
        if (category) {
            where.category = category;
        }
        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
                { author: { name: { contains: q, mode: "insensitive" } } },
                { author: { username: { contains: q, mode: "insensitive" } } },
            ];
        }
        if (tags) {
            const tagList = tags.split(",");
            if (tagList.length > 0) {
                where.tags = {
                    some: {
                        tag: {
                            name: {
                                in: tagList,
                                mode: "insensitive",
                            },
                        },
                    },
                };
            }
        }
        const orderBy = {};
        switch (sort) {
            case "oldest":
                orderBy.createdAt = "asc";
                break;
            case "title-asc":
                orderBy.title = "asc";
                break;
            case "title-desc":
                orderBy.title = "desc";
                break;
            case "newest":
            default:
                orderBy.createdAt = "desc";
                break;
        }
        const [posts, total] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.post.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                    images: { orderBy: { order: "asc" } },
                    tags: { include: { tag: true } },
                },
            }),
            prisma_js_1.default.post.count({ where }),
        ]);
        if (!userId || posts.length === 0) {
            return {
                posts: posts.map((p) => ({
                    ...p,
                    isLikedByCurrentUser: false,
                    isSavedByCurrentUser: false,
                })),
                total,
            };
        }
        const postIds = posts.map((p) => p.id);
        const userLikes = await prisma_js_1.default.postLike.findMany({
            where: { userId: userId, postId: { in: postIds } },
            select: { postId: true },
        });
        const userSaves = await prisma_js_1.default.postSave.findMany({
            where: { userId: userId, postId: { in: postIds } },
            select: { postId: true },
        });
        const likedPostIds = new Set(userLikes.map((like) => like.postId));
        const savedPostIds = new Set(userSaves.map((save) => save.postId));
        const enrichedPosts = posts.map((post) => ({
            ...post,
            isLikedByCurrentUser: likedPostIds.has(post.id),
            isSavedByCurrentUser: savedPostIds.has(post.id),
        }));
        return { posts: enrichedPosts, total };
    }
    async updatePost(userId, postId, data) {
        const { retainedImageUrls = [], newImages = [], tags, postTags, ...textData } = data;
        const postToUpdate = await prisma_js_1.default.post.findUnique({
            where: { id: postId },
            include: { images: true },
        });
        if (!postToUpdate)
            throw (0, error_factory_js_1.createHttpError)(404, "Post not found.");
        if (postToUpdate.authorId !== userId)
            throw (0, error_factory_js_1.createHttpError)(403, "You are not authorized to edit this post.");
        const imagesToDelete = postToUpdate.images.filter((img) => !retainedImageUrls.includes(img.url));
        if (imagesToDelete.length > 0) {
            const deletePromises = imagesToDelete.map((img) => (0, cloudinary_js_1.deleteFromCloudinary)(img.publicId).catch((err) => logger_js_1.logger.error({ err, publicId: img.publicId }, "Cloudinary asset deletion failed")));
            Promise.allSettled(deletePromises);
        }
        return prisma_js_1.default.$transaction(async (tx) => {
            if (imagesToDelete.length > 0) {
                await tx.postImage.deleteMany({
                    where: { id: { in: imagesToDelete.map((img) => img.id) } },
                });
            }
            if (newImages && newImages.length > 0) {
                await tx.postImage.createMany({
                    data: newImages.map((img, index) => ({
                        ...img,
                        postId,
                        order: retainedImageUrls.length + index + 1,
                    })),
                });
            }
            const updateInput = { ...textData };
            if (tags) {
                updateInput.tags = {
                    deleteMany: {},
                    create: tags.map((tag) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tag.name },
                                create: { name: tag.name },
                            },
                        },
                    })),
                };
            }
            const updatedPost = await tx.post.update({
                where: { id: postId },
                data: updateInput,
                include: {
                    images: { orderBy: { order: "asc" } },
                    tags: { include: { tag: true } },
                },
            });
            logger_js_1.logger.info({ postId, userId }, "Post updated successfully.");
            return updatedPost;
        });
    }
    async deletePost(userId, userRole, postId) {
        const postToDelete = await prisma_js_1.default.post.findUnique({
            where: { id: postId },
            include: { images: true },
        });
        if (!postToDelete)
            return;
        if (postToDelete.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw (0, error_factory_js_1.createHttpError)(403, "You are not authorized to delete this post.");
        }
        if (postToDelete.images.length > 0) {
            const deletePromises = postToDelete.images.map((img) => (0, cloudinary_js_1.deleteFromCloudinary)(img.publicId).catch((err) => logger_js_1.logger.error({ err, publicId: img.publicId }, "Cloudinary asset deletion failed")));
            Promise.allSettled(deletePromises);
        }
        await prisma_js_1.default.post.delete({ where: { id: postId } });
        logger_js_1.logger.info({ postId, userId }, "Post and associated assets deleted.");
    }
    async likePost(userId, postId) {
        const existingLike = await prisma_js_1.default.postLike.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (existingLike) {
            return prisma_js_1.default.post.findUniqueOrThrow({ where: { id: postId } });
        }
        const [, updatedPost] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.postLike.create({ data: { userId, postId } }),
            prisma_js_1.default.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } },
            }),
        ]);
        return updatedPost;
    }
    async unlikePost(userId, postId) {
        const existingLike = await prisma_js_1.default.postLike.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (!existingLike) {
            return prisma_js_1.default.post.findUniqueOrThrow({ where: { id: postId } });
        }
        const [, updatedPost] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.postLike.delete({ where: { id: existingLike.id } }),
            prisma_js_1.default.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } },
            }),
        ]);
        return updatedPost;
    }
    async savePost(userId, postId) {
        const existingSave = await prisma_js_1.default.postSave.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (existingSave) {
            return prisma_js_1.default.post.findUniqueOrThrow({ where: { id: postId } });
        }
        const [, updatedPost] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.postSave.create({ data: { userId, postId } }),
            prisma_js_1.default.post.update({
                where: { id: postId },
                data: { savedCount: { increment: 1 } },
            }),
        ]);
        return updatedPost;
    }
    async unsavePost(userId, postId) {
        const existingSave = await prisma_js_1.default.postSave.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (!existingSave) {
            return prisma_js_1.default.post.findUniqueOrThrow({ where: { id: postId } });
        }
        const [, updatedPost] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.postSave.delete({ where: { id: existingSave.id } }),
            prisma_js_1.default.post.update({
                where: { id: postId },
                data: { savedCount: { decrement: 1 } },
            }),
        ]);
        return updatedPost;
    }
    async sharePost(sharerId, postId, platform) {
        const [, updatedPost] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.postShare.create({ data: { sharerId, postId, platform } }),
            prisma_js_1.default.post.update({
                where: { id: postId },
                data: { sharesCount: { increment: 1 } },
            }),
        ]);
        return updatedPost;
    }
    async recordPostView(userId, postId) {
        const existingView = await prisma_js_1.default.postView.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (existingView) {
            await prisma_js_1.default.postView.update({
                where: { id: existingView.id },
                data: { viewCountByUser: { increment: 1 } },
            });
        }
        else {
            try {
                await prisma_js_1.default.$transaction([
                    prisma_js_1.default.postView.create({ data: { userId, postId } }),
                    prisma_js_1.default.post.update({
                        where: { id: postId },
                        data: { viewsCount: { increment: 1 } },
                    }),
                ]);
            }
            catch (error) {
                if (error.code === "P2002") {
                    console.log("Race condition on PostView creation handled gracefully. Ignoring duplicate create.");
                }
                else {
                    throw error;
                }
            }
        }
    }
}
exports.PostService = PostService;
exports.postService = new PostService();
//# sourceMappingURL=post.service.js.map