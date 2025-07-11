"use client";

import PostFilterPage from "@/components/pages/posts/PostFilterPage";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { FolderKanban } from "lucide-react";
import PleaseLogin from "@/components/shared/PleaseLogin";

export default function MyPosts() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <PleaseLogin message="Please log in to see your posts." />;
  }

  return (
    <PostFilterPage
      title="My Posts"
      subtitle="A collection of all the content you have created."
      icon={FolderKanban}
      searchPlaceholder="Search your posts..."
      authorId={currentUser.id} // <-- PASS THE USER'S ID HERE
    />
  );
}
