"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PostCategory,
  GetPostsArgs,
  PostDto,
} from "@/lib/features/post/postTypes";
import {
  useGetPostsQuery,
  useGetTagsQuery,
} from "@/lib/features/post/postApiSlice";
import PostCard from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  X,
  Frown,
  Calendar,
  Tags,
  ServerCrash,
  FolderGit2,
  Newspaper,
  BookCopy,
  FileText,
  Presentation,
  MessagesSquare,
  Compass, // Import new icons
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface PostFilterPageProps {
  category?: PostCategory;
  authorId?: string;
  likedByUserId?: string;
  savedByUserId?: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  searchPlaceholder: string;
}

const PostCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[225px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

const allCategories: ("All" | PostCategory)[] = [
  "All",
  "PROJECT",
  "BLOG",
  "RESOURCE",
  "ARTICLE",
  "SHOWCASE",
  "DISCUSSION",
  "GUIDE",
];

// --- NEW: Helper function to map category to a specific icon ---
const getCategoryIcon = (category: PostCategory | "All") => {
  const iconMap: Partial<Record<PostCategory, React.ElementType>> = {
    PROJECT: FolderGit2,
    BLOG: Newspaper,
    RESOURCE: BookCopy,
    ARTICLE: FileText,
    SHOWCASE: Presentation,
    DISCUSSION: MessagesSquare,
    GUIDE: Compass,
  };
  return iconMap[category as PostCategory];
};

export default function PostFilterPage({
  category,
  authorId,
  likedByUserId,
  savedByUserId,
  title,
  subtitle,
  icon: DefaultPageIcon, // Renamed for clarity
  searchPlaceholder,
}: PostFilterPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<
    "All" | PostCategory
  >(category || (searchParams.get("category") as PostCategory) || "All");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    () => new Set(searchParams.get("tags")?.split(",").filter(Boolean) || [])
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort") || "newest"
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
    } else {
      params.delete("q");
    }
    if (selectedTags.size > 0) {
      params.set("tags", Array.from(selectedTags).join(","));
    } else {
      params.delete("tags");
    }
    if (sortOrder !== "newest") {
      params.set("sort", sortOrder);
    } else {
      params.delete("sort");
    }
    if (!category && selectedCategory !== "All") {
      params.set("category", selectedCategory);
    } else if (!category) {
      params.delete("category");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedTags,
    sortOrder,
    pathname,
    router,
    category,
  ]);

  const queryParams: GetPostsArgs = {
    authorId,
    likedByUserId,
    savedByUserId,
    category:
      category || (selectedCategory === "All" ? undefined : selectedCategory),
    q: debouncedSearchTerm || undefined,
    tags:
      selectedTags.size > 0 ? Array.from(selectedTags).join(",") : undefined,
    sort: sortOrder as GetPostsArgs["sort"],
    limit: 50,
  };

  const {
    data: postsResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetPostsQuery(queryParams);

  const { data: tagsResponse } = useGetTagsQuery(queryParams);

  const posts = postsResponse?.data || [];
  const availableTags = tagsResponse?.data.map((t) => t.name) || [];

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) newTags.delete(tag);
      else newTags.add(tag);
      return newTags;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags(new Set());
    setSortOrder("newest");
    if (!category) setSelectedCategory("All");
  };

  const hasActiveFilters = !!(
    searchTerm ||
    selectedTags.size > 0 ||
    sortOrder !== "newest" ||
    (!category && selectedCategory !== "All")
  );

  // --- NEW: Determine the icon to show based on the selected category ---
  const PageIcon = getCategoryIcon(selectedCategory) || DefaultPageIcon;

  return (
    <section className="space-y-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <PageIcon className="text-primary" />
          {title}
        </h1>
        <p className="text-base text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <Card className="sticky top-16 md:top-20 z-30 bg-background/90 p-4 backdrop-blur-sm sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex w-full gap-4 md:w-auto">
              {!category && !authorId && !likedByUserId && !savedByUserId && (
                <Select
                  value={selectedCategory}
                  onValueChange={(value) =>
                    setSelectedCategory(value as "All" | PostCategory)
                  }
                >
                  <SelectTrigger className="flex-1 md:w-[180px]">
                    <Tags className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="flex-1 md:min-w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {availableTags.length > 0 && (
            <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row sm:items-center">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 shrink-0">
                <Tags className="h-4 w-4" /> Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.has(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagClick(tag)}
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg font-semibold text-muted-foreground">
            {isFetching
              ? "Fetching..."
              : `${postsResponse?.pagination.totalItems ?? 0} Item${
                  (postsResponse?.pagination.totalItems ?? 0) !== 1 ? "s" : ""
                } Found`}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/30 bg-card p-12 text-center min-h-[40vh]">
            <ServerCrash className="h-16 w-16 text-destructive/50" />
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">
              Could Not Load Items
            </h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              An unexpected error occurred. Please try again later.
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center min-h-[40vh]">
            <Frown className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">
              No Results Found
            </h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              We couldn't find any items matching your criteria. Try adjusting
              your filters.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-6" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
