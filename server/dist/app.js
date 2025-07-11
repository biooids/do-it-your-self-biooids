"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_js_1 = require("./middleware/globalErrorHandler.js");
const error_factory_js_1 = require("./utils/error.factory.js");
const corsOptions_js_1 = require("./config/corsOptions.js");
const apiRoutes_js_1 = __importDefault(require("./features/apiRoutes.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions_js_1.corsOptions));
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, cookie_parser_1.default)());
app.use("/uploads", express_1.default.static("uploads"));
app.get("/", (_req, res) => {
    res
        .status(200)
        .json({ status: "success", message: "Chat API is healthy and running!" });
});
app.use("/api/v1", apiRoutes_js_1.default);
app.use((req, _res, next) => {
    next((0, error_factory_js_1.createHttpError)(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(globalErrorHandler_js_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map