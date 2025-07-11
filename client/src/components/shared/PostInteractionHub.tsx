"use client";

import { PostDto } from "@/lib/features/post/postTypes";
import ActionButtons from "./ActionButtons";
import PostStatsBar from "./PostStatsBar";

interface PostInteractionHubProps {
  post: PostDto;
}

export default function PostInteractionHub({ post }: PostInteractionHubProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <PostStatsBar
        viewsCount={post.viewsCount}
        commentsCount={post.commentsCount}
      />
      <ActionButtons post={post} />
    </div>
  );
}
