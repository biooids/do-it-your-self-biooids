"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = void 0;
const asyncHandler_1 = require("../../middleware/asyncHandler");
const error_factory_1 = require("../../utils/error.factory");
const comment_service_1 = require("./comment.service");
const prisma_1 = require("../../../prisma/generated/prisma");
const MAX_COMMENT_TEXT_LENGTH = 1000;
const DEFAULT_REPLIES_PER_PAGE = 5;
class CommentController {
    createCommentOnPost = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const authorId = req.user?.id;
        if (!authorId)
            throw (0, error_factory_1.createHttpError)(401, "Unauthorized");
        const { postId } = req.params;
        const { text } = req.body;
        if (!text || typeof text !== "string" || text.trim() === "") {
            throw (0, error_factory_1.createHttpError)(400, "Comment text is required.");
        }
        if (text.length > MAX_COMMENT_TEXT_LENGTH) {
            throw (0, error_factory_1.createHttpError)(400, `Comment text cannot exceed ${MAX_COMMENT_TEXT_LENGTH} characters.`);
        }
        const comment = await comment_service_1.commentService.create(postId, authorId, { text });
        res.status(201).json({
            success: true,
            message: "Comment created successfully.",
            data: comment,
        });
    });
    replyToComment = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const authorId = req.user?.id;
        if (!authorId)
            throw (0, error_factory_1.createHttpError)(401, "Unauthorized");
        const { commentId: parentId } = req.params;
        const { text } = req.body;
        if (!text || typeof text !== "string" || text.trim() === "") {
            throw (0, error_factory_1.createHttpError)(400, "Reply text is required.");
        }
        if (text.length > MAX_COMMENT_TEXT_LENGTH) {
            throw (0, error_factory_1.createHttpError)(400, `Reply text cannot exceed ${MAX_COMMENT_TEXT_LENGTH} characters.`);
        }
        const reply = await comment_service_1.commentService.createReply(parentId, authorId, {
            text,
        });
        res.status(201).json({
            success: true,
            message: "Reply created successfully.",
            data: reply,
        });
    });
    getCommentsForPost = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const { postId } = req.params;
        const currentUserId = req.user?.id;
        const { skip = "0", take = "10", sortBy = "createdAt", order = "desc", } = req.query;
        const numSkip = parseInt(skip, 10);
        const numTake = parseInt(take, 10);
        if (isNaN(numSkip) ||
            numSkip < 0 ||
            isNaN(numTake) ||
            numTake <= 0 ||
            numTake > 50) {
            throw (0, error_factory_1.createHttpError)(400, "Invalid pagination parameters.");
        }
        const result = await comment_service_1.commentService.findAllForPost(postId, currentUserId, {
            skip: numSkip,
            take: numTake,
            sortBy: sortBy,
            order: order,
        });
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
    });
    getRepliesForComment = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const { parentId } = req.params;
        const currentUserId = req.user?.id;
        const { skip = "0", take = DEFAULT_REPLIES_PER_PAGE.toString(), sortBy = "createdAt", order = "asc", } = req.query;
        const numSkip = parseInt(skip, 10);
        const numTake = parseInt(take, 10);
        if (isNaN(numSkip) ||
            numSkip < 0 ||
            isNaN(numTake) ||
            numTake <= 0 ||
            numTake > 50) {
            throw (0, error_factory_1.createHttpError)(400, "Invalid pagination parameters for replies.");
        }
        const result = await comment_service_1.commentService.findRepliesForComment(parentId, currentUserId, {
            skip: numSkip,
            take: numTake,
            sortBy: sortBy,
            order: order,
        });
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
    });
    updateComment = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const userId = req.user?.id;
        const userRole = req.user?.systemRole;
        if (!userId || !userRole)
            throw (0, error_factory_1.createHttpError)(401, "Unauthorized");
        const { commentId } = req.params;
        const { text } = req.body;
        if (!text || typeof text !== "string" || text.trim() === "")
            throw (0, error_factory_1.createHttpError)(400, "Comment text cannot be empty.");
        if (text.length > MAX_COMMENT_TEXT_LENGTH)
            throw (0, error_factory_1.createHttpError)(400, `Comment exceeds ${MAX_COMMENT_TEXT_LENGTH} characters.`);
        const updatedComment = await comment_service_1.commentService.update(commentId, userId, userRole, { text });
        res.status(200).json({
            success: true,
            message: "Comment updated successfully.",
            data: updatedComment,
        });
    });
    deleteComment = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const userId = req.user?.id;
        const userRole = req.user?.systemRole;
        if (!userId || !userRole)
            throw (0, error_factory_1.createHttpError)(401, "Unauthorized");
        const { commentId } = req.params;
        await comment_service_1.commentService.delete(commentId, userId, userRole);
        res
            .status(200)
            .json({ success: true, message: "Comment deleted successfully." });
    });
    toggleCommentReaction = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
        const userId = req.user?.id;
        if (!userId)
            throw (0, error_factory_1.createHttpError)(401, "Unauthorized");
        const { commentId } = req.params;
        const { reaction } = req.body;
        if (!reaction ||
            !Object.values(prisma_1.CommentReactionState).includes(reaction)) {
            throw (0, error_factory_1.createHttpError)(400, "Invalid reaction type provided.");
        }
        const reactionState = await comment_service_1.commentService.toggleReaction(commentId, userId, { reaction });
        res.status(200).json({
            success: true,
            message: "Comment reaction updated.",
            data: reactionState,
        });
    });
}
exports.commentController = new CommentController();
//# sourceMappingURL=comment.controller.js.map