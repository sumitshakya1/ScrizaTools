"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { imageTools, convertToPdfTools, convertFromPdfTools, pdfUtilityTools } from "@/data/tools";

interface ToolCategory {
  label: string;
  tools: typeof imageTools;
}

const CATEGORIES: ToolCategory[] = [
  { label: "Image Tools", tools: imageTools },
  { label: "Convert to PDF", tools: convertToPdfTools },
  { label: "Convert from PDF", tools: convertFromPdfTools },
  { label: "PDF Utilities", tools: pdfUtilityTools },
];

function getActiveCategory(toolId: string): string {
  for (const cat of CATEGORIES) {
    if (cat.tools.some((t) => t.id === toolId)) return cat.label;
  }
  return CATEGORIES[0].label;
}

interface QuickToolSwitcherProps {
  toolId: string;
  isPdfTool: boolean;
}

export function QuickToolSwitcher({ toolId }: QuickToolSwitcherProps) {
  const activeCategoryLabel = getActiveCategory(toolId);
  const [expandedCategory, setExpandedCategory] = useState<string>(activeCategoryLabel);

  const toggleCategory = (label: string) => {
    setExpandedCategory((prev) => (prev === label ? "" : label));
  };

  return (
    <div className="rounded-xl border border-surface-dim bg-white shadow-card overflow-hidden">
      <h3 className="text-[11px] font-bold text-on-surface uppercase tracking-wider px-4 pt-3.5 pb-2">
        Quick Tool Switcher
      </h3>

      <div className="pb-1">
        {CATEGORIES.map((cat) => {
          const isExpanded = expandedCategory === cat.label;
          const hasActiveTool = cat.tools.some((t) => t.id === toolId);

          return (
            <div key={cat.label}>
              {/* Category header — clickable to expand/collapse */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.label)}
                className={`w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  hasActiveTool
                    ? "text-primary bg-primary-fixed/30"
                    : "text-tertiary hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {cat.label}
                  <span className="text-[9px] font-semibold text-tertiary/60 normal-case tracking-normal">
                    ({cat.tools.length})
                  </span>
                </span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded tool list */}
              {isExpanded && (
                <div className="px-2 pb-2 space-y-0.5">
                  {cat.tools.map((tool) => {
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
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                        {!isActive && tool.badge === "Soon" && (
                          <span className="text-[9px] text-amber-600 font-bold">
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
