interface Config {
    nodeEnv: "development" | "production" | "test";
    port: number;
    databaseUrl: string;
    corsOrigin: string;
    jwt: {
        accessSecret: string;
        accessExpiresInSeconds: number;
        refreshSecret: string;
        refreshExpiresInDays: number;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    cookies: {
        refreshTokenName: string;
    };
    logLevel: string;
}
declare let config: Config;
export { config };
//# sourceMappingURL=index.d.ts.map