"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { PostDto } from "@/lib/features/post/postTypes";
import { useAuthAction } from "@/lib/hooks/useAuthAction";
import {
  useLikePostMutation,
  useUnlikePostMutation,
  useSavePostMutation,
  useUnsavePostMutation,
  useSharePostMutation,
} from "@/lib/features/post/postApiSlice";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, Bookmark, Share2, Loader2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/utils";

interface ActionButtonsProps {
  post: PostDto;
}

export default function ActionButtons({ post }: ActionButtonsProps) {
  const handleAuthAction = useAuthAction();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const [savePost, { isLoading: isSaving }] = useSavePostMutation();
  const [unsavePost, { isLoading: isUnsaving }] = useUnsavePostMutation();
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation();
  const [sharePost, { isLoading: isSharing }] = useSharePostMutation();

  const handleToggleSave = () =>
    handleAuthAction(() => {
      if (isSaving || isUnsaving) return;
      post.isSavedByCurrentUser ? unsavePost(post.id) : savePost(post.id);
    }, "save");

  const handleToggleLike = () =>
    handleAuthAction(() => {
      if (isLiking || isUnliking) return;
      post.isLikedByCurrentUser ? unlikePost(post.id) : likePost(post.id);
    }, "like");

  const handleOpenShareDialog = () => {
    setLinkCopied(false);
    setShowShareDialog(true);
  };

  const handleShareAndCopy = async () => {
    const postUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(postUrl);
      setLinkCopied(true);
      if (!isSharing) sharePost({ postId: post.id, platform: "LINK_COPIED" });
      setTimeout(() => setShowShareDialog(false), 1500);
    } catch (err) {
      toast.error("Could not copy link.");
    }
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 w-full items-center justify-around rounded-lg border bg-background p-1 space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "gap-2 w-full",
                post.isLikedByCurrentUser && "text-red-500 bg-red-500/10"
              )}
              onClick={handleToggleLike}
              disabled={isLiking || isUnliking}
            >
              {isLiking || isUnliking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={cn(
                    "h-5 w-5",
                    post.isLikedByCurrentUser && "fill-current"
                  )}
                />
              )}{" "}
              {formatCompactNumber(post.likesCount)}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {post.isLikedByCurrentUser ? "Unlike" : "Like"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "gap-2 w-full",
                post.isSavedByCurrentUser && "text-primary bg-primary/10"
              )}
              onClick={handleToggleSave}
              disabled={isSaving || isUnsaving}
            >
              {isSaving || isUnsaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    post.isSavedByCurrentUser && "fill-current"
                  )}
                />
              )}{" "}
              {formatCompactNumber(post.savedCount)}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {post.isSavedByCurrentUser ? "Unsave" : "Save"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 w-full"
              onClick={handleOpenShareDialog}
            >
              {isSharing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Share2 className="h-5 w-5" />
              )}{" "}
              {formatCompactNumber(post.sharesCount)}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share this post</TooltipContent>
        </Tooltip>
      </div>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 /> Share Post
            </DialogTitle>
            <DialogDescription>Copy this link to share.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              id="link"
              defaultValue={window.location.href}
              readOnly
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={handleShareAndCopy}
              disabled={isSharing}
            >
              {linkCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {linkCopied && (
            <p className="text-sm text-green-600 mt-2 text-center">
              Link copied!
            </p>
          )}
          <DialogFooter className="sm:justify-start mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
