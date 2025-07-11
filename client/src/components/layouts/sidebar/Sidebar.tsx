// =================================================================
// FILE: src/components/layout/Sidebar.tsx (IMPROVED VERSION)
// =================================================================
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FileCode2,
  Users,
  Bookmark,
  Heart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Rocket,
  Trophy,
  Globe,
  Library,
  BookUser,
  Pen,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Logo from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { UserAccountNav } from "../header/UserAccountNav";

// --- Navigation Configuration ---
// Defining nav structure in an object makes it easier to manage and scale.
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

const sidebarNavConfig: (NavItem | NavSection)[] = [
  { href: "/", label: "Home", icon: Home },
  {
    title: "Discover",
    icon: Library,
    items: [
      { href: "/all", label: "All Posts", icon: FolderKanban },
      { href: "/guides", label: "DIYs", icon: BookOpen },
      { href: "/showcases", label: "Showcases", icon: Trophy },
      { href: "/resources", label: "Resources", icon: Globe },
    ],
  },
  {
    title: "Workspace",
    icon: BookUser,
    items: [
      { href: "/posts/my", label: "My Posts", icon: FileCode2 },
      { href: "/saved", label: "Saved Posts", icon: Bookmark },
      { href: "/liked", label: "Liked Posts", icon: Heart },
    ],
  },
  {
    title: "Community",
    icon: Users,
    items: [{ href: "/updates", label: "Updates", icon: Users }],
  },
];

// --- Reusable NavLink Component ---
const NavLink = ({
  href,
  label,
  icon: Icon,
  isCollapsed,
}: NavItem & { isCollapsed: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-foreground",
              isCollapsed && "h-11 w-11 justify-center rounded-lg",
              isActive && "bg-primary/10 font-semibold text-primary"
            )}
          >
            <div
              className={cn(
                "absolute left-0 h-0 w-1 bg-primary transition-all duration-300 rounded-r-full",
                isActive ? "h-6" : "group-hover:h-4"
              )}
            />
            <Icon className="h-5 w-5" />
            <span className={cn("truncate", isCollapsed && "sr-only")}>
              {label}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

// --- Main Sidebar Component ---
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="hidden lg:block sticky top-0">
      <aside
        data-collapsed={isCollapsed}
        className={cn(
          "sticky top-0 flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo isCollapsed={isCollapsed} />
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="flex flex-col gap-1 p-2">
            {sidebarNavConfig.map((section, index) =>
              "href" in section ? (
                // Render a direct NavLink
                <NavLink key={index} {...section} isCollapsed={isCollapsed} />
              ) : (
                // Render a Collapsible Section
                <div key={index}>
                  <Separator className="my-2" />
                  {isCollapsed ? (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger className="w-full flex justify-center my-2">
                          <section.icon className="h-5 w-5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {section.title}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.title}
                    </h2>
                  )}
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
              )
            )}
          </nav>
          <div className="p-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="default"
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "h-11 w-11 justify-center"
                    )}
                  >
                    <Link href="/create">
                      <Plus className="h-5 w-5" />
                      <span className={cn("ml-2", isCollapsed && "sr-only")}>
                        Create Post
                      </span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">Create New Post</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-2 border-t p-2">
          {!isCollapsed && (
            <div className="rounded-lg border bg-accent/50 p-4 text-center mx-2">
              <div className="mb-2 flex justify-center">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Go Pro</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Unlock exclusive features.
              </p>
            </div>
          )}
          <div
            className={cn(
              "flex p-2",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          ></div>
        </div>
      </aside>

      {/* Collapse Toggle Button */}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute top-6 h-8 w-8 rounded-full bg-background hover:bg-muted z-50",
                "right-0 translate-x-1/2" // Positions button perfectly on the border
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Expand" : "Collapse"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
