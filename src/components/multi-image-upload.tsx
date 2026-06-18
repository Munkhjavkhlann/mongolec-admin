"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { CREATE_PRESIGNED_UPLOAD_URL } from "@/graphql/mutations/merch";
import { toast } from "sonner";
import { Loader2, X, ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  initialUrls?: string[];
  className?: string;
  maxImages?: number;
}

export interface MultiImageUploadRef {
  uploadImages: () => Promise<string[]>;
}

interface ImageEntry {
  id: string;
  file: File | null;
  preview: string;
  uploaded: boolean;
}

export const MultiImageUpload = forwardRef<MultiImageUploadRef, MultiImageUploadProps>(
  ({ initialUrls = [], className, maxImages = 10 }, ref) => {
    const [entries, setEntries] = useState<ImageEntry[]>(() =>
      initialUrls.map((url, i) => ({
        id: `initial-${i}`,
        file: null,
        preview: url,
        uploaded: true,
      }))
    );
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [createPresignedUrl] = useMutation(CREATE_PRESIGNED_UPLOAD_URL);

    useImperativeHandle(ref, () => ({
      uploadImages: async () => {
        const results: string[] = [];

        for (const entry of entries) {
          if (entry.uploaded) {
            results.push(entry.preview);
            continue;
          }

          if (!entry.file) continue;

          const url = await uploadSingleFile(entry.file);
          if (url) {
            results.push(url);
          }
        }

        return results;
      },
    }));

    const uploadSingleFile = async (file: File): Promise<string | null> => {
      try {
        const { data } = await createPresignedUrl({
          variables: { fileType: file.type },
        });

        if (!data) throw new Error("Failed to get presigned URL");

        const { uploadUrl, fileUrl } = (data as any).createPresignedUploadUrl;

        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        return fileUrl;
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to upload image");
        } else {
          toast.error("An unknown error occurred during upload");
        }
        return null;
      }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      const remaining = maxImages - entries.length;
      const filesToAdd = files.slice(0, remaining);

      for (const file of filesToAdd) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select image files only");
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds the 10MB size limit`);
          continue;
        }

        const preview = await readFileAsDataUrl(file);
        const id = `new-${Date.now()}-${Math.random()}`;
        setEntries((prev) => [
          ...prev,
          { id, file, preview, uploaded: false },
        ]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const readFileAsDataUrl = (file: File): Promise<string> =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

    const handleRemove = (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const canAddMore = entries.length < maxImages;

    return (
      <div className={cn("space-y-3", className)}>
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading gallery images...
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className="relative w-24 h-24 group flex-shrink-0">
              <div className="relative w-full h-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={entry.preview}
                  alt="Gallery image"
                  fill
                  className="object-cover"
                  unoptimized={entry.preview.startsWith("data:")}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(entry.id)}
                className={cn(
                  "absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full",
                  "bg-destructive text-destructive-foreground shadow-md",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "flex items-center justify-center"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={cn(
                "w-24 h-24 rounded-lg border-2 border-dashed flex-shrink-0",
                "hover:border-primary hover:bg-muted/50 transition-colors",
                "flex flex-col items-center justify-center gap-1",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                uploading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Add photo</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {entries.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {entries.length} of {maxImages} images
          </p>
        )}

        {entries.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No gallery images. Click &quot;Add photo&quot; to upload.
          </p>
        )}
      </div>
    );
  }
);

MultiImageUpload.displayName = "MultiImageUpload";
