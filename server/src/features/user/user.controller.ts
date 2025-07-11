import { Request, Response } from "express";
import { SystemRole, User } from "../../../prisma/generated/prisma";
import { asyncHandler } from "@/middleware/asyncHandler.js";
import { createHttpError } from "@/utils/error.factory.js";
import { userService } from "./user.service.js";
import { uploadToCloudinary } from "@/config/cloudinary.js";
import { logger } from "@/config/logger.js";

// This helper function is correctly placed and used.
const sanitizeUserForResponse = (user: User): Omit<User, "hashedPassword"> => {
  const { hashedPassword, ...sanitizedUser } = user;
  return sanitizedUser;
};

class UserController {
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await userService.findUserById(userId);

    if (!user) {
      throw createHttpError(404, "Authenticated user profile not found.");
    }

    res.status(200).json({
      status: "success",
      data: { user: sanitizeUserForResponse(user) },
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id: targetUserId } = req.params;
    const user = await userService.findUserById(targetUserId);

    if (!user) {
      throw createHttpError(404, `User with ID ${targetUserId} not found.`);
    }

    res.status(200).json({
      status: "success",
      data: { user: sanitizeUserForResponse(user) },
    });
  });

  deleteMyAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await userService.deleteUserAccount(userId);
    res.status(204).send();
  });

  deleteUserById = asyncHandler(async (req: Request, res: Response) => {
    if (req.user?.systemRole !== SystemRole.SUPER_ADMIN) {
      throw createHttpError(
        403,
        "Forbidden: You do not have permission for this action."
      );
    }

    const { id: targetUserId } = req.params;
    if (req.user.id === targetUserId) {
      throw createHttpError(
        400,
        "Cannot delete your own account via this admin route."
      );
    }

    await userService.deleteUserAccount(targetUserId);
    res.status(204).send();
  });

  updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const updateData = req.body;

    // --- FIX: Correctly handle multiple files from multer's .fields() middleware ---
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.profileImage?.[0]) {
      logger.info({ userId }, "New profile image received. Uploading...");
      const result = await uploadToCloudinary(
        files.profileImage[0].path,
        "user_assets",
        `profile_${userId}`
      );
      updateData.profileImage = result.secure_url;
    }

    if (files?.bannerImage?.[0]) {
      logger.info({ userId }, "New banner image received. Uploading...");
      const result = await uploadToCloudinary(
        files.bannerImage[0].path,
        "user_assets",
        `banner_${userId}`
      );
      updateData.bannerImage = result.secure_url;
    }

    if (Object.keys(updateData).length === 0 && !req.files) {
      throw createHttpError(400, "No update data provided.");
    }

    const updatedUser = await userService.updateUserProfile(userId, updateData);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully.",
      data: { user: sanitizeUserForResponse(updatedUser) },
    });
  });

  getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const currentUserId = req.user?.id; // Get the ID of the person making the request

    const user = await userService.findUserByUsername(username, currentUserId);

    if (!user) {
      throw createHttpError(404, `User profile for @${username} not found.`);
    }

    res.status(200).json({
      status: "success",
      data: user, // The user object now includes follow data
    });
  });

  /**
   * --- NEW: Controller method to follow a user ---
   */
  follow = asyncHandler(async (req: Request, res: Response) => {
    const followerId = req.user!.id; // The person doing the following
    const { id: followingId } = req.params; // The person being followed

    await userService.followUser(followerId, followingId);

    res.status(200).json({
      status: "success",
      message: "User followed successfully.",
    });
  });

  /**
   * --- NEW: Controller method to unfollow a user ---
   */
  unfollow = asyncHandler(async (req: Request, res: Response) => {
    const followerId = req.user!.id;
    const { id: followingId } = req.params;

    await userService.unfollowUser(followerId, followingId);

    res.status(200).json({
      status: "success",
      message: "User unfollowed successfully.",
    });
  });
}

export const userController = new UserController();
