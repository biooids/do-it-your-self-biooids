"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const error_factory_1 = require("../utils/error.factory");
const requireRole = (requiredRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next((0, error_factory_1.createHttpError)(401, "Authentication required."));
        }
        const userRole = req.user.systemRole;
        if (requiredRoles.includes(userRole)) {
            return next();
        }
        else {
            return next((0, error_factory_1.createHttpError)(403, "Forbidden: You do not have permission to access this resource."));
        }
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=admin.middleware.js.map