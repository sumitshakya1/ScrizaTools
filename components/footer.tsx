import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-surface-dim bg-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-surface-dim/80">
          
          {/* Col 1: Brand Info */}
          <div>
            <Link
              href="/"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="Scriza Homepage"
            >
              <div className="relative h-10 w-36 sm:w-40">
                <Image
                  src="/scriza-logo-full.png"
                  alt="SCRIZA"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="mt-4 text-sm text-tertiary max-w-sm leading-relaxed">
              Free online image tools for modern digital workflows. Resize, compress, convert, and crop images directly in your browser — fast, private, and zero installs.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs text-tertiary">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 font-semibold border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Col 2: Image Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
              Image Tools
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/image-resizer"
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  Image Resizer
                </Link>
              </li>
              <li>
                <Link
                  href="/image-compressor"
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-image-resizer"
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  Bulk Image Resizer
                </Link>
              </li>
              <li>
                <Link
                  href="/image-converter"
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  Image Converter
                </Link>
              </li>
              <li>
                <Link
                  href="/image-cropper"
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  Image Cropper
                </Link>
              </li>
              <li>
                <Link
                  href="/image-format-converter"
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  Format Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="#categories"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  PDF &amp; Doc Tools
                </Link>
              </li>
              <li>
                <Link
                  href="#categories"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link
                  href="#categories"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  Utility Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  About Scriza
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-tertiary hover:text-on-surface transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-tertiary">
          <p>© 2026 Scriza. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-on-surface transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-on-surface transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-on-surface transition-colors">
              Security
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
