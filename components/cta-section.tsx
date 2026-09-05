import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";

export function CtaSection() {
  return (
    <section id="explore" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-14 sm:px-12 sm:py-20 text-center shadow-card-hover">
          
          {/* Subtle decorative shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm mb-6 border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-pink-200" />
              <span>Get Started in Seconds • No Credit Card Required</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Work smarter with Scriza.
            </h2>

            {/* Description */}
            <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              Access powerful tools and automate repetitive workflows from one simple, high-performance platform. Boost your daily digital efficiency today.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="http://localhost:3000/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-primary bg-white hover:bg-surface-low rounded-button shadow-lg transition-all duration-200 active:scale-[0.98] w-full sm:w-auto text-center"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                href="#image-tools"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-button backdrop-blur-sm transition-all duration-200 w-full sm:w-auto text-center"
              >
                <span>Explore Tools</span>
              </Link>
            </div>

            {/* Feature Guarantees */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-300" /> 100% Free Core Tools
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> No Registration Required for Image Tools
              </span>
              <span className="flex items-center gap-1.5">
                ✦ High Security Architecture
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
