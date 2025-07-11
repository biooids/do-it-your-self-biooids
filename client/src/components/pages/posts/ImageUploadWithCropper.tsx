"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { dataURLtoFile } from "@/components/shared/dataURLtoFile";

// --- Import the type for existing images ---
import { PostImageDto } from "@/lib/features/post/postTypes";

// UI Components & Icons
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadCloud, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageCropper from "@/components/shared/ImageCropper";

// =======================================================
// === STEP 1: UPDATE THE PROPS INTERFACE ===
// =======================================================
interface ImageUploadWithCropperProps {
  value: File[]; // This will hold NEWLY added files

  // FIX: Change the signature to report back both new and retained images
  onChange: (newFiles: File[], retainedImages: PostImageDto[]) => void;

  maxFiles?: number;

  // ADD: A prop to accept images that already exist on the post
  existingImages?: PostImageDto[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploadWithCropper({
  value = [],
  onChange,
  maxFiles = 5,
  existingImages = [], // Initialize with an empty array
}: ImageUploadWithCropperProps) {
  // State for NEW file previews
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);

  // State for EXISTING images that haven't been deleted by the user
  const [retainedImages, setRetainedImages] =
    useState<PostImageDto[]>(existingImages);

  const [error, setError] = useState<string | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);

  // Sync component's internal state when the initial existingImages prop is loaded
  useEffect(() => {
    setRetainedImages(existingImages);
  }, [existingImages]);

  // Sync previews for NEWLY added files
  useEffect(() => {
    const objectUrls = value.map((file) => URL.createObjectURL(file));
    setNewFilePreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  const totalImageCount = retainedImages.length + value.length;

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => setCroppingImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".gif", ".webp"] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: totalImageCount >= maxFiles,
  });

  const handleCropComplete = (croppedImageBase64: string) => {
    const newFile = dataURLtoFile(
      croppedImageBase64,
      `post-image-${Date.now()}.png`
    );
    if (newFile) {
      const newFilesArray = [...value, newFile];
      // Call onChange with the updated new files and the current retained images
      onChange(newFilesArray, retainedImages);
    }
    setCroppingImage(null);
  };

  // =======================================================
  // === STEP 2: UPDATE THE REMOVAL LOGIC ===
  // =======================================================

  const removeNewFile = (indexToRemove: number) => {
    const newFilesArray = value.filter((_, index) => index !== indexToRemove);
    // Call onChange with the updated new files and the current retained images
    onChange(newFilesArray, retainedImages);
  };

  const removeExistingFile = (idToRemove: string) => {
    const newRetainedArray = retainedImages.filter(
      (img) => img.id !== idToRemove
    );
    setRetainedImages(newRetainedArray);
    // Call onChange with the current new files and the UPDATED retained images
    onChange(value, newRetainedArray);
  };

  return (
    <div className="space-y-4">
      {totalImageCount < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <UploadCloud className="h-12 w-12 mb-4" />
            <p className="font-semibold">
              Drag & drop an image or click to select
            </p>
            <p className="text-xs mt-1">
              ({totalImageCount}/{maxFiles}) Added
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {/* ======================================================= */}
      {/* === STEP 3: UPDATE THE DISPLAY LOGIC === */}
      {/* ======================================================= */}
      {totalImageCount > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {/* Render Existing Images */}
          {retainedImages.map((image) => (
            <div key={image.id} className="relative group aspect-square">
              <Image
                src={image.url}
                alt="Existing image"
                fill
                className="object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeExistingFile(image.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Render Previews of NEWLY Added Files */}
          {newFilePreviews.map((src, index) => (
            <div key={src} className="relative group aspect-square">
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeNewFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Cropper Dialog (No changes needed here) */}
      <Dialog
        open={!!croppingImage}
        onOpenChange={(isOpen) => !isOpen && setCroppingImage(null)}
      >
        <DialogContent className="sm:max-w-lg p-0">
          <DialogHeader className="p-4 sm:p-6 border-b">
            <DialogTitle>Crop Your Image</DialogTitle>
            <DialogDescription>
              Adjust the selection to fit your desired image area.
            </DialogDescription>
          </DialogHeader>
          {croppingImage && (
            <ImageCropper
              imageSrc={croppingImage}
              aspect={16 / 9}
              onCropDone={handleCropComplete}
              onCancel={() => setCroppingImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
