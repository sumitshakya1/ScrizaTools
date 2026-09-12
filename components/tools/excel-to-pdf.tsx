"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { UploadCloud, FileSpreadsheet, Trash2, Sparkles, Loader2 } from "lucide-react";
import { convertExcelToPdf } from "@/lib/pdf-engine";

export function ExcelToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && (f.name.endsWith(".xlsx") || f.name.endsWith(".xls") || f.name.endsWith(".csv"))) {
      setFile(f);
    } else {
      alert("Please upload an .xlsx, .xls, or .csv file.");
    }
    e.target.value = "";
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await convertExcelToPdf(file, orientation);
      const blob = new Blob([result as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const name = `scriza-${file.name.replace(/\.(xlsx?|csv)$/i, "")}.pdf`;
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
    <ToolPageLayout toolId="excel-to-pdf" title="Excel to PDF" description="Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF format with table formatting.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload Excel File" subtitle="Select a spreadsheet file to convert to PDF.">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-8 text-center"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <p className="text-sm font-semibold text-on-surface">Drop Excel file here or click to browse</p>
            <p className="text-xs text-tertiary mt-1">Supports .xlsx, .xls, .csv files</p>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-tertiary">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-2 text-tertiary hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </div>

              {/* Orientation Selector */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">Page Orientation</label>
                <div className="flex gap-2">
                  <button onClick={() => setOrientation("portrait")} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${orientation === "portrait" ? "bg-primary text-white border-primary" : "bg-white text-tertiary border-surface-dim hover:bg-surface-low"}`}>
                    Portrait
                  </button>
                  <button onClick={() => setOrientation("landscape")} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${orientation === "landscape" ? "bg-primary text-white border-primary" : "bg-white text-tertiary border-surface-dim hover:bg-surface-low"}`}>
                    Landscape
                  </button>
                </div>
                <p className="text-xs text-tertiary mt-1">Landscape is recommended for wide spreadsheets with many columns.</p>
              </div>

              <button onClick={handleConvert} disabled={isProcessing} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : <><Sparkles className="h-4 w-4" /> Convert to PDF</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="Excel to PDF" items={[
          { question: "What Excel formats are supported?", answer: "Excel (.xlsx, .xls) and CSV files are all supported for conversion." },
          { question: "Are multiple sheets converted?", answer: "Yes! Each sheet in your workbook gets its own page in the resulting PDF." },
          { question: "Is my spreadsheet data safe?", answer: "Absolutely. All processing happens in your browser — zero server uploads, 100% private." },
        ]} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName={pendingDownload?.name || "spreadsheet.pdf"} onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
