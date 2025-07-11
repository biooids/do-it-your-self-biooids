import { asyncHandler } from "@/middleware/asyncHandler.js";
import { Request, Response } from "express";
import { guideSectionService } from "./guideSection.service.js";

class GuideSectionController {
  create = asyncHandler(async (req: Request, res: Response) => {
    // === THE FIX: Get 'stepId' from params, not 'postId' ===
    const newSection = await guideSectionService.create(
      req.user!.id,
      req.params.stepId, // Use the ID of the parent step
      req.body,
      req.file
    );
    res
      .status(201)
      .json({
        status: "success",
        message: "Guide section added.",
        data: newSection,
      });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const updatedSection = await guideSectionService.update(
      req.user!.id,
      req.params.sectionId,
      req.body,
      req.file
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "Guide section modified.",
        data: updatedSection,
      });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await guideSectionService.delete(req.user!.id, req.params.sectionId);
    res.status(204).send();
  });
}

export const guideSectionController = new GuideSectionController();
