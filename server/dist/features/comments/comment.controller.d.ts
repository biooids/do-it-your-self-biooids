import { Request, Response, NextFunction } from "express";
declare class CommentController {
    createCommentOnPost: (req: Request, res: Response, next: NextFunction) => void;
    replyToComment: (req: Request, res: Response, next: NextFunction) => void;
    getCommentsForPost: (req: Request, res: Response, next: NextFunction) => void;
    getRepliesForComment: (req: Request, res: Response, next: NextFunction) => void;
    updateComment: (req: Request, res: Response, next: NextFunction) => void;
    deleteComment: (req: Request, res: Response, next: NextFunction) => void;
    toggleCommentReaction: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const commentController: CommentController;
export {};
//# sourceMappingURL=comment.controller.d.ts.map