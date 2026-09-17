"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Crop as CropIcon,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Grid,
  Maximize,
  Sparkles,
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

const CROPPER_FAQS: FAQItem[] = [
  {
    question: "What aspect ratio presets are available?",
    answer:
      "We provide instant 1-click aspect ratio presets including 1:1 (Square Profile), 16:9 (YouTube & widescreen), 9:16 (TikTok & Instagram Reels), 4:5 (Instagram Feed Portrait), 4:3 (Standard Photo), and 3:2 (DSLR Classic).",
  },
  {
    question: "How do I crop to an exact pixel dimension?",
    answer:
      "You can directly enter numeric pixel values for Left (X), Top (Y), Width, and Height in the Crop Coordinates panel.",
  },
  {
    question: "Can I rotate or flip my image before cropping?",
    answer:
      "Yes, use the Rotate and Flip buttons to orient your photo perfectly before establishing your crop boundaries.",
  },
];

export function ImageCropperTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Crop Box state in original image pixels
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number>(0);
  const [cropHeight, setCropHeight] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<string>("free");
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Transforms
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Output Preview
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    try {
      const meta = await inspectImageFile(file);
      setMetadata(meta);
      const img = await loadImage(file);
      setLoadedImage(img);
      setPreviewUrl(img.src);

      // Default crop to full image
      setCropX(0);
      setCropY(0);
      setCropWidth(meta.width);
      setCropHeight(meta.height);
      setSelectedPreset("free");
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
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

  // Preset aspect ratio handler
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (!metadata) return;

    const origW = metadata.width;
    const origH = metadata.height;

    let targetRatio: number | null = null;
    if (preset === "1:1") targetRatio = 1;
    else if (preset === "16:9") targetRatio = 16 / 9;
    else if (preset === "9:16") targetRatio = 9 / 16;
    else if (preset === "4:3") targetRatio = 4 / 3;
    else if (preset === "4:5") targetRatio = 4 / 5;
    else if (preset === "3:2") targetRatio = 3 / 2;

    if (targetRatio === null) {
      // Freeform: reset to full
      setCropX(0);
      setCropY(0);
      setCropWidth(origW);
      setCropHeight(origH);
      return;
    }

    let newW = origW;
    let newH = Math.round(newW / targetRatio);

    if (newH > origH) {
      newH = origH;
      newW = Math.round(newH * targetRatio);
    }

    const newX = Math.round((origW - newW) / 2);
    const newY = Math.round((origH - newH) / 2);

    setCropX(newX);
    setCropY(newY);
    setCropWidth(newW);
    setCropHeight(newH);
  };

  // Live Canvas Crop update
  useEffect(() => {
    if (!loadedImage || cropWidth <= 0 || cropHeight <= 0) return;

    let isMounted = true;
    const updatePreview = async () => {
      try {
        const canvas = await processImageToCanvas(
          loadedImage,
          {
            crop: { x: cropX, y: cropY, width: cropWidth, height: cropHeight },
            rotate: rotation,
            flipHorizontal: flipH,
            flipVertical: flipV,
          },
          { format: "image/png" }
        );

        if (!isMounted) return;

        if (previewCanvasRef.current) {
          const preview = previewCanvasRef.current;
          preview.width = canvas.width;
          preview.height = canvas.height;
          const ctx = preview.getContext("2d");
          ctx?.drawImage(canvas, 0, 0);
        }

        const blob = await canvasToBlob(canvas, "image/png", 0.92);
        if (isMounted) setOutputBlob(blob);
      } catch (e) {
        console.error("Preview render failed:", e);
      }
    };

    const timer = setTimeout(updatePreview, 60);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadedImage, cropX, cropY, cropWidth, cropHeight, rotation, flipH, flipV]);

  const handleDownload = (options: ExportOptions) => {
    if (!loadedImage) return;
    try {
      const canvas = processImageToCanvas(
        loadedImage,
        {
          crop: { x: cropX, y: cropY, width: cropWidth, height: cropHeight },
          rotate: rotation,
          flipHorizontal: flipH,
          flipVertical: flipV,
        },
        options
      );

      downloadCanvasDirectly(
        canvas,
        options.fileName || "cropped-image.png",
        options.format || "image/png",
        options.quality || 0.92
      );
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  const presets = [
    { id: "free", label: "Freeform" },
    { id: "1:1", label: "1:1 Square" },
    { id: "16:9", label: "16:9 Cinema" },
    { id: "9:16", label: "9:16 Story / Reel" },
    { id: "4:5", label: "4:5 Portrait" },
    { id: "4:3", label: "4:3 Standard" },
    { id: "3:2", label: "3:2 Photo" },
  ];

  return (
    <ToolPageLayout
      toolId="image-cropper"
      title="Image Cropper"
      description="Crop photos to custom dimensions, social media ratios (1:1, 16:9, 9:16), or freeform shapes with millimeter precision."
      faqComponent={<FAQSection toolName="Image Cropper" items={CROPPER_FAQS} />}
    >
      {/* 1. Upload Card */}
      <ImageUploadCard
        selectedFile={selectedFile}
        imageMetadata={metadata}
        previewUrl={previewUrl}
        onImageSelected={handleImageSelected}
        onClearImage={handleClearImage}
        infoTooltip="Select an image file to crop."
      />

      {selectedFile && metadata && (
        <>
          {/* 2. Crop Controls Card matching RedKetchup */}
          <ToolSectionCard
            title="Crop Image"
            subtitle="Choose an aspect ratio preset or adjust pixel coordinates."
            infoTooltip="Use aspect ratio buttons or enter exact pixel crop values."
          >
            <div className="space-y-6">
              {/* Presets Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface">
                  Aspect Ratio Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedPreset === p.id
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface-low border border-surface-dim text-on-surface hover:bg-surface-dim"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pixel Coordinates Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-low/50 p-4 rounded-xl border border-surface-dim">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-tertiary">Left (X)</label>
                  <input
                    type="number"
                    min="0"
                    max={metadata.width - 1}
                    value={cropX}
                    onChange={(e) => setCropX(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border border-surface-dim bg-white px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-tertiary">Top (Y)</label>
                  <input
                    type="number"
                    min="0"
                    max={metadata.height - 1}
                    value={cropY}
                    onChange={(e) => setCropY(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border border-surface-dim bg-white px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-tertiary">Crop Width</label>
                  <input
                    type="number"
                    min="1"
                    max={metadata.width - cropX}
                    value={cropWidth}
                    onChange={(e) => setCropWidth(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-surface-dim bg-white px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-tertiary">Crop Height</label>
                  <input
                    type="number"
                    min="1"
                    max={metadata.height - cropY}
                    value={cropHeight}
                    onChange={(e) => setCropHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-surface-dim bg-white px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Rotate and Flip Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim bg-white px-3 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-low"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Rotate -90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim bg-white px-3 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-low"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Rotate +90°
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    flipH ? "border-primary bg-primary-fixed text-primary" : "border-surface-dim bg-white"
                  }`}
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  Flip H
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    flipV ? "border-primary bg-primary-fixed text-primary" : "border-surface-dim bg-white"
                  }`}
                >
                  <FlipVertical className="h-3.5 w-3.5" />
                  Flip V
                </button>
              </div>

              {/* Cropped Preview Canvas */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">
                    Cropped Output Preview
                  </label>
                  <span className="text-xs font-mono font-bold text-primary">
                    {cropWidth} × {cropHeight} px
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-xl border border-surface-dim bg-surface-low/50 p-4 max-h-[350px] overflow-auto">
                  <canvas
                    ref={previewCanvasRef}
                    className="max-h-[300px] w-auto object-contain rounded shadow-sm border border-surface-dim bg-white"
                  />
                </div>
              </div>
            </div>
          </ToolSectionCard>

          {/* 3. Save Image Card */}
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
