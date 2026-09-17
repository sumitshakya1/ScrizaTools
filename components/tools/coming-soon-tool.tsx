"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Clock, ArrowRight, ShieldCheck, CheckCircle2, BellRing, FileText } from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { allTools, Tool } from "@/data/tools";

interface ComingSoonToolProps {
  toolId: string;
}

export function ComingSoonTool({ toolId }: ComingSoonToolProps) {
  const currentTool = allTools.find((t) => t.id === toolId) || {
    id: toolId,
    name: toolId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    description: "This tool is currently in active development and will be released very soon.",
    features: ["Browser-Based Processing", "Secure Client Execution", "Zero File Retention"],
    bulletPoints: [],
  };

  const otherLiveTools = allTools.filter((t) => t.badge === "Live" || t.badge === "Popular" || t.id !== toolId).slice(0, 4);

  const COMING_SOON_FAQS: FAQItem[] = [
    {
      question: `When will ${currentTool.name} be available?`,
      answer:
        "Our engineering team is actively building and optimizing this tool for high-performance execution directly in your browser. It will be launched in an upcoming weekly release.",
    },
    {
      question: "Will this tool be free to use?",
      answer:
        "Yes! Core Browser Tools may be used without an account, subject to fair usage. Paid Communication Services require an account and plan.",
    },
    {
      question: "Which tools can I use right now?",
      answer:
        "You can currently use Images to PDF, Image Resizer, Image Compressor, Bulk Resizer, Image Converter, Cropper, and Format Converter.",
    },
  ];

  return (
    <ToolPageLayout
      toolId={toolId}
      title={currentTool.name}
      description={currentTool.description}
    >
      <div className="space-y-8">
        {/* Coming Soon Hero Banner Card */}
        <ToolSectionCard
          title={`${currentTool.name} — Coming Soon`}
          subtitle="This utility is under final development and testing."
          badge="In Progress"
        >
          <div className="py-8 px-4 text-center max-w-xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm mb-4">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-navy">
              {currentTool.name} is Coming Soon!
            </h2>
            <p className="mt-2 text-sm text-tertiary leading-relaxed">
              We are finalizing the client-side WebAssembly engine for {currentTool.name}. You will be able to process files directly on your device with complete security.
            </p>

            {/* Planned Feature Highlights */}
            {currentTool.bulletPoints && currentTool.bulletPoints.length > 0 && (
              <div className="mt-6 text-left rounded-xl border border-surface-dim bg-slate-50/70 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Planned Capabilities:
                </h4>
                <ul className="space-y-2">
                  {currentTool.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-tertiary">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA back to live tools */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/images-to-pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>Try Images to PDF (Live Now)</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-surface-dim bg-white px-6 py-3 text-xs font-semibold text-navy hover:bg-slate-50 transition-colors"
              >
                <span>Browse All Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ToolSectionCard>

        {/* Live Tools Showcase */}
        <div className="rounded-xl border border-surface-dim bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Popular Tools Available Today
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherLiveTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group flex items-center justify-between p-3.5 rounded-lg border border-surface-dim hover:border-primary/50 hover:bg-surface-low transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-[11px] text-tertiary line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection toolName={currentTool.name} items={COMING_SOON_FAQS} />
      </div>
    </ToolPageLayout>
  );
}
