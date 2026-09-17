"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Split,
  FileMinus,
  FileText,
  Camera,
  Wand2,
  FileCog,
  ScanText,
  FileImage,
  Presentation,
  FileSpreadsheet,
  Globe,
  ArrowDownToLine,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  FilePenLine,
  Unlock,
  ShieldCheck,
  PenTool,
  EyeOff,
  GitCompare,
  Sparkles,
  Languages,
  FileCode,
  ArrowRight,
  Shield,
  FileArchive,
  LucideIcon,
} from "lucide-react";

export interface MegaMenuItem {
  name: string;
  href: string;
  desc?: string;
  icon: LucideIcon;
  isLive: boolean;
  badge?: string;
}

export interface MegaMenuCategory {
  title: string;
  color: {
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
    hoverBg: string;
    border: string;
  };
  tools: MegaMenuItem[];
}

export const PDF_MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    title: "ORGANIZE PDF",
    color: {
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-700",
      iconBg: "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
      iconText: "text-rose-600",
      hoverBg: "hover:bg-rose-50/50",
      border: "border-rose-100",
    },
    tools: [
      {
        name: "Merge PDF",
        href: "/pdf-merger",
        desc: "Combine PDFs in custom order",
        icon: Layers,
        isLive: true,
      },
      {
        name: "Split PDF",
        href: "/split-pdf",
        desc: "Separate pages into files",
        icon: Split,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Remove Pages",
        href: "/remove-pdf-pages",
        desc: "Delete unwanted pages",
        icon: FileMinus,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Extract Pages",
        href: "/extract-pdf-pages",
        desc: "Export selected pages",
        icon: ArrowDownToLine,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Organize PDF",
        href: "/organize-pdf",
        desc: "Sort, rotate, and rearrange",
        icon: Layers,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Scan to PDF",
        href: "/scan-to-pdf",
        desc: "Capture document to PDF",
        icon: Camera,
        isLive: false,
        badge: "Soon",
      },
    ],
  },
  {
    title: "OPTIMIZE PDF",
    color: {
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
      iconText: "text-emerald-600",
      hoverBg: "hover:bg-emerald-50/50",
      border: "border-emerald-100",
    },
    tools: [
      {
        name: "Compress PDF",
        href: "/pdf-compressor",
        desc: "Reduce size, retain sharpness",
        icon: Wand2,
        isLive: true,
        badge: "Popular",
      },
      {
        name: "Repair PDF",
        href: "/repair-pdf",
        desc: "Fix corrupted PDF files",
        icon: FileCog,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "OCR PDF",
        href: "/ocr-pdf",
        desc: "Make scanned text searchable",
        icon: ScanText,
        isLive: false,
        badge: "Soon",
      },
    ],
  },
  {
    title: "CONVERT TO PDF",
    color: {
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
      iconText: "text-amber-600",
      hoverBg: "hover:bg-amber-50/50",
      border: "border-amber-100",
    },
    tools: [
      {
        name: "JPG to PDF",
        href: "/jpg-to-pdf",
        desc: "Convert photos into PDF",
        icon: FileImage,
        isLive: true,
      },
      {
        name: "Images to PDF",
        href: "/images-to-pdf",
        desc: "Batch JPG, PNG to single PDF",
        icon: FileImage,
        isLive: true,
        badge: "Popular",
      },
      {
        name: "WORD to PDF",
        href: "/word-to-pdf",
        desc: "DOCX / DOC to clean PDF",
        icon: FileText,
        isLive: true,
      },
      {
        name: "POWERPOINT to PDF",
        href: "/pptx-to-pdf",
        desc: "PPTX slides to PDF doc",
        icon: Presentation,
        isLive: true,
      },
      {
        name: "EXCEL to PDF",
        href: "/excel-to-pdf",
        desc: "XLSX spreadsheets to PDF",
        icon: FileSpreadsheet,
        isLive: true,
      },
      {
        name: "HTML to PDF",
        href: "/html-to-pdf",
        desc: "Web page and HTML code",
        icon: Globe,
        isLive: true,
      },
    ],
  },
  {
    title: "CONVERT FROM PDF",
    color: {
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
      iconText: "text-blue-600",
      hoverBg: "hover:bg-blue-50/50",
      border: "border-blue-100",
    },
    tools: [
      {
        name: "PDF to JPG",
        href: "/pdf-to-image",
        desc: "Extract high-DPI images",
        icon: FileImage,
        isLive: true,
      },
      {
        name: "PDF to WORD",
        href: "/pdf-to-word",
        desc: "Convert to editable DOCX",
        icon: FileText,
        isLive: true,
        badge: "Popular",
      },
      {
        name: "PDF to POWERPOINT",
        href: "/pdf-to-pptx",
        desc: "Extract pages into slides",
        icon: Presentation,
        isLive: true,
      },
      {
        name: "PDF to EXCEL",
        href: "/pdf-to-excel",
        desc: "Extract tables into XLSX",
        icon: FileSpreadsheet,
        isLive: true,
      },
      {
        name: "PDF to PDF/A",
        href: "/pdf-to-pdfa",
        desc: "Standard long-term archive",
        icon: FileArchive,
        isLive: false,
        badge: "Soon",
      },
    ],
  },
  {
    title: "EDIT PDF",
    color: {
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-700",
      iconBg: "bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
      iconText: "text-purple-600",
      hoverBg: "hover:bg-purple-50/50",
      border: "border-purple-100",
    },
    tools: [
      {
        name: "Rotate PDF",
        href: "/rotate-pdf",
        desc: "Rotate pages 90° or 180°",
        icon: RotateCw,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Add page numbers",
        href: "/pdf-page-numbers",
        desc: "Insert page numbers easily",
        icon: Hash,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Add watermark",
        href: "/pdf-watermark",
        desc: "Stamp text or image over PDF",
        icon: Stamp,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Crop PDF",
        href: "/crop-pdf",
        desc: "Trim margins and edges",
        icon: Crop,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Edit PDF",
        href: "/edit-pdf",
        desc: "Add text, shapes, highlights",
        icon: FilePenLine,
        isLive: false,
        badge: "Soon",
      },
    ],
  },
  {
    title: "PDF SECURITY",
    color: {
      badgeBg: "bg-cyan-50",
      badgeText: "text-cyan-700",
      iconBg: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white",
      iconText: "text-cyan-600",
      hoverBg: "hover:bg-cyan-50/50",
      border: "border-cyan-100",
    },
    tools: [
      {
        name: "Unlock PDF",
        href: "/unlock-pdf",
        desc: "Remove PDF password security",
        icon: Unlock,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Protect PDF",
        href: "/pdf-protect",
        desc: "Encrypt with strong password",
        icon: ShieldCheck,
        isLive: true,
      },
      {
        name: "Sign PDF",
        href: "/sign-pdf",
        desc: "Draw or upload signature",
        icon: PenTool,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Redact PDF",
        href: "/redact-pdf",
        desc: "Blackout confidential text",
        icon: EyeOff,
        isLive: false,
        badge: "Soon",
      },
      {
        name: "Compare PDF",
        href: "/compare-pdf",
        desc: "Side-by-side visual diff",
        icon: GitCompare,
        isLive: false,
        badge: "Soon",
      },
    ],
  },
  {
    title: "PDF INTELLIGENCE",
    color: {
      badgeBg: "bg-indigo-50",
      badgeText: "text-indigo-700",
      iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white",
      iconText: "text-indigo-600",
      hoverBg: "hover:bg-indigo-50/50",
      border: "border-indigo-100",
    },
    tools: [
      {
        name: "AI Summarizer",
        href: "/pdf-ai-summarizer",
        desc: "Extract executive summary",
        icon: Sparkles,
        isLive: false,
        badge: "AI",
      },
      {
        name: "Translate PDF",
        href: "/translate-pdf",
        desc: "Translate into 50+ languages",
        icon: Languages,
        isLive: false,
        badge: "AI",
      },
      {
        name: "PDF to Markdown",
        href: "/pdf-to-markdown",
        desc: "Extract tables and clean MD",
        icon: FileCode,
        isLive: false,
        badge: "Soon",
      },
    ],
  },
];

interface PdfMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function PdfMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: PdfMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 pt-2 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/12 overflow-hidden backdrop-blur-xl">
          
          {/* Main 7-Column Grid Layout */}
          <div className="p-6 lg:p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-4 xl:gap-6 bg-gradient-to-b from-slate-50/60 to-white">
            {PDF_MEGA_MENU_CATEGORIES.map((category) => (
              <div key={category.title} className="flex flex-col space-y-3 min-w-0">
                
                {/* Column Category Title */}
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-[11px] font-black tracking-wider text-slate-500 uppercase">
                    {category.title}
                  </h4>
                </div>

                {/* Column Items */}
                <ul className="space-y-1">
                  {category.tools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          onClick={onClose}
                          className={`group flex items-start gap-2.5 p-2 rounded-xl transition-all ${category.color.hoverBg}`}
                        >
                          {/* Vibrant Icon Box */}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${category.color.iconBg}`}
                          >
                            <IconComponent className="h-3.5 w-3.5" />
                          </div>

                          {/* Tool Name and Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[13px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span
                                  className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                                    tool.badge === "Popular"
                                      ? "bg-amber-100 text-amber-800"
                                      : tool.badge === "AI"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            {tool.desc && (
                              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 leading-snug">
                                {tool.desc}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Feature Strip */}
          <div className="bg-slate-50/90 border-t border-slate-100 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Shield className="h-3 w-3" />
              </span>
              <span className="font-medium text-slate-700">
                100% Client-Side Processing • Your files never leave your device
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/#pdf-tools"
                onClick={onClose}
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
              >
                <span>View All In Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
