"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Check, Info, ArrowLeft } from "lucide-react";

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
  adUnitId = "toolon-sidebar-top-300x600",
}: AdSlotProps) {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAdMenu, setShowAdMenu] = useState(false);
  const [adsDisabled, setAdsDisabled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAds = () => {
      const isHidden = typeof window !== "undefined" && localStorage.getItem("toolon_ads_disabled") === "true";
      setAdsDisabled(isHidden);
    };

    checkAds();
    window.addEventListener("toolon-toggle-ads", checkAds);
    return () => window.removeEventListener("toolon-toggle-ads", checkAds);
  }, []);

  // Close ad menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAdMenu(false);
      }
    };
    if (showAdMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAdMenu]);

  const handleDisableAds = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toolon_ads_disabled", "true");
      window.dispatchEvent(new Event("toolon-toggle-ads"));
    }
    setShowRemoveModal(false);
    setShowAdMenu(false);
  };

  if (!enabled || adsDisabled) {
    return null;
  }

  /* ─── "Ads by Google" dropdown panel (matching Google AdSense exactly) ─── */
  const renderAdMenu = () => {
    if (!showAdMenu) return null;
    return (
      <div
        ref={menuRef}
        className="absolute top-0 right-0 z-30 w-full h-full bg-[#f8f9fa] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <button
            type="button"
            onClick={() => setShowAdMenu(false)}
            className="text-[#5f6368] hover:text-[#202124] transition-colors p-0.5"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-[#5f6368]">
            Ads by <span className="font-medium text-[#202124]">Google</span>
          </span>
        </div>

        {/* Actions */}
        <div className="px-4 space-y-2">
          <button
            type="button"
            onClick={handleDisableAds}
            className="w-full rounded-sm bg-[#4285f4] py-2.5 px-4 text-sm font-medium text-white hover:bg-[#3367d6] transition-colors text-center"
          >
            Stop seeing this ad
          </button>
          <button
            type="button"
            onClick={() => window.open("https://support.google.com/ads/answer/1634057", "_blank")}
            className="w-full flex items-center justify-center gap-1.5 rounded-sm border border-[#dadce0] bg-white py-2.5 px-4 text-sm text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
          >
            Why this ad?
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  /* ─── Google AdSense-style ℹ️ + ⋮ icons (top-right overlay on ad) ─── */
  const renderAdIcons = () => (
    <div className="absolute top-1 right-1 z-20 flex items-center gap-0.5 pointer-events-auto">
      {/* Info circle icon */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowAdMenu(true);
        }}
        className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white/95 shadow-xs hover:bg-white text-[#00897b] transition-colors cursor-pointer border border-slate-200/50"
        title="About this ad"
        aria-label="About this ad"
      >
        <Info className="h-[12px] w-[12px]" />
      </button>
      {/* Three-dot kebab menu */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowAdMenu(true);
        }}
        className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white/95 shadow-xs hover:bg-white text-[#5f6368] transition-colors cursor-pointer border border-slate-200/50"
        title="Ad options"
        aria-label="Ad options"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
    </div>
  );

  const renderRemoveAdsModal = () => {
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
              ToolOn Pro &amp; Ad-Free
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
              <span className="font-medium">100% ad-free experience across all tools</span>
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
          {/* Sticky wrapper */}
          <div className="sticky top-20 z-20 flex flex-col items-center">
            {/* Skyscraper Ad Container */}
            <div
              id={adUnitId}
              data-ad-format="vertical"
              className="relative w-[300px] h-[600px] rounded-lg overflow-hidden border border-slate-200/80 bg-white shadow-xs"
            >
              {/* Google AdSense-style ℹ️ + ⋮ icons */}
              {renderAdIcons()}

              {/* "Ads by Google" dropdown panel */}
              {renderAdMenu()}

              <a
                href="https://www.godaddy.com"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative w-full h-full bg-white focus:outline-none"
                title="GoDaddy - Build, brand, and back your business"
              >
                <Image
                  src="/images/godaddy-ad-unit.png"
                  alt="GoDaddy - Build, brand, and back your business"
                  fill
                  sizes="300px"
                  className="object-fill"
                  priority
                />
              </a>
            </div>

            {/* "REMOVE ADS" link below the ad */}
            <div className="mt-2.5 text-center w-full">
              <button
                type="button"
                onClick={() => setShowRemoveModal(true)}
                className="text-[11px] font-medium tracking-wide text-[#8b949e] hover:text-[#24292f] uppercase transition-colors focus:outline-none hover:underline cursor-pointer"
              >
                REMOVE ADS
              </button>
            </div>
          </div>
        </aside>

        {renderRemoveAdsModal()}
      </>
    );
  }

  return (
    <>
      <div
        data-ad-placement={placement}
        className={`toolon-ad-banner relative my-6 mx-auto w-full max-w-5xl overflow-hidden ${className}`}
      >
        {renderAdIcons()}
        {renderAdMenu()}

        <div className="flex h-24 sm:h-28 w-full items-center justify-center bg-gray-50 border border-dashed border-gray-300 text-xs text-gray-500">
          Leaderboard Ad Slot (728×90 / 970×250)
        </div>

        {/* "REMOVE ADS" below banner */}
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setShowRemoveModal(true)}
            className="text-[11px] font-medium tracking-wide text-[#8b949e] hover:text-[#24292f] uppercase transition-colors focus:outline-none hover:underline cursor-pointer"
          >
            REMOVE ADS
          </button>
        </div>
      </div>

      {renderRemoveAdsModal()}
    </>
  );
}
