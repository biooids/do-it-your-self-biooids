// filePath: @/app/projects/[id]/CommentForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Send, Loader2, X } from "lucide-react"; // IMPROVEMENT: Using Lucide icons
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
  initialText?: string;
  onCancel?: () => void;
  submitError?: string;
  placeholder?: string;
  submitButtonText?: string;
  compact?: boolean;
}

export default function CommentForm({
  onSubmit,
  isLoading,
  initialText = "",
  onCancel,
  submitError,
  placeholder = "Add a comment...",
  submitButtonText = "Post",
  compact = false,
}: CommentFormProps) {
  const [text, setText] = useState(initialText);
  const maxCharacters = 300;

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    await onSubmit(text);
    if (!initialText) {
      setText(""); // Clear form only on new comment submission
    }
  };

  const remainingChars = maxCharacters - text.length;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-3", compact ? "mt-2" : "p-4")}
    >
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          maxLength={maxCharacters}
          className="w-full resize-none pr-12 text-sm"
          disabled={isLoading}
          required
        />
        <div
          className={cn(
            "absolute bottom-2.5 right-3 text-xs font-mono select-none",
            remainingChars < 20 ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {remainingChars}
        </div>
      </div>
      {submitError && <p className="text-xs text-destructive">{submitError}</p>}
      <div className="flex items-center justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="mr-1.5 h-4 w-4" /> Cancel
          </Button>
        )}
        <Button
          type="submit"
          size={compact ? "sm" : "default"}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-1.5 h-4 w-4" />
          )}
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
