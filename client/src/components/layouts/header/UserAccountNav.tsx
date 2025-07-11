// FILE: src/components/shared/UserAccountNav.tsx

"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  Bookmark,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { useLogoutMutation } from "@/lib/features/auth/authApiSlice";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Helper function to get initials from a name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U"; // U for User
  const words = name.split(" ").filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// This component will now house all the logic
export function UserAccountNav() {
  const currentUser = useAppSelector(selectCurrentUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when the user or image changes
    setIsImageLoading(true);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("Failed to log out:", error);
      await signOut({ redirect: true, callbackUrl: "/" });
    }
  };

  // If there's no user, show a simple Log In button
  if (!currentUser) {
    return (
      <Button asChild>
        <Link href="/auth/login">Log In</Link>
      </Button>
    );
  }

  // If there is a user, show the avatar and dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={currentUser.profileImage ?? ""}
              alt={currentUser.name ?? "User"}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
              className={cn(
                "transition-opacity",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
            />
            <AvatarFallback
              className={cn(isImageLoading && "animate-pulse bg-muted")}
            >
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${currentUser.username}`}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/saved">
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Saved Items</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
