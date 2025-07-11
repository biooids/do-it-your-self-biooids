// src/features/admin/admin.service.ts

import prisma from "@/db/prisma.js";
import { User, Prisma, SystemRole } from "@/prisma-client";
import {
  AdminDashboardStats,
  AdminUserRow,
  AdminPostRow,
  AdminApiQuery,
  AdminCommentRow,
} from "./admin.types";

class AdminService {
  /**
   * Fetches key statistics for the admin dashboard.
   */
  public async getDashboardStats(): Promise<AdminDashboardStats> {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      totalSaves,
      totalShares,
    ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.postLike.count(),
      prisma.postSave.count(),
      prisma.postShare.count(),
    ]);
    return {
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      totalSaves,
      totalShares,
    };
  }

  /**
   * Fetches a paginated, searchable, and filterable list of all users.
   */
  public async getAllUsers(
    query: AdminApiQuery
  ): Promise<{ users: AdminUserRow[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      q,
      sortBy = "joinedAt",
      order = "desc",
    } = query;
    const where: Prisma.UserWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: { _count: { select: { posts: true, comments: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    return { users: users as AdminUserRow[], total };
  }

  /**
   * Fetches a paginated, searchable, and filterable list of all posts.
   */
  public async getAllPosts(
    query: AdminApiQuery
  ): Promise<{ posts: AdminPostRow[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      q,
      sortBy = "createdAt",
      order = "desc",
      filterByCategory,
    } = query;
    const where: Prisma.PostWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { author: { name: { contains: q, mode: "insensitive" } } },
        { author: { username: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (filterByCategory) {
      where.category = filterByCategory;
    }

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              profileImage: true,
            },
          },
          images: { select: { url: true }, take: 1, orderBy: { order: "asc" } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts: posts as AdminPostRow[], total };
  }

  /**
   * Fetches a paginated, searchable list of all comments.
   */
  public async getAllComments(
    query: AdminApiQuery
  ): Promise<{ comments: AdminCommentRow[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      q,
      sortBy = "createdAt",
      order = "desc",
    } = query;
    const where: Prisma.CommentWhereInput = {};

    if (q) {
      where.OR = [
        { text: { contains: q, mode: "insensitive" } },
        { author: { username: { contains: q, mode: "insensitive" } } },
        { post: { title: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [comments, total] = await prisma.$transaction([
      prisma.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              profileImage: true,
            },
          },
          post: { select: { id: true, title: true } },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments: comments as AdminCommentRow[], total };
  }

  /**
   * --- FIX: Re-added the missing method ---
   * Updates a user's system role.
   */
  public async updateUserRole(
    userId: string,
    newRole: SystemRole
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { systemRole: newRole },
    });
  }

  /**
   * Deletes a user by their ID.
   */
  public async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }

  /**
   * Deletes a post by its ID.
   */
  public async deletePost(postId: string): Promise<void> {
    await prisma.post.delete({ where: { id: postId } });
  }

  /**
   * Deletes a comment by its ID.
   */
  public async deleteComment(commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { id: commentId } });
  }
}

export const adminService = new AdminService();
