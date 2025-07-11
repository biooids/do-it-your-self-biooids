import { z } from "zod";
export declare const createGuideStepSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        order: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        order: number;
        description?: string | undefined;
    }, {
        title: string;
        order: number;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        order: number;
        description?: string | undefined;
    };
}, {
    body: {
        title: string;
        order: number;
        description?: string | undefined;
    };
}>;
export declare const updateGuideStepSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        order: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        description?: string | undefined;
        order?: number | undefined;
    }, {
        title?: string | undefined;
        description?: string | undefined;
        order?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title?: string | undefined;
        description?: string | undefined;
        order?: number | undefined;
    };
}, {
    body: {
        title?: string | undefined;
        description?: string | undefined;
        order?: number | undefined;
    };
}>;
//# sourceMappingURL=guideStep.validation.d.ts.map