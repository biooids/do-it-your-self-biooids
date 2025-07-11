"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const asyncHandler_js_1 = require("../../middleware/asyncHandler.js");
const admin_service_js_1 = require("./admin.service.js");
const error_factory_js_1 = require("../../utils/error.factory.js");
const prisma_1 = require("../../../prisma/generated/prisma");
class AdminController {
    getDashboardStats = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
        const stats = await admin_service_js_1.adminService.getDashboardStats();
        res.status(200).json({ status: "success", data: stats });
    });
    getAllUsers = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { users, total } = await admin_service_js_1.adminService.getAllUsers(req.query);
        const limit = parseInt(req.query.limit) || 10;
        res.status(200).json({
            status: "success",
            data: {
                users,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(req.query.page) || 1,
                },
            },
        });
    });
    getAllPosts = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { posts, total } = await admin_service_js_1.adminService.getAllPosts(req.query);
        const limit = parseInt(req.query.limit) || 10;
        res.status(200).json({
            status: "success",
            data: {
                posts,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(req.query.page) || 1,
                },
            },
        });
    });
    getAllComments = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { comments, total } = await admin_service_js_1.adminService.getAllComments(req.query);
        const limit = parseInt(req.query.limit) || 10;
        res.status(200).json({
            status: "success",
            data: {
                comments,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(req.query.page) || 1,
                },
            },
        });
    });
    updateUserRole = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !Object.values(prisma_1.SystemRole).includes(role)) {
            throw (0, error_factory_js_1.createHttpError)(400, "Invalid role provided.");
        }
        const updatedUser = await admin_service_js_1.adminService.updateUserRole(id, role);
        res.status(200).json({ status: "success", data: updatedUser });
    });
    deleteUser = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (req.user?.id === id) {
            throw (0, error_factory_js_1.createHttpError)(400, "Admins cannot delete their own account via this route.");
        }
        await admin_service_js_1.adminService.deleteUser(id);
        res.status(204).send();
    });
    deletePost = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await admin_service_js_1.adminService.deletePost(id);
        res.status(204).send();
    });
    deleteComment = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await admin_service_js_1.adminService.deleteComment(id);
        res.status(204).send();
    });
}
exports.adminController = new AdminController();
//# sourceMappingURL=admin.controller.js.map