import { z } from "zod";
export declare const createPostSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<[string, ...string[]]>;
        postTags: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
        externalLink: z.ZodEffects<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>, string | undefined, string | undefined>;
        githubLink: z.ZodEffects<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>, string | undefined, string | undefined>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        content: string;
        category: string;
        postTags: string[];
        externalLink?: string | undefined;
        githubLink?: string | undefined;
    }, {
        title: string;
        description: string;
        content: string;
        category: string;
        externalLink?: string | undefined;
        githubLink?: string | undefined;
        postTags?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        description: string;
        content: string;
        category: string;
        postTags: string[];
        externalLink?: string | undefined;
        githubLink?: string | undefined;
    };
}, {
    body: {
        title: string;
        description: string;
        content: string;
        category: string;
        externalLink?: string | undefined;
        githubLink?: string | undefined;
        postTags?: unknown;
    };
}>;
export declare const updatePostSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        postTags: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>>;
        externalLink: z.ZodEffects<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>, string | undefined, string | undefined>;
        githubLink: z.ZodEffects<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>, string | undefined, string | undefined>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        description?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        externalLink?: string | undefined;
        githubLink?: string | undefined;
        postTags?: string[] | undefined;
    }, {
        title?: string | undefined;
        description?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        externalLink?: string | undefined;
        githubLink?: string | undefined;
        postTags?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title?: string | undefined;
        description?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        externalLink?: string | undefined;
        githubLink?: string | undefined;
        postTags?: string[] | undefined;
    };
}, {
    body: {
        title?: string | undefined;
        description?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        externalLink?: string | undefined;
        githubLink?: string | undefined;
        postTags?: unknown;
    };
}>;
//# sourceMappingURL=post.validation.d.ts.map