// src/components/pages/updates/UpdateForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUpdateSchema,
  CreateUpdateFormValues,
} from "@/lib/schemas/update.schemas";
import {
  useCreateUpdateMutation,
  useUpdateUpdateMutation,
} from "@/lib/features/updates/updateApiSlice";
import {
  UpdateDto,
  UpdateCategoryEnum,
} from "@/lib/features/updates/updateTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, Save, AlertCircle } from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";

const updateCategories: UpdateCategoryEnum[] = [
  "APP_UPDATE",
  "MARKETING",
  "COMMUNITY",
];

interface UpdateFormProps {
  existingUpdate?: UpdateDto;
}

export default function UpdateForm({ existingUpdate }: UpdateFormProps) {
  const router = useRouter();
  const [createUpdate, { isLoading: isCreating }] = useCreateUpdateMutation();
  const [updateUpdate, { isLoading: isUpdating }] = useUpdateUpdateMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const isEditMode = !!existingUpdate;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUpdateFormValues>({
    resolver: zodResolver(createUpdateSchema),
    defaultValues: {
      title: existingUpdate?.title || "",
      content: existingUpdate?.content || "",
      category: existingUpdate?.category || undefined,
      version: existingUpdate?.version || "",
    },
  });

  const onSubmit = async (data: CreateUpdateFormValues) => {
    setFormError(null);
    try {
      if (isEditMode) {
        await updateUpdate({ id: existingUpdate.id, ...data }).unwrap();
        toast.success("Update saved successfully!");
        router.push(`/updates/${existingUpdate.id}`);
      } else {
        const newUpdate = await createUpdate(data).unwrap();
        toast.success("Update published successfully!");
        router.push(`/updates/${newUpdate.id}`);
      }
    } catch (err) {
      setFormError(getApiErrorMessage(err as any));
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {updateCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="version">Version (Optional)</Label>
              <Input
                id="version"
                placeholder="e.g., 1.2.0"
                {...register("version")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (Supports Markdown)</Label>
            <Textarea id="content" rows={12} {...register("content")} />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isEditMode ? (
              <Save className="mr-2 h-5 w-5" />
            ) : (
              <PlusCircle className="mr-2 h-5 w-5" />
            )}
            {isEditMode ? "Save Changes" : "Publish Update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
