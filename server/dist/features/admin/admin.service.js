"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
class AdminService {
    async getDashboardStats() {
        const [totalUsers, totalPosts, totalComments, totalLikes, totalSaves, totalShares,] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.user.count(),
            prisma_js_1.default.post.count(),
            prisma_js_1.default.comment.count(),
            prisma_js_1.default.postLike.count(),
            prisma_js_1.default.postSave.count(),
            prisma_js_1.default.postShare.count(),
        ]);
        return {
            totalUsers,
            totalPosts,
            totalComments,
            totalLikes,
            totalSaves,
            totalShares,
        };
    }
    async getAllUsers(query) {
        const { page = 1, limit = 10, q, sortBy = "joinedAt", order = "desc", } = query;
        const where = {};
        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { username: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
            ];
        }
        const [users, total] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: order },
                include: { _count: { select: { posts: true, comments: true } } },
            }),
            prisma_js_1.default.user.count({ where }),
        ]);
        return { users: users, total };
    }
    async getAllPosts(query) {
        const { page = 1, limit = 10, q, sortBy = "createdAt", order = "desc", filterByCategory, } = query;
        const where = {};
        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { author: { name: { contains: q, mode: "insensitive" } } },
                { author: { username: { contains: q, mode: "insensitive" } } },
            ];
        }
        if (filterByCategory) {
            where.category = filterByCategory;
        }
        const [posts, total] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.post.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: order },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                    images: { select: { url: true }, take: 1, orderBy: { order: "asc" } },
                },
            }),
            prisma_js_1.default.post.count({ where }),
        ]);
        return { posts: posts, total };
    }
    async getAllComments(query) {
        const { page = 1, limit = 10, q, sortBy = "createdAt", order = "desc", } = query;
        const where = {};
        if (q) {
            where.OR = [
                { text: { contains: q, mode: "insensitive" } },
                { author: { username: { contains: q, mode: "insensitive" } } },
                { post: { title: { contains: q, mode: "insensitive" } } },
            ];
        }
        const [comments, total] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.comment.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: order },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                    post: { select: { id: true, title: true } },
                },
            }),
            prisma_js_1.default.comment.count({ where }),
        ]);
        return { comments: comments, total };
    }
    async updateUserRole(userId, newRole) {
        return prisma_js_1.default.user.update({
            where: { id: userId },
            data: { systemRole: newRole },
        });
    }
    async deleteUser(userId) {
        await prisma_js_1.default.user.delete({ where: { id: userId } });
    }
    async deletePost(postId) {
        await prisma_js_1.default.post.delete({ where: { id: postId } });
    }
    async deleteComment(commentId) {
        await prisma_js_1.default.comment.delete({ where: { id: commentId } });
    }
}
exports.adminService = new AdminService();
//# sourceMappingURL=admin.service.js.map