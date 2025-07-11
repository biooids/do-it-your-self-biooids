"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../prisma/generated/prisma");
const postCategoryValues = Object.values(prisma_1.PostCategory);
const preprocessTags = (val) => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    }
    return val;
};
const externalLinkSchema = zod_1.z
    .string()
    .optional()
    .or(zod_1.z.literal(""))
    .superRefine((url, ctx) => {
    if (url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "URL must start with 'http://' or 'https://'.",
            });
        }
        try {
            new URL(url);
        }
        catch (error) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Please enter a valid URL structure.",
            });
        }
    }
});
const strictGitHubLinkSchema = zod_1.z
    .string()
    .optional()
    .or(zod_1.z.literal(""))
    .superRefine((url, ctx) => {
    if (url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "URL must start with 'http://' or 'https://'.",
            });
            return;
        }
        try {
            const hostname = new URL(url).hostname;
            if (hostname !== "github.com" && !hostname.endsWith(".github.com")) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "URL must be a valid link from github.com.",
                });
            }
        }
        catch (error) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Please enter a valid URL structure.",
            });
        }
    }
});
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(255),
        description: zod_1.z.string().min(1, "Description is required.").max(500),
        content: zod_1.z.string().min(1, "Post content cannot be empty."),
        category: zod_1.z.enum(postCategoryValues, {
            errorMap: () => ({ message: "Please select a valid category." }),
        }),
        postTags: zod_1.z.preprocess(preprocessTags, zod_1.z
            .array(zod_1.z.string().min(1, "Tag cannot be empty."))
            .min(1, "At least one tag is required.")
            .max(10, "You can add up to 10 tags.")),
        externalLink: externalLinkSchema,
        githubLink: strictGitHubLinkSchema,
    }),
});
exports.updatePostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(255).optional(),
        description: zod_1.z
            .string()
            .min(1, "Description is required")
            .max(500)
            .optional(),
        content: zod_1.z.string().min(1, "Post content cannot be empty.").optional(),
        category: zod_1.z.enum(postCategoryValues).optional(),
        postTags: zod_1.z
            .preprocess(preprocessTags, zod_1.z
            .array(zod_1.z.string().min(1, "Tag cannot be empty."))
            .min(1, "At least one tag is required.")
            .max(10, "You can add up to 10 tags."))
            .optional(),
        externalLink: externalLinkSchema,
        githubLink: strictGitHubLinkSchema,
    }),
});
//# sourceMappingURL=post.validation.js.map