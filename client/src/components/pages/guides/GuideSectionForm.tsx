// FILE: src/components/pages/guides/GuideSectionForm.tsx

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  guideSectionSchema,
  GuideSectionFormValues,
} from "@/lib/schemas/guide.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import RichTextEditor from "../posts/RichTextEditor";

interface GuideSectionFormProps {
  mode: "create" | "edit";
  initialData?: Partial<GuideSectionFormValues>;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function GuideSectionForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: GuideSectionFormProps) {
  const form = useForm<GuideSectionFormValues>({
    resolver: zodResolver(guideSectionSchema),
    defaultValues: {
      title: "",
      content: "",
      order: 1,
      videoUrl: "",
      image: undefined,
      ...initialData,
    },
  });

  const handleSubmit = (values: GuideSectionFormValues) => {
    const formData = new FormData();
    // Append all non-file fields to formData
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "image" && value != null) {
        formData.append(key, String(value));
      }
    });
    // Handle the file input separately
    const imageFile = values.image?.[0];
    if (imageFile instanceof File) {
      formData.append("image", imageFile);
    }
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-6 h-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Understanding Props" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- FIX: Added the missing Video URL field --- */}
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., [https://youtube.com/watch?v=](https://youtube.com/watch?v=)..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- FIX: Added the missing Image Upload field --- */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Image (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* This field will now correctly grow to fill space */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex flex-col flex-grow">
              <FormLabel>Content</FormLabel>
              <FormControl className="flex-grow">
                <RichTextEditor
                  initialContent={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* This div is now part of the form, but will be at the bottom */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Add Section" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
