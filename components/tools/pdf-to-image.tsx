"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileImage, Download, Trash2, Loader2, Image as ImageIcon,
  Settings2, CheckCircle, Sparkles, Archive,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { convertPdfToImages, RenderedPage, PdfToImageOptions } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How does PDF to Image work?", answer: "Your PDF is rendered page-by-page inside your browser using a high-fidelity rendering engine. Each page is converted to a JPG or PNG image at the DPI you select. No files are ever uploaded to a server." },
  { question: "What DPI should I choose?", answer: "72 DPI is great for web or email use. 150 DPI is ideal for standard documents. 300 DPI produces print-quality images with maximum detail." },
  { question: "Can I download all pages at once?", answer: "Yes! Click 'Download All as ZIP' to bundle every page image into a single ZIP archive for easy download." },
];

export function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [dpi, setDpi] = useState<number>(150);
  const [format, setFormat] = useState<"jpg" | "png">("jpg");
  const [quality, setQuality] = useState(0.9);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setPages([]);
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setPages([]);
    try {
      const opts: PdfToImageOptions = { dpi, format, quality };
      const results = await convertPdfToImages(file, opts, (cur, tot) => setProgress({ current: cur, total: tot }));
      setPages(results);
    } catch (err: any) {
      alert("Error: " + (err.message || "Failed to process PDF"));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPage = (page: RenderedPage) => {
    const ext = format === "png" ? "png" : "jpg";
    const name = `${file?.name?.replace(".pdf", "") || "page"}-page-${page.pageNumber}.${ext}`;
    const url = URL.createObjectURL(page.blob);
    setPendingDownload({ url, name });
    setShowCountdown(true);
  };

  const downloadAllAsZip = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const ext = format === "png" ? "png" : "jpg";
    pages.forEach((p) => {
      zip.file(`page-${p.pageNumber}.${ext}`, p.blob);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const name = `${file?.name?.replace(".pdf", "") || "pdf"}-images.zip`;
    setPendingDownload({ url, name });
    setShowCountdown(true);
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

  const reset = () => {
    setFile(null);
    setPages([]);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <ToolPageLayout toolId="pdf-to-image" title="PDF to JPG / PNG" description="Extract high-resolution image pages from any PDF document.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload & Settings" subtitle="Upload a PDF, configure output settings, then convert.">
          {/* Upload Area */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-10 text-center"
            >
              <UploadCloud className="mx-auto h-10 w-10 text-primary/60 mb-3" />
              <p className="text-sm font-semibold text-on-surface">Drop your PDF here or click to browse</p>
              <p className="text-xs text-tertiary mt-1">Accepts .pdf files</p>
              <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-surface-low rounded-lg p-4 border border-surface-dim">
              <div className="flex items-center gap-3">
                <FileImage className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-on-surface truncate max-w-[250px]">{file.name}</p>
                  <p className="text-xs text-tertiary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-tertiary hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          )}

          {/* Settings */}
          {file && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">Output Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value as "jpg" | "png")} className="w-full rounded-lg border border-surface-dim px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
                  <option value="jpg">JPG (smaller size)</option>
                  <option value="png">PNG (lossless)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">DPI Quality</label>
                <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="w-full rounded-lg border border-surface-dim px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
                  <option value={72}>72 DPI (Web / Fast)</option>
                  <option value={150}>150 DPI (Standard)</option>
                  <option value={300}>300 DPI (Print Quality)</option>
                </select>
              </div>
              {format === "jpg" && (
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5">JPG Quality: {Math.round(quality * 100)}%</label>
                  <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-primary mt-1" />
                </div>
              )}
            </div>
          )}

          {/* Convert Button */}
          {file && (
            <button
              onClick={processFile}
              disabled={isProcessing}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Converting page {progress.current} of {progress.total}...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Convert PDF to {format.toUpperCase()}</>
              )}
            </button>
          )}
        </ToolSectionCard>

        {/* Results */}
        {pages.length > 0 && (
          <ToolSectionCard
            title={`Converted Pages (${pages.length})`}
            badge="Complete"
            actionButton={
              <button onClick={downloadAllAsZip} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors">
                <Archive className="h-3.5 w-3.5" /> Download All as ZIP
              </button>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {pages.map((page) => (
                <div key={page.pageNumber} className="group relative rounded-lg border border-surface-dim overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <img src={page.dataUrl} alt={`Page ${page.pageNumber}`} className="w-full h-auto object-contain bg-gray-50" style={{ maxHeight: 200 }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => downloadPage(page)} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-on-surface shadow-lg">
                      <Download className="h-3.5 w-3.5" /> Page {page.pageNumber}
                    </button>
                  </div>
                  <div className="px-2 py-1.5 text-center border-t border-surface-dim">
                    <span className="text-[11px] font-medium text-tertiary">Page {page.pageNumber} • {page.width}×{page.height}</span>
                  </div>
                </div>
              ))}
            </div>
          </ToolSectionCard>
        )}

        <FAQSection toolName="PDF to JPG / PNG" items={FAQS} />
      </div>

      <DownloadCountdownModal
        isOpen={showCountdown}
        fileName={pendingDownload?.name || "download"}
        onComplete={triggerDownload}
        onClose={() => setShowCountdown(false)}
      />
    </ToolPageLayout>
  );
}
