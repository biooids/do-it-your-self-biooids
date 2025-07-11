// server/src/features/tag/tag.service.js

import prisma from "@/db/prisma.js";
import { PostCategory, Prisma } from "@/prisma-client";

interface TagQueryFilters {
  category?: PostCategory;
  likedByUserId?: string;
  savedByUserId?: string;
}

class TagService {
  public async getAllTags(filters: TagQueryFilters) {
    const { category, likedByUserId, savedByUserId } = filters;

    const where: Prisma.TagWhereInput = {};
    const postFilter: Prisma.PostWhereInput = {};

    if (category) {
      postFilter.category = category;
    }
    if (likedByUserId) {
      postFilter.likedBy = { some: { userId: likedByUserId } };
    }
    if (savedByUserId) {
      postFilter.savedBy = { some: { userId: savedByUserId } };
    }

    if (Object.keys(postFilter).length > 0) {
      where.posts = { some: { post: postFilter } };
    }

    return prisma.tag.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }
}
export const tagService = new TagService();
