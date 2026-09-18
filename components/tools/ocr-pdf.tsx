"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, ScanText, Download
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { simulateAiProcess } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How accurate is the OCR?", answer: "This is a simulated demo for launch. Once connected to a backend OCR API, accuracy typically exceeds 98%." },
  { question: "What languages are supported?", answer: "The final version will support over 100 languages including English, Spanish, French, German, and Chinese." },
];

export function OcrPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setResultText(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const mockResult = await simulateAiProcess(file, 2500);
      setResultText("---- EXTRACTED TEXT ----\n\n" + mockResult + "\n\n(Note: This is a frontend simulation. Connect a real backend to process actual images.)");
    } catch (error) {
      console.error("OCR Failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(/\.pdf$/i, "-ocr.txt") : "ocr-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout
      toolId="ocr-pdf"
      title="OCR PDF"
      description="Extract text from scanned PDFs and images using Optical Character Recognition."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload a scanned PDF to extract text">
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
                <p className="text-xs text-slate-500 mt-1">Scanned PDF documents</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
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

            {file && !resultText && (
              <div className="mt-6 pt-2 border-t border-slate-100">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Scanning Document...
                    </>
                  ) : (
                    <>
                      <ScanText className="h-5 w-5" />
                      Start OCR Processing
                    </>
                  )}
                </button>
              </div>
            )}

            {resultText && (
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Extracted Text</h3>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-2 text-sm text-primary font-medium hover:underline bg-primary/5 px-3 py-1.5 rounded-lg"
                  >
                    <Download className="h-4 w-4" /> Download .txt
                  </button>
                </div>
                <textarea
                  readOnly
                  value={resultText}
                  className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="OCR PDF" items={FAQS} />
        </div>
      </div>
    </ToolPageLayout>
  );
}
