// server/src/features/tag/tag.controller.js
import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler.js";
import { tagService } from "./tag.service.js";

class TagController {
  getAllTags = asyncHandler(async (req: Request, res: Response) => {
    // Pass the entire req.query object, which may contain the category
    const tags = await tagService.getAllTags(req.query);
    res.status(200).json({ status: "success", data: tags });
  });
}
export const tagController = new TagController();
