import { Router } from "express";
import { guideSectionController } from "./guideSection.controller.js";
import { verifyToken } from "@/middleware/auth.middleware.js";
import { validate } from "@/middleware/validate.js";
import { uploadImage } from "@/middleware/multer.config.js";
import {
  createGuideSectionSchema,
  updateGuideSectionSchema,
} from "./guideSection.validation.js";

const router: Router = Router();
router.use(verifyToken);

// === THE FIX: Create a section under a specific stepId ===
router.post(
  "/steps/:stepId/sections", // Correct endpoint
  uploadImage.single("image"),
  validate(createGuideSectionSchema),
  guideSectionController.create
);

// These routes are correct as they operate directly on a section
router.put(
  "/sections/:sectionId",
  uploadImage.single("image"),
  validate(updateGuideSectionSchema),
  guideSectionController.update
);

router.delete("/sections/:sectionId", guideSectionController.delete);

export default router;
