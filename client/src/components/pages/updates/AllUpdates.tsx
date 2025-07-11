// src/components/pages/updates/AllUpdatesPage.tsx
"use client";

import React from "react";
import { useGetUpdatesQuery } from "@/lib/features/updates/updateApiSlice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { SystemRole } from "@/lib/features/user/userTypes";
import UpdateCard from "./UpdateCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AllUpdatesPage() {
  const { data: updatesResponse, isLoading, isError } = useGetUpdatesQuery();
  const currentUser = useAppSelector(selectCurrentUser);

  const updates = updatesResponse?.data || [];

  // FIX: Determine if the current user has permission to create an update.
  const canCreate =
    currentUser?.systemRole === SystemRole.DEVELOPER ||
    currentUser?.systemRole === SystemRole.SUPER_ADMIN;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <Megaphone className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold mt-4">Latest Updates</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Stay up-to-date with the latest news, features, and announcements.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-destructive">
          <AlertTriangle className="mx-auto h-12 w-12" />
          <p className="mt-4">
            Failed to load updates. Please try again later.
          </p>
        </div>
      )}

      {!isLoading && !isError && updates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      )}

      {!isLoading && !isError && updates.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No updates have been posted yet.
          </p>
        </div>
      )}

      {/* FIX: Conditionally render the "Create Update" button based on user role */}
      {canCreate && (
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/updates/create">Create New Update</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
