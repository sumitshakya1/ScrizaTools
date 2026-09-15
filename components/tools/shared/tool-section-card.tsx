import React from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface ToolSectionCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  infoTooltip?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
  actionButton?: React.ReactNode;
}

export function ToolSectionCard({
  title,
  subtitle,
  badge,
  infoTooltip,
  children,
  collapsible = false,
  defaultOpen = true,
  className = "",
  actionButton,
}: ToolSectionCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <section className={`rounded-xl border border-surface-dim bg-white shadow-card transition-all duration-200 ${className}`}>
      {/* Card Header matching RedKetchup style */}
      <div className="flex items-center justify-between border-b border-surface-dim/60 bg-surface-low/60 px-5 py-3.5 sm:px-6 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-on-surface tracking-tight flex items-center gap-2">
            {title}
            {badge && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {badge}
              </span>
            )}
          </h2>
          {infoTooltip && (
            <div className="group relative inline-flex cursor-help items-center text-tertiary hover:text-primary">
              <HelpCircle className="h-4 w-4 transition-colors" />
              <div className="pointer-events-none absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-72 rounded-lg bg-[#1f2937] p-3 text-xs leading-relaxed text-white shadow-2xl border border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                {infoTooltip}
                <div className="absolute -top-1.5 left-2 h-3 w-3 rotate-45 bg-[#1f2937] border-l border-t border-gray-700" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actionButton}
          {collapsible && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-tertiary hover:bg-surface-dim hover:text-on-surface transition-colors"
              aria-label="Toggle section"
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      {(!collapsible || isOpen) && (
        <div className="p-5 sm:p-6 space-y-5">
          {subtitle && <p className="text-xs text-tertiary">{subtitle}</p>}
          {children}
        </div>
      )}
    </section>
  );
}
