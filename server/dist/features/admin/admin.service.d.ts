import { User, SystemRole } from "../../../prisma/generated/prisma";
import { AdminDashboardStats, AdminUserRow, AdminPostRow, AdminApiQuery, AdminCommentRow } from "./admin.types";
declare class AdminService {
    getDashboardStats(): Promise<AdminDashboardStats>;
    getAllUsers(query: AdminApiQuery): Promise<{
        users: AdminUserRow[];
        total: number;
    }>;
    getAllPosts(query: AdminApiQuery): Promise<{
        posts: AdminPostRow[];
        total: number;
    }>;
    getAllComments(query: AdminApiQuery): Promise<{
        comments: AdminCommentRow[];
        total: number;
    }>;
    updateUserRole(userId: string, newRole: SystemRole): Promise<User>;
    deleteUser(userId: string): Promise<void>;
    deletePost(postId: string): Promise<void>;
    deleteComment(commentId: string): Promise<void>;
}
export declare const adminService: AdminService;
export {};
//# sourceMappingURL=admin.service.d.ts.map