"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const prisma_1 = __importDefault(require("../../db/prisma"));
const prisma_2 = require("../../../prisma/generated/prisma");
const error_factory_1 = require("../../utils/error.factory");
const MAX_COMMENT_LEVEL_ALLOWED = 5;
const commentInclude = (currentUserId) => {
    const include = {
        author: {
            select: { id: true, name: true, username: true, profileImage: true },
        },
        _count: {
            select: {
                children: true,
            },
        },
    };
    if (currentUserId) {
        include.reactions = {
            where: { userId: currentUserId },
            select: { reaction: true },
        };
    }
    return include;
};
class CommentService {
    processRawCommentForAPI(rawComment) {
        const userReaction = rawComment.reactions?.[0]?.reaction;
        return {
            id: rawComment.id,
            text: rawComment.text,
            postId: rawComment.postId,
            authorId: rawComment.authorId,
            parentId: rawComment.parentId,
            level: rawComment.level,
            createdAt: rawComment.createdAt,
            updatedAt: rawComment.updatedAt,
            author: rawComment.author,
            likes: rawComment.likesCount,
            dislikes: rawComment.dislikesCount,
            isLikedByCurrentUser: userReaction === prisma_2.CommentReactionState.LIKED,
            isDislikedByCurrentUser: userReaction === prisma_2.CommentReactionState.DISLIKED,
            directRepliesCount: rawComment._count?.children || 0,
        };
    }
    async create(postId, authorId, data) {
        const post = await prisma_1.default.post.findUnique({ where: { id: postId } });
        if (!post)
            throw (0, error_factory_1.createHttpError)(404, "Post not found.");
        const [newComment] = await prisma_1.default.$transaction([
            prisma_1.default.comment.create({
                data: { text: data.text, postId, authorId, level: 0 },
                include: commentInclude(authorId),
            }),
            prisma_1.default.post.update({
                where: { id: postId },
                data: { commentsCount: { increment: 1 } },
            }),
        ]);
        return {
            ...this.processRawCommentForAPI(newComment),
            children: [],
        };
    }
    async createReply(parentId, authorId, data) {
        const parentComment = await prisma_1.default.comment.findUnique({
            where: { id: parentId },
        });
        if (!parentComment)
            throw (0, error_factory_1.createHttpError)(404, "Parent comment not found.");
        const newLevel = parentComment.level + 1;
        if (newLevel > MAX_COMMENT_LEVEL_ALLOWED) {
            throw (0, error_factory_1.createHttpError)(403, `Maximum comment depth of ${MAX_COMMENT_LEVEL_ALLOWED} exceeded.`);
        }
        const [newReply] = await prisma_1.default.$transaction([
            prisma_1.default.comment.create({
                data: {
                    text: data.text,
                    postId: parentComment.postId,
                    authorId,
                    parentId,
                    level: newLevel,
                },
                include: commentInclude(authorId),
            }),
            prisma_1.default.post.update({
                where: { id: parentComment.postId },
                data: { commentsCount: { increment: 1 } },
            }),
        ]);
        return {
            ...this.processRawCommentForAPI(newReply),
            children: [],
        };
    }
    async findAllForPost(postId, currentUserId, pagination) {
        const [rawComments, total] = await prisma_1.default.$transaction([
            prisma_1.default.comment.findMany({
                where: { postId, parentId: null },
                orderBy: {
                    [pagination?.sortBy || "createdAt"]: pagination?.order || "desc",
                },
                skip: pagination?.skip || 0,
                take: pagination?.take || 10,
                include: commentInclude(currentUserId),
            }),
            prisma_1.default.comment.count({ where: { postId, parentId: null } }),
        ]);
        const detailedComments = rawComments.map((c) => ({
            ...this.processRawCommentForAPI(c),
            children: [],
        }));
        return { comments: detailedComments, total };
    }
    async findRepliesForComment(parentId, currentUserId, pagination) {
        const [rawReplies, total] = await prisma_1.default.$transaction([
            prisma_1.default.comment.findMany({
                where: { parentId },
                orderBy: {
                    [pagination?.sortBy || "createdAt"]: pagination?.order || "asc",
                },
                skip: pagination?.skip || 0,
                take: pagination?.take || 5,
                include: commentInclude(currentUserId),
            }),
            prisma_1.default.comment.count({ where: { parentId } }),
        ]);
        const detailedReplies = rawReplies.map((c) => ({
            ...this.processRawCommentForAPI(c),
            children: [],
        }));
        return { replies: detailedReplies, total };
    }
    async update(commentId, userId, userRole, data) {
        const comment = await prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            throw (0, error_factory_1.createHttpError)(404, "Comment not found.");
        if (comment.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw (0, error_factory_1.createHttpError)(403, "You are not authorized to edit this comment.");
        }
        const updatedComment = await prisma_1.default.comment.update({
            where: { id: commentId },
            data: { text: data.text },
            include: commentInclude(userId),
        });
        return {
            ...this.processRawCommentForAPI(updatedComment),
            children: [],
        };
    }
    async delete(commentId, userId, userRole) {
        const commentToDelete = await prisma_1.default.comment.findUnique({
            where: { id: commentId },
            include: { _count: { select: { children: true } } },
        });
        if (!commentToDelete)
            throw (0, error_factory_1.createHttpError)(404, "Comment not found.");
        if (commentToDelete.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw (0, error_factory_1.createHttpError)(403, "You are not authorized to delete this comment.");
        }
        const countToDelete = 1 + (commentToDelete._count?.children || 0);
        await prisma_1.default.$transaction([
            prisma_1.default.comment.delete({ where: { id: commentId } }),
            prisma_1.default.post.update({
                where: { id: commentToDelete.postId },
                data: { commentsCount: { decrement: countToDelete } },
            }),
        ]);
    }
    async toggleReaction(commentId, userId, data) {
        const comment = await prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            throw (0, error_factory_1.createHttpError)(404, "Comment not found.");
        const existingReaction = await prisma_1.default.commentUserReaction.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });
        await prisma_1.default.$transaction(async (tx) => {
            if (existingReaction) {
                if (existingReaction.reaction === data.reaction) {
                    await tx.commentUserReaction.delete({
                        where: { id: existingReaction.id },
                    });
                    if (data.reaction === "LIKED") {
                        await tx.comment.update({
                            where: { id: commentId },
                            data: { likesCount: { decrement: 1 } },
                        });
                    }
                    else {
                        await tx.comment.update({
                            where: { id: commentId },
                            data: { dislikesCount: { decrement: 1 } },
                        });
                    }
                }
                else {
                    await tx.commentUserReaction.update({
                        where: { id: existingReaction.id },
                        data: { reaction: data.reaction },
                    });
                    if (data.reaction === "LIKED") {
                        await tx.comment.update({
                            where: { id: commentId },
                            data: {
                                likesCount: { increment: 1 },
                                dislikesCount: { decrement: 1 },
                            },
                        });
                    }
                    else {
                        await tx.comment.update({
                            where: { id: commentId },
                            data: {
                                likesCount: { decrement: 1 },
                                dislikesCount: { increment: 1 },
                            },
                        });
                    }
                }
            }
            else {
                await tx.commentUserReaction.create({
                    data: { userId, commentId, reaction: data.reaction },
                });
                if (data.reaction === "LIKED") {
                    await tx.comment.update({
                        where: { id: commentId },
                        data: { likesCount: { increment: 1 } },
                    });
                }
                else {
                    await tx.comment.update({
                        where: { id: commentId },
                        data: { dislikesCount: { increment: 1 } },
                    });
                }
            }
        });
        const finalCommentState = await prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        const finalUserReaction = await prisma_1.default.commentUserReaction.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });
        return {
            likes: finalCommentState?.likesCount ?? 0,
            dislikes: finalCommentState?.dislikesCount ?? 0,
            isLikedByCurrentUser: finalUserReaction?.reaction === "LIKED",
            isDislikedByCurrentUser: finalUserReaction?.reaction === "DISLIKED",
        };
    }
}
exports.commentService = new CommentService();
//# sourceMappingURL=comment.service.js.map