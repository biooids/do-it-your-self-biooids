"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const error_factory_js_1 = require("../utils/error.factory.js");
const IMAGE_UPLOADS_DIR = path_1.default.join(process.cwd(), "uploads/images_temp");
if (!fs_1.default.existsSync(IMAGE_UPLOADS_DIR)) {
    fs_1.default.mkdirSync(IMAGE_UPLOADS_DIR, { recursive: true });
}
const imageStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, IMAGE_UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `img-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const imageFileFilter = (_req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb((0, error_factory_js_1.createHttpError)(415, `File type ${file.mimetype} is not allowed. Please upload a valid image.`));
    }
};
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
});
const DOCUMENT_UPLOADS_DIR = path_1.default.join(process.cwd(), "uploads/documents_temp");
if (!fs_1.default.existsSync(DOCUMENT_UPLOADS_DIR)) {
    fs_1.default.mkdirSync(DOCUMENT_UPLOADS_DIR, { recursive: true });
}
const documentStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, DOCUMENT_UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `doc-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const documentFileFilter = (_req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb((0, error_factory_js_1.createHttpError)(415, `File type ${file.mimetype} is not allowed.`));
    }
};
const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024;
exports.uploadDocument = (0, multer_1.default)({
    storage: documentStorage,
    fileFilter: documentFileFilter,
    limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES },
});
//# sourceMappingURL=multer.config.js.map