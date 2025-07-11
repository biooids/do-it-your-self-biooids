// src/features/admin/admin.routes.ts

import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { requireRole } from "@/middleware/admin.middleware.js";
import { verifyToken } from "@/middleware/auth.middleware.js";

const router: Router = Router();

// Apply authentication and SUPER_ADMIN role protection to ALL routes in this file.
router.use(verifyToken, requireRole(["SUPER_ADMIN"]));

// Dashboard
router.get("/stats", adminController.getDashboardStats);

// User Management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Post Management
router.get("/posts", adminController.getAllPosts);
router.delete("/posts/:id", adminController.deletePost);

// --- NEW: Comment Management ---
router.get("/comments", adminController.getAllComments);
router.delete("/comments/:id", adminController.deleteComment);

export default router;
