"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateUserProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        username: zod_1.z
            .string()
            .min(3, "Username must be at least 3 characters")
            .optional(),
        bio: zod_1.z.string().max(250, "Bio cannot exceed 250 characters").optional(),
        title: zod_1.z.string().max(100).optional(),
        location: zod_1.z.string().max(100).optional(),
    }),
});
//# sourceMappingURL=user.validation.js.map