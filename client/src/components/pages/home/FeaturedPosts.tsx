// =================================================================
// FILE: src/components/landing/FeaturedPosts.tsx
// =================================================================
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "../posts/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsQuery } from "@/lib/features/post/postApiSlice";

const PostCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[225px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export default function FeaturedPosts() {
  const {
    data: postsResponse,
    isLoading,
    isError,
  } = useGetPostsQuery({ limit: 3, sort: "newest" });

  const featuredPosts = postsResponse?.data || [];

  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Fresh from the Workshop
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Check out the latest projects and guides from our community.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : isError ? (
          <div className="col-span-full rounded-md bg-destructive/10 p-4 text-center text-destructive">
            Could not load featured posts. Please try again later.
          </div>
        ) : (
          featuredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      <div className="mt-12">
        <Button asChild variant="secondary" size="lg">
          <Link href="/posts">
            View All Posts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
