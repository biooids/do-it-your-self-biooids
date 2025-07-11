import { Request, Response } from "express";
declare class UpdateController {
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    findAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    findOne: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    remove: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const updateController: UpdateController;
export {};
//# sourceMappingURL=update.controller.d.ts.map