"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guideStep_controller_js_1 = require("./guideStep.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_js_1 = require("../../middleware/validate.js");
const guideStep_validation_js_1 = require("./guideStep.validation.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.verifyToken);
router.post("/posts/:postId/steps", (0, validate_js_1.validate)(guideStep_validation_js_1.createGuideStepSchema), guideStep_controller_js_1.guideStepController.create);
router.put("/steps/:stepId", (0, validate_js_1.validate)(guideStep_validation_js_1.updateGuideStepSchema), guideStep_controller_js_1.guideStepController.update);
router.delete("/steps/:stepId", guideStep_controller_js_1.guideStepController.delete);
exports.default = router;
//# sourceMappingURL=guideStep.routes.js.map