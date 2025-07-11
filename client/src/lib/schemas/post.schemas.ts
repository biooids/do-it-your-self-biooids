// FILE: src/lib/schemas/post.schemas.ts

import { z } from "zod";

// Define the possible categories as a const array to be used by both Zod and the UI
export const postCategories = [
  "PROJECT",
  "BLOG",
  "RESOURCE",
  "ARTICLE",
  "SHOWCASE",
  "DISCUSSION",
  "GUIDE",
] as const;

export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(500, "Description cannot exceed 500 characters."),
  content: z.string().min(20, "Main content must have at least 20 characters."),

  category: z.enum(postCategories, {
    required_error: "You must select a post category.",
  }),

  postTags: z
    .array(z.string())
    .max(10, "You can add a maximum of 10 tags.")
    .optional(),

  // For file uploads, it's often best to validate the array length and then handle the file objects separately.
  postImages: z
    .array(z.any())
    .max(5, "You can upload a maximum of 5 images.")
    .optional(),

  externalLink: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  githubLink: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
});

// The schema for updating a post makes all fields optional
export const updatePostSchema = createPostSchema.partial();

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
