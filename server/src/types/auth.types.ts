// src/types/auth.types.ts

import { JwtPayload as OriginalJwtPayload } from "jsonwebtoken";
import { SystemRole } from "@/prisma-client";

// --- JWT Payloads ---
export interface DecodedAccessTokenPayload {
  id: string;
  systemRole: SystemRole;
  type: "access";
  iat: number;
  exp: number;
  username: string;
  displayName: string | null;
  profileImage?: string;
  bannerImage?: string;
}
export interface DecodedRefreshTokenPayload extends OriginalJwtPayload {
  id: string;
  jti: string;
  type: "refresh";
}

// --- Service Input DTOs (Data Transfer Objects) ---
export interface SignUpInputDto {
  email: string;
  username: string;
  password: string;
  name: string; // Should match the 'name' field in the User model
}

export interface LoginInputDto {
  email: string;
  password: string;
}

export interface RefreshTokenInputDto {
  incomingRefreshToken: string;
}

export interface LogoutInputDto {
  userId?: string | undefined;
  incomingRefreshToken?: string | undefined;
}

// --- Service Output DTOs ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface UpdateUserProfileDto {
  name?: string;
  profileImage?: string;
  bannerImage?: string;
  username?: string;
  bio?: string;
  title?: string;
  location?: string;
}
export interface ChangePasswordInputDto {
  currentPassword: string;
  newPassword: string;
}
