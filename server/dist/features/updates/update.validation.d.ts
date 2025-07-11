import { z } from "zod";
export declare const createUpdateSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<[string, ...string[]]>;
        version: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        content: string;
        category: string;
        version?: string | null | undefined;
    }, {
        title: string;
        content: string;
        category: string;
        version?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        content: string;
        category: string;
        version?: string | null | undefined;
    };
}, {
    body: {
        title: string;
        content: string;
        category: string;
        version?: string | null | undefined;
    };
}>;
export declare const updateUpdateSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        version: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        version?: string | null | undefined;
    }, {
        title?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        version?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        version?: string | null | undefined;
    };
}, {
    body: {
        title?: string | undefined;
        content?: string | undefined;
        category?: string | undefined;
        version?: string | null | undefined;
    };
}>;
//# sourceMappingURL=update.validation.d.ts.map