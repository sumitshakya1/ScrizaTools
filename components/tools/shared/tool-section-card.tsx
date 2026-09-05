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
    <section className={`rounded-xl border border-surface-dim bg-white shadow-card overflow-hidden transition-all duration-200 ${className}`}>
      {/* Card Header matching RedKetchup style */}
      <div className="flex items-center justify-between border-b border-surface-dim/60 bg-surface-low/60 px-5 py-3.5 sm:px-6">
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
            <div className="group relative flex cursor-help items-center text-tertiary hover:text-primary">
              <HelpCircle className="h-4 w-4" />
              <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full hidden group-hover:block z-30 w-64 rounded-lg bg-navy px-3 py-2 text-xs text-white shadow-xl">
                {infoTooltip}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-navy" />
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
