"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../../prisma/generated/prisma");
const prisma_js_1 = __importDefault(require("../../db/prisma.js"));
const error_factory_js_1 = require("../../utils/error.factory.js");
const logger_js_1 = require("../../config/logger.js");
const cloudinary_1 = require("../../config/cloudinary");
class UserService {
    async findUserByEmail(email) {
        return prisma_js_1.default.user.findUnique({ where: { email } });
    }
    async findUserByUsername(username) {
        return prisma_js_1.default.user.findUnique({ where: { username } });
    }
    async findUserById(id) {
        return prisma_js_1.default.user.findUnique({ where: { id } });
    }
    async createUser(input) {
        const { email, username, password, name } = input;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        try {
            const user = await prisma_js_1.default.user.create({
                data: {
                    email,
                    username,
                    hashedPassword: hashedPassword,
                    name: name,
                },
            });
            logger_js_1.logger.info({ userId: user.id, email: user.email }, "New user created successfully.");
            return user;
        }
        catch (e) {
            if (e instanceof prisma_1.Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002") {
                const field = e.meta?.target?.[0] || "details";
                logger_js_1.logger.warn({ field, email, username }, "Prisma unique constraint violation during user creation.");
                throw (0, error_factory_js_1.createHttpError)(409, `An account with this ${field} already exists.`);
            }
            logger_js_1.logger.error({ err: e }, "Unexpected error during user creation");
            throw (0, error_factory_js_1.createHttpError)(500, "Could not create user account.");
        }
    }
    async deleteUserAccount(userId) {
        logger_js_1.logger.info({ userId }, "Initiating account deletion process.");
        const user = await this.findUserById(userId);
        if (!user) {
            logger_js_1.logger.warn({ userId }, "Account deletion skipped: User not found.");
            return;
        }
        const deletionPromises = [];
        if (user.profileImage) {
            const publicId = `user_assets/profile_${userId}`;
            deletionPromises.push((0, cloudinary_1.deleteFromCloudinary)(publicId));
        }
        if (user.bannerImage) {
            const publicId = `user_assets/banner_${userId}`;
            deletionPromises.push((0, cloudinary_1.deleteFromCloudinary)(publicId));
        }
        if (deletionPromises.length > 0) {
            logger_js_1.logger.info({ userId }, `Deleting ${deletionPromises.length} assets from Cloudinary.`);
            await Promise.allSettled(deletionPromises);
        }
        try {
            await prisma_js_1.default.user.delete({ where: { id: userId } });
            logger_js_1.logger.info({ userId }, "User record and assets deleted successfully.");
        }
        catch (error) {
            logger_js_1.logger.error({ err: error, userId }, "Error deleting user record from database");
            throw (0, error_factory_js_1.createHttpError)(500, "Could not delete user account at this time.");
        }
    }
    async updateUserProfile(userId, data) {
        const existingUser = await this.findUserById(userId);
        if (!existingUser) {
            throw (0, error_factory_js_1.createHttpError)(404, "User profile not found.");
        }
        try {
            const user = await prisma_js_1.default.user.update({
                where: { id: userId },
                data: data,
            });
            logger_js_1.logger.info({ userId }, "User profile updated successfully.");
            return user;
        }
        catch (e) {
            if (e instanceof prisma_1.Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002") {
                logger_js_1.logger.warn({ userId, username: data.username }, "Username conflict during profile update.");
                throw (0, error_factory_js_1.createHttpError)(409, "This username is already taken.");
            }
            logger_js_1.logger.error({ err: e, userId }, "Error updating user profile");
            throw (0, error_factory_js_1.createHttpError)(500, "Could not update user profile.");
        }
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map