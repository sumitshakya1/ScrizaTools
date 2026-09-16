"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cookie,
  ShieldCheck,
  Settings2,
  X,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
} from "lucide-react";

export interface CookiePreferences {
  strictlyNecessary: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
  emailMeasurement: boolean;
  timestamp: string;
  version: string;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  strictlyNecessary: true,
  functional: false,
  analytics: false,
  advertising: false,
  emailMeasurement: false,
  timestamp: "",
  version: "2026.09.16",
};

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Read stored consent
    try {
      const stored = localStorage.getItem("toolon_cookie_consent");
      if (stored) {
        setPreferences(JSON.parse(stored));
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }

    // Global event listener to re-open modal from footer "Privacy Choices" link
    const handleOpenModal = () => {
      setShowModal(true);
    };

    window.addEventListener("toolon-open-cookie-settings", handleOpenModal);
    return () => window.removeEventListener("toolon-open-cookie-settings", handleOpenModal);
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const updated = {
      ...prefs,
      strictlyNecessary: true,
      timestamp: new Date().toISOString(),
      version: "2026.09.16",
    };

    setPreferences(updated);
    try {
      localStorage.setItem("toolon_cookie_consent", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save cookie consent to localStorage", e);
    }

    // Dispatch global event for Google Tag Manager / AdSense CMP signal
    window.dispatchEvent(
      new CustomEvent("toolon-consent-updated", { detail: updated })
    );

    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      ...preferences,
      functional: true,
      analytics: true,
      advertising: true,
      emailMeasurement: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      ...preferences,
      functional: false,
      analytics: false,
      advertising: false,
      emailMeasurement: false,
    });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ─── Floating Bottom Banner (Initial Prompt) ─── */}
      {showBanner && !showModal && (
        <div
          role="region"
          aria-label="Cookie and Privacy Choices"
          className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl animate-fade-in"
        >
          <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5 max-w-4xl">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Cookie className="h-6 w-6" />
              </div>
              <div className="text-[14.5px] sm:text-[15px] text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900 text-base sm:text-lg mb-1">
                  Privacy Choices &amp; Cookie Consent
                </p>
                <p>
                  ToolOn (operated by <strong>Scriza Private Limited</strong>) uses cookies and browser storage to operate free tools, measure traffic, and serve display ads (via Google AdSense). Under Indian DPDP and global privacy frameworks, you have full control over non-essential tracking. Read our{" "}
                  <Link href="/cookies" className="text-primary hover:underline font-semibold">
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer hover:border-slate-400"
              >
                <Settings2 className="h-4 w-4" />
                <span>Customize</span>
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 md:flex-initial inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer hover:border-slate-400"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 md:flex-initial inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-primary-hover transition-colors shadow-xs cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Detailed Preferences Modal (5 Categorized Controls) ─── */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Cookie &amp; Privacy Preferences
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Scriza Private Limited • Effective: 16 September 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Close preferences"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: 5 Categories */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              <p className="text-slate-600 leading-relaxed text-sm">
                Configure which categories of cookies and browser storage technologies you authorize ToolOn to employ on your device. Strictly necessary technologies are required for core security and session functionality.
              </p>

              {/* 1. Strictly Necessary */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">1. Strictly Necessary Cookies</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5">
                        Always Active
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1.5 text-sm leading-relaxed">
                      Essential for authentication, user session security, tokenized payments, fraud prevention, and persisting your cookie preferences. Cannot be disabled.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center mt-1">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* 2. Functional */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">2. Functional Cookies</span>
                    <p className="text-slate-600 mt-1.5 text-sm leading-relaxed">
                      Preserves tool preferences (e.g. image output formats, compression presets, UI themes, and recent utilities) across browser visits.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences({ ...preferences, functional: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* 3. Analytics */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">3. Analytics &amp; Error Telemetry</span>
                    <p className="text-slate-600 mt-1.5 text-sm leading-relaxed">
                      Measures aggregated site visits, popular tools, runtime error diagnostics, and system latency to optimize server performance. Off until consent.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* 4. Advertising (Google AdSense) */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">4. Advertising &amp; Frequency Capping (Google AdSense)</span>
                    <p className="text-slate-600 mt-1.5 text-sm leading-relaxed">
                      Enables display ads that keep ToolOn browser utilities free. Supports ad frequency capping, combating invalid bot traffic, and personalized promotions where permitted.
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-primary">
                      <a
                        href="https://myadcenter.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline font-medium"
                      >
                        <span>Google Ad Center</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href="https://policies.google.com/technologies/partner-sites"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline font-medium"
                      >
                        <span>How Google Uses Data</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.advertising}
                      onChange={(e) =>
                        setPreferences({ ...preferences, advertising: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* 5. Email Measurement */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">5. Email Delivery &amp; Campaign Measurement</span>
                    <p className="text-slate-600 mt-1.5 text-sm leading-relaxed">
                      Applicable to paid Communication Services. Tracks recipient open and click signals strictly when enabled by the sending business customer in accordance with their privacy notice.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.emailMeasurement}
                      onChange={(e) =>
                        setPreferences({ ...preferences, emailMeasurement: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full sm:w-auto text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
              >
                Reject All Non-Essential
              </button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-initial rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm sm:text-base font-semibold text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer hover:border-slate-400"
                >
                  Save My Choices
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial rounded-xl bg-primary px-5 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
