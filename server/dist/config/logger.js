"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const index_js_1 = require("./index.js");
const level = index_js_1.config.logLevel || "info";
const transport = index_js_1.config.nodeEnv === "development"
    ?
        pino_1.default.transport({
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
                ignore: "pid,hostname",
            },
        })
    :
        undefined;
exports.logger = (0, pino_1.default)({
    level: level,
    redact: ["req.headers.authorization", "req.body.password"],
}, transport);
exports.logger.info(`✅ Logger configured with level: '${level}'`);
//# sourceMappingURL=logger.js.map