import { SystemRole } from "../../../prisma/generated/prisma";
import { ProcessedCommentAPI, CreateCommentDto, UpdateCommentDto, ToggleReactionDto } from "./comment.types";
declare class CommentService {
    private processRawCommentForAPI;
    create(postId: string, authorId: string, data: CreateCommentDto): Promise<ProcessedCommentAPI>;
    createReply(parentId: string, authorId: string, data: CreateCommentDto): Promise<ProcessedCommentAPI>;
    findAllForPost(postId: string, currentUserId?: string, pagination?: {
        skip: number;
        take: number;
        sortBy: string;
        order: string;
    }): Promise<{
        comments: {
            children: never[];
            id: string;
            updatedAt: Date;
            createdAt: Date;
            authorId: string;
            postId: string;
            text: string;
            level: number;
            parentId: string | null;
            author: import("./comment.types").CommentAuthorAPI | null;
            likes: number;
            dislikes: number;
            isLikedByCurrentUser: boolean;
            isDislikedByCurrentUser: boolean;
            directRepliesCount: number;
        }[];
        total: number;
    }>;
    findRepliesForComment(parentId: string, currentUserId?: string, pagination?: {
        skip: number;
        take: number;
        sortBy: string;
        order: string;
    }): Promise<{
        replies: {
            children: never[];
            id: string;
            updatedAt: Date;
            createdAt: Date;
            authorId: string;
            postId: string;
            text: string;
            level: number;
            parentId: string | null;
            author: import("./comment.types").CommentAuthorAPI | null;
            likes: number;
            dislikes: number;
            isLikedByCurrentUser: boolean;
            isDislikedByCurrentUser: boolean;
            directRepliesCount: number;
        }[];
        total: number;
    }>;
    update(commentId: string, userId: string, userRole: SystemRole | undefined, data: UpdateCommentDto): Promise<ProcessedCommentAPI>;
    delete(commentId: string, userId: string, userRole: SystemRole | undefined): Promise<void>;
    toggleReaction(commentId: string, userId: string, data: ToggleReactionDto): Promise<{
        likes: number;
        dislikes: number;
        isLikedByCurrentUser: boolean;
        isDislikedByCurrentUser: boolean;
    }>;
}
export declare const commentService: CommentService;
export {};
//# sourceMappingURL=comment.service.d.ts.map