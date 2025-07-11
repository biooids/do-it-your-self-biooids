import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma.js";
import { config } from "../config/index.js";
import { DecodedAccessTokenPayload } from "../types/auth.types.js";
import { createHttpError } from "../utils/error.factory.js";
import { asyncHandler } from "./asyncHandler.js";
import { logger } from "../config/logger.js"; // Import the logger

export const verifyToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Using logger.debug for verbose logs that won't show in production by default
    logger.debug({ path: req.path }, "[Auth Middleware] verifyToken triggered");

    // Token extraction
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        createHttpError(401, "Unauthorized: No Bearer token provided.")
      );
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createHttpError(401, "Unauthorized: Token not found."));
    }

    try {
      // --- Token Verification ---
      const decoded = jwt.verify(
        token,
        config.jwt.accessSecret
      ) as DecodedAccessTokenPayload;

      // --- Payload Validation ---
      if (
        !decoded.id ||
        !decoded.systemRole ||
        !decoded.username ||
        decoded.type !== "access"
      ) {
        // Replaced console.warn with a structured log
        logger.warn(
          { payload: decoded },
          "[Auth Middleware] Invalid token payload"
        );
        return next(
          createHttpError(401, "Unauthorized: Invalid token payload.")
        );
      }

      // --- Database User Validation ---
      // This line is correct. The TypeScript error is likely due to a stale Prisma client.
      // Run `npx prisma generate` in your terminal to fix it.
      const userFromDb = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!userFromDb) {
        // Replaced console.warn with a structured log
        logger.warn(
          { userId: decoded.id },
          "[Auth Middleware] User not found in DB"
        );
        return next(createHttpError(401, "Unauthorized: User not found."));
      }

      // --- Check if user account is active ---
      if (userFromDb.status !== "ACTIVE") {
        // Replaced console.warn with a structured log
        logger.warn(
          { userId: userFromDb.id, status: userFromDb.status },
          "[Auth Middleware] User account is not active"
        );
        return next(
          createHttpError(
            403,
            `Forbidden: User account is ${userFromDb.status.toLowerCase()}.`
          )
        );
      }

      // --- Attach User to Request ---
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

      // Replaced console.log with a structured, informational log
      logger.info(
        { user: req.user },
        "[Auth Middleware] User successfully attached to request"
      );

      next();
    } catch (err) {
      // The globalErrorHandler will catch, log, and format these JWT errors
      next(err);
    }
  }
);
