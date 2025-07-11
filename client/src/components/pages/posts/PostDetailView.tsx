"use client";

import {
  useGetPostByIdQuery,
  useRecordPostViewMutation,
} from "@/lib/features/post/postApiSlice";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import DOMPurify from "dompurify";

// UI Components
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import CommentSection from "./CommentSection";

// This component takes an ID, fetches the data, and renders the result.
export default function PostDetailView({ postId }: { postId: string }) {
  const { data: post, isLoading, isError, error } = useGetPostByIdQuery(postId);
  const currentUser = useAppSelector(selectCurrentUser);

  const [recordPostView] = useRecordPostViewMutation();
  useEffect(() => {
    // Record a view only if we have a post ID and a logged-in user
    if (postId && currentUser) {
      // We don't need to wait for this to finish, it can happen in the background.
      recordPostView(postId);
    }
  }, [postId, currentUser, recordPostView]);
  // --- 1. Loading State ---
  // Display skeletons while the post data is being fetched.
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[450px] w-full rounded-lg" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  // --- 2. Error and Not Found State ---
  if (isError || !post) {
    const status = "status" in (error || {}) ? (error as any).status : 500;
    const title = status === 404 ? "Post Not Found" : "Error Loading Post";
    const description =
      status === 404
        ? "The post you are looking for does not exist or may have been moved."
        : "An unexpected error occurred. Please try again later.";

    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- 3. Security: Sanitize the user-generated HTML content ---
  // This is CRUCIAL to prevent XSS attacks.
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <article className="container mx-auto max-w-4xl py-8">
      {/* --- Post Header --- */}
      <div className="space-y-4 text-center">
        <Badge className="capitalize">{post.category.toLowerCase()}</Badge>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          {post.title}
        </h1>
        <p className="text-xl text-muted-foreground">{post.description}</p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href={`/user/${post.author.username}`}>
            <Avatar>
              <AvatarImage src={post.author.profileImage ?? undefined} />
              <AvatarFallback>
                {post.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-left">
            <Link
              href={`/user/${post.author.username}`}
              className="font-medium hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              Posted on {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* --- Image Carousel --- */}
      {post.images && post.images.length > 0 && (
        <div className="my-10">
          <Carousel className="w-full">
            <CarouselContent>
              {post.images.map((image, index) => (
                <CarouselItem key={image.id}>
                  <Card>
                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                      <Image
                        src={image.url}
                        alt={
                          image.altText || `${post.title} - Image ${index + 1}`
                        }
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      )}

      <Separator className="my-8" />

      {/* --- Main Post Content --- */}
      {/* This is where the magic happens:
        1. `prose` classes from @tailwindcss/typography style the raw HTML.
        2. `dangerouslySetInnerHTML` renders the sanitized HTML string.
      */}
      <div
        className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* --- Tags Footer --- */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((postTag) => (
              <Link
                href={`/posts?tags=${postTag.tag.name}`}
                key={postTag.tag.id}
              >
                <Badge
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  # {postTag.tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <CommentSection postId={post.id} totalComments={post.commentsCount} />
    </article>
  );
}
