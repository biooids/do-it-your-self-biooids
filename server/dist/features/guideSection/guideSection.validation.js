"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuideSectionSchema = exports.createGuideSectionSchema = void 0;
const zod_1 = require("zod");
exports.createGuideSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters long."),
        content: zod_1.z.string().min(10, "Content must be at least 10 characters long."),
        order: zod_1.z.coerce.number().int().positive("Order must be a positive number."),
        videoUrl: zod_1.z
            .string()
            .url("Please provide a valid URL.")
            .optional()
            .or(zod_1.z.literal("")),
    }),
});
exports.updateGuideSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        content: zod_1.z.string().min(10).optional(),
        order: zod_1.z.coerce.number().int().positive().optional(),
        videoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    }),
});
//# sourceMappingURL=guideSection.validation.js.map