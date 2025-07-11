"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tag_controller_js_1 = require("./tag.controller.js");
const router = (0, express_1.Router)();
router.get("/", tag_controller_js_1.tagController.getAllTags);
exports.default = router;
//# sourceMappingURL=tag.routes.js.map