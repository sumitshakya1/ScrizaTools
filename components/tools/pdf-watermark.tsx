"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, Stamp
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { addPdfWatermark, WatermarkOptions } from "@/lib/pdf-engine";
import type * as PdfjsType from "pdfjs-dist";

// Lazy-load pdfjs-dist to avoid top-level execution during SSR/hydration
let _pdfjsLib: typeof PdfjsType | null = null;
async function getPdfjsLib(): Promise<typeof PdfjsType> {
  if (_pdfjsLib) return _pdfjsLib;
  const lib = await import("pdfjs-dist");
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.mjs`;
  _pdfjsLib = lib;
  return lib;
}

const FAQS: FAQItem[] = [
  { question: "Where is the watermark placed?", answer: "You can customize the placement using the grid controls (e.g., Center, Top-Left, Bottom-Right) and adjust the opacity and size." },
  { question: "Does the live preview show exactly how it will look?", answer: "The live preview gives a close approximation of the watermark on the first page. The final PDF will have the watermark stamped natively on every page." },
  { question: "Is my document secure?", answer: "Yes, all processing happens entirely within your browser. Your files are never uploaded to our servers, ensuring 100% privacy." },
];

export function PdfWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [options, setOptions] = useState<WatermarkOptions>({
    position: "center",
    layout: "diagonal",
    size: 60,
    opacity: 0.5,
  });
  
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPreview = useCallback(async () => {
    if (!file || !canvasRef.current) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await getPdfjsLib();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const viewport = page.getViewport({ scale: 1.0 });
      // Scale down for preview if too large
      const scale = Math.min(600 / viewport.width, 1);
      const scaledViewport = page.getViewport({ scale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      await page.render(renderContext).promise;
      
      // Draw watermark preview
      context.save();
      context.fillStyle = `rgba(204, 204, 204, ${options.opacity})`; // light gray rgb(0.8,0.8,0.8)
      
      const scaledSize = options.size * scale;
      context.font = `bold ${scaledSize}px Helvetica`;
      const metrics = context.measureText(watermarkText);
      const textWidth = metrics.width;
      // Approximation for height
      const textHeight = scaledSize;
      
      let x = 0;
      let y = 0;
      
      const margin = 50 * scale;
      
      if (options.position.includes("left")) x = margin;
      else if (options.position.includes("right")) x = canvas.width - textWidth - margin;
      else x = canvas.width / 2 - textWidth / 2;
      
      if (options.position.includes("top")) y = margin + textHeight; // canvas y is from top
      else if (options.position.includes("bottom")) y = canvas.height - margin;
      else y = canvas.height / 2 + textHeight / 4;
      
      if (options.layout === "diagonal") {
        if (options.position === "center") {
           // Basic centering adjustment for preview
           x = canvas.width / 2;
           y = canvas.height / 2;
        }
        context.translate(x, y);
        context.rotate(-Math.PI / 4); // pdf-lib rotates CCW, canvas rotates CW
        if (options.position === "center") {
           context.fillText(watermarkText, -textWidth / 2, textHeight / 4);
        } else {
           context.fillText(watermarkText, 0, 0);
        }
      } else {
        context.fillText(watermarkText, x, y);
      }
      
      context.restore();

    } catch (err) {
      console.error("Preview render error:", err);
    }
  }, [file, watermarkText, options]);

  useEffect(() => {
    if (file) {
      renderPreview();
    }
  }, [file, watermarkText, options, renderPreview]);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleProcess = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    try {
      const processed = await addPdfWatermark(file, watermarkText, options);
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-watermarked.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (error) {
      console.error("Failed to add watermark:", error);
      alert("An error occurred while processing the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!pendingDownload) return;
    const a = document.createElement("a");
    a.href = pendingDownload.url;
    a.download = pendingDownload.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const positions: WatermarkOptions["position"][] = [
    "top-left", "top-center", "top-right",
    "center-left", "center", "center-right",
    "bottom-left", "bottom-center", "bottom-right"
  ];

  return (
    <ToolPageLayout
      toolId="pdf-watermark"
      title="Add Watermark to PDF"
      description="Stamp text over your PDF pages with live preview securely in your browser."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Document & Settings" subtitle="Upload and configure your watermark">
            {!file ? (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group mb-6"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF documents only</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}

            {file && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. DRAFT or CONFIDENTIAL"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                    <div className="grid grid-cols-3 gap-2 w-48">
                      {positions.map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setOptions({ ...options, position: pos })}
                          className={`h-10 w-full rounded border ${
                            options.position === pos
                              ? "bg-primary border-primary text-white"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          } transition-colors flex items-center justify-center`}
                          title={pos.replace("-", " ")}
                        >
                          <div className={`w-2 h-2 rounded-full ${options.position === pos ? "bg-white" : "bg-slate-400"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Layout</label>
                      <select
                        value={options.layout}
                        onChange={(e) => setOptions({ ...options, layout: e.target.value as "horizontal" | "diagonal" })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="diagonal">Diagonal</option>
                        <option value="horizontal">Horizontal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Size ({options.size}pt)</label>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={options.size}
                        onChange={(e) => setOptions({ ...options, size: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Opacity ({Math.round(options.opacity * 100)}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={options.opacity * 100}
                      onChange={(e) => setOptions({ ...options, opacity: parseInt(e.target.value) / 100 })}
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing || !watermarkText.trim()}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding Watermark...
                      </>
                    ) : (
                      <>
                        <Stamp className="h-5 w-5" />
                        Add Watermark
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200 min-h-[300px]">
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Live Preview</p>
                  <div className="shadow-lg bg-white overflow-hidden max-w-full">
                    <canvas ref={canvasRef} className="max-w-full h-auto block" />
                  </div>
                </div>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Add Watermark" items={FAQS} />
        </div>
      </div>

      <DownloadCountdownModal
        isOpen={showCountdown}
        onClose={() => setShowCountdown(false)}
        onComplete={triggerDownload}
        fileName={pendingDownload?.name || ""}
      />
    </ToolPageLayout>
  );
}
