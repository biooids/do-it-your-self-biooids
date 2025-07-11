// src/features/admin/admin.types.ts

import {
  User,
  Post,
  Comment,
  PostCategory,
  UserStatus,
} from "@/prisma-client";

// Data shape for the main dashboard statistics card
export interface AdminDashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalSaves: number;
  totalShares: number;
}

// Data shape for a user row in the admin user management table
export type AdminUserRow = Omit<User, "hashedPassword"> & {
  _count: {
    posts: number;
    comments: number;
  };
};

// Data shape for a post row in the admin post management table
export type AdminPostRow = Post & {
  author: {
    id: string;
    name: string;
    username: string;
    profileImage: string | null;
  };
  images: { url: string }[];
};

// Data shape for a comment row in the admin comment management table
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

// Type for the API query parameters
export interface AdminApiQuery {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  filterByRole?: UserStatus;
  filterByCategory?: PostCategory;
}
