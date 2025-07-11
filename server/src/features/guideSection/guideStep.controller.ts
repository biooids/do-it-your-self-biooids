import { asyncHandler } from "@/middleware/asyncHandler.js";
import { Request, Response } from "express";
import { guideStepService } from "./guideStep.service.js";

class GuideStepController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const newStep = await guideStepService.create(
      req.user!.id,
      req.params.postId,
      req.body
    );
    res
      .status(201)
      .json({ status: "success", message: "Guide step added.", data: newStep });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const updatedStep = await guideStepService.update(
      req.user!.id,
      req.params.stepId,
      req.body
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "Guide step updated.",
        data: updatedStep,
      });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await guideStepService.delete(req.user!.id, req.params.stepId);
    res.status(204).send();
  });
}
export const guideStepController = new GuideStepController();
