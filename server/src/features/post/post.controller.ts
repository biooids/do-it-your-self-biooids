import { asyncHandler } from "@/middleware/asyncHandler.js";
import { Request, Response } from "express";
import { postService } from "./post.service.js";
import { createHttpError } from "@/utils/error.factory.js";
import { uploadToCloudinary } from "@/config/cloudinary.js";
import { logger } from "@/config/logger.js";
import { SharePlatform } from "../../../prisma/generated/prisma";

class PostController {
  createPost = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postData = req.body;

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path, "post_images")
      );
      const uploadResults = await Promise.all(uploadPromises);
      // --- UPDATE: Pass both url and public_id to the service ---
      postData.images = uploadResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    if (postData.postTags) {
      try {
        const tagsArray = JSON.parse(postData.postTags);
        postData.tags = tagsArray.map((name: string) => ({ name }));
      } catch (e) {
        throw createHttpError(400, "Invalid format for postTags.");
      }
    }

    const post = await postService.createPost(userId, postData);
    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: post,
    });
  });

  // ... (getPost and getAllPosts are unchanged)
  getPost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // --- THIS IS THE CHANGE ---
    // We now get the userId from req.user, which is attached by your
    // auth middleware. It's optional ('?.') because guests might not have it.
    const userId = req.user?.id;

    // Now we pass both the postId and the optional userId to the service.
    const post = await postService.getPostById(id, userId);
    // --- END OF CHANGE ---

    if (!post) {
      throw createHttpError(404, "Post not found.");
    }
    res.status(200).json({ status: "success", data: post });
  });

  getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    console.log("USER ON REQUEST IS:", req.user); // <-- ADD THIS DEBUG LINE

    // --- THIS IS THE CHANGE ---
    // Get the optional userId from the request object
    const userId = req.user?.id;

    // Pass both the query filters and the optional userId to the service
    const { posts, total } = await postService.getAllPosts(req.query, userId);
    // --- END OF CHANGE ---

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

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
  updatePost = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id: postId } = req.params;
    const updateData = req.body;

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path, "post_images")
      );
      const uploadResults = await Promise.all(uploadPromises);
      // --- UPDATE: Pass both url and public_id to the service ---
      updateData.newImages = uploadResults.map((res) => ({
        url: res.secure_url,
        publicId: res.public_id,
      }));
    }

    if (updateData.retainedImageUrls) {
      try {
        updateData.retainedImageUrls = JSON.parse(updateData.retainedImageUrls);
      } catch (e) {
        logger.warn("retainedImageUrls not valid JSON.");
      }
    }

    if (updateData.postTags) {
      try {
        const tagsArray = JSON.parse(updateData.postTags);
        updateData.tags = tagsArray.map((name: string) => ({ name }));
      } catch (e) {
        throw createHttpError(400, "Invalid format for postTags.");
      }
    }

    const updatedPost = await postService.updatePost(
      userId,
      postId,
      updateData
    );
    res.status(200).json({
      status: "success",
      message: "Post updated successfully",
      data: updatedPost,
    });
  });

  deletePost = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const userRole = req.user!.systemRole;
    const { id: postId } = req.params;

    await postService.deletePost(userId, userRole, postId);
    res.status(204).send();
  });

  likePost = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id: postId } = req.params;

    const updatedPost = await postService.likePost(userId, postId);
    res.status(200).json({
      status: "success",
      message: "Post liked successfully.",
      data: { likesCount: updatedPost.likesCount },
    });
  });

  unlikePost = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id: postId } = req.params;

    const updatedPost = await postService.unlikePost(userId, postId);
    res.status(200).json({
      status: "success",
      message: "Post unliked successfully.",
      data: { likesCount: updatedPost.likesCount },
    });
  });

  sharePost = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id: postId } = req.params;
    const { platform } = req.body;

    // Basic validation for the platform
    if (!platform || !Object.values(SharePlatform).includes(platform)) {
      throw createHttpError(400, "Invalid or missing share platform.");
    }

    const updatedPost = await postService.sharePost(userId, postId, platform);
    res.status(201).json({
      status: "success",
      message: "Post share recorded.",
      data: { sharesCount: updatedPost.sharesCount },
    });
  });

  recordPostView = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id: postId } = req.params;

    // This is a "fire-and-forget" action from the client's perspective
    await postService.recordPostView(userId, postId);

    // Send a 204 No Content response as there's nothing to return
    res.status(204).send();
  });

  /**
   * @desc    Save a post for the authenticated user
   * @route   POST /api/v1/posts/:id/save
   */
  savePost = asyncHandler(async (req: Request, res: Response) => {
    // Get the user ID from the authenticated user object (attached by verifyToken middleware)
    const userId = req.user!.id;
    // Get the post ID from the URL parameters
    const { id: postId } = req.params;

    // Call the service layer to handle the business logic
    const updatedPost = await postService.savePost(userId, postId);

    // Respond with success message and the new saved count
    res.status(200).json({
      status: "success",
      message: "Post saved successfully.",
      data: { savedCount: updatedPost.savedCount },
    });
  });

  /**
   * @desc    Unsave a post for the authenticated user
   * @route   DELETE /api/v1/posts/:id/save
   */
  unsavePost = asyncHandler(async (req: Request, res: Response) => {
    // Get the user ID from the authenticated user
    const userId = req.user!.id;
    // Get the post ID from the URL parameters
    const { id: postId } = req.params;

    // Call the service layer to handle the business logic
    const updatedPost = await postService.unsavePost(userId, postId);

    // Respond with success message and the new saved count
    res.status(200).json({
      status: "success",
      message: "Post unsaved successfully.",
      data: { savedCount: updatedPost.savedCount },
    });
  });
}

export const postController = new PostController();
