// src/middleware/deserializeUser.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/db/prisma.js";
import { asyncHandler } from "@/middleware/asyncHandler";

interface JwtPayload {
  id: string;
}

export const deserializeUser = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token;

    // Check for the token in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET! // This should now be correct from our last fix
        ) as JwtPayload;

        // Get user from the token and attach to request object
        req.user = await prisma.user.findUnique({
          where: { id: decoded.id },
          // select only non-sensitive fields
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profileImage: true,
            bannerImage: true,
            systemRole: true,
            status: true,
          },
        });
      } catch (error) {
        // If the token is expired or invalid, we don't throw an error.
        // We just proceed without attaching a user. The user is treated as a guest.
        console.error(
          "Token verification failed or token is invalid. Proceeding as guest."
        );

        // --- THIS IS THE FIX ---
        // Assign null instead of undefined to match the type definition.
        req.user = null;
      }
    }

    next();
  }
);
