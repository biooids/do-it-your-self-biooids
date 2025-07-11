"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const post_service_js_1 = require("./post.service.js");
const error_factory_js_1 = require("../../utils/error.factory.js");
const cloudinary_js_1 = require("../../config/cloudinary.js");
const logger_js_1 = require("../../config/logger.js");
const prisma_1 = require("../../../prisma/generated/prisma");
class PostController {
    createPost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const postData = req.body;
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const uploadPromises = req.files.map((file) => (0, cloudinary_js_1.uploadToCloudinary)(file.path, "post_images"));
            const uploadResults = await Promise.all(uploadPromises);
            postData.images = uploadResults.map((result) => ({
                url: result.secure_url,
                publicId: result.public_id,
            }));
        }
        if (postData.postTags) {
            try {
                const tagsArray = JSON.parse(postData.postTags);
                postData.tags = tagsArray.map((name) => ({ name }));
            }
            catch (e) {
                throw (0, error_factory_js_1.createHttpError)(400, "Invalid format for postTags.");
            }
        }
        const post = await post_service_js_1.postService.createPost(userId, postData);
        res.status(201).json({
            status: "success",
            message: "Post created successfully",
            data: post,
        });
    });
    getPost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user?.id;
        const post = await post_service_js_1.postService.getPostById(id, userId);
        if (!post) {
            throw (0, error_factory_js_1.createHttpError)(404, "Post not found.");
        }
        res.status(200).json({ status: "success", data: post });
    });
    getAllPosts = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        console.log("USER ON REQUEST IS:", req.user);
        const userId = req.user?.id;
        const { posts, total } = await post_service_js_1.postService.getAllPosts(req.query, userId);
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: posts,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        });
    });
    updatePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        const updateData = req.body;
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const uploadPromises = req.files.map((file) => (0, cloudinary_js_1.uploadToCloudinary)(file.path, "post_images"));
            const uploadResults = await Promise.all(uploadPromises);
            updateData.newImages = uploadResults.map((res) => ({
                url: res.secure_url,
                publicId: res.public_id,
            }));
        }
        if (updateData.retainedImageUrls) {
            try {
                updateData.retainedImageUrls = JSON.parse(updateData.retainedImageUrls);
            }
            catch (e) {
                logger_js_1.logger.warn("retainedImageUrls not valid JSON.");
            }
        }
        if (updateData.postTags) {
            try {
                const tagsArray = JSON.parse(updateData.postTags);
                updateData.tags = tagsArray.map((name) => ({ name }));
            }
            catch (e) {
                throw (0, error_factory_js_1.createHttpError)(400, "Invalid format for postTags.");
            }
        }
        const updatedPost = await post_service_js_1.postService.updatePost(userId, postId, updateData);
        res.status(200).json({
            status: "success",
            message: "Post updated successfully",
            data: updatedPost,
        });
    });
    deletePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const userRole = req.user.systemRole;
        const { id: postId } = req.params;
        await post_service_js_1.postService.deletePost(userId, userRole, postId);
        res.status(204).send();
    });
    likePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        const updatedPost = await post_service_js_1.postService.likePost(userId, postId);
        res.status(200).json({
            status: "success",
            message: "Post liked successfully.",
            data: { likesCount: updatedPost.likesCount },
        });
    });
    unlikePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        const updatedPost = await post_service_js_1.postService.unlikePost(userId, postId);
        res.status(200).json({
            status: "success",
            message: "Post unliked successfully.",
            data: { likesCount: updatedPost.likesCount },
        });
    });
    sharePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        const { platform } = req.body;
        if (!platform || !Object.values(prisma_1.SharePlatform).includes(platform)) {
            throw (0, error_factory_js_1.createHttpError)(400, "Invalid or missing share platform.");
        }
        const updatedPost = await post_service_js_1.postService.sharePost(userId, postId, platform);
        res.status(201).json({
            status: "success",
            message: "Post share recorded.",
            data: { sharesCount: updatedPost.sharesCount },
        });
    });
    recordPostView = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        await post_service_js_1.postService.recordPostView(userId, postId);
        res.status(204).send();
    });
    savePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        const updatedPost = await post_service_js_1.postService.savePost(userId, postId);
        res.status(200).json({
            status: "success",
            message: "Post saved successfully.",
            data: { savedCount: updatedPost.savedCount },
        });
    });
    unsavePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id: postId } = req.params;
        const updatedPost = await post_service_js_1.postService.unsavePost(userId, postId);
        res.status(200).json({
            status: "success",
            message: "Post unsaved successfully.",
            data: { savedCount: updatedPost.savedCount },
        });
    });
}
exports.postController = new PostController();
//# sourceMappingURL=post.controller.js.map