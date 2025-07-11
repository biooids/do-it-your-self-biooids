import { Router } from "express";
import { postController } from "@/features/post/post.controller.js";
import { verifyToken } from "@/middleware/auth.middleware.js";
import { validate } from "@/middleware/validate.js";
import {
  createPostSchema,
  updatePostSchema,
} from "@/features/post/post.validation.js";
import { uploadImage } from "@/middleware/multer.config.js";

const router: Router = Router();

// --- PUBLIC ROUTES (anyone can view posts) ---
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPost);

// --- PROTECTED ROUTES (user must be logged in) ---
// The verifyToken middleware will apply to all routes defined below this line.
router.use(verifyToken);

// --- Core Post CRUD ---
router.post(
  "/",
  uploadImage.array("postImages", 5),
  validate(createPostSchema),
  postController.createPost
);

router.patch(
  "/:id",
  uploadImage.array("postImages", 5),
  validate(updatePostSchema),
  postController.updatePost
);

router.delete("/:id", postController.deletePost);

// --- Engagement Features ---

// Like / Unlike a post
router.post("/:id/like", postController.likePost);
router.delete("/:id/like", postController.unlikePost);

// Save / Unsave a post
router.post("/:id/save", postController.savePost);
router.delete("/:id/save", postController.unsavePost);

// Share a post
router.post("/:id/share", postController.sharePost);

// Record a view for a post
router.post("/:id/view", postController.recordPostView);

export default router;
