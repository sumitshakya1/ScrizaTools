"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileImage, Trash2, Loader2, Camera
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { scanToPdf } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How does it work?", answer: "Upload one or more JPG or PNG images, and they will be stitched together into a single PDF document." },
  { question: "Is my document secure?", answer: "Yes, all processing happens entirely within your browser. Your images are never uploaded to our servers, ensuring 100% privacy." },
];

export function ScanToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    const validFiles = Array.from(incomingFiles).filter(f => f.type.startsWith("image/"));
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const processed = await scanToPdf(files);
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPendingDownload({ url, name: "scanned-document.pdf" });
      setShowCountdown(true);
    } catch (error) {
      console.error("Failed to convert images:", error);
      alert("An error occurred while creating the PDF.");
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
      toolId="scan-to-pdf"
      title="Scan to PDF"
      description="Convert your JPG and PNG images into a single PDF document instantly."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Images" subtitle="Upload the images you want to convert to PDF">
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">JPG or PNG images</p>
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-3 max-h-[300px] overflow-y-auto">
                {files.map((file, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <FileImage className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating PDF...
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      Convert to PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Scan to PDF" items={FAQS} />
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
