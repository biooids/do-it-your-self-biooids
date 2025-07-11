import { Post, SystemRole, SharePlatform } from "../../../prisma/generated/prisma";
import { PostQueryFilters } from "./post.types";
interface CreatePostData {
    title: string;
    description: string;
    content: string;
    category: Post["category"];
    tags: {
        name: string;
    }[];
    images?: {
        url: string;
        publicId: string;
    }[];
    externalLink?: string;
    githubLink?: string;
}
type UpdatePostData = Partial<Omit<CreatePostData, "images">> & {
    retainedImageUrls?: string[];
    newImages?: {
        url: string;
        publicId: string;
    }[];
    postTags?: string;
};
export declare class PostService {
    createPost(authorId: string, data: CreatePostData): Promise<Post>;
    getPostById(postId: string, userId?: string): Promise<{
        isLikedByCurrentUser: boolean;
        isSavedByCurrentUser: boolean;
        author: {
            id: string;
            name: string;
            username: string;
            profileImage: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        images: {
            id: string;
            order: number;
            postId: string;
            url: string;
            publicId: string;
            altText: string | null;
        }[];
        steps: ({
            sections: {
                id: string;
                title: string | null;
                content: string;
                order: number;
                videoUrl: string | null;
                imageUrl: string | null;
                imagePublicId: string | null;
                stepId: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string | null;
            order: number;
            postId: string;
        })[];
        id: string;
        title: string;
        updatedAt: Date;
        createdAt: Date;
        description: string;
        content: string;
        category: import("../../../prisma/generated/prisma").$Enums.PostCategory;
        isQuestion: boolean;
        isResolved: boolean;
        deletedAt: Date | null;
        externalLink: string | null;
        githubLink: string | null;
        upvotesCount: number;
        likesCount: number;
        viewsCount: number;
        savedCount: number;
        sharesCount: number;
        commentsCount: number;
        authorId: string;
    } | null>;
    getAllPosts(filters: PostQueryFilters, userId?: string): Promise<{
        posts: any[];
        total: number;
    }>;
    updatePost(userId: string, postId: string, data: UpdatePostData): Promise<Post>;
    deletePost(userId: string, userRole: SystemRole, postId: string): Promise<void>;
    likePost(userId: string, postId: string): Promise<Post>;
    unlikePost(userId: string, postId: string): Promise<Post>;
    savePost(userId: string, postId: string): Promise<Post>;
    unsavePost(userId: string, postId: string): Promise<Post>;
    sharePost(sharerId: string, postId: string, platform: SharePlatform): Promise<Post>;
    recordPostView(userId: string, postId: string): Promise<void>;
}
export declare const postService: PostService;
export {};
//# sourceMappingURL=post.service.d.ts.map