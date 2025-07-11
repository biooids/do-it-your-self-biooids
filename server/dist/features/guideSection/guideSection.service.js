"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideSectionService = void 0;
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
const error_factory_js_1 = require("../../utils/error.factory.js");
const cloudinary_js_1 = require("../../config/cloudinary.js");
class GuideSectionService {
    async verifyAuthorshipBySection(userId, sectionId) {
        const section = await prisma_js_1.default.guideSection.findUnique({
            where: { id: sectionId },
            include: { step: { include: { post: { select: { authorId: true } } } } },
        });
        if (!section || section.step.post.authorId !== userId) {
            throw (0, error_factory_js_1.createHttpError)(403, "You are not authorized to modify this section.");
        }
        return section;
    }
    async verifyAuthorshipByStep(userId, stepId) {
        const step = await prisma_js_1.default.guideStep.findUnique({
            where: { id: stepId },
            include: { post: { select: { authorId: true } } },
        });
        if (!step || step.post.authorId !== userId) {
            throw (0, error_factory_js_1.createHttpError)(403, "You are not authorized to add a section to this step.");
        }
    }
    async create(userId, stepId, data, imageFile) {
        await this.verifyAuthorshipByStep(userId, stepId);
        const createData = {
            ...data,
            order: Number(data.order),
            step: { connect: { id: stepId } },
        };
        if (imageFile) {
            const result = await (0, cloudinary_js_1.uploadToCloudinary)(imageFile.path, "guide_sections");
            createData.imageUrl = result.secure_url;
            createData.imagePublicId = result.public_id;
        }
        return prisma_js_1.default.guideSection.create({ data: createData });
    }
    async update(userId, sectionId, data, imageFile) {
        const guideSection = await this.verifyAuthorshipBySection(userId, sectionId);
        const updateData = { ...data };
        if (data.order) {
            updateData.order = Number(data.order);
        }
        if (imageFile) {
            if (guideSection.imagePublicId) {
                await (0, cloudinary_js_1.deleteFromCloudinary)(guideSection.imagePublicId);
            }
            const result = await (0, cloudinary_js_1.uploadToCloudinary)(imageFile.path, "guide_sections");
            updateData.imageUrl = result.secure_url;
            updateData.imagePublicId = result.public_id;
        }
        return prisma_js_1.default.guideSection.update({
            where: { id: sectionId },
            data: updateData,
        });
    }
    async delete(userId, sectionId) {
        const guideSection = await this.verifyAuthorshipBySection(userId, sectionId);
        if (guideSection.imagePublicId) {
            await (0, cloudinary_js_1.deleteFromCloudinary)(guideSection.imagePublicId);
        }
        await prisma_js_1.default.guideSection.delete({ where: { id: sectionId } });
    }
}
exports.guideSectionService = new GuideSectionService();
//# sourceMappingURL=guideSection.service.js.map