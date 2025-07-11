import { Router } from "express";
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
} from "../auth/auth.validation.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";

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
