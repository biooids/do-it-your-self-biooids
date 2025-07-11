import { CommentReactionState } from "../../../prisma/generated/prisma";
export interface CommentAuthorAPI {
    id: string;
    username: string;
    profileImage: string | null;
}
export interface ProcessedCommentAPI {
    id: string;
    text: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    level: number;
    createdAt: Date;
    updatedAt: Date;
    author: CommentAuthorAPI | null;
    likes: number;
    dislikes: number;
    isLikedByCurrentUser: boolean;
    isDislikedByCurrentUser: boolean;
    directRepliesCount: number;
    children: ProcessedCommentAPI[];
}
export interface CreateCommentDto {
    text: string;
}
export interface UpdateCommentDto {
    text: string;
}
export interface ToggleReactionDto {
    reaction: CommentReactionState;
}
//# sourceMappingURL=comment.types.d.ts.map