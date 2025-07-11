"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUpdateSchema = exports.createUpdateSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../prisma/generated/prisma");
const updateCategoryValues = Object.values(prisma_1.UpdateCategory);
exports.createUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(3, "Title must be at least 3 characters long.")
            .max(255),
        content: zod_1.z.string().min(10, "Content must be at least 10 characters long."),
        category: zod_1.z.enum(updateCategoryValues, {
            errorMap: () => ({ message: "Please select a valid category." }),
        }),
        version: zod_1.z.string().optional().nullable(),
    }),
});
exports.updateUpdateSchema = zod_1.z.object({
    body: exports.createUpdateSchema.shape.body.partial(),
});
//# sourceMappingURL=update.validation.js.map