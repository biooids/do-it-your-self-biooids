// src/features/comment/comment.controller.ts

/**
 * =================================================================
 * CONTROLLER LAYER: COMMENT
 * =================================================================
 * This controller handles the HTTP requests for the Comment feature.
 * It is responsible for request validation, calling the appropriate
 * service method, and formatting the HTTP response. It does not
 * contain any direct database logic.
 */

import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@/middleware/asyncHandler";
import { createHttpError } from "@/utils/error.factory";
import { commentService } from "./comment.service";
import { CommentReactionState } from "../../../prisma/generated/prisma"; // Adjust path as needed

// Constants for validation
const MAX_COMMENT_TEXT_LENGTH = 1000;
const DEFAULT_REPLIES_PER_PAGE = 5;

class CommentController {
  /**
   * @desc    Create a top-level comment on a post
   * @route   POST /api/v1/posts/:postId/comments
   */
  createCommentOnPost = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authorId = req.user?.id;
      if (!authorId) throw createHttpError(401, "Unauthorized");

      const { postId } = req.params;
      const { text } = req.body;

      if (!text || typeof text !== "string" || text.trim() === "") {
        throw createHttpError(400, "Comment text is required.");
      }
      if (text.length > MAX_COMMENT_TEXT_LENGTH) {
        throw createHttpError(
          400,
          `Comment text cannot exceed ${MAX_COMMENT_TEXT_LENGTH} characters.`
        );
      }

      const comment = await commentService.create(postId, authorId, { text });
      res.status(201).json({
        success: true,
        message: "Comment created successfully.",
        data: comment,
      });
    }
  );

  /**
   * @desc    Create a reply to an existing comment
   * @route   POST /api/v1/comments/:commentId/replies
   */
  replyToComment = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authorId = req.user?.id;
      if (!authorId) throw createHttpError(401, "Unauthorized");

      const { commentId: parentId } = req.params;
      const { text } = req.body;

      if (!text || typeof text !== "string" || text.trim() === "") {
        throw createHttpError(400, "Reply text is required.");
      }
      if (text.length > MAX_COMMENT_TEXT_LENGTH) {
        throw createHttpError(
          400,
          `Reply text cannot exceed ${MAX_COMMENT_TEXT_LENGTH} characters.`
        );
      }

      const reply = await commentService.createReply(parentId, authorId, {
        text,
      });
      res.status(201).json({
        success: true,
        message: "Reply created successfully.",
        data: reply,
      });
    }
  );

  /**
   * @desc    Get all top-level comments for a post
   * @route   GET /api/v1/posts/:postId/comments
   */
  getCommentsForPost = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { postId } = req.params;
      const currentUserId = req.user?.id;
      const {
        skip = "0",
        take = "10",
        sortBy = "createdAt",
        order = "desc",
      } = req.query;

      const numSkip = parseInt(skip as string, 10);
      const numTake = parseInt(take as string, 10);
      if (
        isNaN(numSkip) ||
        numSkip < 0 ||
        isNaN(numTake) ||
        numTake <= 0 ||
        numTake > 50
      ) {
        throw createHttpError(400, "Invalid pagination parameters.");
      }

      const result = await commentService.findAllForPost(
        postId,
        currentUserId,
        {
          skip: numSkip,
          take: numTake,
          sortBy: sortBy as string,
          order: order as string,
        }
      );

      res.status(200).json({
        success: true,
        data: result.comments,
        pagination: {
          totalItems: result.total,
          totalPages: Math.ceil(result.total / numTake),
          currentPage: Math.floor(numSkip / numTake) + 1,
          hasMore: numSkip + numTake < result.total,
        },
      });
    }
  );

  /**
   * @desc    Get all replies for a specific comment
   * @route   GET /api/v1/comments/:parentId/replies
   */
  getRepliesForComment = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { parentId } = req.params;
      const currentUserId = req.user?.id;
      const {
        skip = "0",
        take = DEFAULT_REPLIES_PER_PAGE.toString(),
        sortBy = "createdAt",
        order = "asc",
      } = req.query;

      const numSkip = parseInt(skip as string, 10);
      const numTake = parseInt(take as string, 10);
      if (
        isNaN(numSkip) ||
        numSkip < 0 ||
        isNaN(numTake) ||
        numTake <= 0 ||
        numTake > 50
      ) {
        throw createHttpError(
          400,
          "Invalid pagination parameters for replies."
        );
      }

      const result = await commentService.findRepliesForComment(
        parentId,
        currentUserId,
        {
          skip: numSkip,
          take: numTake,
          sortBy: sortBy as string,
          order: order as string,
        }
      );

      res.status(200).json({
        success: true,
        data: result.replies,
        pagination: {
          totalItems: result.total,
          totalPages: Math.ceil(result.total / numTake),
          currentPage: Math.floor(numSkip / numTake) + 1,
          hasMore: numSkip + numTake < result.total,
        },
      });
    }
  );

  /**
   * @desc    Update an existing comment
   * @route   PATCH /api/v1/comments/:commentId
   */
  updateComment = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = req.user?.id;
      const userRole = req.user?.systemRole;
      if (!userId || !userRole) throw createHttpError(401, "Unauthorized");

      const { commentId } = req.params;
      const { text } = req.body;

      if (!text || typeof text !== "string" || text.trim() === "")
        throw createHttpError(400, "Comment text cannot be empty.");
      if (text.length > MAX_COMMENT_TEXT_LENGTH)
        throw createHttpError(
          400,
          `Comment exceeds ${MAX_COMMENT_TEXT_LENGTH} characters.`
        );

      const updatedComment = await commentService.update(
        commentId,
        userId,
        userRole,
        { text }
      );
      res.status(200).json({
        success: true,
        message: "Comment updated successfully.",
        data: updatedComment,
      });
    }
  );

  /**
   * @desc    Delete an existing comment
   * @route   DELETE /api/v1/comments/:commentId
   */
  deleteComment = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = req.user?.id;
      const userRole = req.user?.systemRole;
      if (!userId || !userRole) throw createHttpError(401, "Unauthorized");

      const { commentId } = req.params;

      await commentService.delete(commentId, userId, userRole);
      res
        .status(200)
        .json({ success: true, message: "Comment deleted successfully." });
    }
  );

  /**
   * @desc    Like, dislike, or remove a reaction from a comment
   * @route   POST /api/v1/comments/:commentId/react
   */
  toggleCommentReaction = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");

      const { commentId } = req.params;
      const { reaction } = req.body;

      if (
        !reaction ||
        !Object.values(CommentReactionState).includes(
          reaction as CommentReactionState
        )
      ) {
        throw createHttpError(400, "Invalid reaction type provided.");
      }

      const reactionState = await commentService.toggleReaction(
        commentId,
        userId,
        { reaction }
      );
      res.status(200).json({
        success: true,
        message: "Comment reaction updated.",
        data: reactionState,
      });
    }
  );
}

export const commentController = new CommentController();
