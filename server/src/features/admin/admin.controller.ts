// src/features/admin/admin.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler.js";
import { adminService } from "./admin.service.js";
import { createHttpError } from "@/utils/error.factory.js";
import { SystemRole } from "../../../prisma/generated/prisma";

class AdminController {
  // GET /admin/stats
  getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ status: "success", data: stats });
  });

  // GET /admin/users
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { users, total } = await adminService.getAllUsers(req.query);
    const limit = parseInt(req.query.limit as string) || 10;
    res.status(200).json({
      status: "success",
      data: {
        users,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(req.query.page as string) || 1,
        },
      },
    });
  });

  // GET /admin/posts
  getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const { posts, total } = await adminService.getAllPosts(req.query);
    const limit = parseInt(req.query.limit as string) || 10;
    res.status(200).json({
      status: "success",
      data: {
        posts,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(req.query.page as string) || 1,
        },
      },
    });
  });

  // --- NEW: GET /admin/comments ---
  getAllComments = asyncHandler(async (req: Request, res: Response) => {
    const { comments, total } = await adminService.getAllComments(req.query);
    const limit = parseInt(req.query.limit as string) || 10;
    res.status(200).json({
      status: "success",
      data: {
        comments,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(req.query.page as string) || 1,
        },
      },
    });
  });

  // PATCH /admin/users/:id/role
  updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(SystemRole).includes(role)) {
      throw createHttpError(400, "Invalid role provided.");
    }

    const updatedUser = await adminService.updateUserRole(id, role);
    res.status(200).json({ status: "success", data: updatedUser });
  });

  // DELETE /admin/users/:id
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (req.user?.id === id) {
      throw createHttpError(
        400,
        "Admins cannot delete their own account via this route."
      );
    }
    await adminService.deleteUser(id);
    res.status(204).send();
  });

  // DELETE /admin/posts/:id
  deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await adminService.deletePost(id);
    res.status(204).send();
  });

  // --- NEW: DELETE /admin/comments/:id ---
  deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await adminService.deleteComment(id);
    res.status(204).send();
  });
}

export const adminController = new AdminController();
