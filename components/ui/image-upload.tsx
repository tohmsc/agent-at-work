"use client";

import { useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  className?: string;
  label: string;
  accept?: string;
}

export function ImageUpload({ onChange, value, className, label, accept = "image/*" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onChange(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {preview && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setPreview(null);
            }}
            className="text-sm text-destructive hover:text-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <Input
          type="file"
          onChange={handleChange}
          accept={accept}
          className="cursor-pointer file:cursor-pointer"
        />
      )}
    </div>
  );
} 