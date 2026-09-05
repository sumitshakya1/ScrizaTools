import Link from "next/link";
import { Sparkles, ArrowRight, Zap, X, ShieldCheck, CheckCircle2 } from "lucide-react";

export function FullScreenPromoModal() {
  return (
    <>
      {/* Hidden checkbox to toggle modal purely with CSS (Zero 'use client') */}
      <input
        type="checkbox"
        id="scriza-fullscreen-modal-toggle"
        className="peer sr-only"
        defaultChecked={false}
      />

      {/* Floating Trigger Button (Bottom right) for user to inspect or test full-screen popups anytime */}
      <div className="fixed bottom-5 right-5 z-40">
        <label
          htmlFor="scriza-fullscreen-modal-toggle"
          className="group flex cursor-pointer items-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4 fill-current animate-pulse" />
          <span>Special Offer Popup</span>
          <span className="flex h-2 w-2 rounded-full bg-pink-300" />
        </label>
      </div>

      {/* Fullscreen Backdrop & Popup Window (CSS Controlled via peer-checked) */}
      <div className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-navy/70 backdrop-blur-md transition-all peer-checked:flex animate-in fade-in duration-200">
        
        {/* Modal Container */}
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Close Button via label */}
          <label
            htmlFor="scriza-fullscreen-modal-toggle"
            className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-low text-tertiary hover:bg-primary-fixed hover:text-primary transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </label>

          {/* Modal Header */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Exclusive Scriza Launch Deal</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Unlock Unlimited Tools &amp; Pro Image Engine
          </h3>

          <p className="mt-3 text-sm sm:text-base text-tertiary leading-relaxed">
            Get unlimited high-speed bulk image processing, priority queue execution, lossless batch compression, and zero ads across the entire platform.
          </p>

          {/* Benefits Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex items-center gap-2.5 rounded-xl bg-surface-low p-3 border border-surface-dim">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-on-surface">
                100% Ad-Free Experience
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-surface-low p-3 border border-surface-dim">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-on-surface">
                Unlimited Bulk Image Conversion
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-surface-low p-3 border border-surface-dim">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-on-surface">
                High-Fidelity Resampling Engine
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-surface-low p-3 border border-surface-dim">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-on-surface">
                Dedicated Fast-Track Support
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
            <Link
              href="/pricing"
              className="inline-flex w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-button bg-gradient-brand py-3.5 px-6 text-sm font-bold text-white shadow-md hover:opacity-95 transition-all"
            >
              <span>Get Scriza Pro — 50% Off</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <label
              htmlFor="scriza-fullscreen-modal-toggle"
              className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-button border border-surface-dim py-3.5 px-5 text-sm font-semibold text-tertiary hover:bg-surface-low hover:text-on-surface transition-colors"
            >
              Maybe Later
            </label>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-tertiary">
              No credit card required for trial • Cancel anytime with one click
            </span>
          </div>

        </div>

      </div>
    </>
  );
}
