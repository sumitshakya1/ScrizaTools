"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Layers,
  Scale,
  Building2,
  Cookie,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { LEGAL_COMPANY_INFO } from "@/data/policies";

export function Footer() {
  const handleOpenPrivacyChoices = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("toolon-open-cookie-settings"));
    }
  };

  return (
    <footer className="relative border-t border-[#1C3A6B]/80 bg-gradient-to-b from-[#07152B] via-[#061224] to-[#040C19] text-slate-200 pt-16 pb-12 overflow-hidden">
      {/* Subtle Ambient Background Lighting matching Brand Palette */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#0070F3]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-[#0284C7]/10 blur-[90px]" />

      {/* Top Accent Glowing Border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0070F3] via-40% via-[#38BDF8] via-70% to-[#F59E0B]/70" />

      <div className="relative mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-12">
        {/* Main 12-Column Systematic Grid (3 - 2 - 2 - 2 - 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* Col 1: Brand & Operating Entity (Span 3) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Logo Card with refined shadow and subtle border */}
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2.5 bg-white rounded-2xl shadow-xl shadow-black/30 hover:shadow-blue-500/25 border border-white/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070F3] group"
                aria-label="ToolOn Homepage"
              >
                <Image
                  src="/toolon-logo.png"
                  alt="ToolOn.in - Tools for Everyday Tasks"
                  width={240}
                  height={75}
                  className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Link>

              {/* Entity Title & Verification Tag */}
              <div className="space-y-2">
                <p className="text-lg font-bold text-white tracking-tight">
                  Operated by {LEGAL_COMPANY_INFO.legalName}
                </p>
                
                <div className="inline-flex items-center gap-1.5 font-mono text-sm text-blue-200 bg-[#0C2244] border border-[#1D3E74] px-3 py-1 rounded-md shadow-sm">
                  <span className="text-slate-400 font-sans text-xs">CIN:</span>
                  <span className="font-semibold text-white tracking-wider">{LEGAL_COMPANY_INFO.cin}</span>
                </div>
              </div>

              {/* Mission Statement */}
              <p className="text-slate-300 text-[16px] leading-relaxed max-w-sm">
                High-performance, browser-native file and image utilities engineered for speed, privacy, and seamless everyday productivity.
              </p>
            </div>

            {/* Quick Privacy Control */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleOpenPrivacyChoices}
                className="group inline-flex items-center gap-2 rounded-xl border border-[#1C3A6B] bg-[#0A1E3C] hover:bg-[#102B54] hover:border-[#38BDF8]/60 px-4 py-2.5 text-[15px] font-semibold text-white transition-all shadow-sm cursor-pointer"
              >
                <Cookie className="h-4.5 w-4.5 text-[#38BDF8] group-hover:rotate-12 transition-transform duration-200" />
                <span>Manage Privacy Choices</span>
              </button>
            </div>
          </div>

          {/* Col 2: Legal & Governance (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#1C3A6B]/50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0070F3]/15 text-[#38BDF8] border border-[#0070F3]/30">
                <Scale className="h-4 w-4" />
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Legal &amp; Terms
              </h4>
            </div>
            
            <ul className="space-y-3 text-[16px]">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/acceptable-use", label: "Acceptable Use Policy" },
                { href: "/data-processing-addendum", label: "Data Processing Addendum" },
                { href: "/security", label: "Security & Disclosure" },
                { href: "/disclaimer", label: "Service Disclaimer" },
                { href: "/copyright", label: "Copyright & IP Complaints" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-slate-300 hover:text-white transition-all duration-200 py-0.5"
                  >
                    <ChevronRight className="h-4 w-4 text-[#38BDF8] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 mr-1.5 shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Privacy & Compliance (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#1C3A6B]/50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-[#34D399] border border-emerald-500/30">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Privacy &amp; Policy
              </h4>
            </div>
            
            <ul className="space-y-3 text-[16px]">
              {[
                { href: "/cookies", label: "Cookie Policy" },
                { href: "/anti-spam", label: "Anti-Spam & Email Policy" },
                { href: "/advertising-disclosure", label: "Advertising Disclosure" },
                { href: "/subprocessors", label: "Subprocessor List" },
                { href: "/refund-cancellation", label: "Refund & Cancellation" },
                { href: "/delivery", label: "Digital Delivery Policy" },
                { href: "/grievance", label: "Grievance Redressal" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-slate-300 hover:text-white transition-all duration-200 py-0.5"
                  >
                    <ChevronRight className="h-4 w-4 text-[#34D399] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 mr-1.5 shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Core Online Tools (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#1C3A6B]/50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0284C7]/15 text-[#38BDF8] border border-[#0284C7]/30">
                <Layers className="h-4 w-4" />
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Core Free Tools
              </h4>
            </div>
            
            <ul className="space-y-3 text-[16px]">
              {[
                { href: "/image-resizer", label: "Image Resizer" },
                { href: "/image-compressor", label: "Image Compressor" },
                { href: "/bulk-image-resizer", label: "Bulk Resizer" },
                { href: "/images-to-pdf", label: "Images to PDF" },
                { href: "/pdf-to-word", label: "PDF to Word" },
                { href: "/pdf-merger", label: "PDF Merger & Split" },
                { href: "/pdf-compressor", label: "PDF Compressor" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-slate-300 hover:text-white transition-all duration-200 py-0.5"
                  >
                    <ChevronRight className="h-4 w-4 text-[#38BDF8] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 mr-1.5 shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Corporate Office & Contact Card (Span 3) */}
          <div className="lg:col-span-3">
            <div className="h-full rounded-2xl bg-[#091D3A]/70 border border-[#1D3E74]/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1C3A6B]/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-[#F87171] border border-rose-500/30">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    Corporate Office
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  HQ
                </span>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-2.5 text-[15px] sm:text-[16px] text-slate-300 leading-relaxed">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-[#F87171] mt-1" />
                <span>
                  NX One, T1, 507, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201318, India
                </span>
              </div>

              {/* Direct Communications Matrix */}
              <div className="space-y-3 pt-3 border-t border-[#1C3A6B]/70 text-[15px] sm:text-[16px]">
                {/* Phone */}
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <a
                    href={`tel:${LEGAL_COMPANY_INFO.phone}`}
                    className="font-semibold text-white hover:text-[#38BDF8] transition-colors"
                  >
                    {LEGAL_COMPANY_INFO.phone}
                  </a>
                </div>

                {/* Support Email */}
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${LEGAL_COMPANY_INFO.generalSupportEmail}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {LEGAL_COMPANY_INFO.generalSupportEmail}
                  </a>
                </div>

                {/* Grievance & Legal */}
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#34D399] shrink-0" />
                  <a
                    href={`mailto:${LEGAL_COMPANY_INFO.grievanceEmail}`}
                    className="text-slate-300 hover:text-[#34D399] transition-colors"
                    title="Official Grievance Officer & Statutory Disclosures"
                  >
                    Legal: {LEGAL_COMPANY_INFO.grievanceEmail}
                  </a>
                </div>

                {/* Business Hours */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 pt-1.5 border-t border-[#1C3A6B]/50">
                  <Clock className="h-4 w-4 shrink-0 text-amber-400/80" />
                  <span>{LEGAL_COMPANY_INFO.businessHours}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar: Systematic 2-Tier Alignment */}
        <div className="border-t border-[#1C3A6B]/70 pt-8 mt-4 space-y-5">
          
          {/* Tier 1: Horizontal Navigation & Registered Office */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <nav aria-label="Secondary footer links" className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[16px] text-slate-300">
              <Link href="/company" className="hover:text-white transition-colors">
                Company Info
              </Link>
              <span className="text-slate-600 select-none">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="text-slate-600 select-none">•</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-slate-600 select-none">•</span>
              <Link href="/anti-spam" className="hover:text-white transition-colors">
                Anti-Spam
              </Link>
              <span className="text-slate-600 select-none">•</span>
              <button
                type="button"
                onClick={handleOpenPrivacyChoices}
                className="inline-flex items-center gap-1.5 text-[#38BDF8] hover:text-white font-medium cursor-pointer transition-colors"
              >
                <Cookie className="h-4 w-4" />
                <span>Privacy Choices</span>
              </button>
            </nav>

            <div className="flex items-center gap-2 text-sm sm:text-[15px] text-slate-400 bg-[#0A1E3C]/60 border border-[#1C3A6B]/60 px-3.5 py-1.5 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>Registered Office: Udaipur, Rajasthan, India</span>
            </div>
          </div>

          {/* Tier 2: Legal Disclosures & Compliance Badge */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3 text-[14px] sm:text-[15px] text-slate-400 text-center md:text-left">
            <p className="text-slate-400 leading-relaxed">
              © 2026 <strong className="text-white font-semibold">ToolOn</strong> (www.toolon.in). All rights reserved. Operated by <strong className="text-white font-semibold">Scriza Private Limited</strong>.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-medium text-emerald-400 shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Consumer Protection (E-Commerce) &amp; Indian DPDP Compliant</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}

