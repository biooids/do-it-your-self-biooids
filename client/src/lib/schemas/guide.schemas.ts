// =================================================================
// FILE: src/lib/schemas/guide.schemas.ts
// =================================================================
import { z } from "zod";

// Schema for creating or editing a Guide Step
export const guideStepSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  order: z.coerce.number().int().positive("Order must be a positive number."),
});

export type GuideStepFormValues = z.infer<typeof guideStepSchema>;

// Schema for creating or editing a Guide Section
export const guideSectionSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters."),
  order: z.coerce.number().int().positive("Order must be a positive number."),
  videoUrl: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  // FIX: Add the 'image' field to the schema.
  // We use z.any() because file objects are complex and we handle them via FormData.
  image: z.any().optional(),
});

export type GuideSectionFormValues = z.infer<typeof guideSectionSchema>;
