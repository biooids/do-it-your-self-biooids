import { SystemRole } from "../../../prisma/generated/prisma";
import { CreateUpdateDto, UpdateUpdateDto } from "./update.types";
declare class UpdateService {
    create(data: CreateUpdateDto, authorId: string): Promise<{
        author: {
            name: string;
            profileImage: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: import("../../../prisma/generated/prisma").$Enums.UpdateCategory;
        authorId: string;
        version: string | null;
        publishedAt: Date;
    }>;
    findAll(pagination: {
        skip: number;
        take: number;
    }): Promise<{
        updates: ({
            author: {
                name: string;
                profileImage: string | null;
            };
        } & {
            id: string;
            title: string;
            content: string;
            category: import("../../../prisma/generated/prisma").$Enums.UpdateCategory;
            authorId: string;
            version: string | null;
            publishedAt: Date;
        })[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        author: {
            name: string;
            profileImage: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: import("../../../prisma/generated/prisma").$Enums.UpdateCategory;
        authorId: string;
        version: string | null;
        publishedAt: Date;
    }>;
    update(id: string, data: UpdateUpdateDto, userId: string, userRole: SystemRole): Promise<{
        author: {
            name: string;
            profileImage: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: import("../../../prisma/generated/prisma").$Enums.UpdateCategory;
        authorId: string;
        version: string | null;
        publishedAt: Date;
    }>;
    remove(id: string, userId: string, userRole: SystemRole): Promise<void>;
}
export declare const updateService: UpdateService;
export {};
//# sourceMappingURL=update.service.d.ts.map