"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Layers,
  Sparkles,
  CheckCircle,
  X,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  FileUp,
  Maximize2,
  Sliders,
  Settings2,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { ProcessingProgress } from "./shared/processing-progress";
import {
  generatePdfFromImages,
  PDFImageItem,
  PDFExportOptions,
} from "@/lib/pdf-engine";
import { formatFileSize } from "@/lib/image-engine";

const PDF_FAQS: FAQItem[] = [
  {
    question: "How do I convert images to a single PDF document?",
    answer:
      "Simply drag and drop your photos into the upload box. Re-order them as needed, choose your page size (A4 or US Letter) and margins, then click 'Download PDF'. All images will be merged into a single multi-page PDF document.",
  },
  {
    question: "Are my photos uploaded to any external server?",
    answer:
      "No! ToolOn's Images to PDF converter is 100% client-side. The entire PDF compilation runs locally in your web browser via WebAssembly and HTML5 Canvas. Your sensitive documents, receipts, and personal photos never leave your device.",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "You can upload JPG, JPEG, PNG, WEBP, GIF, BMP, and SVG files. All images are processed and embedded into the final PDF with high visual fidelity.",
  },
  {
    question: "Can I reduce the PDF file size?",
    answer:
      "Yes. You can use the Quality & Compression slider to adjust image quality from 10% to 100%, allowing you to create compact, email-friendly PDFs.",
  },
];

export function ImagesToPdfTool() {
  const [items, setItems] = useState<PDFImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [outputFileName, setOutputFileName] = useState("toolon-document.pdf");
  
  // PDF Options
  const [pageSize, setPageSize] = useState<PDFExportOptions["pageSize"]>("a4");
  const [orientation, setOrientation] = useState<PDFExportOptions["orientation"]>("auto");
  const [margin, setMargin] = useState<PDFExportOptions["margin"]>("small");
  const [quality, setQuality] = useState<number>(0.85);
  const [grayscale, setGrayscale] = useState<boolean>(false);

  // Download & Modal State
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownloadUrl, setPendingDownloadUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle incoming files
  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const newItems: PDFImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|bmp|svg|heic)$/i)) {
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Load image to get natural dimensions
        const dims = await new Promise<{ w: number; h: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
          img.onerror = () => resolve({ w: 800, h: 600 });
          img.src = dataUrl;
        });

        newItems.push({
          id,
          name: file.name,
          dataUrl,
          width: dims.w,
          height: dims.h,
          size: file.size,
        });
      } catch (err) {
        console.error("Error reading file:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setIsProcessing(false);
  };

  // Reorder operations
  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  // Handle Generate & Download PDF
  const handleStartDownload = async () => {
    if (items.length === 0) return;
    setIsGenerating(true);
    setProgressPct(5);
    setProgressStatus("Preparing images...");

    try {
      const pdfBytes = await generatePdfFromImages(
        items,
        {
          pageSize,
          orientation,
          margin,
          quality,
          grayscale,
        },
        (pct, msg) => {
          setProgressPct(pct);
          setProgressStatus(msg);
        }
      );

      const blob = new Blob([new Uint8Array(pdfBytes) as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPendingDownloadUrl(url);

      // Open 30-sec sponsored countdown modal
      setShowCountdown(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to compile PDF. Please check that images are valid.");
    } finally {
      setIsGenerating(false);
      setProgressPct(0);
    }
  };

  const handleCountdownComplete = () => {
    if (pendingDownloadUrl) {
      const a = document.createElement("a");
      a.href = pendingDownloadUrl;
      a.download = outputFileName.endsWith(".pdf") ? outputFileName : `${outputFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setShowCountdown(false);
  };

  const totalInputSize = items.reduce((acc, item) => acc + item.size, 0);

  return (
    <ToolPageLayout
      toolId="images-to-pdf"
      title="Images to PDF Maker"
      description="Merge and convert JPG, PNG, WEBP, and BMP images into a single professional PDF document. 100% private and client-side."
    >
      <div className="space-y-8">
        {/* Section 1: Upload Dropzone & Thumbnails */}
        <ToolSectionCard
          title="1. Upload Images & Organize Pages"
          subtitle="Drag and drop photos. Move pages up or down to customize the document sequence."
          badge="Step 1"
        >
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            className="group cursor-pointer rounded-2xl border-2 border-dashed border-surface-dim hover:border-primary bg-slate-50/50 hover:bg-primary/[0.02] p-8 text-center transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <UploadCloud className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-base font-bold text-navy">
              Click to browse or drop images here
            </h3>
            <p className="mt-1 text-xs text-tertiary">
              Supports JPG, PNG, WEBP, BMP, GIF &amp; HEIC • Unlimited pages
            </p>

            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary font-semibold">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading images...
              </div>
            )}
          </div>

          {/* Thumbnail List */}
          {items.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between pb-3 border-b border-surface-dim">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy">
                    Document Pages ({items.length})
                  </span>
                  <span className="text-xs text-tertiary">
                    • Total: {formatFileSize(totalInputSize)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-dim bg-white text-xs font-semibold text-navy hover:bg-slate-50 transition-colors"
                  >
                    <FileUp className="h-3.5 w-3.5 text-primary" /> Add More
                  </button>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </button>
                </div>
              </div>

              {/* Grid of Pages */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-surface-dim bg-white p-2 shadow-xs hover:border-primary/40 transition-all flex flex-col"
                  >
                    {/* Page Number Badge */}
                    <div className="absolute top-3 left-3 z-10 rounded-md bg-navy/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Page {idx + 1}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 z-10 rounded-md bg-rose-600/90 text-white p-1 opacity-0 group-hover:opacity-100 hover:bg-rose-700 transition-all"
                      title="Remove page"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {/* Image Preview */}
                    <div className="relative aspect-3/4 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* File Meta */}
                    <p className="mt-2 truncate text-[11px] font-semibold text-navy">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-tertiary">
                      {item.width}×{item.height} • {formatFileSize(item.size)}
                    </p>

                    {/* Move controls */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move page earlier"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                      <button
                        onClick={() => moveItem(idx, "down")}
                        disabled={idx === items.length - 1}
                        className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move page later"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ToolSectionCard>

        {/* Section 2: Page Setup & Layout */}
        <ToolSectionCard
          title="2. Page Setup & Layout"
          subtitle="Configure paper standard, orientation, and white space margins."
          badge="Step 2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Page Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                Page Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "a4", label: "A4" },
                  { id: "letter", label: "US Letter" },
                  { id: "fit", label: "Fit Image" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setPageSize(preset.id as any)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      pageSize === preset.id
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-surface-dim bg-white text-navy hover:border-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                Orientation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "auto", label: "Auto" },
                  { id: "portrait", label: "Portrait" },
                  { id: "landscape", label: "Landscape" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setOrientation(preset.id as any)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      orientation === preset.id
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-surface-dim bg-white text-navy hover:border-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                Page Margin
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "none", label: "None" },
                  { id: "small", label: "Small" },
                  { id: "normal", label: "Normal" },
                  { id: "large", label: "Large" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setMargin(preset.id as any)}
                    className={`px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      margin === preset.id
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-surface-dim bg-white text-navy hover:border-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ToolSectionCard>

        {/* Section 3: Compression & Filters */}
        <ToolSectionCard
          title="3. Compression & Quality Optimization"
          subtitle="Adjust image quality to control PDF file size."
          badge="Step 3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            {/* Quality Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-navy mb-2">
                <span>Image Compression Quality</span>
                <span className="font-mono text-primary">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-tertiary mt-1">
                <span>Smaller File Size (20%)</span>
                <span>Balanced (85%)</span>
                <span>Maximum Quality (100%)</span>
              </div>
            </div>

            {/* Grayscale Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-surface-dim bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-navy">Grayscale Document</p>
                <p className="text-[11px] text-tertiary">
                  Convert all color photos to black &amp; white for printable forms
                </p>
              </div>
              <button
                onClick={() => setGrayscale(!grayscale)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  grayscale ? "bg-primary" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    grayscale ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </ToolSectionCard>

        {/* Section 4: Document Summary & Save Card */}
        <ToolSectionCard
          title="4. Save & Download PDF"
          subtitle="Compile multi-page PDF document and start instant client-side download."
          badge="Step 4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* File Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                PDF Output Filename
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={outputFileName}
                  onChange={(e) => setOutputFileName(e.target.value)}
                  placeholder="toolon-document.pdf"
                  className="w-full rounded-xl border border-surface-dim bg-white px-4 py-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute right-4 top-3.5 text-xs text-tertiary font-mono">
                  .pdf
                </span>
              </div>
            </div>

            {/* Download Button */}
            <div>
              <button
                onClick={handleStartDownload}
                disabled={items.length === 0 || isGenerating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Compiling ({progressPct}%)...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Download PDF ({items.length} {items.length === 1 ? "page" : "pages"})
                  </>
                )}
              </button>
            </div>
          </div>

          {isGenerating && (
            <ProcessingProgress
              progress={progressPct}
              statusText={progressStatus}
              stepName="Compiling PDF Document"
              completedItems={Math.round((progressPct / 100) * items.length)}
              totalItems={items.length}
              className="mt-5"
            />
          )}

          {items.length === 0 && (
            <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              💡 Please upload at least one image in Step 1 above to generate your PDF.
            </p>
          )}
        </ToolSectionCard>

        {/* FAQ Section */}
        <FAQSection toolName="Images to PDF Maker" items={PDF_FAQS} />
      </div>

      {/* 30-Second Sponsored Download Countdown Modal */}
      <DownloadCountdownModal
        isOpen={showCountdown}
        onComplete={handleCountdownComplete}
        onClose={() => setShowCountdown(false)}
        fileName={outputFileName}
        durationSeconds={30}
      />
    </ToolPageLayout>
  );
}
