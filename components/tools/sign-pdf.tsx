"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, PenTool, Image as ImageIcon
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { signPdf } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How is the signature added?", answer: "The image of your signature will be stamped on the bottom right corner of the last page of the document." },
  { question: "What formats are supported for the signature?", answer: "You can upload your signature as a PNG or JPG file." },
  { question: "Is my document secure?", answer: "Yes, all processing happens entirely within your browser. Your files and signature are never uploaded to our servers, ensuring 100% privacy." },
];

export function SignPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleSigFile = (f: File) => {
    if (f.type !== "image/png" && f.type !== "image/jpeg" && f.type !== "image/jpg") {
      alert("Please upload a PNG or JPG signature image.");
      return;
    }
    setSignatureFile(f);
  };

  const handleProcess = async () => {
    if (!file || !signatureFile) return;
    setIsProcessing(true);
    try {
      const processed = await signPdf(file, signatureFile);
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-signed.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (error: any) {
      console.error("Failed to sign PDF:", error);
      alert(error.message || "An error occurred while processing the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!pendingDownload) return;
    const a = document.createElement("a");
    a.href = pendingDownload.url;
    a.download = pendingDownload.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout
      toolId="sign-pdf"
      title="Sign PDF Document"
      description="Add your digital signature image to a PDF securely in your browser."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="1. Select Document" subtitle="Upload the PDF you want to sign">
            {!file ? (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
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
                <div className="h-14 w-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-slate-700">Click to upload PDF</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
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
          </ToolSectionCard>

          {file && (
            <ToolSectionCard title="2. Select Signature" subtitle="Upload a PNG or JPG of your signature">
              {!signatureFile ? (
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                  onClick={() => sigInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleSigFile(e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    type="file"
                    ref={sigInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => e.target.files?.[0] && handleSigFile(e.target.files[0])}
                  />
                  <div className="h-14 w-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload Signature Image</p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{signatureFile.name}</p>
                      <p className="text-xs text-slate-500">{(signatureFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSignatureFile(null)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove signature"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </ToolSectionCard>
          )}

          {file && signatureFile && (
            <div className="pt-4">
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Applying Signature...
                  </>
                ) : (
                  <>
                    <PenTool className="h-5 w-5" />
                    Sign Document
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Sign PDF" items={FAQS} />
        </div>
      </div>

      <DownloadCountdownModal
        isOpen={showCountdown}
        onClose={() => setShowCountdown(false)}
        onComplete={triggerDownload}
        fileName={pendingDownload?.name || ""}
      />
    </ToolPageLayout>
  );
}
