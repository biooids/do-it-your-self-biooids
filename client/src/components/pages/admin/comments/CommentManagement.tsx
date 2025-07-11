// src/components/pages/admin/comments/CommentManagement.tsx
"use client";

import React, { useState } from "react";
import {
  useGetAdminCommentsQuery,
  useDeleteCommentMutation,
} from "@/lib/features/admin/adminApiSlice";
import { AdminCommentRow } from "@/lib/features/admin/adminTypes";
import { PostCategory } from "@/lib/features/post/postTypes"; // FIX: Import PostCategory from the correct source
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import ManagementPageLayout from "../layouts/ManagementPageLayout";
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
import PaginationControls from "@/components/shared/PaginationControls";
import { useGetPostByIdQuery } from "@/lib/features/post/postApiSlice"; // Import hook to get post details

// Helper function to get the post path
const getPostPath = (category: PostCategory, postId: string) => {
  const categoryToPathMap: Partial<Record<PostCategory, string>> = {
    PROJECT: "projects",
    SHOWCASE: "showcases",
    BLOG: "blogs",
    ARTICLE: "articles",
    RESOURCE: "resources",
    DISCUSSION: "discussions",
    GUIDE: "guides",
  };
  return `/${categoryToPathMap[category] || "posts"}/${postId}`;
};

// Row Actions Component
function CommentActions({ comment }: { comment: AdminCommentRow }) {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // Fetch the parent post's details to get its category
  const { data: post } = useGetPostByIdQuery(comment.post.id, {
    skip: !comment.post.id,
  });

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id).unwrap();
      toast.success("Comment deleted successfully.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  // Construct the link only if we have the post details
  const viewLink = post
    ? `${getPostPath(post.category, post.id)}#comment-${comment.id}`
    : "#";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild disabled={!post}>
            <Link href={viewLink}>
              <Eye className="mr-2 h-4 w-4" />
              View on Post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 focus:bg-red-500/10"
            onClick={() => setIsAlertOpen(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this comment. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Main Component
export default function CommentManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useGetAdminCommentsQuery({
    page,
    q: debouncedSearchTerm,
  });

  const comments = data?.data.comments ?? [];
  const pagination = data?.data.pagination;

  return (
    <ManagementPageLayout
      title="Comment Management"
      description="View, search, and moderate all comments on the platform."
      itemCount={pagination?.totalItems ?? 0}
      controls={
        <Input
          placeholder="Search comments or users..."
          className="w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Comment</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>In Response To</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                Loading comments...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center h-24 text-destructive"
              >
                Failed to load comments.
              </TableCell>
            </TableRow>
          ) : comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No comments found.
              </TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="max-w-xs truncate">
                  {comment.text}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.author.profileImage ?? undefined}
                      />
                      <AvatarFallback>
                        {comment.author.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      @{comment.author.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate font-medium text-muted-foreground">
                  {comment.post.title}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <CommentActions comment={comment} />
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
