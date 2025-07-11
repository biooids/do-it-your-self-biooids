import { Router } from "express";
import { authController } from "@/features/auth/auth.controller.js";
import { validate } from "@/middleware/validate.js"; // You will need to create this middleware
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
} from "@/features/auth/auth.validation.js";
import { verifyToken } from "@/middleware/auth.middleware";

const router: Router = Router();

// --- Public Routes ---
router.post("/register", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshAccessToken);
router.post("/oauth", authController.handleOAuth);

// --- Protected Routes (require a valid token) ---
router.post("/logout", verifyToken, authController.logout);
router.post(
  "/change-password",
  verifyToken,
  validate(changePasswordSchema),
  authController.changePassword
);
router.post("/logout-all", verifyToken, authController.logoutAll);

export default router;
