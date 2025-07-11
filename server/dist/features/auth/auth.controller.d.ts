import { Request, Response } from "express";
declare class AuthController {
    signup: (req: Request, res: Response, next: import("express").NextFunction) => void;
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    refreshAccessToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
    logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    handleOAuth: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    logoutAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const authController: AuthController;
export {};
//# sourceMappingURL=auth.controller.d.ts.map