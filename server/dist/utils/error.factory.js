"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpError = void 0;
const HttpError_js_1 = require("./HttpError.js");
const createHttpError = (statusCode, message) => {
    return new HttpError_js_1.HttpError(statusCode, message);
};
exports.createHttpError = createHttpError;
//# sourceMappingURL=error.factory.js.map