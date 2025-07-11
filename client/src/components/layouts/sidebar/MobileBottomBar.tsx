"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Plus,
  LayoutDashboard,
  FileCode2,
  BookOpen,
  Library,
  FolderKanban,
  Trophy,
  Globe,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the navigation items for the bottom bar
const bottomNavItems = [
  { href: "/all", label: "All Posts", icon: FolderKanban },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/create", label: "Create", icon: Plus, isCentral: true }, // Central button
  { href: "/showcases", label: "Showcases", icon: Trophy },
  { href: "/resources", label: "Resources", icon: Globe },
];

export default function MobileBottomBar() {
  const pathname = usePathname();

  return (
    // This entire component is hidden on large screens (lg and up)
    <div className="lg:hidden fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background/95 backdrop-blur-lg">
      <div className="grid h-full grid-cols-5">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isCentral) {
            return (
              <div key={item.label} className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className="relative -top-5 flex h-16 w-16 items-center justify-center rounded-full border bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
                      >
                        <item.icon className="h-7 w-7" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="group inline-flex flex-col items-center justify-center px-5"
            >
              <item.icon
                className={cn(
                  "h-6 w-6 mb-1 text-muted-foreground transition-colors group-hover:text-primary",
                  isActive && "text-primary"
                )}
              />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
