// src/features/updates/update.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler.js";
import { createHttpError } from "@/utils/error.factory.js";
import { updateService } from "./update.service";

class UpdateController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const authorId = req.user?.id;
    // The role check is now handled by middleware, so we just need to ensure a user exists.
    if (!authorId) throw createHttpError(401, "Authentication required.");

    const newUpdate = await updateService.create(req.body, authorId);
    res.status(201).json({ success: true, data: newUpdate });
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const take = req.query.take ? parseInt(req.query.take as string) : 10;
    const { updates, total } = await updateService.findAll({ skip, take });
    res.status(200).json({ success: true, data: updates, total });
  });

  findOne = asyncHandler(async (req: Request, res: Response) => {
    const update = await updateService.findOne(req.params.id);
    res.status(200).json({ success: true, data: update });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.systemRole;
    if (!userId || !userRole) throw createHttpError(401, "Unauthorized");

    const updated = await updateService.update(
      req.params.id,
      req.body,
      userId,
      userRole
    );
    res.status(200).json({ success: true, data: updated });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.systemRole;
    if (!userId || !userRole) throw createHttpError(401, "Unauthorized");

    await updateService.remove(req.params.id, userId, userRole);
    res.status(204).send();
  });
}

export const updateController = new UpdateController();
