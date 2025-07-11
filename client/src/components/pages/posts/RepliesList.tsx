// filePath: @/app/projects/[id]/RepliesList.tsx
"use client";

import React, { useState } from "react";
import { useGetRepliesForCommentQuery } from "@/lib/features/comment/commentApiSlice";
import { GetCommentsForPostParams } from "@/lib/features/comment/commentTypes";
import CommentItem from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { REPLIES_PER_PAGE } from "@/lib/features/comment/comment.config";

interface RepliesListProps {
  parentId: string;
  postId: string;
}

export default function RepliesList({ parentId, postId }: RepliesListProps) {
  const [page, setPage] = useState(1);

  const { data: repliesResponse, isLoading } = useGetRepliesForCommentQuery({
    parentId,
    skip: (page - 1) * REPLIES_PER_PAGE,
    take: REPLIES_PER_PAGE,
  });

  const replies = repliesResponse?.data || [];
  const pagination = repliesResponse?.pagination;

  // This is a placeholder as replies don't need to optimistically update the main list
  const dummyGetCommentsParams: GetCommentsForPostParams = { postId };

  return (
    <div className="mt-4 space-y-4 pl-4 border-l-2">
      {isLoading && page === 1 && <Loader2 className="h-5 w-5 animate-spin" />}

      {replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} />
      ))}

      {pagination && pagination.hasMore && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More Replies"}
        </Button>
      )}
    </div>
  );
}
