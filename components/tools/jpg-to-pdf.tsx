"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileImage, Download, Trash2, Loader2, Sparkles, X,
  ArrowUp, ArrowDown, FileText,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { generatePdfFromImages, PDFImageItem, PDFExportOptions } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How is this different from Images to PDF?", answer: "JPG to PDF is streamlined specifically for JPEG photos with simpler defaults — drag-drop your JPGs and get a clean PDF instantly. Images to PDF supports more formats and advanced options." },
  { question: "Can I add multiple JPG files?", answer: "Yes! Add as many JPG/JPEG files as you want. They will be combined into a multi-page PDF in the order shown. Drag to reorder before converting." },
  { question: "What page size is used?", answer: "By default, A4 page size is used with automatic orientation (portrait or landscape) based on each image's dimensions." },
];

export function JpgToPdfTool() {
  const [items, setItems] = useState<PDFImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const newItems: PDFImageItem[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/jpeg") && !file.type.startsWith("image/jpg")) continue;
      try {
        const item = await loadImageItem(file);
        newItems.push(item);
      } catch { /* skip bad files */ }
    }
    setItems((prev) => [...prev, ...newItems]);
    setIsProcessing(false);
  };

  const loadImageItem = (file: File): Promise<PDFImageItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          resolve({
            id: crypto.randomUUID(),
            name: file.name,
            dataUrl: reader.result as string,
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: file.size,
          });
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    setItems((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const generatePdf = async () => {
    if (items.length === 0) return;
    setIsGenerating(true);
    try {
      const options: PDFExportOptions = {
        pageSize: "a4",
        orientation: "auto",
        margin: "small",
        quality: 0.85,
      };
      const pdfBytes = await generatePdfFromImages(items, options);
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPendingUrl(url);
      setShowCountdown(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "PDF generation failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerDownload = () => {
    if (!pendingUrl) return;
    const a = document.createElement("a");
    a.href = pendingUrl;
    a.download = "toolon-jpg-to-pdf.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout toolId="jpg-to-pdf" title="JPG to PDF" description="Convert JPG and JPEG photos into a clean PDF document.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload JPG Photos" subtitle="Add your JPEG photos and convert them to PDF.">
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-8 text-center"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <p className="text-sm font-semibold text-on-surface">Drop JPG photos here or click to browse</p>
            <p className="text-xs text-tertiary mt-1">Accepts .jpg, .jpeg files only</p>
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,image/jpeg" multiple className="hidden" onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }} />
          </div>

          {/* File List */}
          {items.length > 0 && (
            <div className="mt-4 space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 bg-surface-low rounded-lg p-2.5 border border-surface-dim">
                  <img src={item.dataUrl} alt={item.name} className="h-12 w-12 rounded object-cover border border-surface-dim" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-on-surface truncate">{item.name}</p>
                    <p className="text-[11px] text-tertiary">{item.width}×{item.height} • {(item.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="p-1 text-tertiary hover:text-on-surface disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className="p-1 text-tertiary hover:text-on-surface disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-tertiary hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}

              <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...</> : <><FileText className="h-4 w-4" /> Convert {items.length} JPG{items.length > 1 ? "s" : ""} to PDF</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="JPG to PDF" items={FAQS} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName="toolon-jpg-to-pdf.pdf" onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
