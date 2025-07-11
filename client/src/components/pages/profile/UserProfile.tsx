// FILE: src/components/pages/profile/UserProfile.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  useGetUserByUsernameQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/lib/features/user/userApiSlice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import {
  UserProfile as UserProfileType,
  CurrentUser,
} from "@/lib/features/user/userTypes";
import toast from "react-hot-toast";

// --- Page-specific Components ---
import PostFilterPage from "@/components/pages/posts/PostFilterPage";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Twitter,
  Github,
  Link as LinkIcon,
  MapPin,
  Calendar,
  AlertCircle,
  LayoutGrid,
  Share2, // <-- Import Share icon
  Check, // <-- Import Check icon
} from "lucide-react";

// --- Skeleton Loader (unchanged) ---
const ProfileHeaderSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full md:h-64" />
    <div className="p-6 pt-0">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <Skeleton className="-mt-16 h-32 w-32 shrink-0 rounded-full border-4 border-background" />
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto mt-4 sm:mt-0">
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-5 w-64 rounded-md" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-3/4 rounded-md" />
        </div>
      </div>
    </div>
  </Card>
);

// --- Main Profile Header Component (Now with Follow and Share logic) ---
const ProfileHeader = ({
  user,
  currentUser,
}: {
  user: UserProfileType;
  currentUser: CurrentUser | null;
}) => {
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] =
    useUnfollowUserMutation();
  const [isCopied, setIsCopied] = useState(false); // State for share button

  const isMyProfile = currentUser?.id === user.id;
  const isLoading = isFollowing || isUnfollowing;

  const handleFollowToggle = () => {
    if (isLoading || isMyProfile || !currentUser) return;

    const mutationPayload = {
      userIdToFollow: user.id,
      userIdToUnfollow: user.id,
      usernameToInvalidate: user.username,
    };

    if (user.isFollowedByCurrentUser) {
      unfollowUser(mutationPayload);
    } else {
      followUser(mutationPayload);
    }
  };

  // --- NEW: Function to handle copying the profile link ---
  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${user.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      toast.error("Failed to copy link.");
      console.error("Clipboard error:", err);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-muted md:h-64">
        {user.bannerImage && (
          <Image
            src={user.bannerImage}
            alt={`${user.name}'s banner`}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
      <div className="p-6 pt-0">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <Avatar className="-mt-16 h-32 w-32 shrink-0 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.profileImage ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name?.slice(0, 2) || "??"}</AvatarFallback>
          </Avatar>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto mt-4 sm:mt-0">
            {!isMyProfile && currentUser && (
              <Button onClick={handleFollowToggle} disabled={isLoading}>
                {user.isFollowedByCurrentUser ? "Following" : "Follow"}
              </Button>
            )}
            {isMyProfile && (
              <>
                {/* --- NEW: Share Button --- */}
                <Button variant="outline" onClick={handleShare}>
                  {isCopied ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Share2 className="mr-2 h-4 w-4" />
                  )}
                  {isCopied ? "Copied!" : "Share"}
                </Button>
                <Button asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tighter">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.title && (
            <p className="mt-2 text-foreground/80">{user.title}</p>
          )}
          {user.bio && <p className="mt-4 max-w-2xl">{user.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {user.location}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Joined{" "}
              {format(new Date(user.joinedAt), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {user.githubUrl && (
              <Button variant="outline" size="icon" asChild>
                <Link href={user.githubUrl} target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {user.twitterUrl && (
              <Button variant="outline" size="icon" asChild>
                <Link href={user.twitterUrl} target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {user.websiteUrl && (
              <Button variant="outline" size="icon" asChild>
                <Link href={user.websiteUrl} target="_blank">
                  <LinkIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <p>
              <span className="font-bold">
                {user._count?.followers.toLocaleString() || 0}
              </span>{" "}
              Followers
            </p>
            <p>
              <span className="font-bold">
                {user._count?.following.toLocaleString() || 0}
              </span>{" "}
              Following
            </p>
            <p>
              <span className="font-bold">
                {user._count?.posts.toLocaleString() || 0}
              </span>{" "}
              Posts
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- Main UserProfile Component ---
export default function UserProfile() {
  const params = useParams();
  const username = params.slug as string;
  const currentUser = useAppSelector(selectCurrentUser);

  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserByUsernameQuery(username, {
    skip: !username,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>User Not Found</AlertTitle>
          <AlertDescription>
            The profile you are looking for does not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} currentUser={currentUser} />

      <div className="mt-12">
        <PostFilterPage
          title={`${user.name}'s Posts`}
          subtitle={`A collection of all content created by @${user.username}.`}
          icon={LayoutGrid}
          searchPlaceholder={`Search ${user.name}'s posts...`}
          authorId={user.id}
        />
      </div>
    </div>
  );
}
