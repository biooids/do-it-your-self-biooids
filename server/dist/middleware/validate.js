"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const error_factory_js_1 = require("../utils/error.factory.js");
const validate = (schema) => async (req, _res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const firstErrorMessage = error.errors[0]?.message || "Invalid input.";
            return next((0, error_factory_js_1.createHttpError)(400, firstErrorMessage));
        }
        next((0, error_factory_js_1.createHttpError)(500, "Internal Server Error during validation."));
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map