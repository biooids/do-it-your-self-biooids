// src/features/comment/comment.service.ts

/**
 * =================================================================
 * SERVICE LAYER: COMMENT
 * =================================================================
 * This service is responsible for all business logic related to
 * comments, including creation, retrieval, updates, deletion,
 * and reactions. It is the single source of truth for interacting
 * with the Comment model in the database.
 *
 * It uses Prisma for database operations and throws structured
 * HttpErrors that are caught and handled by the Controller layer.
 */

import prisma from "@/db/prisma";
import {
  Prisma,
  SystemRole,
  CommentReactionState,
} from "../../../prisma/generated/prisma"; // Adjust path if needed
import { createHttpError } from "@/utils/error.factory";
import {
  ProcessedCommentAPI,
  CreateCommentDto,
  UpdateCommentDto,
  ToggleReactionDto,
} from "./comment.types";

// Constants for business logic
const MAX_COMMENT_LEVEL_ALLOWED = 5;

/**
 * A reusable Prisma 'include' object for fetching the necessary comment details.
 * IMPROVEMENT: This is now a function that conditionally includes user-specific data
 * only when a userId is provided, fixing the TypeScript error.
 * @param currentUserId The ID of the user making the request, to check their reaction status.
 */
const commentInclude = (currentUserId?: string): Prisma.CommentInclude => {
  const include: Prisma.CommentInclude = {
    author: {
      select: { id: true, name: true, username: true, profileImage: true },
    },
    _count: {
      select: {
        children: true, // Counts direct replies
        // We can add reaction counts here if we denormalize them on the Comment model later
      },
    },
  };

  // FIX: Conditionally add the 'reactions' part only if a user is logged in.
  // This prevents passing 'undefined' to the where clause.
  if (currentUserId) {
    include.reactions = {
      where: { userId: currentUserId },
      select: { reaction: true },
    };
  }

  return include;
};

class CommentService {
  /**
   * Transforms raw database comment data into the final API shape.
   */
  // FIX: Removed the unused 'currentUserId' parameter.
  private processRawCommentForAPI(
    rawComment: any
  ): Omit<ProcessedCommentAPI, "children" | "totalDescendantRepliesCount"> {
    const userReaction = rawComment.reactions?.[0]?.reaction;

    return {
      id: rawComment.id,
      text: rawComment.text,
      postId: rawComment.postId,
      authorId: rawComment.authorId,
      parentId: rawComment.parentId,
      level: rawComment.level,
      createdAt: rawComment.createdAt,
      updatedAt: rawComment.updatedAt,
      author: rawComment.author,

      // --- THIS IS THE FIX ---
      // Use the accurate, denormalized counts directly from the database model
      likes: rawComment.likesCount,
      dislikes: rawComment.dislikesCount,

      isLikedByCurrentUser: userReaction === CommentReactionState.LIKED,
      isDislikedByCurrentUser: userReaction === CommentReactionState.DISLIKED,
      directRepliesCount: rawComment._count?.children || 0,
    };
  }
  /**
   * Creates a new top-level comment on a post and increments the post's commentsCount.
   */
  public async create(
    postId: string,
    authorId: string,
    data: CreateCommentDto
  ): Promise<ProcessedCommentAPI> {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw createHttpError(404, "Post not found.");

    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: { text: data.text, postId, authorId, level: 0 },
        include: commentInclude(authorId),
      }),
      prisma.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return {
      ...this.processRawCommentForAPI(newComment),
      children: [],
    };
  }

  /**
   * Creates a reply to an existing comment and increments the post's commentsCount.
   */
  public async createReply(
    parentId: string,
    authorId: string,
    data: CreateCommentDto
  ): Promise<ProcessedCommentAPI> {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment) throw createHttpError(404, "Parent comment not found.");

    const newLevel = parentComment.level + 1;
    if (newLevel > MAX_COMMENT_LEVEL_ALLOWED) {
      throw createHttpError(
        403,
        `Maximum comment depth of ${MAX_COMMENT_LEVEL_ALLOWED} exceeded.`
      );
    }

    const [newReply] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          text: data.text,
          postId: parentComment.postId,
          authorId,
          parentId,
          level: newLevel,
        },
        include: commentInclude(authorId),
      }),
      prisma.post.update({
        where: { id: parentComment.postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return {
      ...this.processRawCommentForAPI(newReply),
      children: [],
    };
  }

  /**
   * Fetches a paginated list of top-level comments for a post.
   */
  public async findAllForPost(
    postId: string,
    currentUserId?: string,
    pagination?: { skip: number; take: number; sortBy: string; order: string }
  ) {
    const [rawComments, total] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { postId, parentId: null },
        orderBy: {
          [pagination?.sortBy || "createdAt"]: pagination?.order || "desc",
        },
        skip: pagination?.skip || 0,
        take: pagination?.take || 10,
        include: commentInclude(currentUserId),
      }),
      prisma.comment.count({ where: { postId, parentId: null } }),
    ]);

    const detailedComments = rawComments.map((c) => ({
      ...this.processRawCommentForAPI(c),
      children: [],
    }));

    return { comments: detailedComments, total };
  }

  /**
   * Fetches a paginated list of replies for a given parent comment.
   */
  public async findRepliesForComment(
    parentId: string,
    currentUserId?: string,
    pagination?: { skip: number; take: number; sortBy: string; order: string }
  ) {
    const [rawReplies, total] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { parentId },
        orderBy: {
          [pagination?.sortBy || "createdAt"]: pagination?.order || "asc",
        },
        skip: pagination?.skip || 0,
        take: pagination?.take || 5,
        include: commentInclude(currentUserId),
      }),
      prisma.comment.count({ where: { parentId } }),
    ]);

    const detailedReplies = rawReplies.map((c) => ({
      ...this.processRawCommentForAPI(c),
      children: [],
    }));

    return { replies: detailedReplies, total };
  }

  /**
   * Updates the text of an existing comment.
   */
  public async update(
    commentId: string,
    userId: string,
    userRole: SystemRole | undefined,
    data: UpdateCommentDto
  ): Promise<ProcessedCommentAPI> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw createHttpError(404, "Comment not found.");
    if (comment.authorId !== userId && userRole !== "SUPER_ADMIN") {
      throw createHttpError(
        403,
        "You are not authorized to edit this comment."
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { text: data.text },
      include: commentInclude(userId),
    });

    return {
      ...this.processRawCommentForAPI(updatedComment),
      children: [],
    };
  }

  /**
   * Deletes a comment and decrements the post's commentsCount.
   */
  public async delete(
    commentId: string,
    userId: string,
    userRole: SystemRole | undefined
  ): Promise<void> {
    // We must fetch the comment and its replies first to know how many to decrement
    const commentToDelete = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { _count: { select: { children: true } } },
    });
    if (!commentToDelete) throw createHttpError(404, "Comment not found.");
    if (commentToDelete.authorId !== userId && userRole !== "SUPER_ADMIN") {
      throw createHttpError(
        403,
        "You are not authorized to delete this comment."
      );
    }

    // This needs a deeper look for nested replies. For now, we assume one level for the count.
    // A full recursive delete count is complex and better handled by other patterns.
    const countToDelete = 1 + (commentToDelete._count?.children || 0);

    await prisma.$transaction([
      prisma.comment.delete({ where: { id: commentId } }),
      prisma.post.update({
        where: { id: commentToDelete.postId },
        data: { commentsCount: { decrement: countToDelete } },
      }),
    ]);
  }

  /**
   * Toggles a user's reaction (like/dislike) on a comment.
   */
  public async toggleReaction(
    commentId: string,
    userId: string,
    data: ToggleReactionDto
  ) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw createHttpError(404, "Comment not found.");

    const existingReaction = await prisma.commentUserReaction.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    // We use a transaction to ensure all database updates succeed or fail together
    await prisma.$transaction(async (tx) => {
      if (existingReaction) {
        if (existingReaction.reaction === data.reaction) {
          // --- User is UNDOING their reaction ---
          await tx.commentUserReaction.delete({
            where: { id: existingReaction.id },
          });
          // Decrement the appropriate counter
          if (data.reaction === "LIKED") {
            await tx.comment.update({
              where: { id: commentId },
              data: { likesCount: { decrement: 1 } },
            });
          } else {
            await tx.comment.update({
              where: { id: commentId },
              data: { dislikesCount: { decrement: 1 } },
            });
          }
        } else {
          // --- User is CHANGING their reaction (e.g., from like to dislike) ---
          await tx.commentUserReaction.update({
            where: { id: existingReaction.id },
            data: { reaction: data.reaction },
          });
          // Decrement the old counter and increment the new one
          if (data.reaction === "LIKED") {
            await tx.comment.update({
              where: { id: commentId },
              data: {
                likesCount: { increment: 1 },
                dislikesCount: { decrement: 1 },
              },
            });
          } else {
            await tx.comment.update({
              where: { id: commentId },
              data: {
                likesCount: { decrement: 1 },
                dislikesCount: { increment: 1 },
              },
            });
          }
        }
      } else {
        // --- User is CREATING a new reaction ---
        await tx.commentUserReaction.create({
          data: { userId, commentId, reaction: data.reaction },
        });
        // Increment the appropriate counter
        if (data.reaction === "LIKED") {
          await tx.comment.update({
            where: { id: commentId },
            data: { likesCount: { increment: 1 } },
          });
        } else {
          await tx.comment.update({
            where: { id: commentId },
            data: { dislikesCount: { increment: 1 } },
          });
        }
      }
    });

    // Now we can fetch the final, accurate state directly from the comment
    const finalCommentState = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    const finalUserReaction = await prisma.commentUserReaction.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    return {
      likes: finalCommentState?.likesCount ?? 0,
      dislikes: finalCommentState?.dislikesCount ?? 0,
      isLikedByCurrentUser: finalUserReaction?.reaction === "LIKED",
      isDislikedByCurrentUser: finalUserReaction?.reaction === "DISLIKED",
    };
  }
}

export const commentService = new CommentService();
