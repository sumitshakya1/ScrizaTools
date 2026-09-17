"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Lock,
  ExternalLink,
} from "lucide-react";

export function AntiSpamChecklist() {
  const [domainVerified, setDomainVerified] = useState(false);
  const [listCertified, setListCertified] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5 text-xs shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-slate-900 text-sm">
            Outbound Campaign Compliance Pre-Flight
          </h4>
        </div>
        <Link
          href="/anti-spam"
          className="text-primary hover:underline text-[11px] font-medium flex items-center gap-1"
        >
          <span>Anti-Spam Policy</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* SPF Check */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">SPF Authentication</span>
            <span className="text-[11px] text-slate-500">v=spf1 include:toolon.in ~all</span>
          </div>
        </div>

        {/* DKIM Check */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">DKIM Key 2048-bit</span>
            <span className="text-[11px] text-slate-500">toolon._domainkey.verified</span>
          </div>
        </div>

        {/* DMARC Check */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">DMARC Policy</span>
            <span className="text-[11px] text-slate-500">v=DMARC1; p=reject; rua=...</span>
          </div>
        </div>
      </div>

      {/* Threshold Monitor Box */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Reputation &amp; Automatic Enforcement Thresholds
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
            <span>Hard Bounces ≥ 2% → Warning; ≥ 3% → Pause; ≥ 5% → Suspend</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>Spam Complaints ≥ 0.1% → Immediate Account Freeze</span>
          </div>
        </div>
      </div>
    </div>
  );
}
