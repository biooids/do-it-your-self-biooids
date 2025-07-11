// src/lib/schemas/projectUpdate.schemas.ts

import { z } from "zod";
import { projectUpdateCategories } from "../features/projectUpdate/projectUpdateTypes";

export const projectUpdateSchema = z.object({
  version: z.string().min(1, "Version is required (e.g., 1.0.0)."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "A valid date is required.",
  }),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(255),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
  category: z.enum(projectUpdateCategories, {
    required_error: "You must select a category.",
  }),
  // FIX: Add the 'image' field to the schema.
  // We use z.any() because file objects are complex and we handle them via FormData.
  image: z.any().optional(),
});

export type ProjectUpdateFormValues = z.infer<typeof projectUpdateSchema>;
