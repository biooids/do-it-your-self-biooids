import { PostCategory } from "../../../prisma/generated/prisma";
interface TagQueryFilters {
    category?: PostCategory;
    likedByUserId?: string;
    savedByUserId?: string;
}
declare class TagService {
    getAllTags(filters: TagQueryFilters): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
    }[]>;
}
export declare const tagService: TagService;
export {};
//# sourceMappingURL=tag.service.d.ts.map