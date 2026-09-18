"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, GitCompare
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";

const FAQS: FAQItem[] = [
  { question: "Does this highlight the differences?", answer: "This version provides a fast, side-by-side visual comparison in your browser. Automatic text highlighting is coming in a future update." },
  { question: "Is my document secure?", answer: "Yes, the files are only rendered in your local browser and are never uploaded to any server." },
];

export function ComparePdfTool() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [url1, setUrl1] = useState<string>("");
  const [url2, setUrl2] = useState<string>("");

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFile1 = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile1(f);
    setUrl1(URL.createObjectURL(f));
  };

  const handleFile2 = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile2(f);
    setUrl2(URL.createObjectURL(f));
  };

  const clearFile1 = () => {
    setFile1(null);
    if (url1) URL.revokeObjectURL(url1);
    setUrl1("");
  };

  const clearFile2 = () => {
    setFile2(null);
    if (url2) URL.revokeObjectURL(url2);
    setUrl2("");
  };

  return (
    <ToolPageLayout
      toolId="compare-pdf"
      title="Compare PDF Files"
      description="Visually compare two PDF documents side-by-side securely in your browser."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolSectionCard title="Document 1" subtitle="Upload original PDF">
            {!file1 ? (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                onClick={() => fileInputRef1.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef1}
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFile1(e.target.files[0])}
                />
                <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-slate-700">Upload Original</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{file1.name}</p>
                  </div>
                </div>
                <button
                  onClick={clearFile1}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </ToolSectionCard>

          <ToolSectionCard title="Document 2" subtitle="Upload modified PDF">
            {!file2 ? (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                onClick={() => fileInputRef2.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef2}
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFile2(e.target.files[0])}
                />
                <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-slate-700">Upload Modified</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{file2.name}</p>
                  </div>
                </div>
                <button
                  onClick={clearFile2}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Compare PDF" items={FAQS} />
        </div>
      </div>

      {file1 && file2 && (
        <div className="bg-slate-900 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-white font-bold flex items-center gap-2"><GitCompare className="h-5 w-5 text-primary" /> Side-by-Side View</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 h-[70vh]">
            <div className="bg-white rounded-xl overflow-hidden h-full flex flex-col">
              <div className="bg-slate-100 p-2 text-xs font-semibold text-slate-600 border-b text-center line-clamp-1">
                {file1.name}
              </div>
              <iframe src={`${url1}#toolbar=0&navpanes=0`} className="w-full h-full border-none" />
            </div>
            <div className="bg-white rounded-xl overflow-hidden h-full flex flex-col">
              <div className="bg-slate-100 p-2 text-xs font-semibold text-slate-600 border-b text-center line-clamp-1">
                {file2.name}
              </div>
              <iframe src={`${url2}#toolbar=0&navpanes=0`} className="w-full h-full border-none" />
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
