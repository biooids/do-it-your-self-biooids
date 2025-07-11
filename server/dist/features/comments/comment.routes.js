"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("./comment.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/posts/:postId/comments", comment_controller_1.commentController.getCommentsForPost);
router.get("/comments/:parentId/replies", comment_controller_1.commentController.getRepliesForComment);
router.post("/posts/:postId/comments", auth_middleware_1.verifyToken, comment_controller_1.commentController.createCommentOnPost);
router.post("/comments/:commentId/replies", auth_middleware_1.verifyToken, comment_controller_1.commentController.replyToComment);
router.patch("/comments/:commentId", auth_middleware_1.verifyToken, comment_controller_1.commentController.updateComment);
router.delete("/comments/:commentId", auth_middleware_1.verifyToken, comment_controller_1.commentController.deleteComment);
router.post("/comments/:commentId/react", auth_middleware_1.verifyToken, comment_controller_1.commentController.toggleCommentReaction);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map