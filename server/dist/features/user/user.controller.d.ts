import { Request, Response } from "express";
declare class UserController {
    getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteMyAccount: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteUserById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateMyProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserByUsername: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const userController: UserController;
export {};
//# sourceMappingURL=user.controller.d.ts.map