// =================================================================
// FILE: src/components/pages/guides/GuideStepForm.tsx
// =================================================================
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  guideStepSchema,
  GuideStepFormValues,
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

interface GuideStepFormProps {
  mode: "create" | "edit";
  initialData?: GuideStepFormValues;
  onSubmit: (data: GuideStepFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function GuideStepForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: GuideStepFormProps) {
  const form = useForm<GuideStepFormValues>({
    resolver: zodResolver(guideStepSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      ...initialData,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Step Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Part 1: Setting Up Your Environment"
                  {...field}
                />
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Step Description (Optional)</FormLabel>
              <FormControl>
                <RichTextEditor
                  initialContent={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {mode === "create" ? "Add Step" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
