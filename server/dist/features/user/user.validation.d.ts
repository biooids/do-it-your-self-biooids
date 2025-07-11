import { z } from "zod";
export declare const updateUserProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        username?: string | undefined;
        bio?: string | undefined;
        title?: string | undefined;
        location?: string | undefined;
    }, {
        name?: string | undefined;
        username?: string | undefined;
        bio?: string | undefined;
        title?: string | undefined;
        location?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        username?: string | undefined;
        bio?: string | undefined;
        title?: string | undefined;
        location?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        username?: string | undefined;
        bio?: string | undefined;
        title?: string | undefined;
        location?: string | undefined;
    };
}>;
//# sourceMappingURL=user.validation.d.ts.map