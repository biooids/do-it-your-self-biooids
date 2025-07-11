"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const prisma_1 = require("../../../prisma/generated/prisma");
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const error_factory_js_1 = require("../../utils/error.factory.js");
const user_service_js_1 = require("./user.service.js");
const cloudinary_js_1 = require("../../config/cloudinary.js");
const logger_js_1 = require("../../config/logger.js");
const sanitizeUserForResponse = (user) => {
    const { hashedPassword, ...sanitizedUser } = user;
    return sanitizedUser;
};
class UserController {
    getMe = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const user = await user_service_js_1.userService.findUserById(userId);
        if (!user) {
            throw (0, error_factory_js_1.createHttpError)(404, "Authenticated user profile not found.");
        }
        res.status(200).json({
            status: "success",
            data: { user: sanitizeUserForResponse(user) },
        });
    });
    getUserById = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { id: targetUserId } = req.params;
        const user = await user_service_js_1.userService.findUserById(targetUserId);
        if (!user) {
            throw (0, error_factory_js_1.createHttpError)(404, `User with ID ${targetUserId} not found.`);
        }
        res.status(200).json({
            status: "success",
            data: { user: sanitizeUserForResponse(user) },
        });
    });
    deleteMyAccount = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        await user_service_js_1.userService.deleteUserAccount(userId);
        res.status(204).send();
    });
    deleteUserById = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        if (req.user?.systemRole !== prisma_1.SystemRole.SUPER_ADMIN) {
            throw (0, error_factory_js_1.createHttpError)(403, "Forbidden: You do not have permission for this action.");
        }
        const { id: targetUserId } = req.params;
        if (req.user.id === targetUserId) {
            throw (0, error_factory_js_1.createHttpError)(400, "Cannot delete your own account via this admin route.");
        }
        await user_service_js_1.userService.deleteUserAccount(targetUserId);
        res.status(204).send();
    });
    updateMyProfile = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const updateData = req.body;
        const files = req.files;
        if (files?.profileImage?.[0]) {
            logger_js_1.logger.info({ userId }, "New profile image received. Uploading...");
            const result = await (0, cloudinary_js_1.uploadToCloudinary)(files.profileImage[0].path, "user_assets", `profile_${userId}`);
            updateData.profileImage = result.secure_url;
        }
        if (files?.bannerImage?.[0]) {
            logger_js_1.logger.info({ userId }, "New banner image received. Uploading...");
            const result = await (0, cloudinary_js_1.uploadToCloudinary)(files.bannerImage[0].path, "user_assets", `banner_${userId}`);
            updateData.bannerImage = result.secure_url;
        }
        if (Object.keys(updateData).length === 0 && !req.files) {
            throw (0, error_factory_js_1.createHttpError)(400, "No update data provided.");
        }
        const updatedUser = await user_service_js_1.userService.updateUserProfile(userId, updateData);
        res.status(200).json({
            status: "success",
            message: "Profile updated successfully.",
            data: { user: sanitizeUserForResponse(updatedUser) },
        });
    });
    getUserByUsername = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { username } = req.params;
        const user = await user_service_js_1.userService.findUserByUsername(username);
        if (!user) {
            throw (0, error_factory_js_1.createHttpError)(404, `User profile for @${username} not found.`);
        }
        res.status(200).json({
            status: "success",
            data: sanitizeUserForResponse(user),
        });
    });
}
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map