"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
exports.deserializeUser = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = await prisma_js_1.default.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    profileImage: true,
                    bannerImage: true,
                    systemRole: true,
                    status: true,
                },
            });
        }
        catch (error) {
            console.error("Token verification failed or token is invalid. Proceeding as guest.");
            req.user = null;
        }
    }
    next();
});
//# sourceMappingURL=deserializeUser.js.map