import { z } from "zod";
export declare const createGuideSectionSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        content: z.ZodString;
        order: z.ZodNumber;
        videoUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        content: string;
        order: number;
        videoUrl?: string | undefined;
    }, {
        title: string;
        content: string;
        order: number;
        videoUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        content: string;
        order: number;
        videoUrl?: string | undefined;
    };
}, {
    body: {
        title: string;
        content: string;
        order: number;
        videoUrl?: string | undefined;
    };
}>;
export declare const updateGuideSectionSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        order: z.ZodOptional<z.ZodNumber>;
        videoUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        content?: string | undefined;
        order?: number | undefined;
        videoUrl?: string | undefined;
    }, {
        title?: string | undefined;
        content?: string | undefined;
        order?: number | undefined;
        videoUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title?: string | undefined;
        content?: string | undefined;
        order?: number | undefined;
        videoUrl?: string | undefined;
    };
}, {
    body: {
        title?: string | undefined;
        content?: string | undefined;
        order?: number | undefined;
        videoUrl?: string | undefined;
    };
}>;
//# sourceMappingURL=guideSection.validation.d.ts.map