"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Sliders,
  FileCheck,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ImageUploadCard } from "./shared/image-upload-card";
import { SaveImageCard } from "./shared/save-image-card";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import {
  loadImage,
  inspectImageFile,
  formatFileSize,
  processImageToCanvas,
  compressImageClient,
  downloadCanvasDirectly,
  downloadCanvas,
  triggerFileDownload,
  ImageMetadata,
  ExportOptions,
} from "@/lib/image-engine";

const COMPRESSOR_FAQS: FAQItem[] = [
  {
    question: "How does the Image Compressor reduce file size?",
    answer:
      "ToolOn Image Compressor uses advanced browser-native encoding algorithms to optimize color quantization, remove redundant EXIF metadata, and adjust compression factors without degrading perceptible visual sharpness.",
  },
  {
    question: "Can I specify an exact target size in KB or MB?",
    answer:
      "Yes! Switch the compression mode to 'Target File Size' and enter your desired maximum KB limit (e.g. 200 KB for passport/portal uploads). The engine will automatically calculate the best matching quality.",
  },
  {
    question: "Will compressing an image make it look blurry?",
    answer:
      "Not at all. Standard 75%–85% quality compression typically cuts 60%–80% of the byte weight with zero noticeable blur or artifacting on Retina and HD screens.",
  },
  {
    question: "Is there any limit to how many images I can compress?",
    answer:
      "Zero limits! Because all processing runs right inside your browser, you can compress as many photos as you want with no wait times, daily quotas, or subscriptions.",
  },
];

export function ImageCompressorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Compression Controls
  const [compressionMode, setCompressionMode] = useState<"quality" | "targetSize">("quality");
  const [quality, setQuality] = useState<number>(80);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(250);
  const [targetFormat, setTargetFormat] = useState<string>("image/jpeg");
  const [useDithering, setUseDithering] = useState<boolean>(true);

  // Compression Results
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [savingsPercent, setSavingsPercent] = useState<number>(0);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    try {
      const meta = await inspectImageFile(file);
      setMetadata(meta);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Default target size to roughly 40% of original
      const initialTarget = Math.max(50, Math.round((file.size * 0.4) / 1024));
      setTargetSizeKB(initialTarget);
      setTargetFormat(file.type.includes("png") ? "image/webp" : "image/jpeg");
    } catch (err) {
      console.error("Error loading image:", err);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setMetadata(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedPreviewUrl(null);
    setSavingsPercent(0);
  };

  // Re-run compression whenever settings change
  useEffect(() => {
    if (!selectedFile) return;

    let isMounted = true;
    const runCompression = async () => {
      setIsCompressing(true);
      try {
        const result = await compressImageClient(selectedFile, {
          quality,
          targetSizeKB: compressionMode === "targetSize" ? targetSizeKB : undefined,
          format: targetFormat,
        });

        if (!isMounted) return;

        setCompressedBlob(result.blob);
        setSavingsPercent(result.reductionPercent);

        if (compressedPreviewUrl) {
          URL.revokeObjectURL(compressedPreviewUrl);
        }
        setCompressedPreviewUrl(URL.createObjectURL(result.blob));
      } catch (err) {
        console.error("Compression failed:", err);
      } finally {
        if (isMounted) setIsCompressing(false);
      }
    };

    const timer = setTimeout(runCompression, 120);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedFile, quality, targetSizeKB, compressionMode, targetFormat]);

  const handleDownload = (options: ExportOptions) => {
    if (!selectedFile) return;
    try {
      if (compressedBlob && (options.format === targetFormat || !options.format)) {
        triggerFileDownload(compressedBlob, options.fileName || `compressed-${selectedFile.name}`);
      } else if (previewUrl) {
        const img = new Image();
        img.src = previewUrl;
        img.onload = () => {
          const canvas = processImageToCanvas(img, {}, options);
          downloadCanvasDirectly(
            canvas,
            options.fileName || `compressed-${selectedFile.name}`,
            options.format || targetFormat,
            quality / 100
          );
        };
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <ToolPageLayout
      toolId="image-compressor"
      title="Image Compressor"
      description="Reduce PNG, JPEG, WEBP, and HEIC image file sizes up to 85% while retaining maximum visual clarity."
      faqComponent={<FAQSection toolName="Image Compressor" items={COMPRESSOR_FAQS} />}
    >
      {/* 1. Upload Card */}
      <ImageUploadCard
        selectedFile={selectedFile}
        imageMetadata={metadata}
        previewUrl={previewUrl}
        onImageSelected={handleImageSelected}
        onClearImage={handleClearImage}
        infoTooltip="Upload or drop any image file to instantly compress."
      />

      {selectedFile && metadata && (
        <>
          {/* 2. Compress Settings Card matching RedKetchup */}
          <ToolSectionCard
            title="Compress Image"
            subtitle="Adjust compression mode, quality slider, or target file size."
            infoTooltip="Fine-tune your compression balance between small size and visual fidelity."
          >
            <div className="space-y-6">
              {/* Compression Mode Selector Tabs */}
              <div className="flex rounded-lg border border-surface-dim bg-surface-low p-1 max-w-md">
                <button
                  type="button"
                  onClick={() => setCompressionMode("quality")}
                  className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                    compressionMode === "quality"
                      ? "bg-white text-primary shadow-xs"
                      : "text-tertiary hover:text-on-surface"
                  }`}
                >
                  Quality Mode (Slider)
                </button>
                <button
                  type="button"
                  onClick={() => setCompressionMode("targetSize")}
                  className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                    compressionMode === "targetSize"
                      ? "bg-white text-primary shadow-xs"
                      : "text-tertiary hover:text-on-surface"
                  }`}
                >
                  Target File Size (KB/MB)
                </button>
              </div>

              {/* Mode 1: Quality Slider */}
              {compressionMode === "quality" ? (
                <div className="space-y-3 bg-surface-low/40 p-4 rounded-xl border border-surface-dim">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-primary" />
                      Quality Level: {quality}%
                    </label>
                    <span className="text-xs font-semibold text-tertiary">
                      {quality >= 85 ? "Maximum Sharpness" : quality >= 60 ? "Balanced (Recommended)" : "High Compression"}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2.5 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex justify-between text-[11px] text-tertiary">
                    <span>5% (Smallest File)</span>
                    <span>50%</span>
                    <span>80% (Sweet Spot)</span>
                    <span>100% (Lossless)</span>
                  </div>
                </div>
              ) : (
                /* Mode 2: Target File Size Input */
                <div className="space-y-3 bg-surface-low/40 p-4 rounded-xl border border-surface-dim max-w-md">
                  <label className="block text-xs font-bold text-on-surface">
                    Target Maximum File Size (KB)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max={Math.round(selectedFile.size / 1024)}
                      value={targetSizeKB}
                      onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                      className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-mono font-bold text-on-surface shadow-xs focus:border-primary focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-tertiary">
                      KB
                    </span>
                  </div>
                  <p className="text-[11px] text-tertiary">
                    The engine will automatically pick the highest quality that fits under {targetSizeKB} KB.
                  </p>
                </div>
              )}

              {/* Output Format selector for compressor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Compress As Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-xs focus:border-primary focus:outline-none"
                  >
                    <option value="image/webp">WEBP (Best compression &amp; transparency)</option>
                    <option value="image/jpeg">JPEG (Standard photo compatibility)</option>
                    <option value="image/png">PNG (Lossless &amp; sharp graphics)</option>
                  </select>
                </div>
              </div>

              {/* Compression Real-Time Savings Comparison Widget */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4" />
                      Compression Result
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
                        {compressedBlob ? formatFileSize(compressedBlob.size) : "Calculating..."}
                      </span>
                      <span className="text-xs text-tertiary line-through">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>

                  {savingsPercent > 0 && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-black text-white shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{savingsPercent}% SMALLER</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compressed Image Live Preview */}
              {compressedPreviewUrl && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-on-surface">
                    Compressed Image Preview
                  </label>
                  <div className="flex items-center justify-center rounded-xl border border-surface-dim bg-surface-low/40 p-4 max-h-[350px] overflow-auto">
                    <img
                      src={compressedPreviewUrl}
                      alt="Compressed preview"
                      className="max-h-[300px] w-auto object-contain rounded shadow-sm bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </ToolSectionCard>

          {/* 3. Save Image Card */}
          <SaveImageCard
            onDownload={handleDownload}
            outputBlob={compressedBlob}
            defaultFormat={targetFormat}
            originalFileName={selectedFile.name}
            isProcessing={isCompressing}
          />
        </>
      )}
    </ToolPageLayout>
  );
}
