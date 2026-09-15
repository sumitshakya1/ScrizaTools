"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ExternalLink, Sparkles, Laptop, Globe } from "lucide-react";

export function GoogleVignetteModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#google_vignette") {
      // Remove hash from URL without scrolling
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  useEffect(() => {
    // Check initial hash on load
    if (typeof window !== "undefined") {
      if (window.location.hash === "#google_vignette") {
        setIsOpen(true);
      }

      const handleHashChange = () => {
        if (window.location.hash === "#google_vignette") {
          setIsOpen(true);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      window.addEventListener("hashchange", handleHashChange);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sponsored Google Vignette Advertisement"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        // Close if clicking the backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative flex flex-col items-end w-full max-w-[340px] sm:max-w-[360px] animate-in zoom-in-95 duration-200">
        
        {/* RedKetchup Exact "Close" Button positioned right above ad top-right */}
        <button
          type="button"
          onClick={handleClose}
          className="mb-1.5 flex items-center gap-1.5 px-3 py-1 rounded text-sm font-semibold text-white bg-black/40 hover:bg-black/70 border border-white/20 transition-colors cursor-pointer shadow-sm focus:outline-none"
          aria-label="Close Ad"
        >
          <span>Close</span>
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Google Vignette Ad Container (Matching RedKetchup / GoDaddy Format) */}
        <div className="w-full overflow-hidden rounded-md border border-white/20 bg-[#080d16] text-white shadow-2xl">
          
          {/* AdChoices & Sponsor Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-xs bg-[#00a4a6] text-[10px] font-bold text-white leading-none">
                ⓘ
              </span>
              <span className="text-[11px] font-semibold text-gray-300">
                AdChoices
              </span>
            </div>

            {/* GoDaddy Official Sponsor Mark */}
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm tracking-tight">
              <span className="text-[#00dfa2] text-base font-black">GO</span>
              <span className="text-white font-bold">GoDaddy</span>
            </div>
          </div>

          {/* Main Headline (Vibrant Cyan text matching screenshot) */}
          <div className="p-4 bg-gradient-to-b from-[#080d16] to-[#0d1624]">
            <h3 className="text-xl sm:text-[22px] font-bold tracking-tight text-[#00dfa2] leading-snug">
              Build, brand, and back your business with GoDaddy.
            </h3>
          </div>

          {/* Ad Creative Visual Graphic Showcase */}
          <div className="px-4 pb-4">
            
            {/* Website Preview Card (American Pies) */}
            <div className="rounded border border-white/15 bg-white text-[#24292f] p-3 shadow-md mb-3">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-gray-200 text-[9px] text-gray-500 font-mono">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-1 text-gray-400">americanpies.es</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Original American Pies
              </div>
              <div className="text-xs font-bold text-gray-900 mt-0.5 leading-tight">
                AMERICAN PIES CASERAS, NATURALES, PERO SOBRE TODO ORIGINALES
              </div>
              <div className="mt-2 h-16 rounded bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/60 flex items-center justify-center text-amber-800 text-[11px] font-medium">
                🥧 Artisan Bakery Online Store
              </div>
            </div>

            {/* Entrepreneur Working Visual Banner */}
            <div className="relative rounded overflow-hidden bg-gradient-to-tr from-[#162233] to-[#1f3047] p-3.5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Ricardo de Tomás</div>
                <div className="text-[11px] text-[#00dfa2] font-mono mt-0.5">9LIVES.ES</div>
                <div className="text-[10px] text-gray-300 mt-1">Founder &amp; Creative Director</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-emerald-300">
                <Laptop className="h-6 w-6" />
              </div>
            </div>

            {/* Sponsor Call to Action Button */}
            <a
              href="https://www.godaddy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-[#00dfa2] hover:bg-[#00c58f] px-4 py-3 text-sm font-bold text-gray-950 shadow-lg transition-colors cursor-pointer"
            >
              <span>Explore Domains &amp; Websites</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* AdSense Verification Footer Note */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 px-1">
              <span>Google AdSense #google_vignette</span>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-white underline cursor-pointer"
              >
                Skip ad
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
