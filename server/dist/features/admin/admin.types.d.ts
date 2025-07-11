import { User, Post, Comment, PostCategory, UserStatus } from "../../../prisma/generated/prisma";
export interface AdminDashboardStats {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalSaves: number;
    totalShares: number;
}
export type AdminUserRow = Omit<User, "hashedPassword"> & {
    _count: {
        posts: number;
        comments: number;
    };
};
export type AdminPostRow = Post & {
    author: {
        id: string;
        name: string;
        username: string;
        profileImage: string | null;
    };
    images: {
        url: string;
    }[];
};
export type AdminCommentRow = Comment & {
    author: {
        id: string;
        name: string;
        username: string;
        profileImage: string | null;
    };
    post: {
        id: string;
        title: string;
    };
};
export interface AdminApiQuery {
    page?: number;
    limit?: number;
    q?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    filterByRole?: UserStatus;
    filterByCategory?: PostCategory;
}
//# sourceMappingURL=admin.types.d.ts.map