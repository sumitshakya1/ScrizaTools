"use client";

import React, { useState } from "react";
import { SUBPROCESSORS, Subprocessor } from "@/data/subprocessors";
import { Search, ExternalLink, ShieldCheck, AlertTriangle, Building2, Globe, Server } from "lucide-react";

export function SubprocessorTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "tbd">("all");

  const filtered = SUBPROCESSORS.filter((sp) => {
    const matchesSearch =
      sp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : filterStatus === "active" ? sp.status === "active" : sp.status === "tbd";

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 mb-8">
      {/* Intro info box */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-5 text-xs text-blue-900 leading-relaxed">
        <p className="font-semibold text-sm mb-1 text-blue-950 flex items-center gap-2">
          <Server className="h-4 w-4 text-blue-700" />
          Authorised Infrastructure &amp; Processing Entities
        </p>
        <p>
          In accordance with our <a href="/privacy" className="underline font-medium hover:text-blue-700">Privacy Policy</a> and <a href="/data-processing-addendum" className="underline font-medium hover:text-blue-700">Data Processing Addendum</a>, <strong>Scriza Private Limited</strong> engages select external subprocessors to support secure hosting, network delivery, payment gateway tokenisation, and advertising measurement. Entries marked <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono text-[10px]">TBD</span> indicate vendor evaluations pending final commercial onboarding.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search provider, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All ({SUBPROCESSORS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "active"
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("tbd")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "tbd"
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            TBD / Pending
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Service Category</th>
              <th className="px-4 py-3">Provider &amp; Legal Entity</th>
              <th className="px-4 py-3">Processing Purpose</th>
              <th className="px-4 py-3">Location &amp; Policy</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((sp) => (
              <tr key={sp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3.5 font-semibold text-slate-900">
                  {sp.category}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-slate-900">{sp.provider}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" />
                    <span>{sp.legalEntity}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 max-w-xs text-slate-600 leading-relaxed">
                  {sp.purpose}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <span>{sp.location}</span>
                  </div>
                  {sp.privacyPolicyUrl && (
                    <a
                      href={sp.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                    >
                      <span>Privacy Notice</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {sp.status === "active" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      <AlertTriangle className="h-3 w-3" />
                      TBD — In Review
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
