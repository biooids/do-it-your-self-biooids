"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../../features/auth/auth.controller.js");
const validate_js_1 = require("../../middleware/validate.js");
const auth_validation_js_1 = require("../../features/auth/auth.validation.js");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_js_1.validate)(auth_validation_js_1.signupSchema), auth_controller_js_1.authController.signup);
router.post("/login", (0, validate_js_1.validate)(auth_validation_js_1.loginSchema), auth_controller_js_1.authController.login);
router.post("/refresh", auth_controller_js_1.authController.refreshAccessToken);
router.post("/oauth", auth_controller_js_1.authController.handleOAuth);
router.post("/logout", auth_middleware_1.verifyToken, auth_controller_js_1.authController.logout);
router.post("/change-password", auth_middleware_1.verifyToken, (0, validate_js_1.validate)(auth_validation_js_1.changePasswordSchema), auth_controller_js_1.authController.changePassword);
router.post("/logout-all", auth_middleware_1.verifyToken, auth_controller_js_1.authController.logoutAll);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map