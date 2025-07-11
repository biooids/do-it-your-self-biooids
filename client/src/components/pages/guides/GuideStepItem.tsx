// =================================================================
// FILE: src/components/pages/guides/GuideStepItem.tsx
// =================================================================
"use client";

import React from "react";
import DOMPurify from "dompurify";
import { GuideStepDto } from "@/lib/features/guideSection/guideTypes";
import { GuideSectionItem } from "./GuideSectionItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { MoreHorizontal, PlusCircle, Edit, Trash } from "lucide-react";

interface GuideStepItemProps {
  step: GuideStepDto;
  index: number;
  isAuthor: boolean;
  onEditStep: () => void;
  onDeleteStep: () => Promise<any>;
  onAddSection: () => void;
  onEditSection: (section: GuideStepDto["sections"][0]) => void;
  onDeleteSection: (sectionId: string) => Promise<any>;
}

export default function GuideStepItem({
  step,
  index,
  isAuthor,
  onEditStep,
  onDeleteStep,
  onAddSection,
  onEditSection,
  onDeleteSection,
}: GuideStepItemProps) {
  const sanitizedDescription = step.description
    ? DOMPurify.sanitize(step.description)
    : null;

  return (
    <div id={`step-${step.id}`} className="scroll-mt-24 flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-lg font-bold text-primary">
          {index + 1}
        </div>
        <div className="h-full w-px bg-border"></div>
      </div>

      <div className="flex-1 space-y-6 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              {step.title}
            </h3>
            {sanitizedDescription && (
              <div
                className="prose prose-zinc dark:prose-invert mt-2 max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            )}
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEditStep}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Step
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteConfirmationDialog
                  title="Delete this step?"
                  description="This will permanently delete the step and all sections inside it. This action cannot be undone."
                  onConfirm={onDeleteStep}
                  trigger={
                    <button className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:bg-destructive/10">
                      <Trash className="mr-2 h-4 w-4" /> Delete Step
                    </button>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-4">
          {step.sections.map((section) => (
            <GuideSectionItem
              key={section.id}
              section={section}
              isAuthor={isAuthor}
              onEdit={() => onEditSection(section)}
              onDelete={() => onDeleteSection(section.id)}
            />
          ))}
        </div>

        {isAuthor && (
          <div className="pt-4">
            <Button variant="outline" size="sm" onClick={onAddSection}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
