"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const error_factory_js_1 = require("../../utils/error.factory.js");
const update_service_1 = require("./update.service");
class UpdateController {
    create = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const authorId = req.user?.id;
        if (!authorId)
            throw (0, error_factory_js_1.createHttpError)(401, "Authentication required.");
        const newUpdate = await update_service_1.updateService.create(req.body, authorId);
        res.status(201).json({ success: true, data: newUpdate });
    });
    findAll = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const take = req.query.take ? parseInt(req.query.take) : 10;
        const { updates, total } = await update_service_1.updateService.findAll({ skip, take });
        res.status(200).json({ success: true, data: updates, total });
    });
    findOne = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const update = await update_service_1.updateService.findOne(req.params.id);
        res.status(200).json({ success: true, data: update });
    });
    update = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const userRole = req.user?.systemRole;
        if (!userId || !userRole)
            throw (0, error_factory_js_1.createHttpError)(401, "Unauthorized");
        const updated = await update_service_1.updateService.update(req.params.id, req.body, userId, userRole);
        res.status(200).json({ success: true, data: updated });
    });
    remove = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const userRole = req.user?.systemRole;
        if (!userId || !userRole)
            throw (0, error_factory_js_1.createHttpError)(401, "Unauthorized");
        await update_service_1.updateService.remove(req.params.id, userId, userRole);
        res.status(204).send();
    });
}
exports.updateController = new UpdateController();
//# sourceMappingURL=update.controller.js.map