"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, RotateCw
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { rotatePdfPages } from "@/lib/pdf-engine";
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
  { question: "Can I rotate specific pages?", answer: "Yes, you can enter a comma-separated list of pages to rotate just those pages. Leave it empty to rotate all pages." },
  { question: "Is my document secure?", answer: "Yes, all processing happens entirely within your browser. Your files are never uploaded to our servers, ensuring 100% privacy." },
  { question: "Are changes permanent?", answer: "Yes, the newly downloaded PDF will have the rotated orientation saved permanently." },
];

function parsePageRanges(input: string): number[] | undefined {
  if (!input.trim()) return undefined;
  
  const pages = new Set<number>();
  const parts = input.split(",").map(s => s.trim());
  for (const part of parts) {
    if (!part) continue;
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) pages.add(i);
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p)) pages.add(p);
    }
  }
  return Array.from(pages);
}

export function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagesInput, setPagesInput] = useState<string>("");
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
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
      const scale = Math.min(600 / viewport.width, 1);
      const scaledViewport = page.getViewport({ scale });

      // Handle canvas dimensions based on rotation
      if (rotation === 90 || rotation === 270) {
        canvas.width = scaledViewport.height;
        canvas.height = scaledViewport.width;
      } else {
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
      }

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      // Since page.render doesn't automatically apply our custom canvas transform before clearing, 
      // we render to an offscreen canvas first, then draw it rotated onto our visible canvas.
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = scaledViewport.width;
      offscreenCanvas.height = scaledViewport.height;
      const offscreenCtx = offscreenCanvas.getContext("2d");
      
      if (!offscreenCtx) return;
      
      await page.render({ canvasContext: offscreenCtx, viewport: scaledViewport }).promise;
      
      context.save();
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Move to center to rotate
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotation * Math.PI) / 180);
      
      // Draw image offset by half its width and height to center it
      context.drawImage(
        offscreenCanvas,
        -scaledViewport.width / 2,
        -scaledViewport.height / 2
      );
      
      context.restore();

    } catch (err) {
      console.error("Preview render error:", err);
    }
  }, [file, rotation]);

  useEffect(() => {
    if (file) {
      renderPreview();
    }
  }, [file, rotation, renderPreview]);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const specificPages = parsePageRanges(pagesInput);
      const processed = await rotatePdfPages(file, rotation, specificPages);
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-rotated.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (error) {
      console.error("Failed to rotate pages:", error);
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

  return (
    <ToolPageLayout
      toolId="rotate-pdf"
      title="Rotate PDF Pages"
      description="Rotate your PDF documents securely in your browser. Choose specific pages or rotate the entire document."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload the PDF you want to rotate">
            {!file ? (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
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
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Rotation Angle
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg as any)}
                        className={`py-2 rounded-lg font-bold text-sm border-2 transition-colors ${
                          rotation === deg
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-slate-200 text-slate-600 hover:border-primary/50"
                        }`}
                      >
                        Right {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Specific Pages (Optional)
                  </label>
                  <input
                    type="text"
                    value={pagesInput}
                    onChange={(e) => setPagesInput(e.target.value)}
                    placeholder="e.g. 1, 3, 5-7 (Leave empty for all pages)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Rotating Pages...
                    </>
                  ) : (
                    <>
                      <RotateCw className="h-5 w-5" />
                      Rotate PDF
                    </>
                  )}
                </button>
                </div>
                
                <div className="bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200 min-h-[300px]">
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Live Preview</p>
                  <div className="shadow-lg bg-white overflow-hidden max-w-full flex items-center justify-center">
                    <canvas ref={canvasRef} className="max-w-full h-auto block" />
                  </div>
                </div>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Rotate PDF Pages" items={FAQS} />
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
