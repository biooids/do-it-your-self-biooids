"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideStepController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const guideStep_service_js_1 = require("./guideStep.service.js");
class GuideStepController {
    create = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const newStep = await guideStep_service_js_1.guideStepService.create(req.user.id, req.params.postId, req.body);
        res
            .status(201)
            .json({ status: "success", message: "Guide step added.", data: newStep });
    });
    update = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const updatedStep = await guideStep_service_js_1.guideStepService.update(req.user.id, req.params.stepId, req.body);
        res
            .status(200)
            .json({
            status: "success",
            message: "Guide step updated.",
            data: updatedStep,
        });
    });
    delete = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        await guideStep_service_js_1.guideStepService.delete(req.user.id, req.params.stepId);
        res.status(204).send();
    });
}
exports.guideStepController = new GuideStepController();
//# sourceMappingURL=guideStep.controller.js.map