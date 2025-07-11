// src/components/pages/updates/CreateUpdatePage.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { SystemRole } from "@/lib/features/user/userTypes";
import UpdateForm from "./UpdateForm"; // Use the reusable form
import toast from "react-hot-toast";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateUpdatePage() {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);

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
  }, [currentUser, router]);

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
          <CardTitle className="text-3xl">Create New Update</CardTitle>
          <CardDescription>
            Post an update for app changes, marketing, or community news.
          </CardDescription>
        </CardHeader>
      </Card>
      <UpdateForm />
    </div>
  );
}
