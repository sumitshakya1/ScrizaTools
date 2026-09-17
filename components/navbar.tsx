"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Menu,
  ChevronRight,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Mail,
  Sparkles,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { PdfMegaMenu, PDF_MEGA_MENU_CATEGORIES } from "./pdf-mega-menu";
import { ImageMegaMenu, IMAGE_MEGA_MENU_CATEGORIES } from "./image-mega-menu";

interface UserProfile {
  id?: string;
  userId?: string;
  name?: string | null;
  email?: string;
  role?: string;
  avatarUrl?: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [isMobilePdfOpen, setIsMobilePdfOpen] = useState(false);
  const [isMobileImageOpen, setIsMobileImageOpen] = useState(false);
  const pdfMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePdfMouseEnter = () => {
    if (pdfMenuTimeoutRef.current) {
      clearTimeout(pdfMenuTimeoutRef.current);
      pdfMenuTimeoutRef.current = null;
    }
    setIsPdfMenuOpen(true);
  };

  const handlePdfMouseLeave = () => {
    if (pdfMenuTimeoutRef.current) {
      clearTimeout(pdfMenuTimeoutRef.current);
    }
    pdfMenuTimeoutRef.current = setTimeout(() => {
      setIsPdfMenuOpen(false);
    }, 180);
  };

  const handleImageMouseEnter = () => {
    if (imageMenuTimeoutRef.current) {
      clearTimeout(imageMenuTimeoutRef.current);
      imageMenuTimeoutRef.current = null;
    }
    setIsImageMenuOpen(true);
  };

  const handleImageMouseLeave = () => {
    if (imageMenuTimeoutRef.current) {
      clearTimeout(imageMenuTimeoutRef.current);
    }
    imageMenuTimeoutRef.current = setTimeout(() => {
      setIsImageMenuOpen(false);
    }, 180);
  };

  // Sync authentication state from localStorage
  const checkAuth = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("toolon_user") || localStorage.getItem("user_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen to local and cross-tab auth state changes
    window.addEventListener("toolon-auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("toolon-auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("toolon_user");
      localStorage.removeItem("toolon_token");
      localStorage.removeItem("user_profile");
      localStorage.removeItem("token");
      localStorage.removeItem("jwtToken");
      window.dispatchEvent(new Event("toolon-auth-change"));
    }
    setUser(null);
    setIsUserMenuOpen(false);
  };

  // Build SSO transfer link to Email Automation software (running on :3001)
  const handleEmailAutomationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const softwareUrl = process.env.NEXT_PUBLIC_SOFTWARE_URL || "http://localhost:3001";

    if (user) {
      // User is already logged in -> Seamless Single Sign-On (SSO) straight to Dashboard
      try {
        const token =
          (typeof window !== "undefined" &&
            (localStorage.getItem("toolon_token") ||
              localStorage.getItem("token") ||
              localStorage.getItem("jwtToken"))) ||
          "authenticated-session";

        const ssoPayload = btoa(
          unescape(encodeURIComponent(JSON.stringify({ user_profile: user, token })))
        );
        window.open(`${softwareUrl}/dashboard?sso=${ssoPayload}`, "_blank", "noopener,noreferrer");
      } catch (err) {
        window.open(`${softwareUrl}/dashboard`, "_blank", "noopener,noreferrer");
      }
    } else {
      // User not logged in yet -> Route to sign in first, which then transfers to dashboard
      window.location.href = "/signin?redirect=email-automation";
    }
  };

  // Determine friendly display name
  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "User");
  const displayInitial = (displayName || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-dim/40 bg-white/90 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto flex h-20 max-w-[1536px] items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Official ToolOn Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1"
            aria-label="ToolOn Homepage"
          >
            <Image
              src="/toolon-logo.png"
              alt="ToolOn.in - Tools for Everyday Tasks"
              width={260}
              height={80}
              priority
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
          >
            {/* Image Tools Mega Menu Hover Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
            >
              <Link
                href="/#image-tools"
                onClick={() => setIsImageMenuOpen(false)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isImageMenuOpen
                    ? "text-primary bg-primary/10 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span>Image Tools</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isImageMenuOpen ? "rotate-180 text-primary" : "text-slate-400"
                  }`}
                />
              </Link>
            </div>

            {/* PDF Tools Mega Menu Hover Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={handlePdfMouseEnter}
              onMouseLeave={handlePdfMouseLeave}
            >
              <Link
                href="/#pdf-tools"
                onClick={() => setIsPdfMenuOpen(false)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isPdfMenuOpen
                    ? "text-primary bg-primary/10 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span>PDF Tools</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isPdfMenuOpen ? "rotate-180 text-primary" : "text-slate-400"
                  }`}
                />
              </Link>
            </div>
          </nav>
        </div>

        {/* Right CTA Area (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            /* Logged In User Dropdown Menu */
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                {/* User Avatar Circle */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-white font-bold text-xs shadow-xs">
                  {displayInitial}
                </div>
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {displayName}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Overlay Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-60 origin-top-right rounded-2xl border border-slate-200 bg-white p-3 shadow-dropdown transition-all animate-in fade-in zoom-in-95">
                    {/* User Identity Info */}
                    <div className="p-3 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1.5">
                      <p className="text-xs font-bold text-slate-900 capitalize">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {user.email || "Registered User"}
                      </p>
                    </div>

                    {/* Menu Actions */}
                    <div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out: Standard Sign In Link */
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-tertiary hover:text-on-surface transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Email Automation Direct Software Redirect CTA Button */}
          <button
            type="button"
            onClick={handleEmailAutomationClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-brand hover:opacity-95 shadow-sm hover:shadow-glow rounded-button transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>Email Automation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* CSS-Only Mobile Navigation */}
        <div className="flex md:hidden items-center">
          <details className="group relative">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-surface-dim/80 bg-surface-low text-tertiary hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-12 z-50 w-72 origin-top-right rounded-card border border-surface-dim/80 bg-white p-4 shadow-dropdown transition-all animate-in fade-in zoom-in-95">
              
              {/* Mobile User Identity Bar if Logged In */}
              {user && (
                <div className="flex items-center gap-2.5 pb-3 mb-2 border-b border-surface-dim">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-white font-bold text-xs">
                    {displayInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate capitalize">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 pb-3 border-b border-surface-dim">
                {/* Mobile Image Tools Expandable Accordion */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobileImageOpen(!isMobileImageOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-low rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">Image Tools</span>
                    <ChevronDown
                      className={`h-4 w-4 text-tertiary transition-transform duration-200 ${
                        isMobileImageOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isMobileImageOpen && (
                    <div className="pl-3 pr-1 py-2 space-y-3 max-h-72 overflow-y-auto border-l-2 border-primary/30 ml-3 my-1">
                      {IMAGE_MEGA_MENU_CATEGORIES.map((category) => (
                        <div key={category.title} className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            {category.title}
                          </p>
                          <div className="grid grid-cols-1 gap-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className="flex items-center justify-between py-1 px-2 text-xs text-slate-700 hover:text-primary hover:bg-slate-50 rounded transition-colors"
                              >
                                <span className="font-medium">{tool.name}</span>
                                {tool.badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                                    {tool.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Mobile PDF Tools Expandable Accordion */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobilePdfOpen(!isMobilePdfOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-low rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">PDF Tools</span>
                    <ChevronDown
                      className={`h-4 w-4 text-tertiary transition-transform duration-200 ${
                        isMobilePdfOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isMobilePdfOpen && (
                    <div className="pl-3 pr-1 py-2 space-y-3 max-h-72 overflow-y-auto border-l-2 border-primary/30 ml-3 my-1">
                      {PDF_MEGA_MENU_CATEGORIES.map((category) => (
                        <div key={category.title} className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            {category.title}
                          </p>
                          <div className="grid grid-cols-1 gap-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className="flex items-center justify-between py-1 px-2 text-xs text-slate-700 hover:text-primary hover:bg-slate-50 rounded transition-colors"
                              >
                                <span className="font-medium">{tool.name}</span>
                                {tool.badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                                    {tool.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-center px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-button cursor-pointer"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="w-full text-center px-3 py-2 text-sm font-medium text-tertiary hover:bg-surface-low rounded-button block"
                  >
                    Sign In
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleEmailAutomationClick}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-brand rounded-button shadow-sm cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Automation</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Image Tools Mega Menu Floating Dropdown */}
      <ImageMegaMenu
        isOpen={isImageMenuOpen}
        onClose={() => setIsImageMenuOpen(false)}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      />

      {/* PDF Tools Mega Menu Floating Dropdown */}
      <PdfMegaMenu
        isOpen={isPdfMenuOpen}
        onClose={() => setIsPdfMenuOpen(false)}
        onMouseEnter={handlePdfMouseEnter}
        onMouseLeave={handlePdfMouseLeave}
      />
    </header>
  );
}
