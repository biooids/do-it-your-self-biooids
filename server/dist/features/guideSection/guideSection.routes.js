"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guideSection_controller_js_1 = require("./guideSection.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_js_1 = require("../../middleware/validate.js");
const multer_config_js_1 = require("../../middleware/multer.config.js");
const guideSection_validation_js_1 = require("./guideSection.validation.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.verifyToken);
router.post("/steps/:stepId/sections", multer_config_js_1.uploadImage.single("image"), (0, validate_js_1.validate)(guideSection_validation_js_1.createGuideSectionSchema), guideSection_controller_js_1.guideSectionController.create);
router.put("/sections/:sectionId", multer_config_js_1.uploadImage.single("image"), (0, validate_js_1.validate)(guideSection_validation_js_1.updateGuideSectionSchema), guideSection_controller_js_1.guideSectionController.update);
router.delete("/sections/:sectionId", guideSection_controller_js_1.guideSectionController.delete);
exports.default = router;
//# sourceMappingURL=guideSection.routes.js.map