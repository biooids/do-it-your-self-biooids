"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  useGetPostByIdQuery,
  useRecordPostViewMutation,
} from "@/lib/features/post/postApiSlice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import DOMPurify from "dompurify";

// --- Import the new modular component ---
import PostInteractionHub from "../../shared/PostInteractionHub";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Edit, ExternalLink, Github, Terminal } from "lucide-react";
import CommentSection from "../posts/CommentSection";

export default function ResourceDetails({ postId }: { postId: string }) {
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId);
  const currentUser = useAppSelector(selectCurrentUser);
  const [recordPostView] = useRecordPostViewMutation();
  const [mainImage, setMainImage] = useState<string | undefined>();

  // === ADDED: State and Effect for sanitizing the main content ===
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (postId && currentUser) recordPostView(postId);
  }, [postId, currentUser, recordPostView]);

  useEffect(() => {
    if (post?.images && post.images.length > 0)
      setMainImage(post.images[0].url);
    // Sanitize the content when the post data arrives
    if (post?.content) {
      setSanitizedContent(DOMPurify.sanitize(post.content));
    }
  }, [post]);

  if (isLoading) return <p>Loading resource...</p>;
  if (isError || !post) return <p>Could not load resource.</p>;

  return (
    <section className="mx-auto max-w-7xl py-8 space-y-12">
      {/* --- Main Info: Gallery & Details --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Side: Image Gallery */}
        <div className="lg:sticky lg:top-24 h-fit flex flex-col gap-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
            {mainImage && (
              <Image
                src={mainImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          {post.images && post.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {post.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setMainImage(img.url)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all ${
                    mainImage === img.url
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${post.title} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Resource Metadata */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <header className="space-y-4">
            <Badge variant="secondary" className="w-fit capitalize">
              {post.category.toLowerCase()}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl break-all">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground break-all">
              {post.description}
            </p>
            {currentUser?.id === post.author.id && (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/posts/${post.id}/update`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
            )}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Link
                href={`/user/${post.author.username}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage src={post.author.profileImage ?? undefined} />
                  <AvatarFallback>
                    {post.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground hover:underline">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Published{" "}
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
            </div>
          </header>

          <PostInteractionHub post={post} />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relevant Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {post.tags.map((postTag) => (
                <Badge key={postTag.tag.id}># {postTag.tag.name}</Badge>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.githubLink ? (
              <Button asChild className="w-full">
                <Link href={post.githubLink} target="_blank">
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Link>
              </Button>
            ) : (
              <div className="text-sm text-center text-muted-foreground p-3 rounded-md border border-dashed flex items-center justify-center">
                No GitHub link
              </div>
            )}
            {post.externalLink ? (
              <Button variant="outline" asChild className="w-full">
                <Link href={post.externalLink} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Link>
              </Button>
            ) : (
              <div className="text-sm text-center text-muted-foreground p-3 rounded-md border border-dashed flex items-center justify-center">
                No external link provided
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* === Main Content Area (Now Added) === */}
      {sanitizedContent && (
        <div className="mx-auto max-w-4xl">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      )}

      <Separator />

      {/* --- Comments Section --- */}
      <div id="comments" className="">
        <Card>
          <CardHeader>
            <CardTitle>Comments ({post.commentsCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentSection
              postId={post.id}
              totalComments={post.commentsCount}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
