import { User } from "../../prisma/generated/prisma";
import { DecodedRefreshTokenPayload } from "../types/auth.types.js";
export declare const generateAccessToken: (user: User) => string;
export declare const generateAndStoreRefreshToken: (userId: string) => Promise<{
    token: string;
    expiresAt: Date;
}>;
export declare const verifyAndValidateRefreshToken: (token: string) => Promise<DecodedRefreshTokenPayload>;
//# sourceMappingURL=jwt.utils.d.ts.map