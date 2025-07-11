// src/features/updates/update.validation.ts
import { z } from "zod";
import { UpdateCategory } from "../../../prisma/generated/prisma";

// Get the enum values directly from the Prisma type for safety
const updateCategoryValues = Object.values(UpdateCategory) as [
  string,
  ...string[]
];

export const createUpdateSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long.")
      .max(255),
    content: z.string().min(10, "Content must be at least 10 characters long."),
    category: z.enum(updateCategoryValues, {
      errorMap: () => ({ message: "Please select a valid category." }),
    }),
    version: z.string().optional().nullable(),
  }),
});

export const updateUpdateSchema = z.object({
  body: createUpdateSchema.shape.body.partial(), // Makes all fields optional for PATCH requests
});
