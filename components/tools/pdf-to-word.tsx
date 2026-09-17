"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { UploadCloud, FileText, Trash2, Sparkles, Loader2 } from "lucide-react";
import { convertPdfToWord, getPdfPageCount } from "@/lib/pdf-engine";

export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      try {
        const count = await getPdfPageCount(f);
        setPageCount(count);
      } catch {
        setPageCount(0);
      }
    } else {
      alert("Please upload a PDF file.");
    }
    e.target.value = "";
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await convertPdfToWord(file);
      const url = URL.createObjectURL(blob);
      const name = `toolon-${file.name.replace(/\.pdf$/i, "")}.docx`;
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
    <ToolPageLayout toolId="pdf-to-word" title="PDF to Word" description="Convert PDF documents to editable Microsoft Word (.docx) files.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload PDF Document" subtitle="Select a PDF file to convert to Word (.docx).">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); getPdfPageCount(f).then(setPageCount).catch(() => setPageCount(0)); } }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-8 text-center"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <p className="text-sm font-semibold text-on-surface">Drop PDF file here or click to browse</p>
            <p className="text-xs text-tertiary mt-1">Upload any PDF document</p>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-tertiary">{formatSize(file.size)} • {pageCount} pages</p>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setPageCount(0); }} className="p-2 text-tertiary hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </div>

              <button onClick={handleConvert} disabled={isProcessing} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : <><Sparkles className="h-4 w-4" /> Convert to Word</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="PDF to Word" items={[
          { question: "How accurate is the conversion?", answer: "The tool extracts text content with layout detection, preserving headings, paragraph structure, and reading order. Complex visual layouts may differ slightly." },
          { question: "Is my document uploaded to any server?", answer: "No. All conversion happens locally in your browser for complete privacy. Zero data leaves your device." },
          { question: "Can I edit the resulting Word file?", answer: "Yes! The output is a standard .docx file that can be opened and edited in Microsoft Word, Google Docs, or LibreOffice Writer." },
        ]} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName={pendingDownload?.name || "document.docx"} onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
