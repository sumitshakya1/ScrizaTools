"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import { imageTools, pdfTools, allTools } from "@/data/tools";

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
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
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                100% Client-Side • Private
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left Tool Content (approx 70-75%) + Right Sticky Ad Rail (approx 25-30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Controls & Processing Column */}
          <div className="lg:col-span-8 space-y-6">
            {children}

            {/* Bottom FAQ Section */}
            {faqComponent}

            {/* Related Tools Grid */}
            <div className="rounded-xl border border-surface-dim bg-white p-5 sm:p-6 shadow-card mt-8">
              <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Explore Other Free Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherTools.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group flex items-center justify-between p-3 rounded-lg border border-surface-dim hover:border-primary/50 hover:bg-surface-low transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-tertiary line-clamp-1 mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Sticky Ads and Quick Utility Box */}
          <aside className="lg:col-span-4 space-y-6 sticky top-20">
            {/* Top Ad in Right Rail */}
            <AdSlot
              placement="sticky-rail"
              format="skyscraper"
              adUnitId="tool-sidebar-skyscraper-1"
            />

            {/* Quick Tool Navigation Box */}
            <div className="rounded-xl border border-surface-dim bg-white p-4 shadow-card">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
                Quick Tool Switcher
              </h3>
              
              {/* Image Tools group */}
              <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider px-2 mb-1">Image Tools</p>
              <div className="space-y-1 mb-4">
                {imageTools.map((tool) => {
                  const isActive = tool.id === toolId;
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white font-bold"
                          : "text-tertiary hover:bg-surface-low hover:text-on-surface"
                      }`}
                    >
                      <span>{tool.name}</span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </Link>
                  );
                })}
              </div>

              {/* PDF Tools group */}
              <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider px-2 mb-1">PDF Tools</p>
              <div className="space-y-1">
                {pdfTools.map((tool) => {
                  const isActive = tool.id === toolId;
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white font-bold"
                          : "text-tertiary hover:bg-surface-low hover:text-on-surface"
                      }`}
                    >
                      <span>{tool.name}</span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* Full-width Horizontal Bottom Ad */}
        <div className="mt-10">
          <AdSlot
            placement="hero-bottom"
            format="banner"
            adUnitId="tool-bottom-leaderboard"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
