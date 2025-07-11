"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateService = void 0;
const prisma_1 = __importDefault(require("../../db/prisma"));
const error_factory_1 = require("../../utils/error.factory");
class UpdateService {
    async create(data, authorId) {
        const newUpdate = await prisma_1.default.update.create({
            data: {
                ...data,
                author: { connect: { id: authorId } },
            },
            include: { author: { select: { name: true, profileImage: true } } },
        });
        return newUpdate;
    }
    async findAll(pagination) {
        const { skip, take } = pagination;
        const [updates, total] = await prisma_1.default.$transaction([
            prisma_1.default.update.findMany({
                skip,
                take,
                orderBy: { publishedAt: "desc" },
                include: { author: { select: { name: true, profileImage: true } } },
            }),
            prisma_1.default.update.count(),
        ]);
        return { updates, total };
    }
    async findOne(id) {
        const update = await prisma_1.default.update.findUnique({
            where: { id },
            include: { author: { select: { name: true, profileImage: true } } },
        });
        if (!update)
            throw (0, error_factory_1.createHttpError)(404, "Update not found.");
        return update;
    }
    async update(id, data, userId, userRole) {
        const updateToModify = await this.findOne(id);
        if (updateToModify.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw (0, error_factory_1.createHttpError)(403, "You are not authorized to modify this update.");
        }
        const updated = await prisma_1.default.update.update({
            where: { id },
            data,
            include: { author: { select: { name: true, profileImage: true } } },
        });
        return updated;
    }
    async remove(id, userId, userRole) {
        const updateToModify = await this.findOne(id);
        if (updateToModify.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw (0, error_factory_1.createHttpError)(403, "You are not authorized to delete this update.");
        }
        await prisma_1.default.update.delete({ where: { id } });
    }
}
exports.updateService = new UpdateService();
//# sourceMappingURL=update.service.js.map