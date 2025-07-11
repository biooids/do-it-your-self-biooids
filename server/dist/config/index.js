"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const getEnvVariable = (key, required = true) => {
    const value = process.env[key];
    if (!value && required) {
        throw new Error(`❌ Fatal Error: Missing required environment variable ${key}. Check your .env file or platform settings.`);
    }
    return value || "";
};
const getEnvVariableAsInt = (key, required = true, defaultValue) => {
    const valueStr = process.env[key];
    if (!valueStr) {
        if (required && defaultValue === undefined) {
            throw new Error(`❌ Fatal Error: Missing required environment variable ${key}.`);
        }
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        return NaN;
    }
    const intValue = parseInt(valueStr, 10);
    if (isNaN(intValue)) {
        throw new Error(`❌ Fatal Error: Invalid integer format for environment variable ${key}. Value: "${valueStr}"`);
    }
    return intValue;
};
let config;
try {
    exports.config = config = {
        nodeEnv: getEnvVariable("NODE_ENV", true),
        port: getEnvVariableAsInt("PORT", true),
        databaseUrl: getEnvVariable("DATABASE_URL", true),
        corsOrigin: getEnvVariable("CORS_ORIGIN", true),
        jwt: {
            accessSecret: getEnvVariable("ACCESS_TOKEN_SECRET", true),
            accessExpiresInSeconds: getEnvVariableAsInt("ACCESS_TOKEN_EXPIRES_IN_SECONDS", true),
            refreshSecret: getEnvVariable("REFRESH_TOKEN_SECRET", true),
            refreshExpiresInDays: getEnvVariableAsInt("REFRESH_TOKEN_EXPIRES_IN_DAYS", true),
        },
        cloudinary: {
            cloudName: getEnvVariable("CLOUDINARY_CLOUD_NAME", true),
            apiKey: getEnvVariable("CLOUDINARY_API_KEY", true),
            apiSecret: getEnvVariable("CLOUDINARY_API_SECRET", true),
        },
        cookies: {
            refreshTokenName: "jid",
        },
        logLevel: getEnvVariable("LOG_LEVEL", false) || "info",
    };
}
catch (error) {
    console.error("❌ Critical error during application configuration setup:", error);
    process.exit(1);
}
//# sourceMappingURL=index.js.map