"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const promises_1 = __importDefault(require("fs/promises"));
const index_js_1 = require("./index.js");
const logger_js_1 = require("./logger.js");
cloudinary_1.v2.config({
    cloud_name: index_js_1.config.cloudinary.cloudName,
    api_key: index_js_1.config.cloudinary.apiKey,
    api_secret: index_js_1.config.cloudinary.apiSecret,
    secure: true,
});
logger_js_1.logger.info("✅ Cloudinary configured successfully.");
const uploadToCloudinary = async (filePath, folder, publicId) => {
    const uploadOptions = {
        folder: folder,
        resource_type: "auto",
        ...(publicId && { public_id: publicId, overwrite: true }),
    };
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, uploadOptions);
        logger_js_1.logger.info({ public_id: result.public_id }, "File successfully uploaded to Cloudinary");
        return result;
    }
    catch (error) {
        logger_js_1.logger.error({ err: error }, "Cloudinary Upload Error");
        throw error;
    }
    finally {
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (unlinkErr) {
            logger_js_1.logger.warn({ err: unlinkErr, filePath }, "Failed to delete temporary local file");
        }
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        logger_js_1.logger.info({ publicId, result: result.result }, "Asset successfully deleted from Cloudinary");
        return result;
    }
    catch (error) {
        logger_js_1.logger.error({ err: error, publicId }, "Cloudinary Deletion Error");
        throw error;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinary.js.map