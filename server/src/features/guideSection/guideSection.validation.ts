import { z } from "zod";

// Renamed to createGuideSectionSchema
export const createGuideSectionSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    content: z.string().min(10, "Content must be at least 10 characters long."),
    // Coerce form data from string to number and ensure it's valid
    order: z.coerce.number().int().positive("Order must be a positive number."),
    videoUrl: z
      .string()
      .url("Please provide a valid URL.")
      .optional()
      .or(z.literal("")),
    // The optional image from the form doesn't need backend validation here,
    // as multer handles the file type and size checks.
  }),
});

// Renamed to updateGuideSectionSchema
export const updateGuideSectionSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    order: z.coerce.number().int().positive().optional(),
    videoUrl: z.string().url().optional().or(z.literal("")),
  }),
});
