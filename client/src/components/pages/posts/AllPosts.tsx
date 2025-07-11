"use client";

import PostFilterPage from "./PostFilterPage"; // Adjust the import path as needed
import { Newspaper } from "lucide-react"; // Using a generic icon for "all posts"

export default function AllPosts() {
  return (
    <PostFilterPage
      title="All Posts"
      subtitle="Explore articles, projects, and resources from across the community."
      icon={Newspaper}
      searchPlaceholder="Search all posts..."
    />
  );
}
