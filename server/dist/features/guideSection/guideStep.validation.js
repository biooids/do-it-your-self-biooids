"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuideStepSchema = exports.createGuideStepSchema = void 0;
const zod_1 = require("zod");
exports.createGuideStepSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().optional(),
        order: zod_1.z.coerce.number().int().positive(),
    }),
});
exports.updateGuideStepSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().optional(),
        order: zod_1.z.coerce.number().int().positive().optional(),
    }),
});
//# sourceMappingURL=guideStep.validation.js.map