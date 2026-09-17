"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { UploadCloud, FileText, Trash2, Sparkles, Loader2, Presentation } from "lucide-react";
import { convertPptxToPdf } from "@/lib/pdf-engine";

export function PptxToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".pptx")) {
      setFile(f);
    } else {
      alert("Please upload a .pptx file.");
    }
    e.target.value = "";
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await convertPptxToPdf(file);
      const blob = new Blob([result as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const name = `toolon-${file.name.replace(/\.pptx$/i, "")}.pdf`;
      setPendingDownload({ url, name });
      setShowCountdown(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "Conversion failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = useCallback(() => {
    if (!pendingDownload) return;
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = pendingDownload.url;
    a.download = pendingDownload.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { if (document.body.contains(a)) document.body.removeChild(a); }, 200);
  }, [pendingDownload]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <ToolPageLayout toolId="pptx-to-pdf" title="PowerPoint to PDF" description="Convert PowerPoint (.pptx) presentations to PDF format.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload PowerPoint File" subtitle="Select a .pptx file to convert to PDF.">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-8 text-center"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <p className="text-sm font-semibold text-on-surface">Drop PowerPoint file here or click to browse</p>
            <p className="text-xs text-tertiary mt-1">Supports .pptx files</p>
            <input ref={fileInputRef} type="file" accept=".pptx" className="hidden" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <Presentation className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-tertiary">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-2 text-tertiary hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </div>

              <button onClick={handleConvert} disabled={isProcessing} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : <><Sparkles className="h-4 w-4" /> Convert to PDF</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="PowerPoint to PDF" items={[
          { question: "What PowerPoint formats are supported?", answer: "The .pptx format (PowerPoint 2007+) is fully supported. Text, images, and basic slide layouts are preserved." },
          { question: "Are slide animations preserved?", answer: "Animations and transitions are not included in the PDF output, but all text and image content is faithfully rendered." },
          { question: "Is my file uploaded to a server?", answer: "No. Everything runs in your browser — zero server uploads, 100% private." },
        ]} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName={pendingDownload?.name || "presentation.pdf"} onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
