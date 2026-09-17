import Link from "next/link";
import { futureCategories } from "@/data/tools";
import { DynamicIcon } from "@/components/icons";
import { ArrowRight, Sparkles, Plus } from "lucide-react";

export function MoreCategories() {
  return (
    <section id="categories" className="scroll-mt-20 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed/50 px-3 py-1 text-xs font-bold text-secondary mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Expanding Ecosystem</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              More Tool Categories
            </h2>
            <p className="mt-3 text-base text-tertiary max-w-2xl leading-relaxed">
              Explore our comprehensive suite of online utilities engineered for developers, marketers, and document workflows.
            </p>
          </div>

          <div className="text-sm font-medium text-tertiary">
            Architecture ready for <span className="font-bold text-on-surface">50+ tools</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureCategories.map((cat) => (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between rounded-card border border-surface-dim/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-secondary/20 bg-secondary-fixed/30 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    <DynamicIcon name={cat.iconName} className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-tertiary bg-surface-low px-2.5 py-1 rounded-full">
                    {cat.toolCount} Tools
                  </span>
                </div>

                <h3 className="text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                  {cat.title}
                </h3>

                <p className="mt-2 text-sm text-tertiary leading-relaxed">
                  {cat.description}
                </p>

                {/* Preview Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-surface-dim/60">
                  {cat.previewTools.map((toolName, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium text-tertiary bg-surface-low px-2 py-0.5 rounded"
                    >
                      {toolName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-3 border-t border-surface-dim/40 text-xs font-semibold text-secondary">
                <span>Browse Category</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
