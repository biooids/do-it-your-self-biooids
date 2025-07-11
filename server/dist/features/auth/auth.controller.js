"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const auth_service_js_1 = require("./auth.service.js");
const index_js_1 = require("../../config/index.js");
class AuthController {
    signup = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { user, tokens } = await auth_service_js_1.authService.registerUser(req.body);
        res.cookie(index_js_1.config.cookies.refreshTokenName, tokens.refreshToken, {
            httpOnly: true,
            secure: index_js_1.config.nodeEnv === "production",
            sameSite: "strict",
            expires: tokens.refreshTokenExpiresAt,
        });
        res.status(201).json({
            status: "success",
            message: "User registered successfully.",
            data: { user, tokens },
        });
    });
    login = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { user, tokens } = await auth_service_js_1.authService.loginUser(req.body);
        res.cookie(index_js_1.config.cookies.refreshTokenName, tokens.refreshToken, {
            httpOnly: true,
            secure: index_js_1.config.nodeEnv === "production",
            sameSite: "strict",
            expires: tokens.refreshTokenExpiresAt,
        });
        res.status(200).json({
            status: "success",
            message: "Logged in successfully.",
            data: { user, tokens },
        });
    });
    refreshAccessToken = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const incomingRefreshToken = req.cookies[index_js_1.config.cookies.refreshTokenName];
        const { newAccessToken, newRefreshToken, newRefreshTokenExpiresAt } = await auth_service_js_1.authService.handleRefreshTokenRotation({ incomingRefreshToken });
        res.cookie(index_js_1.config.cookies.refreshTokenName, newRefreshToken, {
            httpOnly: true,
            secure: index_js_1.config.nodeEnv === "production",
            sameSite: "strict",
            expires: newRefreshTokenExpiresAt,
        });
        res.status(200).json({
            status: "success",
            message: "Token refreshed successfully.",
            data: { accessToken: newAccessToken },
        });
    });
    logout = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const incomingRefreshToken = req.cookies[index_js_1.config.cookies.refreshTokenName];
        await auth_service_js_1.authService.handleUserLogout({ incomingRefreshToken });
        res.clearCookie(index_js_1.config.cookies.refreshTokenName);
        res
            .status(200)
            .json({ status: "success", message: "Logged out successfully." });
    });
    handleOAuth = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { user, tokens } = await auth_service_js_1.authService.findOrCreateOAuthUser(req.body);
        res.cookie(index_js_1.config.cookies.refreshTokenName, tokens.refreshToken, {
            httpOnly: true,
            secure: index_js_1.config.nodeEnv === "production",
            sameSite: "strict",
            expires: tokens.refreshTokenExpiresAt,
        });
        res.status(200).json({
            status: "success",
            data: { user, tokens },
        });
    });
    changePassword = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        await auth_service_js_1.authService.changeUserPassword(userId, req.body);
        res.clearCookie(index_js_1.config.cookies.refreshTokenName);
        res
            .status(200)
            .json({
            status: "success",
            message: "Password changed successfully. Please log in again.",
        });
    });
    logoutAll = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        await auth_service_js_1.authService.revokeAllRefreshTokensForUser(userId);
        res.clearCookie(index_js_1.config.cookies.refreshTokenName);
        res
            .status(200)
            .json({
            status: "success",
            message: "Successfully logged out of all devices.",
        });
    });
}
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map