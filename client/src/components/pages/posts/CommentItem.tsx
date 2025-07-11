"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  MessageSquare,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

import {
  useToggleCommentReactionMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
} from "@/lib/features/comment/commentApiSlice";
import { ProcessedCommentAPI } from "@/lib/features/comment/commentTypes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import {
  toggleReplies,
  selectIsRepliesExpanded,
} from "@/lib/features/comment/commentUiSlice";

import CommentForm from "./CommentForm";
import RepliesList from "./RepliesList";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { MAX_REPLY_LEVEL } from "@/lib/features/comment/comment.config";

interface CommentItemProps {
  comment: ProcessedCommentAPI;
  // We no longer need to pass getCommentsParams down with the invalidatesTags approach
}

export default function CommentItem({ comment }: CommentItemProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const showReplies = useAppSelector((state) =>
    selectIsRepliesExpanded(state, comment.id)
  );

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [toggleReaction] = useToggleCommentReactionMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [replyToComment, { isLoading: isReplyingLoading }] =
    useReplyToCommentMutation();

  const isOwner = currentUser?.id === comment.author?.id;
  const timeAgo = formatDistanceToNow(parseISO(comment.createdAt), {
    addSuffix: true,
  });
  const canReply = currentUser && comment.level < MAX_REPLY_LEVEL;

  const handleToggleReaction = (reaction: "LIKED" | "DISLIKED") => {
    if (!currentUser) return;
    toggleReaction({
      commentId: comment.id,
      reaction,
      postId: comment.postId,
      parentId: comment.parentId,
    });
  };

  const handleUpdate = async (text: string) => {
    await updateComment({
      commentId: comment.id,
      text,
      postId: comment.postId,
      parentId: comment.parentId,
    }).unwrap();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteComment({
      commentId: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
    }).unwrap();
  };

  const handleReplySubmit = async (text: string) => {
    if (!canReply) return;
    try {
      await replyToComment({
        parentId: comment.id,
        postId: comment.postId,
        text,
      }).unwrap();
      setIsReplying(false);
      if (!showReplies) {
        dispatch(toggleReplies(comment.id));
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const handleToggleReplies = () => {
    dispatch(toggleReplies(comment.id));
  };

  const processedText = useMemo(() => {
    return comment.text.split(/(@\w+)/g).map((part, index) =>
      part.startsWith("@") ? (
        <strong key={index} className="text-primary">
          {part}
        </strong>
      ) : (
        part
      )
    );
  }, [comment.text]);

  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author?.profileImage || undefined} />
        <AvatarFallback>
          {comment.author?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="bg-muted rounded-lg px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">
                {comment.author?.username || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
            {isOwner && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}{" "}
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <CommentForm
              onSubmit={handleUpdate}
              isLoading={isUpdating}
              initialText={comment.text}
              onCancel={() => setIsEditing(false)}
              submitButtonText="Save"
              compact
            />
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap">{processedText}</p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleReaction("LIKED")}
            className={cn(
              "px-2",
              comment.isLikedByCurrentUser && "text-primary"
            )}
          >
            <ThumbsUp
              className="h-4 w-4 mr-1.5"
              // --- THIS IS THE FIX ---
              // Conditionally fill the icon with the current text color
              fill={comment.isLikedByCurrentUser ? "currentColor" : "none"}
            />

            {comment.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleReaction("DISLIKED")}
            className="px-2"
          >
            <ThumbsDown
              className="h-4 w-4 mr-1.5"
              fill={comment.isDislikedByCurrentUser ? "currentColor" : "none"}
            />
            {comment.dislikes}
          </Button>
          {canReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="px-2"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />{" "}
              {isReplying ? "Cancel" : "Reply"}
            </Button>
          )}
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              onSubmit={handleReplySubmit}
              isLoading={isReplyingLoading}
              placeholder={`Replying to @${comment.author?.username}...`}
              onCancel={() => setIsReplying(false)}
              compact
            />
          </div>
        )}

        {comment.directRepliesCount > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={handleToggleReplies}
            className="text-xs text-primary mt-1 pl-1 h-auto"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 mr-1 transition-transform",
                showReplies && "rotate-180"
              )}
            />
            {showReplies
              ? "Hide Replies"
              : `View ${comment.directRepliesCount} Replies`}
          </Button>
        )}

        {showReplies && (
          <RepliesList parentId={comment.id} postId={comment.postId} />
        )}
      </div>
    </div>
  );
}
