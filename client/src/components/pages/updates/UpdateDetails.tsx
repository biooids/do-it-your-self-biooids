// src/components/pages/updates/UpdateDetails.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  useGetUpdateQuery,
  useDeleteUpdateMutation,
} from "@/lib/features/updates/updateApiSlice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { SystemRole } from "@/lib/features/user/userTypes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BellRing,
  Bot,
  Megaphone,
  Loader2,
  AlertTriangle,
  Edit,
  Trash2,
} from "lucide-react";
import { Remarkable } from "remarkable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import toast from "react-hot-toast";

const md = new Remarkable({ html: true, linkify: true, typographer: true });

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "APP_UPDATE":
      return <Bot className="h-5 w-5 text-blue-500" />;
    case "MARKETING":
      return <Megaphone className="h-5 w-5 text-purple-500" />;
    case "COMMUNITY":
      return <BellRing className="h-5 w-5 text-orange-500" />;
    default:
      return <BellRing className="h-5 w-5" />;
  }
};

export default function UpdateDetails({ updateId }: { updateId: string }) {
  const router = useRouter();
  const {
    data: update,
    isLoading,
    isError,
  } = useGetUpdateQuery(updateId, { skip: !updateId });
  const [deleteUpdate, { isLoading: isDeleting }] = useDeleteUpdateMutation();
  const currentUser = useAppSelector(selectCurrentUser);

  const canModify =
    currentUser?.systemRole === SystemRole.DEVELOPER ||
    currentUser?.systemRole === SystemRole.SUPER_ADMIN;

  const handleDelete = async () => {
    try {
      await deleteUpdate(updateId).unwrap();
      toast.success("Update deleted successfully.");
      router.refresh();

      router.push("/updates");
    } catch {
      toast.error("Failed to delete update.");
    }
  };

  const renderedContent = useMemo(() => {
    if (update?.content) return md.render(update.content);
    return "";
  }, [update?.content]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  if (isError || !update)
    return (
      <div className="container mx-auto py-10 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Update Not Found</h2>
        <p className="text-muted-foreground">
          The requested update could not be loaded.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl py-8">
      <article className="space-y-8">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium">
            {getCategoryIcon(update.category)}
            <span>{update.category.replace("_", " ")}</span>
          </div>
          {update.version && (
            <p className="text-lg font-semibold text-primary">
              v{update.version}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
            {update.title}
          </h1>
          <p className="text-muted-foreground">
            Published on {format(new Date(update.publishedAt), "MMMM dd, yyyy")}
          </p>
        </header>

        {canModify && (
          <div className="flex justify-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/updates/${update.id}/update`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this update. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        <Separator />
        <div
          className="prose prose-lg dark:prose-invert mx-auto max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </article>
    </div>
  );
}
