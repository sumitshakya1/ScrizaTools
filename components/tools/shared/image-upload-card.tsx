"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, FileCheck, Clipboard, Sparkles } from "lucide-react";
import { ToolSectionCard } from "./tool-section-card";
import { inspectImageFile, formatFileSize, ImageMetadata } from "@/lib/image-engine";

interface ImageUploadCardProps {
  selectedFile: File | null;
  imageMetadata: ImageMetadata | null;
  previewUrl: string | null;
  onImageSelected: (file: File) => void;
  onClearImage: () => void;
  accept?: string;
  multiple?: boolean;
  onMultipleImagesSelected?: (files: File[]) => void;
  infoTooltip?: string;
}

export function ImageUploadCard({
  selectedFile,
  imageMetadata,
  previewUrl,
  onImageSelected,
  onClearImage,
  accept = "image/*,.heic,.heif,.webp,.svg,.ico,.bmp,.tiff",
  multiple = false,
  onMultipleImagesSelected,
  infoTooltip = "Select or drop an image file. All processing stays 100% in your browser.",
}: ImageUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Global clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileProcess(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    try {
      onImageSelected(file);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && onMultipleImagesSelected && files.length > 1) {
      onMultipleImagesSelected(Array.from(files));
    } else {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (multiple && onMultipleImagesSelected && files.length > 1) {
      onMultipleImagesSelected(Array.from(files));
    } else {
      handleFileProcess(files[0]);
    }
  };

  // Quick sample image loader for convenience
  const loadSampleImage = async () => {
    try {
      // Create a nice gradient canvas test image
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 1200;
      sampleCanvas.height = 800;
      const ctx = sampleCanvas.getContext("2d")!;

      const grad = ctx.createLinearGradient(0, 0, 1200, 800);
      grad.addColorStop(0, "#4338ca");
      grad.addColorStop(0.5, "#3b82f6");
      grad.addColorStop(1, "#06b6d4");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 800);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scriza High-Res Sample", 600, 380);

      ctx.font = "28px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText("1200 × 800 • 24-bit RGB Color", 600, 440);

      sampleCanvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], "sample-image.jpg", { type: "image/jpeg" });
          handleFileProcess(sampleFile);
        }
      }, "image/jpeg", 0.95);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ToolSectionCard
      title="Select Image"
      infoTooltip={infoTooltip}
      actionButton={
        selectedFile && (
          <button
            onClick={onClearImage}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary-fixed/20 scale-[0.99]"
              : "border-surface-dim bg-surface-low/30 hover:border-primary/50 hover:bg-white"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-low border border-surface-dim group-hover:bg-primary group-hover:text-white transition-colors duration-200 text-tertiary mb-3.5 shadow-sm">
            <UploadCloud className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-bold text-on-surface">
              Click to browse or drag &amp; drop an image
            </p>
            <p className="text-xs text-tertiary">
              Supports PNG, JPEG, WEBP, HEIC, GIF, SVG, ICO, BMP, TIFF (Up to 100MB)
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-all"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              BROWSE FILE
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                loadSampleImage();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim bg-white px-3.5 py-2 text-xs font-semibold text-tertiary hover:bg-surface-low hover:text-on-surface transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Load Sample Image
            </button>
          </div>

          <div className="mt-4 flex items-center gap-1 text-[11px] text-tertiary">
            <Clipboard className="h-3 w-3" />
            <span>Tip: You can also paste an image from clipboard (Ctrl+V)</span>
          </div>
        </div>
      ) : (
        /* Selected Image Preview Box matching RedKetchup metadata bar */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-surface-dim bg-surface-low/50 p-3.5">
            <div className="flex items-center gap-3 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected thumbnail"
                  className="h-12 w-12 rounded-lg border border-surface-dim object-cover shrink-0 bg-white"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-dim text-tertiary shrink-0">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-on-surface">
                  {selectedFile.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {imageMetadata && (
                    <>
                      <span className="inline-flex items-center text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {imageMetadata.width} × {imageMetadata.height} px
                      </span>
                      <span className="text-[11px] text-tertiary">
                        {formatFileSize(selectedFile.size)}
                      </span>
                      <span className="text-[11px] uppercase font-mono bg-surface-dim text-on-surface px-1.5 py-0.5 rounded">
                        {selectedFile.type.split("/")[1] || "image"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-surface-dim bg-white px-3 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-low transition-colors shadow-xs"
              >
                Change Image
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolSectionCard>
  );
}
