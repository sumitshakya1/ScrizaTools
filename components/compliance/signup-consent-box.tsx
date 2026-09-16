"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, AlertCircle, FileText, Download } from "lucide-react";

export interface SignupConsentEvidence {
  userId: string;
  timestamp: string;
  termsAccepted: boolean;
  marketingOptIn: boolean;
  policyVersion: string;
  ipAddress: string;
  userAgent: string;
}

interface SignupConsentBoxProps {
  userId?: string;
  onValidationChange?: (isValid: boolean, evidence: SignupConsentEvidence | null) => void;
}

export function SignupConsentBox({
  userId = "usr_guest_demo",
  onValidationChange,
}: SignupConsentBoxProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [exported, setExported] = useState(false);

  const getEvidence = (): SignupConsentEvidence => ({
    userId,
    timestamp: new Date().toISOString(),
    termsAccepted,
    marketingOptIn,
    policyVersion: "v1.1-2026.09.16",
    ipAddress: "Logged at server Gateway",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Client-Agent",
  });

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    const ev = getEvidence();
    ev.termsAccepted = checked;
    onValidationChange?.(checked, checked ? ev : null);
  };

  const handleMarketingChange = (checked: boolean) => {
    setMarketingOptIn(checked);
    const ev = getEvidence();
    ev.marketingOptIn = checked;
    onValidationChange?.(termsAccepted, termsAccepted ? ev : null);
  };

  const handleExportEvidence = () => {
    const evidence = getEvidence();
    const blob = new Blob([JSON.stringify(evidence, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consent-evidence-${userId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <span className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Statutory Consent &amp; Legal Acceptance
        </span>
        <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
          Policy v1.1
        </span>
      </div>

      {/* Mandatory Checkbox 1: Terms + Privacy + AUP + Anti-Spam */}
      <div className="flex items-start gap-3">
        <div className="pt-0.5 shrink-0">
          <input
            id="mandatory-legal-consent"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => handleTermsChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          />
        </div>
        <label
          htmlFor="mandatory-legal-consent"
          className="text-slate-700 leading-relaxed cursor-pointer"
        >
          <span className="font-bold text-slate-900">Required: </span>
          I have read and unconditionally accept the{" "}
          <Link href="/terms" target="_blank" className="text-primary font-medium hover:underline">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/privacy" target="_blank" className="text-primary font-medium hover:underline">
            Privacy Policy
          </Link>
          ,{" "}
          <Link href="/acceptable-use" target="_blank" className="text-primary font-medium hover:underline">
            Acceptable Use Policy
          </Link>
          , and{" "}
          <Link href="/anti-spam" target="_blank" className="text-primary font-medium hover:underline">
            Anti-Spam Policy
          </Link>
          . I certify that all recipient contact lists uploaded will be lawfully collected under documented permission.
        </label>
      </div>

      {/* Optional Checkbox 2: ToolOn Marketing Opt-in */}
      <div className="flex items-start gap-3 pt-2 border-t border-slate-200/60">
        <div className="pt-0.5 shrink-0">
          <input
            id="marketing-optin-consent"
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => handleMarketingChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          />
        </div>
        <label
          htmlFor="marketing-optin-consent"
          className="text-slate-600 leading-relaxed cursor-pointer"
        >
          <span className="font-semibold text-slate-800">Optional: </span>
          Keep me updated on ToolOn product releases, API upgrades, and platform announcements. You can unsubscribe at any time. Acceptance of terms does not require marketing opt-in.
        </label>
      </div>

      {/* Export Evidence Link */}
      {termsAccepted && (
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            Consent logged for regulatory compliance
          </span>
          <button
            type="button"
            onClick={handleExportEvidence}
            className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>{exported ? "Exported" : "Export Audit Log"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
