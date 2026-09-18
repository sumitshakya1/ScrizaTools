"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, Scissors
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { editPdf } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How does redaction work?", answer: "This version is a demo that simply overlays a black box at the top of the page. Precise word-coordinate redaction is coming in the full release." },
  { question: "Is the text actually removed?", answer: "In proper redaction, yes! The underlying text objects are completely removed from the file, not just covered up." },
];

export function RedactPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [word, setWord] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleProcess = async () => {
    if (!file || !word.trim()) return;
    setIsProcessing(true);
    try {
      // Mocking redaction by just stamping a black box / text
      const processed = await editPdf(file, "[REDACTED: " + word + "]", "#000000");
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-redacted.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (error) {
      console.error("Failed to redact PDF:", error);
      alert("An error occurred while redacting the PDF.");
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
      toolId="redact-pdf"
      title="Redact PDF"
      description="Permanently remove sensitive text and graphics from your PDF documents."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload the PDF you want to redact">
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
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Word or Phrase to Redact
                  </label>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="e.g. Social Security, Password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center bg-yellow-50 p-2 rounded-md">Note: This is a demo mode for the frontend. Real redaction requires our backend API.</p>
                </div>
                
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !word.trim()}
                  className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-black/20"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redacting...
                    </>
                  ) : (
                    <>
                      <Scissors className="h-5 w-5" />
                      Apply Redaction
                    </>
                  )}
                </button>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Redact PDF" items={FAQS} />
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
