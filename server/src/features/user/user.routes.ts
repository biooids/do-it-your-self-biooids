import { Router } from "express";
import { userController } from "@/features/user/user.controller.js";
import { verifyToken } from "@/middleware/auth.middleware.js";
import { uploadImage } from "@/middleware/multer.config";
import { validate } from "@/middleware/validate.js";
import { updateUserProfileSchema } from "@/features/user/user.validation.js";

const router: Router = Router();

// --- PUBLIC ROUTES (No token required) ---
// This route is for fetching public user profiles.
// It MUST be defined BEFORE the '/:id' route to avoid conflicts.
router.get("/profile/:username", userController.getUserByUsername);

// --- PROTECTED ROUTES (Token is now required for all routes below) ---
router.use(verifyToken);

// --- Routes for the authenticated user ("me") ---
router.get("/me", userController.getMe);
router.patch(
  "/me",
  uploadImage.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  validate(updateUserProfileSchema),
  userController.updateMyProfile
);
router.delete("/me", userController.deleteMyAccount);

// --- Admin/Protected Routes ---
// This route for fetching a user by their UUID is now protected.
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUserById);
// --- NEW: Follow/Unfollow Routes ---
router.post("/:id/follow", userController.follow);
router.delete("/:id/follow", userController.unfollow);

export default router;
