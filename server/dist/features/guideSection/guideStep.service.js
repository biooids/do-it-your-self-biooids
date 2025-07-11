"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideStepService = void 0;
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
const error_factory_js_1 = require("../../utils/error.factory.js");
class GuideStepService {
    async verifyAuthorship(userId, postId) {
        const post = await prisma_js_1.default.post.findUnique({ where: { id: postId } });
        if (!post || post.authorId !== userId) {
            throw (0, error_factory_js_1.createHttpError)(403, "Not authorized to modify this guide.");
        }
    }
    async create(userId, postId, data) {
        await this.verifyAuthorship(userId, postId);
        return prisma_js_1.default.guideStep.create({
            data: {
                ...data,
                order: Number(data.order),
                post: { connect: { id: postId } },
            },
        });
    }
    async update(userId, stepId, data) {
        const step = await prisma_js_1.default.guideStep.findUnique({
            where: { id: stepId },
            include: { post: { select: { authorId: true } } },
        });
        if (!step || step.post.authorId !== userId) {
            throw (0, error_factory_js_1.createHttpError)(403, "Not authorized to edit this step.");
        }
        const updateData = data.order
            ? { ...data, order: Number(data.order) }
            : data;
        return prisma_js_1.default.guideStep.update({ where: { id: stepId }, data: updateData });
    }
    async delete(userId, stepId) {
        const step = await prisma_js_1.default.guideStep.findUnique({
            where: { id: stepId },
            include: { post: { select: { authorId: true } } },
        });
        if (!step || step.post.authorId !== userId) {
            throw (0, error_factory_js_1.createHttpError)(403, "Not authorized to delete this step.");
        }
        await prisma_js_1.default.guideStep.delete({ where: { id: stepId } });
    }
}
exports.guideStepService = new GuideStepService();
//# sourceMappingURL=guideStep.service.js.map