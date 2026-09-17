"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import { QuickToolSwitcher } from "@/components/tools/shared/quick-tool-switcher";
import { imageTools, convertToPdfTools, convertFromPdfTools, pdfUtilityTools, pdfTools, allTools } from "@/data/tools";

interface ToolPageLayoutProps {
  toolId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  faqComponent?: React.ReactNode;
}

export function ToolPageLayout({
  toolId,
  title,
  description,
  children,
  faqComponent,
}: ToolPageLayoutProps) {
  const isPdfTool = pdfTools.some((t) => t.id === toolId);
  const otherTools = allTools.filter((t) => t.id !== toolId);

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-on-surface flex flex-col">
      <Navbar />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-surface-dim bg-white">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-12 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-tertiary">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-surface-dim" />
            <Link
              href={isPdfTool ? "/#pdf-tools" : "/#image-tools"}
              className="hover:text-primary transition-colors"
            >
              {isPdfTool ? "PDF Tools" : "Image Tools"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-surface-dim" />
            <span className="font-semibold text-on-surface">{title}</span>
          </nav>
        </div>
      </div>

      {/* Main Tool Area */}
      <main className="flex-1 mx-auto max-w-[1536px] w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Tool Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-tertiary max-w-2xl">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Browser-Based Processing • Private
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Controls */}
          <div className="lg:col-span-8 space-y-6">
            {children}

            {faqComponent}
          </div>

          {/* Right Rail */}
          <aside className="lg:col-span-4 space-y-6 sticky top-20">
            <AdSlot
              placement="sticky-rail"
              format="skyscraper"
              adUnitId="tool-sidebar-skyscraper-1"
            />

            {/* Compact Quick Tool Switcher — only active category expanded */}
            <QuickToolSwitcher toolId={toolId} isPdfTool={isPdfTool} />
          </aside>
        </div>

        {/* Bottom Ad removed — sidebar ad already provides REMOVE ADS option */}
      </main>

      <Footer />
    </div>
  );
}
