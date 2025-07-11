"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePostMutation } from "@/lib/features/post/postApiSlice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import {
  createPostSchema,
  CreatePostFormValues,
} from "@/lib/schemas/post.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ReactHashTags from "./ReactHashTags";
import RichTextEditor from "./RichTextEditor";
import ImageUploadWithCropper from "./ImageUploadWithCropper";
import {
  Loader2,
  PlusCircle,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";
// Import PostCategory to be used by the helper function
import { PostImageDto, PostCategory } from "@/lib/features/post/postTypes";

const postCategories = ["GUIDE", "SHOWCASE", "RESOURCE"] as const;

// --- ADDED: Helper function to determine the correct post URL based on category ---
const getPostAction = (post: { id: string; category: PostCategory }) => {
  const category = post.category;
  const categoryToPathMap: Partial<Record<PostCategory, string>> = {
    GUIDE: "guides",
    SHOWCASE: "showcases",
    RESOURCE: "resources",
  };
  const path = categoryToPathMap[category] || "posts";
  return { href: `/${path}/${post.id}` };
};

export default function CreatePostPage() {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const [createPost, { isLoading, isSuccess }] = useCreatePostMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: undefined,
      postTags: [],
      postImages: [],
      externalLink: "",
      githubLink: "",
    },
  });

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      setValue("postTags", tags, { shouldValidate: true });
    },
    [setValue]
  );

  const handleImagesChange = useCallback(
    (files: File[], retainedImages: PostImageDto[]) => {
      setValue("postImages", files, { shouldValidate: true });
    },
    [setValue]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      setValue("content", content, { shouldValidate: true });
    },
    [setValue]
  );

  const stableEmptyArray = useMemo(() => [], []);

  const onSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    setFormError(null);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("postTags", JSON.stringify(data.postTags));
    if (data.externalLink) formData.append("externalLink", data.externalLink);
    if (data.githubLink) formData.append("githubLink", data.githubLink);
    if (data.postImages && Array.isArray(data.postImages)) {
      data.postImages.forEach((file) => formData.append("postImages", file));
    }

    try {
      const response = await createPost(formData).unwrap();

      // --- UPDATED: Use the helper function to get the correct URL ---
      const { href } = getPostAction(response.data);
      router.push(href); // Redirect to the smart, category-specific URL
    } catch (err) {
      setFormError(getApiErrorMessage(err as any));
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to create a post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Button variant="link" asChild className="px-0 mb-6 group">
        <Link href="/" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Create a New Post
          </CardTitle>
          <CardDescription>
            Share your knowledge, project, or story with the community.
          </CardDescription>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="e.g., How to Build a Full-Stack App with Next.js"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                placeholder="A brief summary of your post (up to 500 characters)."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {postCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags (up to 10)</Label>
              <Controller
                name="postTags"
                control={control}
                render={({ field }) => (
                  <ReactHashTags
                    onChange={handleTagsChange}
                    initialTags={field.value}
                  />
                )}
              />
              {errors.postTags && (
                <p className="text-sm text-destructive">
                  {errors.postTags.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Post Images (up to 5)</Label>
              <Controller
                name="postImages"
                control={control}
                render={({ field }) => (
                  <ImageUploadWithCropper
                    value={field.value as any[]}
                    onChange={handleImagesChange}
                    existingImages={stableEmptyArray}
                    maxFiles={5}
                  />
                )}
              />
              {errors.postImages && (
                <p className="text-sm text-destructive">
                  {errors.postImages.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Main Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    onChange={handleContentChange}
                    initialContent={field.value}
                  />
                )}
              />
              {errors.content && (
                <p className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalLink">External Link (Optional)</Label>
              <Input
                id="externalLink"
                placeholder="https://example.com/related-article"
                {...register("externalLink")}
              />
              {errors.externalLink && (
                <p className="text-sm text-destructive">
                  {errors.externalLink.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Link (Optional)</Label>
              <Input
                id="githubLink"
                placeholder="https://github.com/user/repo"
                {...register("githubLink")}
              />
              {errors.githubLink && (
                <p className="text-sm text-destructive">
                  {errors.githubLink.message}
                </p>
              )}
            </div>

            <Separator />

            {isSuccess && (
              <Alert
                variant="default"
                className="border-green-500/50 text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your post has been created. Redirecting...
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Post...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" /> Publish Post
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
