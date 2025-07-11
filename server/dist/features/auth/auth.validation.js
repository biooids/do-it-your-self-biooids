"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Please enter a valid email address."),
        username: zod_1.z.string().min(3, "Username must be at least 3 characters long."),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters long."),
        name: zod_1.z.string().min(1, "Your name is required."),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .min(1, "Email is required.")
            .email("Please enter a valid email address."),
        password: zod_1.z.string().min(1, "Password is required."),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        currentPassword: zod_1.z
            .string()
            .min(1, "You must enter your current password."),
        newPassword: zod_1.z
            .string()
            .min(8, "Your new password must be at least 8 characters long."),
    })
        .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from your current password.",
        path: ["newPassword"],
    }),
});
//# sourceMappingURL=auth.validation.js.map