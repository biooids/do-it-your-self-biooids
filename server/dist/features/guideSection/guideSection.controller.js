"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideSectionController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const guideSection_service_js_1 = require("./guideSection.service.js");
class GuideSectionController {
    create = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const newSection = await guideSection_service_js_1.guideSectionService.create(req.user.id, req.params.stepId, req.body, req.file);
        res
            .status(201)
            .json({
            status: "success",
            message: "Guide section added.",
            data: newSection,
        });
    });
    update = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const updatedSection = await guideSection_service_js_1.guideSectionService.update(req.user.id, req.params.sectionId, req.body, req.file);
        res
            .status(200)
            .json({
            status: "success",
            message: "Guide section modified.",
            data: updatedSection,
        });
    });
    delete = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        await guideSection_service_js_1.guideSectionService.delete(req.user.id, req.params.sectionId);
        res.status(204).send();
    });
}
exports.guideSectionController = new GuideSectionController();
//# sourceMappingURL=guideSection.controller.js.map