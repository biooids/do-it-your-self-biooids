"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { allTags } from "./allTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUGGESTION_LIMIT = 10;

const impossibleCombinations: string[][] = [
  ["React", "Angular"],
  ["React", "Vue"],
  ["Angular", "Vue"],
  ["MySQL", "MongoDB"],
  ["Django", "Express"],
];

interface ReactHashTagsProps {
  // The component is now fully controlled. It receives its value via this prop.
  // It was named `initialTags` but it represents the *current* value from the form.
  initialTags?: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const ReactHashTags: React.FC<ReactHashTagsProps> = ({
  initialTags: tags = [], // Use the prop directly. Default to [] if undefined.
  onChange,
  maxTags = 10,
}) => {
  // REMOVED: The internal `useState` for tags is gone. This is the core fix.
  // The component no longer manages its own state for the tags array.

  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [error, setError] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // REMOVED: All complex useEffect hooks for syncing state are no longer needed.
  // This simplifies the component and removes the source of the bug.

  const checkImpossibleCombinations = useCallback(
    (currentTags: string[]): string => {
      const currentTagsSet = new Set(
        currentTags.map((tag) => tag.toLowerCase())
      );
      for (const combo of impossibleCombinations) {
        const lowerCombo = combo.map((tech) => tech.toLowerCase());
        if (lowerCombo.every((tech) => currentTagsSet.has(tech))) {
          const displayCombo = combo.join(" and ");
          return `Combining ${displayCombo} is not recommended. Please choose one.`;
        }
      }
      return "";
    },
    []
  );

  const handleRemoveTag = useCallback(
    (indexToRemove: number) => {
      // Create the new array based on the props
      const newTags = tags.filter((_, i) => i !== indexToRemove);
      setError(checkImpossibleCombinations(newTags));
      // Immediately inform the parent form of the new value
      onChange(newTags);
    },
    [tags, onChange, checkImpossibleCombinations]
  );

  const handleAddTag = useCallback(
    (tagToAdd: string) => {
      const trimmedTag = tagToAdd.trim();
      if (!trimmedTag) return;

      if (tags.length >= maxTags) {
        setError(`Maximum of ${maxTags} tags allowed.`);
        setInputValue("");
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);
        return;
      }

      const normalizedTag = trimmedTag.toLowerCase();
      if (tags.some((t) => t.toLowerCase() === normalizedTag)) {
        setInputValue("");
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);
        setError("");
        return;
      }

      const officialTag =
        allTags.find((t) => t.toLowerCase() === normalizedTag) || trimmedTag;
      const potentialNewTags = [...tags, officialTag];
      const errorMessage = checkImpossibleCombinations(potentialNewTags);

      if (errorMessage) {
        setError(errorMessage);
      } else {
        // Immediately inform the parent form of the new value
        onChange(potentialNewTags);
        setError("");
      }

      setInputValue("");
      setFilteredSuggestions([]);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [tags, onChange, checkImpossibleCombinations, maxTags]
  );

  const handleClearAll = useCallback(() => {
    // Immediately inform the parent form of the new value
    onChange([]);
    setError("");
    setInputValue("");
    setFilteredSuggestions([]);
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setHighlightedIndex(-1);
    if (error) setError("");

    if (value.trim()) {
      const lowerValue = value.toLowerCase();
      const matches = allTags.filter(
        (tech) =>
          tech.toLowerCase().startsWith(lowerValue) &&
          !tags.some((t) => t.toLowerCase() === tech.toLowerCase())
      );
      setFilteredSuggestions(matches.slice(0, SUGGESTION_LIMIT));
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const hasSuggestions = filteredSuggestions.length > 0;
    switch (event.key) {
      case "ArrowDown":
        if (hasSuggestions) {
          event.preventDefault();
          setHighlightedIndex(
            (prev) => (prev + 1) % filteredSuggestions.length
          );
        }
        break;
      case "ArrowUp":
        if (hasSuggestions) {
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
          );
        }
        break;
      case "Enter":
        event.preventDefault();
        if (hasSuggestions && highlightedIndex > -1) {
          handleAddTag(filteredSuggestions[highlightedIndex]);
        } else if (inputValue.trim()) {
          handleAddTag(inputValue);
        }
        break;
      case "Escape":
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);
        break;
      case "Tab":
        if (hasSuggestions && highlightedIndex === -1) {
          setFilteredSuggestions([]);
        } else if (hasSuggestions && highlightedIndex > -1) {
          handleAddTag(filteredSuggestions[highlightedIndex]);
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddTag(suggestion);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="p-3 bg-card text-card-foreground rounded-lg border space-y-3 w-full shadow-sm"
    >
      <div className="relative">
        <label htmlFor="tech-input" className="sr-only">
          Type Tech stack tags
        </label>
        <div className="flex items-center gap-2 ">
          <div className="flex-1">
            <Input
              id="tech-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g., React, Python..."
              className="w-full h-10 "
              autoComplete="off"
              role="combobox"
              aria-expanded={filteredSuggestions.length > 0}
              aria-controls="tech-suggestions-list"
              aria-activedescendant={
                highlightedIndex > -1
                  ? `suggestion-${highlightedIndex}`
                  : undefined
              }
            />
          </div>
          <Button
            type="button"
            onClick={() => handleAddTag(inputValue)}
            disabled={!inputValue.trim() || tags.length >= maxTags}
            size="default"
            className="shrink-0  h-10 px-4"
          >
            Add
          </Button>
        </div>

        {filteredSuggestions.length > 0 && (
          <ul
            id="tech-suggestions-list"
            role="listbox"
            className="absolute mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-20 text-popover-foreground"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer transition-colors duration-100 ease-in-out",
                  index === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div
          className="mt-2 p-3 border border-destructive/50 text-destructive text-xs rounded-md bg-destructive/10 flex items-start gap-2"
          role="alert"
          aria-live="polite"
        >
          <div>
            <span className="font-semibold">Warning:</span> {error}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-2 items-center min-h-[2.125rem]">
            {tags.map((tag, index) => (
              <div
                key={`${tag}-${index}`}
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                  "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  aria-label={`Remove tag ${tag}`}
                  className="ml-1.5 appearance-none inline-flex items-center justify-center text-secondary-foreground/70 hover:text-destructive hover:bg-destructive/10 focus:outline-none rounded-full w-4 h-4 transition-colors"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                onClick={handleClearAll}
                variant="ghost"
                size="sm"
                className="text-xs h-auto px-2 py-1 text-muted-foreground hover:text-destructive"
              >
                Clear All Tags
              </Button>
            </div>
          )}
        </div>
      )}
      {tags.length === 0 && !error && (
        <p className="text-muted-foreground text-xs italic mt-2">
          No tech stack selected yet. Use the input above to add technologies.
        </p>
      )}
    </div>
  );
};

export default React.memo(ReactHashTags);
