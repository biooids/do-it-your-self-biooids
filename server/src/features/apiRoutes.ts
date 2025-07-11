// src/routes/apiRoutes.ts
import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js";
import postRoutes from "./post/post.routes.js";
import tagRoutes from "./tags/tag.routes.js"; // Import the tag routes
import { deserializeUser } from "./post/deserializeUser.js";
import commentRoutes from "./comments/comment.routes.js";
import updateRoutes from "./updates/update.routes.js"; // Import the update routes
import guideSectionRoutes from "../features/guideSection/guideSection.routes.js"; // Adjust path if needed
import guideStepRoutes from "../features/guideSection/guideStep.routes.js";
import adminRoutes from "./admin/admin.routes.js"; // <-- Import the new admin routes

const router: Router = Router();
router.use(deserializeUser);

// Health check for the API router itself
router.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "API router is healthy." });
});

// Mount the feature-specific routers
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/posts", postRoutes);
router.use("/tags", tagRoutes); // Mount the tag routes
router.use(commentRoutes);
router.use("/updates", updateRoutes);
router.use(guideSectionRoutes);
router.use(guideStepRoutes); // <-- Mount new step routes
router.use("/admin", adminRoutes); // <-- ADD THIS LINE to mount the admin routes

export default router;
