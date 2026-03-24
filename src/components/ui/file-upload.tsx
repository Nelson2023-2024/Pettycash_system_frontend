"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (file: File | undefined) => void;
  value?: File | string | null; // File for new upload, string for existing URL
  accept?: string;
  label?: string;
}

export function FileUpload({
  onChange,
  value,
  accept = "image/*,.pdf",
  label = "Click to upload",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    // if value is an existing URL string show it as preview
    typeof value === "string" ? value : null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileSelect(file: File) {
    onChange(file);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  function handleRemove() {
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const fileName = value instanceof File ? value.name : null;

  return (
    <div className="flex flex-col gap-2">
      {/* ── hidden input ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {/* ── image preview ── */}
      {preview ? (
        <div className="relative w-full">
          <Image
            width={500}
            height={500}
            src={preview}
            alt="Preview"
            className="w-full max-h-52 object-contain rounded-md border border-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : fileName ? (
        // ── PDF filename ──
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <span className="text-sm text-muted-foreground truncate">
            📄 {fileName}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 shrink-0 text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        // ── empty placeholder ──
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-8 text-muted-foreground hover:bg-muted/30 transition-colors"
        >
          <ImagePlus className="size-6 opacity-50" />
          <span className="text-sm">{label}</span>
          <span className="text-xs opacity-50">PNG, JPG, PDF up to 10MB</span>
        </button>
      )}
    </div>
  );
}
