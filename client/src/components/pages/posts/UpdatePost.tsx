"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useUpdatePostMutation,
  useGetPostByIdQuery,
} from "@/lib/features/post/postApiSlice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import {
  updatePostSchema,
  UpdatePostFormValues,
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
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";

// Import PostCategory to be used by the helper function
import { PostImageDto, PostCategory } from "@/lib/features/post/postTypes";

const postCategories = ["RESOURCE", "GUIDE", "SHOWCASE"] as const;

// --- ADDED: Helper function to determine the correct post URL based on category ---
const getPostAction = (post: { id: string; category: PostCategory }) => {
  const category = post.category;
  const categoryToPathMap: Partial<Record<PostCategory, string>> = {
    SHOWCASE: "showcases",
    RESOURCE: "resources",
    GUIDE: "guides",
  };
  const path = categoryToPathMap[category] || "posts";
  return { href: `/${path}/${post.id}` };
};

const PageSkeleton = () => (
  <div className="container mx-auto max-w-3xl py-8 animate-pulse">
    <div className="h-8 bg-secondary rounded w-1/4 mb-6"></div>
    <Card>
      <CardHeader>
        <div className="h-10 bg-secondary rounded w-3/4"></div>
        <div className="h-6 bg-secondary rounded w-1/2 mt-2"></div>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent className="space-y-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 bg-secondary rounded w-1/6"></div>
            <div className="h-10 bg-secondary rounded"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default function UpdatePostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.slug as string;

  const currentUser = useAppSelector(selectCurrentUser);
  const {
    data: postData,
    isLoading: isLoadingPost,
    isError: isFetchError,
  } = useGetPostByIdQuery(postId, { skip: !postId });
  const [updatePost, { isLoading: isUpdating, isSuccess }] =
    useUpdatePostMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [retainedImages, setRetainedImages] = useState<PostImageDto[]>([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdatePostFormValues>({
    resolver: zodResolver(updatePostSchema),
    mode: "onSubmit",
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

  useEffect(() => {
    if (postData) {
      reset({
        title: postData.title,
        description: postData.description,
        content: postData.content,
        category: postData.category,
        postTags: postData.tags.map((t) => t.tag.name),
        postImages: [],
        externalLink: postData.externalLink || "",
        githubLink: postData.githubLink || "",
      });
      setRetainedImages(postData.images);
      setIsFormInitialized(true);
    }
  }, [postData, reset]);

  const handleImagesChange = useCallback(
    (files: File[], retained: PostImageDto[]) => {
      setValue("postImages", files, { shouldValidate: true });
      setRetainedImages(retained);
    },
    [setValue]
  );
  const handleContentChange = useCallback(
    (content: string) => setValue("content", content, { shouldValidate: true }),
    [setValue]
  );

  const onSubmit: SubmitHandler<UpdatePostFormValues> = async (data) => {
    setFormError(null);
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.content) formData.append("content", data.content);
    if (data.category) formData.append("category", data.category);
    if (data.postTags)
      formData.append("postTags", JSON.stringify(data.postTags));
    if (data.externalLink) formData.append("externalLink", data.externalLink);
    if (data.githubLink) formData.append("githubLink", data.githubLink);
    data.postImages?.forEach((file: File) =>
      formData.append("postImages", file)
    );
    const retainedImageUrls = retainedImages.map((img) => img.url);
    formData.append("retainedImageUrls", JSON.stringify(retainedImageUrls));
    try {
      // The updatePost mutation returns the updated post object
      const response = await updatePost({ postId, formData }).unwrap();

      // --- UPDATED: Use the helper function to get the correct URL from the response ---
      const { href } = getPostAction(response.data);
      router.push(href); // Redirect to the smart, category-specific URL
    } catch (err) {
      setFormError(getApiErrorMessage(err as any));
    }
  };

  if (isLoadingPost) return <PageSkeleton />;

  if (isFetchError || !postData) {
    return (
      <div className="container mx-auto py-10 flex justify-center text-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Post</AlertTitle>
          <AlertDescription>
            The post you are trying to edit could not be found.
            <Button variant="link" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (currentUser?.id !== postData.authorId) {
    return (
      <div className="container mx-auto py-10 flex justify-center text-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unauthorized</AlertTitle>
          <AlertDescription>
            You are not the author of this post and cannot edit it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Button variant="link" asChild className="px-0 mb-6 group">
        <Link
          href={`/posts/${postId}`}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Post
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Update Post</CardTitle>
          <CardDescription>
            Make changes to your post and save them.
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
                key={isFormInitialized ? "initialized" : "uninitialized"}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                key={isFormInitialized ? "initialized" : "uninitialized"}
                render={({ field }) => (
                  <ReactHashTags
                    onChange={field.onChange}
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
                    existingImages={retainedImages}
                    value={field.value as any[]}
                    onChange={handleImagesChange}
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
                  Your post has been updated. Redirecting...
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
