// src/features/comment/comment.types.ts

/**
 * =================================================================
 * TYPE DEFINITIONS: COMMENT
 * =================================================================
 * This file defines all the TypeScript interfaces and types related
 * to the Comment feature.
 */

import { CommentReactionState } from "../../../prisma/generated/prisma"; // Adjust path as needed

// The 'AuthenticatedRequest' interface has been DELETED.
// It is no longer needed because we have a global type for req.user.

// Defines the shape of a comment author's public data
export interface CommentAuthorAPI {
  id: string;
  username: string;
  profileImage: string | null;
}

// The final, clean shape of a comment object sent to the frontend
export interface ProcessedCommentAPI {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  author: CommentAuthorAPI | null;
  likes: number;
  dislikes: number;
  isLikedByCurrentUser: boolean;
  isDislikedByCurrentUser: boolean;
  directRepliesCount: number;
  children: ProcessedCommentAPI[];
}

// Data Transfer Objects (DTOs) for validating controller request bodies
// --------------------------------------------------------------------

export interface CreateCommentDto {
  text: string;
}

export interface UpdateCommentDto {
  text: string;
}

export interface ToggleReactionDto {
  reaction: CommentReactionState;
}
