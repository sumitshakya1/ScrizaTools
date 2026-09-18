"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Download, Trash2, Loader2, Sparkles, Scissors, FileMinus
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { removePdfPages } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How do I specify pages?", answer: "Enter a comma-separated list of pages or ranges. For example: 1, 3, 5-7. These pages will be removed from your document." },
  { question: "Is my document secure?", answer: "Yes, all processing happens entirely within your browser. Your files are never uploaded to our servers, ensuring 100% privacy." },
  { question: "Can I remove pages from a password-protected PDF?", answer: "No, you must unlock the PDF first before you can remove pages from it." },
];

function parsePageRanges(input: string): number[] {
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

export function RemovePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagesInput, setPagesInput] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleProcess = async () => {
    if (!file || !pagesInput.trim()) return;
    setIsProcessing(true);
    try {
      const pagesToRemove = parsePageRanges(pagesInput);
      const processed = await removePdfPages(file, pagesToRemove);
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-removed.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (error) {
      console.error("Failed to remove pages:", error);
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
      toolId="remove-pdf-pages"
      title="Remove PDF Pages"
      description="Delete unwanted pages from your PDF document securely in your browser."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload the PDF you want to modify">
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
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Pages to Remove
                  </label>
                  <input
                    type="text"
                    value={pagesInput}
                    onChange={(e) => setPagesInput(e.target.value)}
                    placeholder="e.g. 1, 3, 5-7"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter the exact page numbers you want to delete from the document.
                  </p>
                </div>
                
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !pagesInput.trim()}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Removing Pages...
                    </>
                  ) : (
                    <>
                      <FileMinus className="h-5 w-5" />
                      Remove Pages
                    </>
                  )}
                </button>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Remove PDF Pages" items={FAQS} />
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
