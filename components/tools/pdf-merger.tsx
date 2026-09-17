"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection } from "./shared/faq-section";
import {
  UploadCloud,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Loader2,
  Merge,
  Scissors,
  X,
  AlertCircle,
} from "lucide-react";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { mergePdfs, splitPdf, getPdfPageCount, PageRange } from "@/lib/pdf-engine";

interface MergeFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export function PdfMergerTool() {
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [files, setFiles] = useState<MergeFileItem[]>([]);
  const [splitFile, setSplitFile] = useState<MergeFileItem | null>(null);
  const [pageRangeInput, setPageRangeInput] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (newFiles: FileList | File[]) => {
    const validPdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (validPdfs.length === 0) return;

    if (mode === "split") {
      const f = validPdfs[0];
      try {
        const count = await getPdfPageCount(f);
        setSplitFile({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size,
          pageCount: count,
        });
        setPageRangeInput(count > 1 ? `1-${Math.min(count, 5)}` : "1");
      } catch (err) {
        alert("Failed to read PDF pages");
      }
      return;
    }

    // Merge mode
    const loaded: MergeFileItem[] = [];
    for (const f of validPdfs) {
      try {
        const count = await getPdfPageCount(f);
        loaded.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size,
          pageCount: count,
        });
      } catch (err) {
        console.error("Error reading file:", f.name, err);
      }
    }
    setFiles((prev) => [...prev, ...loaded]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await mergePdfs(files.map((f) => f.file));
      const blob = new Blob([new Uint8Array(result) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName = `toolon-merged-${Date.now()}.pdf`;
      setPendingDownload({ url, name: downloadName });
      setShowCountdown(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "Merge failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (!splitFile) {
      alert("Please upload a PDF file to split.");
      return;
    }

    const ranges = parsePageRanges(pageRangeInput);
    if (ranges.length === 0) {
      alert("Please enter a valid page range (e.g. 1-3, 5, 7-10).");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await splitPdf(splitFile.file, ranges);
      const blob = new Blob([new Uint8Array(result) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName = `toolon-split-${splitFile.name.replace(/\.pdf$/i, "")}-pages.pdf`;
      setPendingDownload({ url, name: downloadName });
      setShowCountdown(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "Split failed"));
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
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 200);
  }, [pendingDownload]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <ToolPageLayout toolId="pdf-merger" title="PDF Merger & Splitter" description="Combine multiple PDF files into one or extract specific page ranges.">
      <div className="space-y-6">
        {/* Mode Tabs */}
        <div className="flex rounded-xl border border-surface-dim overflow-hidden bg-white shadow-card">
          <button onClick={() => { setMode("merge"); setSplitFile(null); }} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors cursor-pointer ${mode === "merge" ? "bg-primary text-white" : "text-tertiary hover:bg-surface-low"}`}>
            <Merge className="h-4 w-4" /> Merge PDFs
          </button>
          <button onClick={() => { setMode("split"); setFiles([]); }} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors cursor-pointer ${mode === "split" ? "bg-primary text-white" : "text-tertiary hover:bg-surface-low"}`}>
            <Scissors className="h-4 w-4" /> Split PDF
          </button>
        </div>

        <ToolSectionCard title={mode === "merge" ? "Upload PDFs to Merge" : "Upload PDF to Split"} subtitle={mode === "merge" ? "Add multiple PDFs and reorder them before merging." : "Upload a PDF and specify which pages to extract."}>
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-8 text-center"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <p className="text-sm font-semibold text-on-surface">Drop PDF files here or click to browse</p>
            <p className="text-xs text-tertiary mt-1">{mode === "merge" ? "Add multiple PDFs" : "Select one PDF file"}</p>
            <input ref={fileInputRef} type="file" accept=".pdf" multiple={mode === "merge"} className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
          </div>

          {/* MERGE MODE: File List */}
          {mode === "merge" && files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-dim">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{idx + 1}</span>
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{item.name}</p>
                      <p className="text-xs text-tertiary">{formatSize(item.size)} • {item.pageCount} pages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveFile(idx, -1)} disabled={idx === 0} className="p-1.5 text-tertiary hover:text-on-surface disabled:opacity-30 transition-colors cursor-pointer"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1} className="p-1.5 text-tertiary hover:text-on-surface disabled:opacity-30 transition-colors cursor-pointer"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeFile(item.id)} className="p-1.5 text-tertiary hover:text-red-500 transition-colors cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              <button onClick={handleMerge} disabled={isProcessing || files.length < 2} className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Merging...</> : <><Sparkles className="h-4 w-4" /> Merge {files.length} PDFs</>}
              </button>
            </div>
          )}

          {/* SPLIT MODE */}
          {mode === "split" && splitFile && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface truncate max-w-[250px]">{splitFile.name}</p>
                    <p className="text-xs text-tertiary">{formatSize(splitFile.size)} • {splitFile.pageCount} pages</p>
                  </div>
                </div>
                <button onClick={() => setSplitFile(null)} className="p-2 text-tertiary hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">Page Range (e.g., 1-3, 5, 7-10)</label>
                <input type="text" value={pageRangeInput} onChange={(e) => setPageRangeInput(e.target.value)} placeholder="1-3, 5, 7-10" className="w-full rounded-lg border border-surface-dim px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                <p className="text-xs text-tertiary mt-1">Total pages in document: {splitFile.pageCount}</p>
              </div>
              <button onClick={handleSplit} disabled={isProcessing} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Splitting...</> : <><Scissors className="h-4 w-4" /> Extract Pages</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="PDF Merger & Splitter" items={FAQS} />
      </div>

      <DownloadCountdownModal
        isOpen={showCountdown}
        fileName={pendingDownload?.name || "toolon-document.pdf"}
        onComplete={triggerDownload}
        onClose={() => {
          setShowCountdown(false);
        }}
      />
    </ToolPageLayout>
  );
}

function parsePageRanges(input: string): PageRange[] {
  const ranges: PageRange[] = [];
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        ranges.push({ start, end });
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > 0) {
        ranges.push({ start: num, end: num });
      }
    }
  }
  return ranges;
}

const FAQS = [
  {
    question: "Can I merge multiple PDF files in any order?",
    answer: "Yes! Upload all your PDFs and use the up and down arrow buttons to reorder pages or documents before merging."
  },
  {
    question: "How does PDF page splitting work?",
    answer: "You can specify individual pages (e.g., 1, 3, 5) or page ranges (e.g., 1-5, 8-12) to extract into a single clean PDF file."
  },
  {
    question: "Are my uploaded PDFs stored on any server?",
    answer: "No. All PDF merging and splitting operations occur 100% locally in your browser memory for total privacy."
  }
];
