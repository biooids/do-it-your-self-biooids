import { Request, Response } from "express";
declare class AdminController {
    getDashboardStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllComments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateUserRole: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deletePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteComment: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const adminController: AdminController;
export {};
//# sourceMappingURL=admin.controller.d.ts.map