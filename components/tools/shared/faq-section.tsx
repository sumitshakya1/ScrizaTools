"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  toolName: string;
  items: FAQItem[];
}

export function FAQSection({ toolName, items }: FAQSectionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Open first by default

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="rounded-xl border border-surface-dim bg-white shadow-card overflow-hidden mt-8">
      <div className="border-b border-surface-dim/60 bg-surface-low/60 px-5 py-4 sm:px-6 flex items-center gap-2.5">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-base sm:text-lg font-bold text-on-surface">
          Frequently Asked Questions about {toolName}
        </h2>
      </div>

      <div className="divide-y divide-surface-dim/60 p-2 sm:p-4">
        {items.map((item, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div key={idx} className="py-3 px-3">
              <button
                onClick={() => toggleIndex(idx)}
                className="flex w-full items-center justify-between gap-4 text-left font-semibold text-xs sm:text-sm text-on-surface hover:text-primary transition-colors focus:outline-none"
              >
                <span>{item.question}</span>
                <span className="shrink-0 text-tertiary">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="mt-2 text-xs sm:text-sm text-tertiary leading-relaxed animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
