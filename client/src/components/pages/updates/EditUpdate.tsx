// src/components/pages/updates/EditUpdatePage.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { SystemRole } from "@/lib/features/user/userTypes";
import { useGetUpdateQuery } from "@/lib/features/updates/updateApiSlice";
import UpdateForm from "./UpdateForm"; // Use the reusable form
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditUpdatePage({ updateId }: { updateId: string }) {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: update, isLoading, isError } = useGetUpdateQuery(updateId);

  useEffect(() => {
    if (
      currentUser &&
      !(
        currentUser.systemRole === SystemRole.DEVELOPER ||
        currentUser.systemRole === SystemRole.SUPER_ADMIN
      )
    ) {
      toast.error("You are not authorized to access this page.");
      router.push("/updates");
    }
    if (isError) {
      toast.error("Could not load the update to edit.");
      router.push("/updates");
    }
  }, [currentUser, isError, router]);

  if (isLoading)
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <Skeleton className="h-[500px] w-full" />
      </div>
    );

  if (
    !currentUser ||
    !(
      currentUser.systemRole === SystemRole.DEVELOPER ||
      currentUser.systemRole === SystemRole.SUPER_ADMIN
    )
  ) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="mb-8 border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Edit Update</CardTitle>
          <CardDescription>
            Update the details for this announcement.
          </CardDescription>
        </CardHeader>
      </Card>
      {update && <UpdateForm existingUpdate={update} />}
    </div>
  );
}
