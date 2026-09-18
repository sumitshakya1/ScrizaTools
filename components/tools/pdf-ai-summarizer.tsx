"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, Sparkles, Bot
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { simulateAiProcess } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How does the AI work?", answer: "We use advanced Large Language Models (LLMs) to read your document and extract the core concepts into a concise summary." },
  { question: "Is my data used for training?", answer: "No, your documents are securely processed and immediately deleted from memory. We do not use user data for model training." },
];

export function PdfAiSummarizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setSummary(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const mockResult = await simulateAiProcess(file, 3000);
      setSummary("✨ **AI Summary (Demo)** ✨\n\n" + mockResult + "\n\n1. Key Point One\n2. Key Point Two\n3. Conclusion");
    } catch (error) {
      console.error("AI Failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="pdf-ai-summarizer"
      title="AI Summarizer"
      description="Let AI read your long PDFs and instantly generate a concise, accurate summary."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload the PDF you want to summarize">
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

            {file && !summary && (
              <div className="mt-6 pt-2 border-t border-slate-100">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Reading Document...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate AI Summary
                    </>
                  )}
                </button>
              </div>
            )}

            {summary && (
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-800">AI Summary Generated</h3>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 prose prose-slate prose-sm max-w-none">
                  {summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0 text-slate-700 whitespace-pre-wrap">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="AI Summarizer" items={FAQS} />
        </div>
      </div>
    </ToolPageLayout>
  );
}
