"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./user/user.routes.js"));
const post_routes_js_1 = __importDefault(require("./post/post.routes.js"));
const tag_routes_js_1 = __importDefault(require("./tags/tag.routes.js"));
const deserializeUser_js_1 = require("./post/deserializeUser.js");
const comment_routes_js_1 = __importDefault(require("./comments/comment.routes.js"));
const update_routes_js_1 = __importDefault(require("./updates/update.routes.js"));
const guideSection_routes_js_1 = __importDefault(require("../features/guideSection/guideSection.routes.js"));
const guideStep_routes_js_1 = __importDefault(require("../features/guideSection/guideStep.routes.js"));
const admin_routes_js_1 = __importDefault(require("./admin/admin.routes.js"));
const router = (0, express_1.Router)();
router.use(deserializeUser_js_1.deserializeUser);
router.get("/health", (_req, res) => {
    res
        .status(200)
        .json({ status: "success", message: "API router is healthy." });
});
router.use("/auth", auth_routes_js_1.default);
router.use("/user", user_routes_js_1.default);
router.use("/posts", post_routes_js_1.default);
router.use("/tags", tag_routes_js_1.default);
router.use(comment_routes_js_1.default);
router.use("/updates", update_routes_js_1.default);
router.use(guideSection_routes_js_1.default);
router.use(guideStep_routes_js_1.default);
router.use("/admin", admin_routes_js_1.default);
exports.default = router;
//# sourceMappingURL=apiRoutes.js.map