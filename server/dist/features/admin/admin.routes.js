"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("./admin.controller.js");
const admin_middleware_js_1 = require("../../middleware/admin.middleware.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.verifyToken, (0, admin_middleware_js_1.requireRole)(["SUPER_ADMIN"]));
router.get("/stats", admin_controller_js_1.adminController.getDashboardStats);
router.get("/users", admin_controller_js_1.adminController.getAllUsers);
router.patch("/users/:id/role", admin_controller_js_1.adminController.updateUserRole);
router.delete("/users/:id", admin_controller_js_1.adminController.deleteUser);
router.get("/posts", admin_controller_js_1.adminController.getAllPosts);
router.delete("/posts/:id", admin_controller_js_1.adminController.deletePost);
router.get("/comments", admin_controller_js_1.adminController.getAllComments);
router.delete("/comments/:id", admin_controller_js_1.adminController.deleteComment);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map