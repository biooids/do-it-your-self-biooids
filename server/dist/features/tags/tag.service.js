"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagService = void 0;
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
class TagService {
    async getAllTags(filters) {
        const { category, likedByUserId, savedByUserId } = filters;
        const where = {};
        const postFilter = {};
        if (category) {
            postFilter.category = category;
        }
        if (likedByUserId) {
            postFilter.likedBy = { some: { userId: likedByUserId } };
        }
        if (savedByUserId) {
            postFilter.savedBy = { some: { userId: savedByUserId } };
        }
        if (Object.keys(postFilter).length > 0) {
            where.posts = { some: { post: postFilter } };
        }
        return prisma_js_1.default.tag.findMany({
            where,
            orderBy: { name: "asc" },
        });
    }
}
exports.tagService = new TagService();
//# sourceMappingURL=tag.service.js.map