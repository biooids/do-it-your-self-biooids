// src/components/pages/admin/posts/PostManagement.tsx
"use client";

import React, { useState } from "react";
import {
  useGetAdminPostsQuery,
  useDeletePostMutation,
} from "@/lib/features/admin/adminApiSlice";
import { AdminPostRow, PostCategory } from "@/lib/features/admin/adminTypes";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import Image from "next/image";
import ManagementPageLayout from "../layouts/ManagementPageLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationControls from "@/components/shared/PaginationControls";

// Helper function to determine the correct path based on category
const getPostAction = (post: AdminPostRow) => {
  const category = post.category as PostCategory;
  const categoryToPathMap: Partial<Record<PostCategory, string>> = {
    PROJECT: "projects",
    SHOWCASE: "showcases",
    BLOG: "blogs",
    ARTICLE: "articles",
    RESOURCE: "resources",
    DISCUSSION: "discussions",
    GUIDE: "guides",
  };
  const path = categoryToPathMap[category] || "posts";
  return { href: `/${path}/${post.id}` };
};

// Row Actions Component
function PostActions({ post }: { post: AdminPostRow }) {
  const [deletePost, { isLoading }] = useDeletePostMutation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { href } = getPostAction(post); // Get the smart href

  const handleDelete = async () => {
    try {
      await deletePost(post.id).unwrap();
      toast.success(`Post "${post.title.substring(0, 20)}..." deleted.`);
    } catch (error) {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* UPDATED: Link now uses the smart href */}
          <DropdownMenuItem asChild>
            <Link href={href}>
              <Eye className="mr-2 h-4 w-4" />
              View Post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 focus:bg-red-500/10"
            onClick={() => setIsAlertOpen(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this post and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Yes, delete post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Main Component
export default function PostManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<PostCategory | "ALL">("ALL");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useGetAdminPostsQuery({
    page,
    q: debouncedSearchTerm,
    filterByCategory: category === "ALL" ? undefined : category,
  });

  const posts = data?.data.posts ?? [];
  const pagination = data?.data.pagination;

  const controls = (
    <>
      <Input
        placeholder="Search posts or authors..."
        className="w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select
        value={category}
        onValueChange={(value) => setCategory(value as PostCategory | "ALL")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {Object.values(PostCategory).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <ManagementPageLayout
      title="Post Management"
      description="View, search, filter, and moderate all posts on the platform."
      itemCount={pagination?.totalItems ?? 0}
      controls={controls}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead className="w-[25%]">Title</TableHead>
            <TableHead className="w-[35%]">Description</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                Loading posts...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center h-24 text-destructive"
              >
                Failed to load posts.
              </TableCell>
            </TableRow>
          ) : posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                    {post.images?.[0]?.url ? (
                      <Image
                        src={post.images[0].url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary"></div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium align-top break-words">
                  {post.title}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground align-top break-words">
                  {post.description}
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={post.author.profileImage ?? undefined}
                      />
                      <AvatarFallback>
                        {post.author.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">@{post.author.username}</span>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1.5" />
                      {post.viewsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1.5" />
                      {post.likesCount.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1.5" />
                      {post.commentsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Bookmark className="h-3 w-3 mr-1.5" />
                      {post.savedCount.toLocaleString()}
                    </span>
                    <span className="flex items-center col-span-2">
                      <Share2 className="h-3 w-3 mr-1.5" />
                      {post.sharesCount.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right align-top">
                  <PostActions post={post} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {pagination && (
        <PaginationControls pagination={pagination} onPageChange={setPage} />
      )}
    </ManagementPageLayout>
  );
}
