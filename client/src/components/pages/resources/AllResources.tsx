"use client";

import PostFilterPage from "../posts/PostFilterPage";
import { Library } from "lucide-react";

export default function AllResources() {
  return (
    <PostFilterPage
      title="Resources"
      subtitle="A curated collection of tools, libraries, and cheatsheets for developers."
      icon={Library}
      searchPlaceholder="Search resources..."
      category="RESOURCE" // This is the only required change for a new page
    />
  );
}
