// src/features/comment/comment.routes.ts

import { Router } from "express";
import { commentController } from "./comment.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router: Router = Router();

// --- PUBLIC ROUTES ---
// These routes do not have any middleware and can be accessed by anyone.
router.get("/posts/:postId/comments", commentController.getCommentsForPost);
router.get(
  "/comments/:parentId/replies",
  commentController.getRepliesForComment
);

// --- PROTECTED ROUTES ---
// The verifyToken middleware is now applied individually to each route that needs it.

// Create comments and replies
router.post(
  "/posts/:postId/comments",
  verifyToken,
  commentController.createCommentOnPost
);
router.post(
  "/comments/:commentId/replies",
  verifyToken,
  commentController.replyToComment
);

// Update and delete a specific comment
router.patch(
  "/comments/:commentId",
  verifyToken,
  commentController.updateComment
);
router.delete(
  "/comments/:commentId",
  verifyToken,
  commentController.deleteComment
);

// React to a comment
router.post(
  "/comments/:commentId/react",
  verifyToken,
  commentController.toggleCommentReaction
);

export default router;
