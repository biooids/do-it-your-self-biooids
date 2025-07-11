// src/features/updates/update.routes.ts
import { Router } from "express";
import { updateController } from "./update.controller.js";
import { verifyToken } from "@/middleware/auth.middleware.js";
import { requireRole } from "@/middleware/admin.middleware.js"; // Reusable role middleware
import { validate } from "@/middleware/validate.js";
import { createUpdateSchema, updateUpdateSchema } from "./update.validation.js";
import { SystemRole } from "@/prisma-client"; // FIX: Import the SystemRole enum

const router: Router = Router();

// Public routes to view updates
router.get("/", updateController.findAll);
router.get("/:id", updateController.findOne);

// --- Protected routes for admin/developer actions ---

// The roles allowed to create, update, or delete updates.
// FIX: Explicitly type the array as SystemRole[]
const authorizedRoles: SystemRole[] = ["DEVELOPER", "SUPER_ADMIN"];

// Create a new update
router.post(
  "/",
  verifyToken,
  requireRole(authorizedRoles), // Middleware handles authorization check
  validate(createUpdateSchema),
  updateController.create
);

// Update an existing update
router.patch(
  "/:id",
  verifyToken,
  requireRole(authorizedRoles), // Middleware handles authorization check
  validate(updateUpdateSchema),
  updateController.update
);

// Delete an update
router.delete(
  "/:id",
  verifyToken,
  requireRole(authorizedRoles), // Middleware handles authorization check
  updateController.remove
);

export default router;
