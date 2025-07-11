"use client";

import PostFilterPage from "../posts/PostFilterPage";
import { Library } from "lucide-react";

export default function AllGuides() {
  return (
    <PostFilterPage
      title="Guides"
      subtitle="A collection of guides, tutorials, and structured lessons."
      icon={Library}
      searchPlaceholder="Search guides..."
      category="GUIDE"
    />
  );
}
