"use client";

import React, { useState } from "react";
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
  Bot,
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
        isLive: true,
      },
      {
        name: "Remove Pages",
        href: "/remove-pdf-pages",
        desc: "Delete unwanted pages",
        icon: FileMinus,
        isLive: true,
      },
      {
        name: "Extract Pages",
        href: "/extract-pdf-pages",
        desc: "Export selected pages",
        icon: ArrowDownToLine,
        isLive: true,
      },
      {
        name: "Organize PDF",
        href: "/organize-pdf",
        desc: "Sort, rotate, and rearrange",
        icon: Layers,
        isLive: true,
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
        isLive: true,
      },
      {
        name: "Scan to PDF",
        href: "/scan-to-pdf",
        desc: "Convert images to PDF",
        icon: Camera,
        isLive: true,
      },
      {
        name: "OCR PDF",
        href: "/ocr-pdf",
        desc: "Make text searchable",
        icon: ScanText,
        isLive: true,
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
        isLive: true,
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
        isLive: true,
      },
      {
        name: "Add page numbers",
        href: "/add-page-numbers",
        desc: "Insert page numbers in PDF",
        icon: Hash,
        isLive: true,
      },
      {
        name: "Add watermark",
        href: "/add-watermark",
        desc: "Stamp image or text over PDF",
        icon: Stamp,
        isLive: true,
      },
      {
        name: "Crop PDF",
        href: "/crop-pdf",
        desc: "Trim margins and edges",
        icon: Crop,
        isLive: true,
      },
      {
        name: "Edit PDF",
        href: "/edit-pdf",
        desc: "Add text, images, annotations",
        icon: FilePenLine,
        isLive: true,
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
        desc: "Remove PDF password",
        icon: Unlock,
        isLive: true,
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
        isLive: true,
      },
      {
        name: "Redact PDF",
        href: "/redact-pdf",
        desc: "Remove sensitive information",
        icon: EyeOff,
        isLive: true,
      },
      {
        name: "Compare PDF",
        href: "/compare-pdf",
        desc: "Find differences between files",
        icon: GitCompare,
        isLive: true,
      },
    ],
  },
  /*
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
        desc: "Chat and extract insights",
        icon: Bot,
        isLive: true,
      },
      {
        name: "Translate PDF",
        href: "/translate-pdf",
        desc: "Convert to 100+ languages",
        icon: Languages,
        isLive: true,
      },
      {
        name: "PDF to Markdown",
        href: "/pdf-to-markdown",
        desc: "Extract to MD format",
        icon: FileCode,
        isLive: true,
      },
    ],
  },
  */
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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  if (!isOpen || PDF_MEGA_MENU_CATEGORIES.length === 0) return null;

  const safeIndex = Math.min(Math.max(0, activeCategoryIndex), PDF_MEGA_MENU_CATEGORIES.length - 1);
  const activeCategory = PDF_MEGA_MENU_CATEGORIES[safeIndex] || PDF_MEGA_MENU_CATEGORIES[0];

  if (!activeCategory) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 pt-2 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/12 overflow-hidden backdrop-blur-xl flex flex-col md:flex-row">
          
          {/* Left Pane: Categories Sidebar */}
          <div className="w-full md:w-64 lg:w-72 bg-slate-50/80 border-r border-slate-100 p-4 lg:p-6 flex flex-col gap-2 shrink-0">
            <h4 className="text-[11px] font-black tracking-wider text-slate-500 uppercase mb-2 px-3">
              Categories
            </h4>
            <div className="flex flex-col gap-1">
              {PDF_MEGA_MENU_CATEGORIES.map((category, index) => {
                const isActive = activeCategoryIndex === index;
                return (
                  <button
                    key={category.title}
                    type="button"
                    onMouseEnter={() => setActiveCategoryIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-default text-left ${
                      isActive
                        ? "bg-white shadow-sm border border-slate-200/60"
                        : "hover:bg-slate-100/60 border border-transparent"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold ${
                        isActive ? "text-primary" : "text-slate-600"
                      }`}
                    >
                      {category.title}
                    </span>
                    {isActive && (
                      <ArrowRight className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Tools Grid */}
          <div className="flex-1 bg-white p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-800 capitalize tracking-tight">
                  {activeCategory.title.toLowerCase()}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                {activeCategory.tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={onClose}
                      className={`group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 transition-all shadow-sm ${activeCategory.color.hoverBg} hover:shadow-md hover:border-transparent`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${activeCategory.color.iconBg}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      {/* Tool Info */}
                      <div className="min-w-0 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
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
                          <p className="text-xs text-slate-500 leading-snug">
                            {tool.desc}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Strip of Right Pane */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Shield className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-slate-600">
                  100% Client-Side Processing • Your files never leave your device
                </span>
              </div>
              <Link
                href="/#pdf-tools"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
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
