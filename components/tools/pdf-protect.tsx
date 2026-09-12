"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Download, Trash2, Loader2, ShieldCheck, Lock,
  Eye, EyeOff, Sparkles, CheckCircle, Printer, Copy, Edit3,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { protectPdf, PdfPermissions } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "How secure is the encryption?", answer: "PDF password protection uses the standard PDF encryption specification. The user password is required to open the document. The owner password controls editing, copying, and printing permissions." },
  { question: "What's the difference between user and owner passwords?", answer: "The user password is needed to open and view the PDF. The owner password controls what actions are allowed (printing, copying text, modifying). If you only set a user password, the owner password defaults to match it." },
  { question: "Can I remove a password later?", answer: "Yes, open the PDF with the password in any PDF viewer, then 're-save' or 're-export' it without encryption. You can also re-upload the encrypted PDF here (with password) to create a new unprotected copy." },
];

export function PdfProtectTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showUserPw, setShowUserPw] = useState(false);
  const [showOwnerPw, setShowOwnerPw] = useState(false);
  const [permissions, setPermissions] = useState<PdfPermissions>({
    printing: true,
    copying: false,
    modifying: false,
  });
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
  };

  const handleProtect = async () => {
    if (!file) return;
    if (!userPassword.trim()) { alert("Please enter a password to protect the PDF."); return; }
    setIsProcessing(true);
    try {
      const result = await protectPdf(file, userPassword, ownerPassword || userPassword, permissions);
      const blob = new Blob([new Uint8Array(result) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPendingUrl(url);
      setShowCountdown(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "Encryption failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!pendingUrl) return;
    const a = document.createElement("a");
    a.href = pendingUrl;
    a.download = `scriza-protected-${file?.name || "document.pdf"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setUserPassword("");
    setOwnerPassword("");
    setPendingUrl(null);
  };

  // Password strength
  const getStrength = (pw: string) => {
    if (!pw) return { label: "", color: "" };
    if (pw.length < 4) return { label: "Weak", color: "text-red-600" };
    if (pw.length < 8) return { label: "Fair", color: "text-amber-600" };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 8) return { label: "Strong", color: "text-emerald-600" };
    return { label: "Good", color: "text-blue-600" };
  };

  const strength = getStrength(userPassword);

  return (
    <ToolPageLayout toolId="pdf-protect" title="PDF Password Protect" description="Encrypt and protect sensitive PDF files with password protection.">
      <div className="space-y-6">
        <ToolSectionCard title="Upload & Encrypt" subtitle="Upload a PDF, set passwords and permissions, then encrypt.">
          {/* Upload */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-10 text-center"
            >
              <UploadCloud className="mx-auto h-10 w-10 text-primary/60 mb-3" />
              <p className="text-sm font-semibold text-on-surface">Drop your PDF here or click to browse</p>
              <p className="text-xs text-tertiary mt-1">Accepts .pdf files</p>
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="space-y-5">
              {/* File Info */}
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-4 border border-surface-dim">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-tertiary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={reset} className="p-2 text-tertiary hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> User Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPw ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Required to open the PDF"
                      className="w-full rounded-lg border border-surface-dim px-3 py-2 pr-10 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                    <button onClick={() => setShowUserPw(!showUserPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface">
                      {showUserPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {strength.label && <p className={`text-xs font-bold mt-1 ${strength.color}`}>Strength: {strength.label}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Owner Password <span className="text-tertiary font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOwnerPw ? "text" : "password"}
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Controls permissions"
                      className="w-full rounded-lg border border-surface-dim px-3 py-2 pr-10 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                    <button onClick={() => setShowOwnerPw(!showOwnerPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface">
                      {showOwnerPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Permission Toggles */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Allowed Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([
                    { key: "printing" as const, label: "Allow Printing", icon: Printer },
                    { key: "copying" as const, label: "Allow Copying", icon: Copy },
                    { key: "modifying" as const, label: "Allow Modifying", icon: Edit3 },
                  ]).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`flex items-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                        permissions[key]
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}: {permissions[key] ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleProtect} disabled={isProcessing || !userPassword.trim()} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all">
                {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Encrypting...</> : <><ShieldCheck className="h-4 w-4" /> Encrypt & Protect PDF</>}
              </button>
            </div>
          )}
        </ToolSectionCard>

        <FAQSection toolName="PDF Password Protect" items={FAQS} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName={`scriza-protected-${file?.name || "document.pdf"}`} onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
