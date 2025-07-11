// FILE: src/components/layout/MobileSidebar.tsx

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import { UserAccountNav } from "../header/UserAccountNav";

import {
  Menu,
  Home,
  LayoutDashboard,
  User,
  BookOpen,
  FolderKanban,
  Trophy,
  Globe,
  Book,
  Users,
  FileCode2,
  Bookmark,
  Heart,
  ChevronDown,
  Plus,
} from "lucide-react";

// --- Navigation Data synced with Desktop Sidebar ---
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}
interface CollapsibleNavSection {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

const mainNav: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
];

const contentSection: CollapsibleNavSection = {
  title: "Content",
  icon: BookOpen,
  items: [
    { href: "/all", label: "All Posts", icon: FolderKanban },
    { href: "/guides", label: "Guides", icon: BookOpen },
    { href: "/showcases", label: "Showcases", icon: Trophy },
    { href: "/resources", label: "Resources", icon: Globe },
  ],
};

const communitySection: CollapsibleNavSection = {
  title: "Community",
  icon: Users,
  items: [{ href: "/updates", label: "Updates", icon: Book }],
};

const workspaceSection: CollapsibleNavSection = {
  title: "Workspace",
  icon: FolderKanban,
  items: [
    { href: "/posts/my", label: "My Posts", icon: FileCode2 },
    { href: "/saved", label: "Saved Posts", icon: Bookmark },
    { href: "/liked", label: "Liked Posts", icon: Heart },
  ],
};

// --- Mobile Sidebar ---
export default function MobileSidebar() {
  const pathname = usePathname();

  const MobileNavLink = ({ href, label, icon: Icon }: NavItem) => {
    const isActive = pathname === href;
    return (
      <SheetClose asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted font-semibold text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-base">{label}</span>
        </Link>
      </SheetClose>
    );
  };

  const CollapsibleNav = ({ section }: { section: CollapsibleNavSection }) => (
    <Collapsible defaultOpen className="w-full">
      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <div className="flex items-center gap-4">
          <section.icon className="h-5 w-5" />
          <span className="text-base">{section.title}</span>
        </div>
        <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 py-1 pl-8">
        {section.items.map((item) => (
          <MobileNavLink key={item.href} {...item} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col bg-background p-0">
          <SheetHeader className="h-16 shrink-0 border-b px-4 flex items-center">
            <SheetTitle className="sr-only">Main Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate through the application pages.
            </SheetDescription>
            <SheetClose asChild>
              <Link href="/" className="flex items-center">
                <Logo />
              </Link>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-1 p-4">
              {mainNav.map((item) => (
                <MobileNavLink key={item.href} {...item} />
              ))}
              <Separator className="my-2" />
              <CollapsibleNav section={contentSection} />
              <CollapsibleNav section={communitySection} />
              <Separator className="my-2" />
              <CollapsibleNav section={workspaceSection} />
              <SheetClose asChild>
                <Button asChild variant="default" className="w-full mb-2">
                  <Link href="/create">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Post
                  </Link>
                </Button>
              </SheetClose>
            </nav>
          </div>

          <SheetFooter className="border-t p-4 shrink-0">
            <UserAccountNav />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
