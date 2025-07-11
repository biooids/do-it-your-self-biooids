"use client";

import PostFilterPage from "../posts/PostFilterPage";
import { Library } from "lucide-react";

export default function AllShowCases() {
  return (
    <PostFilterPage
      title="Showcases"
      subtitle="A collection of digital canvas for creativity and code."
      icon={Library}
      searchPlaceholder="Search showcases..."
      category="SHOWCASE" // This is the only required change for a new page
    />
  );
}
