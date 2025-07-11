import { Request, Response, NextFunction } from "express";
import { SystemRole } from "../../prisma/generated/prisma";
export declare const requireRole: (requiredRoles: SystemRole[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=admin.middleware.d.ts.map