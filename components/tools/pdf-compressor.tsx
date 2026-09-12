"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Download, Trash2, Loader2, Sparkles, TrendingDown,
  CheckCircle, BarChart3,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { compressPdf } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How does PDF compression work?", answer: "The tool creates a new optimized PDF by removing unused objects, deduplicating data streams, and compressing object streams. All text, images, and hyperlinks are preserved." },
  { question: "Will I lose quality?", answer: "The compression focuses on structural optimization. Text remains sharp and vector graphics are preserved. For maximum reduction, use the 'High' compression level." },
  { question: "Is there a file size limit?", answer: "Since processing happens in your browser, the limit depends on your device's memory. Most PDFs up to 100 MB work well on modern devices." },
];

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium");
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number; url: string } | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setResult(null);
  };

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const compressed = await compressPdf(file, compressionLevel);
      const blob = new Blob([new Uint8Array(compressed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ originalSize: file.size, compressedSize: compressed.byteLength, url });
    } catch (err: any) {
      alert("Error: " + (err.message || "Compression failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `scriza-compressed-${file?.name || "document.pdf"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const reductionPercent = result ? Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100)) : 0;

  const reset = () => { setFile(null); setResult(null); };

  return (
    <ToolPageLayout toolId="pdf-compressor" title="PDF Compressor" description="Reduce PDF document file size while preserving sharp text and images.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload & Compress" subtitle="Upload a PDF and choose your compression level.">
          {/* Upload */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-10 text-center"
            >
              <UploadCloud className="mx-auto h-10 w-10 text-primary/60 mb-3" />
              <p className="text-sm font-semibold text-on-surface">Drop your PDF here or click to browse</p>
              <p className="text-xs text-tertiary mt-1">Accepts .pdf files</p>
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-4 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-tertiary">Original size: {formatSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={reset} className="p-2 text-tertiary hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>

              {/* Compression Level */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Compression Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setCompressionLevel(level)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                        compressionLevel === level
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-surface-dim text-tertiary hover:border-primary/40"
                      }`}
                    >
                      {level === "low" ? "Low (Gentle)" : level === "medium" ? "Medium (Balanced)" : "High (Maximum)"}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={compress} disabled={isProcessing} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Compressing...</> : <><TrendingDown className="h-4 w-4" /> Compress PDF</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        {/* Result */}
        {result && (
          <ToolSectionCard title="Compression Result" badge="Complete">
            <div className="space-y-4">
              {/* Size Comparison Bar */}
              <div className="rounded-xl bg-surface-low border border-surface-dim p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-tertiary">BEFORE</span>
                  <span className="text-xs font-bold text-tertiary">AFTER</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-red-700">{formatSize(result.originalSize)}</span>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-primary">→</span>
                  <div style={{ flex: Math.max(0.1, result.compressedSize / result.originalSize) }}>
                    <div className="h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-700">{formatSize(result.compressedSize)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-extrabold text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                    {reductionPercent > 0 ? `${reductionPercent}% smaller` : "Optimized"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { setShowCountdown(true); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition-all"
              >
                <Download className="h-4 w-4" /> Download Compressed PDF
              </button>
            </div>
          </ToolSectionCard>
        )}

        <FAQSection toolName="PDF Compressor" items={FAQS} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName={`scriza-compressed-${file?.name || "document.pdf"}`} onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
