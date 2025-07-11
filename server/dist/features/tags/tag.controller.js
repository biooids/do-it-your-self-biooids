"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const tag_service_js_1 = require("./tag.service.js");
class TagController {
    getAllTags = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const tags = await tag_service_js_1.tagService.getAllTags(req.query);
        res.status(200).json({ status: "success", data: tags });
    });
}
exports.tagController = new TagController();
//# sourceMappingURL=tag.controller.js.map