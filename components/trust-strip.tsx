import { valueHighlights } from "@/data/tools";
import { DynamicIcon } from "@/components/icons";

export function TrustStrip() {
  return (
    <section className="relative border-y border-surface-dim/70 bg-white/70 backdrop-blur-sm py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Title */}
          <div className="max-w-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Engineered for Excellence
            </p>
            <p className="text-base font-bold text-navy mt-0.5">
              Built for faster, simpler digital workflows
            </p>
          </div>

          {/* Value Highlights Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 flex-1">
            {valueHighlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-surface-low"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-low text-primary border border-surface-dim group-hover:border-primary/30">
                  <DynamicIcon name={item.iconName} className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">
                    {item.title}
                  </h4>
                  <p className="text-xs text-tertiary leading-tight mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
