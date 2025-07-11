"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCompactNumber } from "@/lib/utils";
import { Eye, MessageSquare } from "lucide-react";

interface PostStatsBarProps {
  viewsCount: number;
  commentsCount: number;
}

export default function PostStatsBar({
  viewsCount,
  commentsCount,
}: PostStatsBarProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Eye className="h-4 w-4" />
            <span className="font-medium">
              {formatCompactNumber(viewsCount)}
            </span>
            <span>Views</span>
          </TooltipTrigger>
          <TooltipContent>
            {viewsCount.toLocaleString()} total views
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">
              {formatCompactNumber(commentsCount)}
            </span>
            <span>Comments</span>
          </TooltipTrigger>
          <TooltipContent>
            {commentsCount.toLocaleString()} total comments
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
