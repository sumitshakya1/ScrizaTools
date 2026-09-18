"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, Code2, Download
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { simulateAiProcess } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "What is Markdown?", answer: "Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents." },
  { question: "Are tables and images supported?", answer: "This tool extracts plain text and attempts to format headers and paragraphs. Advanced tables and image extraction are planned for future updates." },
];

export function PdfToMarkdownTool() {
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
      const mockResult = await simulateAiProcess(file, 1500);
      setResultText(`# Document Extracted\n\n## Section 1\nThis is a mocked Markdown output.\n\n* Bullet 1\n* Bullet 2\n\n> "Connect backend for real extraction."\n\n---\n\n${mockResult}`);
    } catch (error) {
      console.error("Markdown conversion failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadMd = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(/\.pdf$/i, ".md") : "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout
      toolId="pdf-to-markdown"
      title="PDF to Markdown"
      description="Convert your PDF files into clean, beautifully formatted Markdown (.md) text."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload the PDF you want to convert to Markdown">
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
                  className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Converting to Markdown...
                    </>
                  ) : (
                    <>
                      <Code2 className="h-5 w-5" />
                      Convert PDF to .md
                    </>
                  )}
                </button>
              </div>
            )}

            {resultText && (
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-slate-500" /> Output Code
                  </h3>
                  <button
                    onClick={handleDownloadMd}
                    className="flex items-center gap-2 text-sm text-primary font-medium hover:underline bg-primary/5 px-3 py-1.5 rounded-lg"
                  >
                    <Download className="h-4 w-4" /> Download .md
                  </button>
                </div>
                <textarea
                  readOnly
                  value={resultText}
                  className="w-full h-64 p-4 bg-[#0d1117] text-[#c9d1d9] border border-slate-200 rounded-xl font-mono text-sm resize-none focus:outline-none"
                />
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="PDF to Markdown" items={FAQS} />
        </div>
      </div>
    </ToolPageLayout>
  );
}
