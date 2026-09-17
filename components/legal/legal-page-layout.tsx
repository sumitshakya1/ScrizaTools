"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  FileText,
  Printer,
  Share2,
  Check,
  ExternalLink,
  Phone,
  Mail,
  Scale,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LEGAL_COMPANY_INFO, POLICIES, PolicyHeading } from "@/data/policies";

interface LegalPageLayoutProps {
  policyId: string;
  title: string;
  description?: string;
  headings?: PolicyHeading[];
  htmlContent: string;
  children?: React.ReactNode;
}

export function LegalPageLayout({
  policyId,
  title,
  description,
  headings = [],
  htmlContent,
  children,
}: LegalPageLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.anchor))
        .filter(Boolean) as HTMLElement[];

      const scrollPos = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const elem = headingElements[i];
        if (elem.offsetTop <= scrollPos) {
          setActiveHeading(elem.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const otherPolicies = POLICIES.filter((p) => p.id !== policyId).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-primary-fixed selection:text-primary">
      <Navbar />

      {/* Top Breadcrumbs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-12 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <Link href="/company" className="hover:text-primary transition-colors">
              Compliance &amp; Legal
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          </nav>
        </div>
      </div>

      {/* Header Banner */}
      <header className="border-b border-slate-200 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                <Building2 className="h-3.5 w-3.5" />
                <span>{LEGAL_COMPANY_INFO.legalName} • CIN {LEGAL_COMPANY_INFO.cin}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Effective date: {LEGAL_COMPANY_INFO.effectiveDate}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span>Jurisdiction: India</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Statutory Compliance Verified</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                title="Copy shareable link"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                title="Print or save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-[1536px] w-full px-6 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents (Sticky on Desktop) */}
          {headings.length > 0 && (
            <aside className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1 sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Table of Contents
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {headings.length} sections
                  </span>
                </div>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 text-xs">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.anchor}`}
                      className={`block py-1.5 px-2.5 rounded-md transition-colors text-[13.5px] leading-snug ${
                        activeHeading === h.anchor
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {h.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Company Quick Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  Legal Authority
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Operated by <strong className="text-slate-800">{LEGAL_COMPANY_INFO.legalName}</strong>.
                  CIN: <span className="font-mono text-[11px]">{LEGAL_COMPANY_INFO.cin}</span>.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-700">Legal Notices &amp; Redressal:</p>
                      <a href={`mailto:${LEGAL_COMPANY_INFO.grievanceEmail}`} className="text-primary hover:underline">
                        {LEGAL_COMPANY_INFO.grievanceEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-700">Corporate Phone:</p>
                      <a href={`tel:${LEGAL_COMPANY_INFO.phone}`} className="text-primary hover:underline">
                        {LEGAL_COMPANY_INFO.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Policies Link Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs">
                <h4 className="font-bold text-slate-900 mb-2.5">Related Policies</h4>
                <ul className="space-y-1.5">
                  {otherPolicies.map((op) => (
                    <li key={op.id}>
                      <Link
                        href={op.route}
                        className="text-slate-600 hover:text-primary transition-colors flex items-center justify-between py-1 group"
                      >
                        <span className="truncate group-hover:translate-x-0.5 transition-transform">
                          {op.title}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Legal Text Body */}
          <main
            className={`${
              headings.length > 0
                ? "lg:col-span-8 xl:col-span-9 order-1 lg:order-2"
                : "lg:col-span-12"
            } rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs`}
          >
            {/* Custom JSX Children if provided (e.g. Subprocessors table) */}
            {children}

            {/* Verbatim Rendered HTML from Source Document */}
            {htmlContent && (
              <div
                className="legal-document-content max-w-none text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}

            {/* Bottom Disclaimer Notice */}
            <div className="mt-12 rounded-xl bg-slate-50 border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span>Statutory Publication Notice</span>
              </div>
              <p className="leading-relaxed">
                This document constitutes an official policy of <strong>{LEGAL_COMPANY_INFO.legalName}</strong> for the <strong>{LEGAL_COMPANY_INFO.brand}</strong> online service platform. These terms are effective as of <strong>{LEGAL_COMPANY_INFO.effectiveDate}</strong>. Continued use of ToolOn browser tools or subscription communication services signifies complete agreement with these binding terms.
              </p>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
