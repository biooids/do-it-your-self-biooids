import { User } from "../../../prisma/generated/prisma";
import { SignUpInputDto } from "../../types/auth.types.js";
interface UserProfileUpdateData {
    name?: string;
    username?: string;
    bio?: string;
    title?: string;
    location?: string;
    profileImage?: string;
    bannerImage?: string;
}
export declare class UserService {
    findUserByEmail(email: string): Promise<User | null>;
    findUserByUsername(username: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    createUser(input: SignUpInputDto): Promise<User>;
    deleteUserAccount(userId: string): Promise<void>;
    updateUserProfile(userId: string, data: UserProfileUpdateData): Promise<User>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map