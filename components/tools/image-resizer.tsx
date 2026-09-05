"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Lock,
  Unlock,
  RefreshCw,
  Sparkles,
  Crop as CropIcon,
  Sliders,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ImageUploadCard } from "./shared/image-upload-card";
import { SaveImageCard } from "./shared/save-image-card";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import {
  loadImage,
  inspectImageFile,
  processImageToCanvas,
  canvasToBlob,
  downloadCanvasDirectly,
  downloadCanvas,
  triggerFileDownload,
  ImageMetadata,
  ExportOptions,
} from "@/lib/image-engine";

const RESIZER_FAQS: FAQItem[] = [
  {
    question: "How do I resize an image without losing quality?",
    answer:
      "Scriza Image Resizer uses multi-step downsampling and high-fidelity bilinear/bicubic interpolation filters to preserve edge sharpness and fine details. Simply keep 'Lock Aspect Ratio' checked so your image dimensions scale proportionally without stretching or distortion.",
  },
  {
    question: "Are my uploaded photos safe and private?",
    answer:
      "Yes, 100%! All resizing, cropping, and encoding operations are executed directly inside your web browser using HTML5 Canvas APIs. Your images are never sent to any remote server or stored in any database.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can open and resize PNG, JPEG, WEBP, HEIC, GIF, ICO, BMP, TIFF, and SVG files, and export them into PNG, JPEG, WEBP, GIF, ICO, or BMP formats.",
  },
  {
    question: "Can I crop and rotate the image before resizing?",
    answer:
      "Yes! The Crop & Orientation section lets you rotate by 90° increments, flip horizontally/vertically, and select precise aspect ratio presets like 1:1, 16:9, or custom pixel boundaries.",
  },
];

export function ImageResizerTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Resize Settings
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [resamplingFilter, setResamplingFilter] = useState<"bilinear" | "bicubic" | "nearest" | "lanczos">("bilinear");

  // Crop & Transform Settings
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [cropAspect, setCropAspect] = useState<string>("free");

  // Processing & Output
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // When a new image is selected
  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    try {
      const meta = await inspectImageFile(file);
      setMetadata(meta);
      setTargetWidth(meta.width);
      setTargetHeight(meta.height);
      setScalePercent(100);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);

      const img = await loadImage(file);
      setLoadedImage(img);
      setPreviewUrl(img.src);
    } catch (err) {
      console.error("Error loading image:", err);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setMetadata(null);
    setPreviewUrl(null);
    setLoadedImage(null);
    setOutputBlob(null);
  };

  // Width change handler with aspect ratio sync
  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && metadata && metadata.width > 0) {
      const ratio = metadata.height / metadata.width;
      setTargetHeight(Math.round(val * ratio));
      setScalePercent(Math.round((val / metadata.width) * 100));
    }
  };

  // Height change handler with aspect ratio sync
  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && metadata && metadata.height > 0) {
      const ratio = metadata.width / metadata.height;
      setTargetWidth(Math.round(val * ratio));
      setScalePercent(Math.round((val / metadata.height) * 100));
    }
  };

  // Scale % change handler
  const handleScaleChange = (percent: number) => {
    setScalePercent(percent);
    if (metadata) {
      setTargetWidth(Math.round((metadata.width * percent) / 100));
      setTargetHeight(Math.round((metadata.height * percent) / 100));
    }
  };

  // Redraw preview canvas whenever settings change
  useEffect(() => {
    if (!loadedImage || targetWidth <= 0 || targetHeight <= 0) return;

    let isMounted = true;
    const updatePreview = async () => {
      try {
        const canvas = processImageToCanvas(
          loadedImage,
          {
            width: targetWidth,
            height: targetHeight,
            lockAspectRatio: false,
            rotate: rotation,
            flipHorizontal: flipH,
            flipVertical: flipV,
            resamplingFilter,
          },
          { format: "image/png" }
        );

        if (!isMounted) return;

        // Update preview canvas in UI
        if (previewCanvasRef.current) {
          const previewCanvas = previewCanvasRef.current;
          previewCanvas.width = canvas.width;
          previewCanvas.height = canvas.height;
          const ctx = previewCanvas.getContext("2d");
          ctx?.drawImage(canvas, 0, 0);
        }

        // Generate preliminary blob for size estimation
        const blob = await canvasToBlob(canvas, "image/png", 0.9);
        if (isMounted) setOutputBlob(blob);
      } catch (err) {
        console.error("Preview render failed:", err);
      }
    };

    const timer = setTimeout(updatePreview, 60);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadedImage, targetWidth, targetHeight, rotation, flipH, flipV, resamplingFilter]);

  // Final Download Handler
  const handleDownload = (options: ExportOptions) => {
    if (!loadedImage) return;
    try {
      const canvas = processImageToCanvas(
        loadedImage,
        {
          width: targetWidth,
          height: targetHeight,
          rotate: rotation,
          flipHorizontal: flipH,
          flipVertical: flipV,
          resamplingFilter,
        },
        options
      );

      downloadCanvasDirectly(
        canvas,
        options.fileName || "resized-image.png",
        options.format || "image/png",
        options.quality || 0.92
      );
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <ToolPageLayout
      toolId="image-resizer"
      title="Image Resizer"
      description="Resize, crop, and transform PNG, JPEG, WEBP, or HEIC images by exact pixels, percentage, or ratio with studio-grade sharpness."
      faqComponent={<FAQSection toolName="Image Resizer" items={RESIZER_FAQS} />}
    >
      {/* 1. Select Image Section */}
      <ImageUploadCard
        selectedFile={selectedFile}
        imageMetadata={metadata}
        previewUrl={previewUrl}
        onImageSelected={handleImageSelected}
        onClearImage={handleClearImage}
        infoTooltip="Select or drop any image file. You can also paste directly from clipboard (Ctrl+V)."
      />

      {selectedFile && metadata && (
        <>
          {/* 2. Crop & Transform Section (Matching RedKetchup Card) */}
          <ToolSectionCard
            title="Crop & Transform"
            subtitle="Rotate, flip, or change image orientation before resizing."
            collapsible
            defaultOpen={true}
            infoTooltip="Apply rotation or flip transformations to your image."
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Rotate Left */}
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim bg-white px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-low hover:text-primary transition-colors shadow-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Rotate -90°
                </button>

                {/* Rotate Right */}
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim bg-white px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-low hover:text-primary transition-colors shadow-xs"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Rotate +90°
                </button>

                {/* Flip H */}
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors shadow-xs ${
                    flipH
                      ? "border-primary bg-primary-fixed text-primary"
                      : "border-surface-dim bg-white text-on-surface hover:bg-surface-low"
                  }`}
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  Flip Horizontal
                </button>

                {/* Flip V */}
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors shadow-xs ${
                    flipV
                      ? "border-primary bg-primary-fixed text-primary"
                      : "border-surface-dim bg-white text-on-surface hover:bg-surface-low"
                  }`}
                >
                  <FlipVertical className="h-3.5 w-3.5" />
                  Flip Vertical
                </button>

                {(rotation !== 0 || flipH || flipV) && (
                  <button
                    type="button"
                    onClick={() => {
                      setRotation(0);
                      setFlipH(false);
                      setFlipV(false);
                    }}
                    className="text-xs font-semibold text-tertiary hover:text-rose-600 px-2 py-1 transition-colors ml-auto"
                  >
                    Reset Transforms
                  </button>
                )}
              </div>

              {rotation !== 0 && (
                <div className="text-xs font-semibold text-primary bg-primary-fixed/30 px-3 py-1.5 rounded-md inline-block">
                  Current Angle: {rotation}°
                </div>
              )}
            </div>
          </ToolSectionCard>

          {/* 3. Resize Image Section (Matching RedKetchup Controls) */}
          <ToolSectionCard
            title="Resize Image"
            subtitle="Change pixel dimensions or scale by percentage."
            infoTooltip="Enter exact pixel width and height or use quick percentage presets."
          >
            <div className="space-y-5">
              {/* Width / Height / Lock Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                {/* Width */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Width (px)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-mono font-bold text-on-surface shadow-xs focus:border-primary focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-tertiary">
                      px
                    </span>
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Height (px)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-mono font-bold text-on-surface shadow-xs focus:border-primary focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-tertiary">
                      px
                    </span>
                  </div>
                </div>

                {/* Lock Aspect Ratio Toggle */}
                <div className="space-y-1.5 sm:col-span-2 md:col-span-1 flex flex-col justify-end">
                  <label
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer select-none transition-colors shadow-xs ${
                      lockAspectRatio
                        ? "border-primary bg-primary-fixed/40 text-primary font-bold"
                        : "border-surface-dim bg-white text-tertiary font-semibold"
                    }`}
                  >
                    {lockAspectRatio ? (
                      <Lock className="h-4 w-4 text-primary" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                    <span className="text-xs">Lock Aspect Ratio</span>
                  </label>
                </div>
              </div>

              {/* Scale Percentage Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">
                    Scale Percentage ({scalePercent}%)
                  </label>
                  <span className="text-xs text-tertiary">
                    Original: {metadata.width} × {metadata.height} px
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[25, 50, 75, 100, 150, 200].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleScaleChange(pct)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        scalePercent === pct
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface-low border border-surface-dim text-on-surface hover:bg-surface-dim"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleScaleChange(100)}
                    className="text-xs text-tertiary hover:text-primary px-2 py-1 font-semibold transition-colors"
                  >
                    Reset (100%)
                  </button>
                </div>
              </div>

              {/* Resampling Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface-dim">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Resampling Filter
                  </label>
                  <select
                    value={resamplingFilter}
                    onChange={(e) => setResamplingFilter(e.target.value as any)}
                    className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-xs focus:border-primary focus:outline-none"
                  >
                    <option value="bilinear">Bilinear (Smooth details, standard)</option>
                    <option value="bicubic">Bicubic (Sharpest edges for photos)</option>
                    <option value="nearest">Nearest Neighbor (Pixel art, crisp retro)</option>
                  </select>
                </div>

                <div className="flex items-center text-xs text-tertiary pt-4">
                  <span>
                    Current Output:{" "}
                    <strong className="text-on-surface">
                      {targetWidth} × {targetHeight} px
                    </strong>
                  </span>
                </div>
              </div>

              {/* Live Canvas Preview Panel */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-on-surface">
                    Live Resized Preview
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-md border border-primary/20">
                      Output: {targetWidth} × {targetHeight} px ({scalePercent}%)
                    </span>
                    {metadata && (
                      <span className="text-xs font-semibold text-tertiary hidden sm:inline">
                        (Original: {metadata.width} × {metadata.height} px)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-xl border border-surface-dim bg-surface-low/50 p-6 overflow-auto min-h-[280px] max-h-[480px]">
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(20, scalePercent))}%`,
                      maxWidth: "100%",
                      transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className="flex justify-center transition-all duration-300"
                  >
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full h-auto object-contain rounded-lg shadow-md border border-surface-dim bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ToolSectionCard>

          {/* 4. Save Image Section */}
          <SaveImageCard
            onDownload={handleDownload}
            outputBlob={outputBlob}
            originalFileName={selectedFile.name}
            isProcessing={isProcessing}
          />
        </>
      )}
    </ToolPageLayout>
  );
}
