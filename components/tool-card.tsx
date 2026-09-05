import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Tool } from "@/data/tools";
import { DynamicIcon } from "@/components/icons";

interface ToolCardProps {
  tool: Tool;
  accentColor?: "primary" | "secondary";
}

export function ToolCard({ tool, accentColor = "primary" }: ToolCardProps) {
  const isPrimary = accentColor === "primary";

  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col justify-between rounded-card border border-surface-dim/90 bg-white p-5 sm:p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary/30 overflow-hidden"
      aria-label={`Open ${tool.name}`}
    >
      {/* Top subtle gradient highlight bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-brand" />

      <div>
        {/* Header: Icon + Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
              isPrimary
                ? "border-primary/20 bg-primary-fixed/40 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/20"
                : "border-secondary/20 bg-secondary-fixed/40 text-secondary group-hover:bg-secondary group-hover:text-white group-hover:shadow-md group-hover:shadow-secondary/20"
            }`}
          >
            <DynamicIcon name={tool.iconName} className="h-6 w-6 stroke-[2]" />
          </div>

          {tool.badge && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                tool.badge === "Popular"
                  ? "bg-primary-fixed text-primary"
                  : "bg-surface-low text-tertiary"
              }`}
            >
              {tool.badge === "Popular" && (
                <Sparkles className="h-3 w-3 fill-current" />
              )}
              {tool.badge}
            </span>
          )}
        </div>

        {/* Tool Name */}
        <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-200">
          {tool.name}
        </h3>

        {/* Tool Description */}
        <p className="mt-2 text-sm text-tertiary leading-relaxed min-h-[40px]">
          {tool.description}
        </p>

        {/* Feature Tags */}
        {tool.features && tool.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-surface-dim/60">
            {tool.features.map((feat, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-tertiary/90 bg-surface-low px-2 py-0.5 rounded-md"
              >
                {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Link */}
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-surface-dim/40 text-sm font-semibold transition-colors">
        <span className="text-primary group-hover:text-secondary">
          {tool.actionLabel || "Open Tool"}
        </span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed/50 text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
