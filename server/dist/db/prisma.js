"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemRole = void 0;
exports.connectPrisma = connectPrisma;
exports.disconnectPrisma = disconnectPrisma;
const prisma_1 = require("../../prisma/generated/prisma");
const index_js_1 = require("../config/index.js");
const logger_js_1 = require("../config/logger.js");
var prisma_2 = require("../../prisma/generated/prisma");
Object.defineProperty(exports, "SystemRole", { enumerable: true, get: function () { return prisma_2.SystemRole; } });
const prismaClient = new prisma_1.PrismaClient({
    log: index_js_1.config.nodeEnv === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
});
const MAX_QUERY_RETRIES = 3;
const QUERY_RETRY_BASE_DELAY_MS = 1000;
const RETRIABLE_PRISMA_ERROR_CODES = [
    "P1000",
    "P1001",
    "P1002",
    "P1003",
    "P1008",
    "P1017",
    "P2024",
    "P3006",
];
const prisma = prismaClient.$extends({
    query: {
        $allModels: {
            $allOperations: async ({ model, operation, args, query }) => {
                let attempts = 0;
                while (attempts <= MAX_QUERY_RETRIES) {
                    try {
                        return await query(args);
                    }
                    catch (error) {
                        attempts++;
                        let errorCode;
                        if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                            errorCode = error.code;
                            if (!RETRIABLE_PRISMA_ERROR_CODES.includes(error.code) ||
                                attempts > MAX_QUERY_RETRIES) {
                                throw error;
                            }
                        }
                        else {
                            throw error;
                        }
                        const delayMs = QUERY_RETRY_BASE_DELAY_MS * Math.pow(2, attempts - 1);
                        logger_js_1.logger.warn({
                            err: error,
                            model,
                            operation,
                            attempt: attempts,
                            maxRetries: MAX_QUERY_RETRIES,
                            code: errorCode,
                        }, `Prisma query failed. Retrying in ${delayMs / 1000}s...`);
                        await new Promise((resolve) => setTimeout(resolve, delayMs));
                    }
                }
                throw new Error(`Query (${model}.${operation}) failed after ${MAX_QUERY_RETRIES} retries.`);
            },
        },
    },
});
const MAX_CONNECT_RETRIES = 5;
const CONNECT_RETRY_DELAY_MS = 5000;
async function connectPrisma(retriesLeft = MAX_CONNECT_RETRIES) {
    try {
        await prisma.$connect();
        logger_js_1.logger.info("✅ Successfully connected to the database via Prisma.");
    }
    catch (error) {
        const currentAttempt = MAX_CONNECT_RETRIES - retriesLeft + 1;
        logger_js_1.logger.error({ err: error, attempt: currentAttempt, maxRetries: MAX_CONNECT_RETRIES }, `❌ Prisma Connection Error`);
        if (retriesLeft > 0) {
            logger_js_1.logger.info(`Retrying connection in ${CONNECT_RETRY_DELAY_MS / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, CONNECT_RETRY_DELAY_MS));
            return connectPrisma(retriesLeft - 1);
        }
        else {
            logger_js_1.logger.fatal("❌ Exhausted all retries. Failed to connect to the database. Exiting.");
            process.exit(1);
        }
    }
}
exports.default = prisma;
async function disconnectPrisma() {
    try {
        await prisma.$disconnect();
        logger_js_1.logger.info("🔌 Prisma disconnected successfully.");
    }
    catch (error) {
        logger_js_1.logger.error({ err: error }, "❌ Error during Prisma disconnect");
    }
}
//# sourceMappingURL=prisma.js.map