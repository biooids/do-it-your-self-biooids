"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const index_js_1 = require("../config/index.js");
const error_factory_js_1 = require("../utils/error.factory.js");
const asyncHandler_js_1 = require("./asyncHandler.js");
const logger_js_1 = require("../config/logger.js");
exports.verifyToken = (0, asyncHandler_js_1.asyncHandler)(async (req, _res, next) => {
    logger_js_1.logger.debug({ path: req.path }, "[Auth Middleware] verifyToken triggered");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next((0, error_factory_js_1.createHttpError)(401, "Unauthorized: No Bearer token provided."));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return next((0, error_factory_js_1.createHttpError)(401, "Unauthorized: Token not found."));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, index_js_1.config.jwt.accessSecret);
        if (!decoded.id ||
            !decoded.systemRole ||
            !decoded.username ||
            decoded.type !== "access") {
            logger_js_1.logger.warn({ payload: decoded }, "[Auth Middleware] Invalid token payload");
            return next((0, error_factory_js_1.createHttpError)(401, "Unauthorized: Invalid token payload."));
        }
        const userFromDb = await prisma_js_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!userFromDb) {
            logger_js_1.logger.warn({ userId: decoded.id }, "[Auth Middleware] User not found in DB");
            return next((0, error_factory_js_1.createHttpError)(401, "Unauthorized: User not found."));
        }
        if (userFromDb.status !== "ACTIVE") {
            logger_js_1.logger.warn({ userId: userFromDb.id, status: userFromDb.status }, "[Auth Middleware] User account is not active");
            return next((0, error_factory_js_1.createHttpError)(403, `Forbidden: User account is ${userFromDb.status.toLowerCase()}.`));
        }
        req.user = {
            id: userFromDb.id,
            systemRole: userFromDb.systemRole,
            username: userFromDb.username,
            name: userFromDb.name,
            profileImage: userFromDb.profileImage || "",
            bannerImage: userFromDb.bannerImage || "",
            status: userFromDb.status,
            email: userFromDb.email,
        };
        logger_js_1.logger.info({ user: req.user }, "[Auth Middleware] User successfully attached to request");
        next();
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=auth.middleware.js.map