"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndValidateRefreshToken = exports.generateAndStoreRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const index_js_1 = require("../config/index.js");
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const error_factory_js_1 = require("./error.factory.js");
const HttpError_js_1 = require("./HttpError.js");
const logger_js_1 = require("../config/logger.js");
const generateAccessToken = (user) => {
    const payload = {
        id: user.id,
        systemRole: user.systemRole,
        type: "access",
        username: user.username,
        displayName: user.name,
        ...(user.profileImage && { profileImage: user.profileImage }),
    };
    const options = {
        expiresIn: index_js_1.config.jwt.accessExpiresInSeconds,
    };
    const token = jsonwebtoken_1.default.sign(payload, index_js_1.config.jwt.accessSecret, options);
    logger_js_1.logger.info({ userId: user.id }, "[JWT Utils] Generated Access Token");
    return token;
};
exports.generateAccessToken = generateAccessToken;
const generateAndStoreRefreshToken = async (userId) => {
    const jti = crypto_1.default.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + index_js_1.config.jwt.refreshExpiresInDays);
    const payload = { id: userId, type: "refresh" };
    try {
        await prisma_js_1.default.refreshToken.create({
            data: { jti, userId, expiresAt },
        });
        logger_js_1.logger.info({ jti, userId }, "[JWT Utils] Refresh token JTI stored in DB");
    }
    catch (dbError) {
        logger_js_1.logger.error({ err: dbError }, "[JWT Utils] Failed to store refresh token in DB");
        throw (0, error_factory_js_1.createHttpError)(500, "Could not save session information.");
    }
    const token = jsonwebtoken_1.default.sign(payload, index_js_1.config.jwt.refreshSecret, {
        expiresIn: `${index_js_1.config.jwt.refreshExpiresInDays}d`,
        jwtid: jti,
    });
    return { token, expiresAt };
};
exports.generateAndStoreRefreshToken = generateAndStoreRefreshToken;
const verifyAndValidateRefreshToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, index_js_1.config.jwt.refreshSecret);
        if (!decoded.jti || !decoded.id || decoded.type !== "refresh") {
            throw (0, error_factory_js_1.createHttpError)(401, "Invalid refresh token payload structure.");
        }
        const storedToken = await prisma_js_1.default.refreshToken.findUnique({
            where: { jti: decoded.jti },
        });
        if (!storedToken) {
            throw (0, error_factory_js_1.createHttpError)(403, "Session not found. Please log in again.");
        }
        if (storedToken.revoked) {
            throw (0, error_factory_js_1.createHttpError)(403, "Session has been revoked. Please log in again.");
        }
        if (new Date() > storedToken.expiresAt) {
            throw (0, error_factory_js_1.createHttpError)(403, "Session has expired. Please log in again.");
        }
        if (storedToken.userId !== decoded.id) {
            await prisma_js_1.default.refreshToken.update({
                where: { jti: decoded.jti },
                data: { revoked: true },
            });
            logger_js_1.logger.fatal({
                jti: decoded.jti,
                expectedUserId: storedToken.userId,
                actualUserId: decoded.id,
            }, "CRITICAL: Refresh token user mismatch. Token voided.");
            throw (0, error_factory_js_1.createHttpError)(403, "Session invalid; token has been voided.");
        }
        logger_js_1.logger.info({ jti: decoded.jti }, "[JWT Utils] Refresh token successfully validated.");
        return decoded;
    }
    catch (error) {
        if (error instanceof HttpError_js_1.HttpError) {
            throw error;
        }
        if (error instanceof jsonwebtoken_1.TokenExpiredError ||
            error instanceof jsonwebtoken_1.JsonWebTokenError) {
            logger_js_1.logger.warn({ err: error }, "[JWT Utils] Session token is invalid or expired");
            throw (0, error_factory_js_1.createHttpError)(403, "Your session is invalid or expired. Please log in again.");
        }
        logger_js_1.logger.error({ err: error }, "[JWT Utils] Unexpected error during refresh token verification");
        throw (0, error_factory_js_1.createHttpError)(500, "Could not verify session due to a server issue.");
    }
};
exports.verifyAndValidateRefreshToken = verifyAndValidateRefreshToken;
//# sourceMappingURL=jwt.utils.js.map