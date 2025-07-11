import { Router } from "express";
import { tagController } from "./tag.controller.js";

const router: Router = Router();
router.get("/", tagController.getAllTags);
export default router;
