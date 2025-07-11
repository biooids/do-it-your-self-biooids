"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../../features/user/user.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const multer_config_1 = require("../../middleware/multer.config");
const validate_js_1 = require("../../middleware/validate.js");
const user_validation_js_1 = require("../../features/user/user.validation.js");
const router = (0, express_1.Router)();
router.get("/profile/:username", user_controller_js_1.userController.getUserByUsername);
router.use(auth_middleware_js_1.verifyToken);
router.get("/me", user_controller_js_1.userController.getMe);
router.patch("/me", multer_config_1.uploadImage.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
]), (0, validate_js_1.validate)(user_validation_js_1.updateUserProfileSchema), user_controller_js_1.userController.updateMyProfile);
router.delete("/me", user_controller_js_1.userController.deleteMyAccount);
router.get("/:id", user_controller_js_1.userController.getUserById);
router.delete("/:id", user_controller_js_1.userController.deleteUserById);
exports.default = router;
//# sourceMappingURL=user.routes.js.map