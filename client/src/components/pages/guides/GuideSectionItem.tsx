// =================================================================
// FILE: src/components/pages/guides/GuideSectionItem.tsx
// =================================================================
"use client";

import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import Image from "next/image";
import { GuideSectionDto } from "@/lib/features/guideSection/guideTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { getEmbedUrl } from "@/lib/utils";

export function GuideSectionItem({
  section,
  isAuthor,
  onEdit,
  onDelete,
}: {
  section: GuideSectionDto;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => Promise<any>;
}) {
  const embedUrl = useMemo(
    () => getEmbedUrl(section.videoUrl),
    [section.videoUrl]
  );
  const sanitizedContent = DOMPurify.sanitize(section.content);

  return (
    <Card
      id={`section-${section.id}`}
      className="scroll-mt-24 overflow-hidden bg-background/50"
    >
      {(section.title || isAuthor) && (
        <CardHeader className="flex-row items-center justify-between space-y-0 border-b bg-muted/30 p-4">
          <CardTitle className="text-base font-semibold text-foreground">
            {section.title}
          </CardTitle>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteConfirmationDialog
                  title="Delete this section?"
                  description="This action cannot be undone and will permanently delete this content."
                  onConfirm={onDelete}
                  trigger={
                    <button className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:bg-destructive/10">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </button>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
      )}

      <CardContent className="space-y-4 p-4">
        {sanitizedContent && (
          <div
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
        {section.imageUrl && (
          <div className="not-prose relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={section.imageUrl}
              alt={section.title || "Guide section image"}
              fill
              className="object-cover"
            />
          </div>
        )}
        {embedUrl && (
          <div className="not-prose relative aspect-video w-full">
            <iframe
              src={embedUrl}
              className="absolute left-0 top-0 h-full w-full rounded-lg border"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={section.title || "Embedded video"}
            ></iframe>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
