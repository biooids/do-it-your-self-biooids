"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
const error_factory_js_1 = require("../../utils/error.factory.js");
const logger_js_1 = require("../../config/logger.js");
const jwt_utils_js_1 = require("../../utils/jwt.utils.js");
const user_service_js_1 = require("../user/user.service.js");
const sanitizeUser = (user) => {
    const { hashedPassword, ...sanitized } = user;
    return sanitized;
};
class AuthService {
    async registerUser(input) {
        const { email, username } = input;
        const existingUser = await prisma_js_1.default.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (existingUser) {
            if (existingUser.email === email) {
                throw (0, error_factory_js_1.createHttpError)(409, "An account with this email already exists.");
            }
            if (existingUser.username === username) {
                throw (0, error_factory_js_1.createHttpError)(409, "This username is already taken.");
            }
        }
        const user = await user_service_js_1.userService.createUser(input);
        const accessToken = (0, jwt_utils_js_1.generateAccessToken)(user);
        const { token: refreshToken, expiresAt } = await (0, jwt_utils_js_1.generateAndStoreRefreshToken)(user.id);
        return {
            user: sanitizeUser(user),
            tokens: { accessToken, refreshToken, refreshTokenExpiresAt: expiresAt },
        };
    }
    async loginUser(input) {
        const { email, password } = input;
        const user = await user_service_js_1.userService.findUserByEmail(email);
        if (!user) {
            throw (0, error_factory_js_1.createHttpError)(404, "No account found with this email address.");
        }
        if (!user.hashedPassword) {
            throw (0, error_factory_js_1.createHttpError)(400, "This account was created using a social provider. Please log in with Google or GitHub.");
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.hashedPassword);
        if (!isPasswordCorrect) {
            throw (0, error_factory_js_1.createHttpError)(401, "The password you entered is incorrect.");
        }
        logger_js_1.logger.info({ userId: user.id }, "User login successful, revoking old sessions.");
        await this.revokeAllRefreshTokensForUser(user.id);
        const accessToken = (0, jwt_utils_js_1.generateAccessToken)(user);
        const { token: refreshToken, expiresAt } = await (0, jwt_utils_js_1.generateAndStoreRefreshToken)(user.id);
        return {
            user: sanitizeUser(user),
            tokens: { accessToken, refreshToken, refreshTokenExpiresAt: expiresAt },
        };
    }
    async changeUserPassword(userId, input) {
        const { currentPassword, newPassword } = input;
        const user = await user_service_js_1.userService.findUserById(userId);
        if (!user || !user.hashedPassword) {
            throw (0, error_factory_js_1.createHttpError)(401, "User not found or has no password set.");
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(currentPassword, user.hashedPassword);
        if (!isPasswordCorrect) {
            throw (0, error_factory_js_1.createHttpError)(401, "The current password you entered is incorrect.");
        }
        const newHashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_js_1.default.user.update({
            where: { id: userId },
            data: { hashedPassword: newHashedPassword },
        });
        logger_js_1.logger.info({ userId }, "User password changed successfully. Revoking all sessions.");
        await this.revokeAllRefreshTokensForUser(userId);
    }
    async handleRefreshTokenRotation(input) {
        if (!input.incomingRefreshToken) {
            throw (0, error_factory_js_1.createHttpError)(401, "Refresh token is required.");
        }
        const decodedOldToken = await (0, jwt_utils_js_1.verifyAndValidateRefreshToken)(input.incomingRefreshToken);
        const user = await user_service_js_1.userService.findUserById(decodedOldToken.id);
        if (!user) {
            await this.revokeTokenByJti(decodedOldToken.jti);
            throw (0, error_factory_js_1.createHttpError)(403, "Forbidden: User account not found.");
        }
        await this.revokeTokenByJti(decodedOldToken.jti);
        const newAccessToken = (0, jwt_utils_js_1.generateAccessToken)(user);
        const { token: newRefreshToken, expiresAt: newRefreshTokenExpiresAt } = await (0, jwt_utils_js_1.generateAndStoreRefreshToken)(user.id);
        return { newAccessToken, newRefreshToken, newRefreshTokenExpiresAt };
    }
    async handleUserLogout(input) {
        if (!input.incomingRefreshToken) {
            logger_js_1.logger.warn("Logout attempt without a refresh token.");
            return;
        }
        try {
            const decoded = await (0, jwt_utils_js_1.verifyAndValidateRefreshToken)(input.incomingRefreshToken);
            await this.revokeTokenByJti(decoded.jti);
            logger_js_1.logger.info({ userId: decoded.id, jti: decoded.jti }, "User logged out, token revoked.");
        }
        catch (error) {
            logger_js_1.logger.warn({ err: error }, "Logout failed: could not verify or revoke token.");
        }
    }
    async findOrCreateOAuthUser(profile) {
        let user = await user_service_js_1.userService.findUserByEmail(profile.email);
        if (user) {
            logger_js_1.logger.info({ email: profile.email }, "Found existing user for OAuth login.");
            user = await prisma_js_1.default.user.update({
                where: { email: profile.email },
                data: {
                    name: user.name ?? profile.name ?? "New User",
                    profileImage: user.profileImage ?? profile.image ?? null,
                },
            });
        }
        else {
            logger_js_1.logger.info({ email: profile.email }, "Creating new user from OAuth profile.");
            const username = profile.email.split("@")[0] +
                `_${Math.floor(1000 + Math.random() * 9000)}`;
            user = await prisma_js_1.default.user.create({
                data: {
                    email: profile.email,
                    name: profile.name ?? "New User",
                    username: username,
                    ...(profile.image && { profileImage: profile.image }),
                },
            });
        }
        await this.revokeAllRefreshTokensForUser(user.id);
        const accessToken = (0, jwt_utils_js_1.generateAccessToken)(user);
        const { token: refreshToken, expiresAt } = await (0, jwt_utils_js_1.generateAndStoreRefreshToken)(user.id);
        return {
            user: sanitizeUser(user),
            tokens: { accessToken, refreshToken, refreshTokenExpiresAt: expiresAt },
        };
    }
    async revokeTokenByJti(jti) {
        await prisma_js_1.default.refreshToken
            .update({
            where: { jti },
            data: { revoked: true },
        })
            .catch((err) => logger_js_1.logger.warn({ err, jti }, "Failed to revoke single token, it might already be gone."));
    }
    async revokeAllRefreshTokensForUser(userId) {
        const { count } = await prisma_js_1.default.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });
        logger_js_1.logger.info({ count, userId }, `Revoked all active sessions.`);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map