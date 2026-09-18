"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Trash2, Loader2, Unlock
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { unlockPdf } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "Can this crack unknown passwords?", answer: "No. This tool removes the password from a PDF assuming you already know the password. It is designed to remove the inconvenience of entering a password every time you open your own document." },
  { question: "Is my password sent to your servers?", answer: "No, the decryption happens entirely in your browser. Your password and your document never leave your device." },
];

export function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setErrorMsg("");
  };

  const handleProcess = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const processed = await unlockPdf(file, password);
      const blob = new Blob([new Uint8Array(processed) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-unlocked.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (error: any) {
      console.error("Failed to unlock PDF:", error);
      const msg = error?.message?.toLowerCase() || "";
      const name = error?.name || "";
      if (name === "PasswordException" || msg.includes("password") || msg.includes("incorrect")) {
        setErrorMsg("Incorrect password. Please check your password and try again.");
      } else if (msg.includes("client") || msg.includes("canvas")) {
        setErrorMsg("Browser error. Please try refreshing the page.");
      } else {
        setErrorMsg("Failed to unlock the PDF. The password may be incorrect or the file might not be encrypted.");
      }
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
      toolId="unlock-pdf"
      title="Unlock PDF"
      description="Remove password protection from your PDF files instantly in your browser."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ToolSectionCard title="Select Document" subtitle="Upload the encrypted PDF you want to unlock">
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
                <p className="text-xs text-slate-500 mt-1">Encrypted PDF documents only</p>
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

            {file && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Document Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter the password to unlock..."
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errorMsg ? "border-red-300 bg-red-50" : "border-slate-200"
                    }`}
                  />
                  {errorMsg && <p className="text-sm text-red-600 mt-2 font-medium">{errorMsg}</p>}
                </div>
                
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !password}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Unlocking PDF...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-5 w-5" />
                      Unlock PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </ToolSectionCard>
        </div>
        
        <div className="lg:col-span-1">
          <FAQSection toolName="Unlock PDF" items={FAQS} />
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
