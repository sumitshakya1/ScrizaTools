import { whyToolOnItems } from "@/data/tools";
import { DynamicIcon } from "@/components/icons";
import { Sparkles } from "lucide-react";

export function WhyToolOn() {
  return (
    <section id="why-toolon" className="scroll-mt-20 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed/50 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The ToolOn Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Why choose ToolOn?
          </h2>
          <p className="mt-3 text-base text-tertiary leading-relaxed">
            Designed from the ground up for modern professionals who value speed, privacy, and frictionless digital productivity.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyToolOnItems.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-card border border-surface-dim/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed/40 text-primary border border-primary/20 mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                  <DynamicIcon name={item.iconName} className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-bold text-on-surface">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-tertiary leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-dim/60">
                <span className="text-xs font-semibold text-primary">
                  ✦ {item.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
