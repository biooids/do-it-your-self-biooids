import { PostCategory } from "../../../prisma/generated/prisma";
export interface PostQueryFilters {
    page?: number;
    limit?: number;
    q?: string;
    category?: PostCategory;
    sort?: "newest" | "oldest" | "title-asc" | "title-desc";
    tags?: string;
    authorId?: string;
    likedByUserId?: string;
    savedByUserId?: string;
}
export interface TagQueryFilters {
    category?: PostCategory;
}
//# sourceMappingURL=post.types.d.ts.map