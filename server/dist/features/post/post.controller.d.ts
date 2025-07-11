import { Request, Response } from "express";
declare class PostController {
    createPost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updatePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deletePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    likePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    unlikePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    sharePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    recordPostView: (req: Request, res: Response, next: import("express").NextFunction) => void;
    savePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    unsavePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const postController: PostController;
export {};
//# sourceMappingURL=post.controller.d.ts.map