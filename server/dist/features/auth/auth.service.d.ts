import { User } from "../../../prisma/generated/prisma";
import { SignUpInputDto, LoginInputDto, RefreshTokenInputDto, AuthTokens, LogoutInputDto, ChangePasswordInputDto } from "../../types/auth.types.js";
export declare class AuthService {
    registerUser(input: SignUpInputDto): Promise<{
        user: Omit<User, "hashedPassword">;
        tokens: AuthTokens;
    }>;
    loginUser(input: LoginInputDto): Promise<{
        user: Omit<User, "hashedPassword">;
        tokens: AuthTokens;
    }>;
    changeUserPassword(userId: string, input: ChangePasswordInputDto): Promise<void>;
    handleRefreshTokenRotation(input: RefreshTokenInputDto): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
        newRefreshTokenExpiresAt: Date;
    }>;
    handleUserLogout(input: LogoutInputDto): Promise<void>;
    findOrCreateOAuthUser(profile: {
        email: string;
        name?: string | null;
        image?: string | null;
    }): Promise<{
        user: Omit<User, "hashedPassword">;
        tokens: AuthTokens;
    }>;
    private revokeTokenByJti;
    revokeAllRefreshTokensForUser(userId: string): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map