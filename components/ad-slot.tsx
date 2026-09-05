"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Check, ShieldCheck, Sparkles } from "lucide-react";

interface AdSlotProps {
  placement?: "sticky-rail" | "in-feed" | "hero-bottom";
  format?: "skyscraper" | "rectangle" | "banner";
  enabled?: boolean;
  className?: string;
  adUnitId?: string;
}

export function AdSlot({
  placement = "sticky-rail",
  format = "skyscraper",
  enabled = true,
  className = "",
  adUnitId = "scriza-sidebar-top-300x600",
}: AdSlotProps) {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [adsDisabled, setAdsDisabled] = useState(false);

  useEffect(() => {
    const checkAds = () => {
      const isHidden = typeof window !== "undefined" && localStorage.getItem("scriza_ads_disabled") === "true";
      setAdsDisabled(isHidden);
    };

    checkAds();
    window.addEventListener("scriza-toggle-ads", checkAds);
    return () => window.removeEventListener("scriza-toggle-ads", checkAds);
  }, []);

  const handleDisableAds = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("scriza_ads_disabled", "true");
      window.dispatchEvent(new Event("scriza-toggle-ads"));
    }
    setShowRemoveModal(false);
  };

  if (!enabled || adsDisabled) {
    return null;
  }

  const renderModal = () => {
    if (!showRemoveModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-surface-dim">
          <button
            type="button"
            onClick={() => setShowRemoveModal(false)}
            className="absolute right-4 top-4 text-tertiary hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-surface-low"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
              Scriza Pro &amp; Ad-Free
            </span>
          </div>

          <h3 className="text-xl font-black text-on-surface">
            Remove Advertisements
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-tertiary leading-relaxed">
            Enjoy a distraction-free workspace with zero ads, ultra-fast client-side processing, and maximum screen space.
          </p>

          <div className="mt-4 space-y-2.5 text-xs text-on-surface bg-surface-low/50 p-3.5 rounded-xl border border-surface-dim">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-medium">100% ad-free experience across all image tools</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Clean full-width layout with zero popups</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Unlimited free browser-based processing</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleDisableAds}
              className="w-full flex-1 rounded-xl bg-primary py-3 px-4 text-center text-xs font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-md shadow-primary/20"
            >
              Hide Ads (Free for 24h)
            </button>
            <button
              type="button"
              onClick={() => setShowRemoveModal(false)}
              className="w-full sm:w-auto rounded-xl border border-surface-dim px-4 py-3 text-xs font-semibold text-tertiary hover:bg-surface-low hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (placement === "sticky-rail" || format === "skyscraper") {
    return (
      <>
        <aside
          aria-label="Sponsored Advertisement"
          className={`w-[300px] flex flex-col shrink-0 self-stretch ${className}`}
        >
          {/* Sticky wrapper pinning the ad smoothly during catalog scrolling */}
          <div className="sticky top-20 z-20 flex flex-col items-center">
            {/* GoDaddy 300x600 Skyscraper Google Ad (Matching Exact RedKetchup Reference) */}
            <div
              id={adUnitId}
              data-ad-format="vertical"
              className="w-[300px] border border-[#d0d7de] bg-white shadow-xs hover:shadow-sm transition-shadow rounded-sm overflow-hidden"
            >
              <a
                href="https://www.godaddy.com"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative w-full aspect-[453/904] bg-white focus:outline-none"
                title="GoDaddy - Ready to check-out? Your cart is waiting"
              >
                <Image
                  src="/images/godaddy-ad-unit.png"
                  alt="GoDaddy - Ready to check-out? Your cart is waiting"
                  fill
                  sizes="300px"
                  className="object-contain"
                  priority
                />
              </a>
            </div>

            {/* Simple Centered "REMOVE ADS" Link (Matching RedKetchup IA) */}
            <div className="mt-3 text-center w-full">
              <button
                type="button"
                onClick={() => setShowRemoveModal(true)}
                className="text-xs font-semibold tracking-wider text-[#57606a] hover:text-[#24292f] uppercase transition-colors focus:outline-none hover:underline cursor-pointer"
              >
                REMOVE ADS
              </button>
            </div>
          </div>
        </aside>

        {renderModal()}
      </>
    );
  }

  return (
    <>
      <div
        data-ad-placement={placement}
        className={`scriza-ad-banner my-6 mx-auto w-full max-w-5xl rounded-lg border border-[#d0d7de] bg-white p-4 ${className}`}
      >
        <div className="flex h-24 sm:h-28 w-full items-center justify-center rounded bg-gray-50 border border-dashed border-gray-300 text-xs text-gray-500">
          Leaderboard Ad Slot (728×90 / 970×250)
        </div>
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setShowRemoveModal(true)}
            className="text-[11px] font-semibold tracking-wider text-[#57606a] hover:text-[#24292f] uppercase hover:underline cursor-pointer"
          >
            REMOVE ADS
          </button>
        </div>
      </div>

      {renderModal()}
    </>
  );
}
