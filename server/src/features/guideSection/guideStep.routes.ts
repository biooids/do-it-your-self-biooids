import { Router } from "express";
import { guideStepController } from "./guideStep.controller.js";
import { verifyToken } from "@/middleware/auth.middleware.js";
import { validate } from "@/middleware/validate.js";
import {
  createGuideStepSchema,
  updateGuideStepSchema,
} from "./guideStep.validation.js";

const router: Router = Router();
router.use(verifyToken);

router.post(
  "/posts/:postId/steps",
  validate(createGuideStepSchema),
  guideStepController.create
);
router.put(
  "/steps/:stepId",
  validate(updateGuideStepSchema),
  guideStepController.update
);
router.delete("/steps/:stepId", guideStepController.delete);

export default router;
