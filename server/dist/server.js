"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = require("./config/index.js");
const prisma_js_1 = require("./db/prisma.js");
const logger_js_1 = require("./config/logger.js");
const PORT = index_js_1.config.port;
const server = http_1.default.createServer(app_js_1.default);
let isShuttingDown = false;
async function startServer() {
    try {
        await (0, prisma_js_1.connectPrisma)();
        server.listen(PORT, () => {
            logger_js_1.logger.info(`🚀 Server listening on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        logger_js_1.logger.fatal({ err: error }, "❌ Failed to connect to database during startup. Server not started.");
        process.exit(1);
    }
}
const performGracefulShutdown = async (signalSource) => {
    if (isShuttingDown) {
        logger_js_1.logger.warn(`[Shutdown] Already in progress (triggered by ${signalSource})...`);
        return;
    }
    isShuttingDown = true;
    logger_js_1.logger.info(`👋 Received ${signalSource}, shutting down gracefully...`);
    const shutdownTimeout = setTimeout(() => {
        logger_js_1.logger.error("⚠️ Graceful shutdown timed out (10s), forcing exit.");
        process.exit(1);
    }, 10000);
    try {
        logger_js_1.logger.info("🔌 Attempting to close HTTP server...");
        await new Promise((resolve) => {
            server.close((err) => {
                if (err) {
                    if (err.code === "ERR_SERVER_NOT_RUNNING") {
                        logger_js_1.logger.warn("⚠️ HTTP server was already not running or closed.");
                    }
                    else {
                        logger_js_1.logger.error({ err }, "❌ Error closing HTTP server");
                    }
                }
                else {
                    logger_js_1.logger.info("✅ HTTP server closed.");
                }
                resolve();
            });
        });
        await (0, prisma_js_1.disconnectPrisma)();
        clearTimeout(shutdownTimeout);
        logger_js_1.logger.info("🚪 All services closed successfully. Exiting process...");
        process.exit(0);
    }
    catch (error) {
        clearTimeout(shutdownTimeout);
        logger_js_1.logger.fatal({ err: error }, "❌ Error during graceful shutdown sequence");
        process.exit(1);
    }
};
const criticalErrorHandler = (errorType, error) => {
    logger_js_1.logger.fatal({ err: error }, `💥 ${errorType}! Attempting graceful shutdown...`);
    if (!isShuttingDown) {
        performGracefulShutdown(errorType).catch(() => {
            logger_js_1.logger.fatal("Force exiting after critical error and failed graceful shutdown.");
            process.exit(1);
        });
        setTimeout(() => {
            logger_js_1.logger.error(`Force exiting after ${errorType} (7s timeout).`);
            process.exit(1);
        }, 7000);
    }
    else {
        logger_js_1.logger.warn("Shutdown already initiated, but a critical error occurred during the process.");
    }
};
const signals = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
    process.on(signal, () => performGracefulShutdown(signal));
});
process.on("unhandledRejection", (reason, _promise) => {
    criticalErrorHandler("UNHANDLED REJECTION", reason);
});
process.on("uncaughtException", (err) => {
    criticalErrorHandler("UNCAUGHT EXCEPTION", err);
});
startServer();
//# sourceMappingURL=server.js.map