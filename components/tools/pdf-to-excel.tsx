"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { UploadCloud, FileSpreadsheet, Trash2, Sparkles, Loader2 } from "lucide-react";
import { convertPdfToExcel, getPdfPageCount } from "@/lib/pdf-engine";

export function PdfToExcelTool() {
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
      const blob = await convertPdfToExcel(file);
      const url = URL.createObjectURL(blob);
      const name = `scriza-${file.name.replace(/\.pdf$/i, "")}.xlsx`;
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
    <ToolPageLayout toolId="pdf-to-excel" title="PDF to Excel" description="Extract tables and data from PDF documents into Excel (.xlsx) spreadsheets.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload PDF Document" subtitle="Tables and text data will be extracted into Excel format.">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); getPdfPageCount(f).then(setPageCount).catch(() => setPageCount(0)); } }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-8 text-center"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <p className="text-sm font-semibold text-on-surface">Drop PDF file here or click to browse</p>
            <p className="text-xs text-tertiary mt-1">Text and table data will be extracted to Excel</p>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-tertiary">{formatSize(file.size)} • {pageCount} pages</p>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setPageCount(0); }} className="p-2 text-tertiary hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </div>

              <button onClick={handleConvert} disabled={isProcessing} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Extracting...</> : <><Sparkles className="h-4 w-4" /> Convert to Excel</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="PDF to Excel" items={[
          { question: "How does table extraction work?", answer: "The tool analyzes text positions in the PDF to detect rows and columns, then reconstructs the data into an Excel spreadsheet with proper cell alignment." },
          { question: "Does it work with scanned PDFs?", answer: "This tool works best with text-based PDFs. Scanned images (image-only PDFs) may need OCR processing first." },
          { question: "Is my data kept private?", answer: "Yes. All extraction happens entirely in your browser — your PDF data never leaves your device." },
        ]} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName={pendingDownload?.name || "data.xlsx"} onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
