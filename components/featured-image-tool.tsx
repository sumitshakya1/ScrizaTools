import Link from "next/link";
import {
  Sliders,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
} from "lucide-react";

export function FeaturedImageTool() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-2xl border border-surface-dim/80 bg-gradient-to-br from-white via-surface-bright to-surface-low p-6 sm:p-10 shadow-card">
          
          {/* Subtle decorative background blob */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-primary mb-4">
                <Sparkles className="h-3 w-3" />
                Featured Capability
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
                Everything you need to work with images
              </h3>

              <p className="mt-4 text-base text-tertiary leading-relaxed">
                Handle all common and advanced image operations directly inside your browser without installing bulky desktop software, paying recurring subscriptions, or compromising privacy.
              </p>

              <div className="mt-6 space-y-3 w-full">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    Real-time visual comparison with split before/after view
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    Zero upload wait: client-accelerated WebAssembly processing
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    Batch export to modern Next-Gen formats (WebP & AVIF)
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/image-compressor"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-brand hover:opacity-95 shadow-sm rounded-button transition-all"
                >
                  <span>Try Image Optimizer</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/image-resizer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-tertiary hover:text-on-surface transition-colors"
                >
                  <span>View Resizer</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive-look Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-surface-dim bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
                
                {/* Mock Header Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-dim mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">
                      hero-banner-visual.png
                    </span>
                    <span className="text-[10px] font-semibold text-tertiary bg-surface-low px-2 py-0.5 rounded">
                      3840 x 2160
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    Saved 84% (4.2 MB → 670 KB)
                  </span>
                </div>

                {/* Mock Image Before/After Visual Canvas */}
                <div className="relative h-48 sm:h-56 w-full rounded-lg bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden flex items-center justify-center border border-surface-dim">
                  
                  {/* Left "Original" visual slice */}
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-primary/30 to-purple-900/40 backdrop-blur-[1px] border-r border-white/40 flex flex-col justify-between p-3">
                    <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded w-fit">
                      Original • 4.2 MB
                    </span>
                    <span className="text-xs font-medium text-white/70">
                      Standard JPEG
                    </span>
                  </div>

                  {/* Right "Optimized" visual slice */}
                  <div className="absolute inset-y-0 right-0 w-1/2 flex flex-col justify-between items-end p-3">
                    <span className="text-[10px] font-bold text-emerald-300 bg-black/40 px-2 py-0.5 rounded w-fit">
                      Optimized • 670 KB
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      Lossless WebP
                    </span>
                  </div>

                  {/* Splitter handle graphic */}
                  <div className="absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg border border-primary text-primary font-bold text-xs">
                    ↔
                  </div>
                </div>

                {/* Mock Control Sliders & Radios */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-surface-low p-2.5 border border-surface-dim/60">
                    <span className="text-[11px] font-semibold text-tertiary block">
                      Target Format
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      WEBP (Lossy)
                    </span>
                  </div>
                  <div className="rounded-lg bg-surface-low p-2.5 border border-surface-dim/60">
                    <span className="text-[11px] font-semibold text-tertiary block">
                      Quality Slider
                    </span>
                    <span className="text-xs font-bold text-primary">
                      85% (Optimal)
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-lg bg-surface-low p-2.5 border border-surface-dim/60">
                    <span className="text-[11px] font-semibold text-tertiary block">
                      Dimension Scale
                    </span>
                    <span className="text-xs font-bold text-secondary">
                      100% (Original)
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
