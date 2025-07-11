"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const update_controller_js_1 = require("./update.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const admin_middleware_js_1 = require("../../middleware/admin.middleware.js");
const validate_js_1 = require("../../middleware/validate.js");
const update_validation_js_1 = require("./update.validation.js");
const router = (0, express_1.Router)();
router.get("/", update_controller_js_1.updateController.findAll);
router.get("/:id", update_controller_js_1.updateController.findOne);
const authorizedRoles = ["DEVELOPER", "SUPER_ADMIN"];
router.post("/", auth_middleware_js_1.verifyToken, (0, admin_middleware_js_1.requireRole)(authorizedRoles), (0, validate_js_1.validate)(update_validation_js_1.createUpdateSchema), update_controller_js_1.updateController.create);
router.patch("/:id", auth_middleware_js_1.verifyToken, (0, admin_middleware_js_1.requireRole)(authorizedRoles), (0, validate_js_1.validate)(update_validation_js_1.updateUpdateSchema), update_controller_js_1.updateController.update);
router.delete("/:id", auth_middleware_js_1.verifyToken, (0, admin_middleware_js_1.requireRole)(authorizedRoles), update_controller_js_1.updateController.remove);
exports.default = router;
//# sourceMappingURL=update.routes.js.map