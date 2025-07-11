// =================================================================
// FILE: src/lib/features/comment/comment.types.ts
// =================================================================
export type CommentReactionType = "LIKED" | "DISLIKED";

export interface CommentAuthorAPI {
  id: string;
  username: string;
  name: string;
  profileImage: string | null;
}

export interface ProcessedCommentAPI {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  level: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorAPI | null;
  likes: number;
  dislikes: number;
  isLikedByCurrentUser: boolean;
  isDislikedByCurrentUser: boolean;
  directRepliesCount: number;
  children: ProcessedCommentAPI[];
}

// --- Query Payloads and Responses ---
export interface GetCommentsForPostParams {
  postId: string;
  skip?: number;
  take?: number;
  sortBy?: "createdAt" | "likesCount";
  order?: "asc" | "desc";
}

export interface GetCommentsResponse {
  success: boolean;
  data: ProcessedCommentAPI[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  };
}

export interface GetRepliesForCommentParams {
  parentId: string;
  skip?: number;
  take?: number;
}

export interface GetRepliesResponse {
  success: boolean;
  data: ProcessedCommentAPI[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  };
}

// --- Mutation Payloads and Responses ---
export interface CreateCommentPayload {
  postId: string;
  text: string;
}

export interface ReplyToCommentPayload {
  parentId: string;
  postId: string;
  text: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  postId: string;
  parentId?: string | null;
  text: string;
}

export interface DeleteCommentPayload {
  commentId: string;
  postId: string;
  parentId?: string | null;
}

export interface ToggleCommentReactionPayload {
  commentId: string;
  reaction: CommentReactionType;
  parentId?: string | null;
  postId: string;
}

export interface ToggleCommentReactionResponse {
  success: boolean;
  message: string;
  data: {
    likes: number;
    dislikes: number;
    isLikedByCurrentUser: boolean;
    isDislikedByCurrentUser: boolean;
  };
}
