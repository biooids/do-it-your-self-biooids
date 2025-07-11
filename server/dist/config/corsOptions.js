"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const index_js_1 = require("./index.js");
const error_factory_js_1 = require("../utils/error.factory.js");
const logger_js_1 = require("./logger.js");
const allowedOrigins = index_js_1.config.corsOrigin
    .split(",")
    .map((origin) => origin.trim());
logger_js_1.logger.info({ origins: allowedOrigins }, "✅ Configured Allowed CORS origins");
exports.corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_js_1.logger.warn({ blockedOrigin: origin, allowed: allowedOrigins }, `🚫 CORS: Origin was blocked`);
            callback((0, error_factory_js_1.createHttpError)(403, `This origin is not allowed by CORS policy.`));
        }
    },
    credentials: true,
};
//# sourceMappingURL=corsOptions.js.map