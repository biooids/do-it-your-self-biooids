// src/features/post/post.types.ts

import { PostCategory } from "@/prisma-client";

/**
 * Defines the shape of the filter object for querying multiple posts.
 * This is used by the post service and controller.
 */
export interface PostQueryFilters {
  page?: number;
  limit?: number;
  q?: string; // The search query string
  category?: PostCategory;
  sort?: "newest" | "oldest" | "title-asc" | "title-desc";
  tags?: string; // Comma-separated string of tag names
  authorId?: string;
  likedByUserId?: string;
  savedByUserId?: string;
}

/**
 * Defines the shape of the filter object for querying tags.
 * This is used by the tag service and controller.
 */
export interface TagQueryFilters {
  category?: PostCategory;
}
