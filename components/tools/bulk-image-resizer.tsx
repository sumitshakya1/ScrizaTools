"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileArchive,
  Layers,
  Sparkles,
  CheckCircle,
  X,
  Download,
  Trash2,
  Lock,
  Loader2,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import {
  loadImage,
  inspectImageFile,
  processImageToCanvas,
  canvasToBlob,
  formatFileSize,
  createZipArchive,
  triggerFileDownload,
  ImageMetadata,
} from "@/lib/image-engine";

const BULK_FAQS: FAQItem[] = [
  {
    question: "How many images can I resize or convert at once?",
    answer:
      "You can upload dozens or even hundreds of images at once. Processing runs client-side sequentially and asynchronously without freezing your browser.",
  },
  {
    question: "How are the processed images delivered?",
    answer:
      "All resized and converted images are bundled together into a single downloadable .ZIP archive.",
  },
  {
    question: "Can I convert formats while resizing in bulk?",
    answer:
      "Yes! You can choose WEBP, JPEG, or PNG as your global export format for all files in the batch.",
  },
];

interface BulkItem {
  id: string;
  file: File;
  meta?: ImageMetadata;
  status: "pending" | "processing" | "done" | "error";
  processedBlob?: Blob;
  outputName: string;
}

export function BulkImageResizerTool() {
  const [items, setItems] = useState<BulkItem[]>([]);
  const [scalePercent, setScalePercent] = useState<number>(75);
  const [targetWidth, setTargetWidth] = useState<number>(1200);
  const [mode, setMode] = useState<"percent" | "width">("percent");
  const [targetFormat, setTargetFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const newItems: BulkItem[] = [];
    for (const file of files) {
      const id = Math.random().toString(36).substring(2, 9);
      newItems.push({
        id,
        file,
        status: "pending",
        outputName: file.name.replace(/\.[^/.]+$/, "") + "-resized",
      });
    }

    setItems((prev) => [...prev, ...newItems]);
    setZipBlob(null);

    // Read metadata asynchronously
    for (let i = 0; i < newItems.length; i++) {
      try {
        const meta = await inspectImageFile(newItems[i].file);
        setItems((current) =>
          current.map((item) =>
            item.id === newItems[i].id ? { ...item, meta } : item
          )
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClearAll = () => {
    setItems([]);
    setZipBlob(null);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleProcessBatch = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setZipBlob(null);

    const processedFiles: { name: string; blob: Blob }[] = [];
    const ext = targetFormat === "image/webp" ? ".webp" : targetFormat === "image/png" ? ".png" : ".jpg";

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "processing" } : it))
      );

      try {
        const img = await loadImage(item.file);
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        if (mode === "percent") {
          w = Math.round((w * scalePercent) / 100);
          h = Math.round((h * scalePercent) / 100);
        } else if (mode === "width" && targetWidth > 0) {
          const ratio = h / w;
          w = targetWidth;
          h = Math.round(w * ratio);
        }

        const canvas = await processImageToCanvas(
          img,
          { width: w, height: h },
          { format: targetFormat }
        );

        const blob = await canvasToBlob(canvas, targetFormat, quality / 100);
        const fileName = `${item.outputName}${ext}`;
        processedFiles.push({ name: fileName, blob });

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: "done", processedBlob: blob }
              : it
          )
        );
      } catch (err) {
        console.error(`Error processing ${item.file.name}:`, err);
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: "error" } : it))
        );
      }
    }

    try {
      const zip = await createZipArchive(processedFiles);
      setZipBlob(zip);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const [showCountdown, setShowCountdown] = useState(false);

  const handleDownloadZip = () => {
    if (!zipBlob) return;
    const isPro = typeof window !== "undefined" && localStorage.getItem("scriza_pro_active") === "true";
    if (isPro) {
      triggerFileDownload(zipBlob, "scriza-resized-images.zip");
    } else {
      setShowCountdown(true);
    }
  };

  const handleCountdownComplete = () => {
    if (zipBlob) {
      triggerFileDownload(zipBlob, "scriza-resized-images.zip");
    }
  };

  const loadSampleBatch = async () => {
    const samples = [
      { name: "sample-photo-1.jpg", color: "#4f46e5", label: "Sample Image 1 (1920x1080)" },
      { name: "sample-photo-2.jpg", color: "#0ea5e9", label: "Sample Image 2 (1280x720)" },
      { name: "sample-photo-3.jpg", color: "#10b981", label: "Sample Image 3 (800x600)" },
    ];

    const files: File[] = [];
    for (let i = 0; i < samples.length; i++) {
      const c = document.createElement("canvas");
      c.width = 1200;
      c.height = 800;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = samples[i].color;
      ctx.fillRect(0, 0, 1200, 800);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(samples[i].label, 600, 400);

      const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.9));
      files.push(new File([blob], samples[i].name, { type: "image/jpeg" }));
    }

    handleFilesSelected(files);
  };

  return (
    <ToolPageLayout
      toolId="bulk-image-resizer"
      title="Bulk Image Resizer"
      description="Resize, convert, and compress multiple images in batch with automatic ZIP package download."
      faqComponent={<FAQSection toolName="Bulk Image Resizer" items={BULK_FAQS} />}
    >
      {/* 1. Multi-file Select Dropzone Card */}
      <ToolSectionCard
        title="Select Images in Batch"
        infoTooltip="Choose multiple images to resize together."
        actionButton={
          items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All ({items.length})
            </button>
          )
        }
      >
        <div
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.accept = "image/*,.heic,.webp";
            input.onchange = (e: any) => {
              if (e.target.files?.length) {
                handleFilesSelected(Array.from(e.target.files));
              }
            };
            input.click();
          }}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-dim bg-surface-low/40 p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-white transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dim text-tertiary mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-on-surface">
            Click or drag &amp; drop multiple images here
          </p>
          <p className="text-xs text-tertiary mt-1">
            Supports PNG, JPEG, WEBP, HEIC, GIF, BMP (Batch limit: up to 100 files)
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              BROWSE MULTIPLE FILES
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                loadSampleBatch();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim bg-white px-3.5 py-2 text-xs font-semibold text-tertiary hover:bg-surface-low hover:text-on-surface transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Load Sample Batch (3 Images)
            </button>
          </div>
        </div>
      </ToolSectionCard>

      {items.length > 0 && (
        <>
          {/* 2. Global Batch Settings Card */}
          <ToolSectionCard
            title="Batch Resize &amp; Format Settings"
            subtitle="These settings will be applied to all uploaded images."
            infoTooltip="Configure global dimensions and export format for the entire batch."
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Mode toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Resize Method
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold"
                  >
                    <option value="percent">Scale by Percentage (%)</option>
                    <option value="width">Target Width (Keep Aspect Ratio)</option>
                  </select>
                </div>

                {mode === "percent" ? (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface">
                      Scale Percentage ({scalePercent}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={scalePercent}
                      onChange={(e) => setScalePercent(Number(e.target.value))}
                      className="w-full h-2 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface">
                      Target Width (px)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="5000"
                      value={targetWidth}
                      onChange={(e) => setTargetWidth(Number(e.target.value))}
                      className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                )}

                {/* Output Format */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Export Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold"
                  >
                    <option value="image/jpeg">JPEG (Standard Photo)</option>
                    <option value="image/webp">WEBP (High Compression)</option>
                    <option value="image/png">PNG (Lossless Sharpness)</option>
                  </select>
                </div>
              </div>
            </div>
          </ToolSectionCard>

          {/* 3. Items Queue Table */}
          <ToolSectionCard
            title={`Batch Queue (${items.length} Images)`}
            infoTooltip="Review each image in your queue before starting processing."
          >
            <div className="divide-y divide-surface-dim max-h-80 overflow-y-auto">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between py-3 px-2 text-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-tertiary w-5 text-right">
                      {idx + 1}.
                    </span>
                    <span className="font-bold text-on-surface truncate max-w-xs">
                      {it.file.name}
                    </span>
                    <span className="text-tertiary">
                      ({formatFileSize(it.file.size)})
                    </span>
                    {it.meta && (
                      <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {it.meta.width} × {it.meta.height} px
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {it.status === "processing" && (
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Processing
                      </span>
                    )}
                    {it.status === "done" && (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Done
                      </span>
                    )}
                    {it.status === "pending" && (
                      <span className="text-tertiary">Ready</span>
                    )}
                    <button
                      onClick={() => handleRemoveItem(it.id)}
                      className="text-tertiary hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-dim mt-4">
              <span className="text-xs text-tertiary">
                Total Files: <strong>{items.length}</strong>
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!zipBlob ? (
                  <button
                    type="button"
                    onClick={handleProcessBatch}
                    disabled={isProcessing}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-all disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>PROCESSING BATCH...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>START BULK RESIZE</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>DOWNLOAD ALL AS .ZIP ({formatFileSize(zipBlob.size)})</span>
                  </button>
                )}
              </div>
            </div>
          </ToolSectionCard>

          {/* 30-Second Countdown Modal for ZIP batch download */}
          <DownloadCountdownModal
            isOpen={showCountdown}
            durationSeconds={30}
            fileName="scriza-resized-images.zip"
            onComplete={handleCountdownComplete}
            onClose={() => setShowCountdown(false)}
          />
        </>
      )}
    </ToolPageLayout>
  );
}
