import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, ChevronRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-dim/40 bg-white/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Official Scriza Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1"
            aria-label="Scriza Homepage"
          >
            <Image
              src="/scriza-logo-full.png"
              alt="SCRIZA - YOUR TECH PARTNER"
              width={140}
              height={36}
              priority
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2"
          >
            <Link
              href="/#image-tools"
              className="px-3 py-1.5 text-sm font-medium text-tertiary hover:text-on-surface hover:bg-surface-low rounded-button transition-colors"
            >
              Image Tools
            </Link>
            <Link
              href="/#pdf-tools"
              className="px-3 py-1.5 text-sm font-medium text-tertiary hover:text-on-surface hover:bg-surface-low rounded-button transition-colors"
            >
              PDF Tools
            </Link>
          </nav>
        </div>

        {/* Right CTA Area (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="http://localhost:3000/signin"
            className="px-4 py-2 text-sm font-medium text-tertiary hover:text-on-surface transition-colors"
          >
            Sign In
          </a>
          <Link
            href="#explore"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-brand hover:opacity-95 shadow-sm hover:shadow-glow rounded-button transition-all duration-200 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
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
              <div className="flex flex-col gap-1 pb-3 border-b border-surface-dim">
                <Link
                  href="/#image-tools"
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-low rounded-lg transition-colors"
                >
                  <span>Image Tools</span>
                  <ChevronRight className="h-4 w-4 text-tertiary" />
                </Link>
                <Link
                  href="/#pdf-tools"
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-low rounded-lg transition-colors"
                >
                  <span>PDF Tools</span>
                  <ChevronRight className="h-4 w-4 text-tertiary" />
                </Link>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <a
                  href="http://localhost:3000/signin"
                  className="w-full text-center px-3 py-2 text-sm font-medium text-tertiary hover:bg-surface-low rounded-button"
                >
                  Sign In
                </a>
                <Link
                  href="#explore"
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-brand rounded-button shadow-sm"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
