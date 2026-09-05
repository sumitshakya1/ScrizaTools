import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";

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
              Free online image and PDF utilities for modern digital workflows. Resize, compress, convert, and manage documents directly in your browser — fast, private, and zero installs.
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
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                Image Tools
              </h4>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/image-resizer"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">Image Resizer</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded border border-emerald-100">Popular</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-image-resizer"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">Bulk Image Resizer</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-1.5 py-0.5 rounded border border-blue-100">Bulk</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/image-compressor"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">Image Compressor</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded border border-emerald-100">Lossless</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/image-converter"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">Image Converter</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">Convert</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/image-cropper"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">Image Cropper</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">Crop</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/image-format-converter"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">Format Converter</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">Formats</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: PDF Tools */}
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                PDF Tools
              </h4>
              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <Sparkles className="h-2.5 w-2.5" /> PDF
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/images-to-pdf"
                  className="flex items-center justify-between text-tertiary hover:text-primary transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors font-medium">Images to PDF</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100">Live</span>
                </Link>
              </li>
              <li className="flex items-center justify-between text-tertiary group">
                <span className="group-hover:text-primary transition-colors">PDF to JPG / PNG</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded border border-amber-200">Soon</span>
              </li>
              <li className="flex items-center justify-between text-tertiary group">
                <span className="group-hover:text-primary transition-colors">PDF Merger &amp; Splitter</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded border border-amber-200">Soon</span>
              </li>
              <li className="flex items-center justify-between text-tertiary group">
                <span className="group-hover:text-primary transition-colors">PDF Compressor</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded border border-amber-200">Soon</span>
              </li>
              <li className="flex items-center justify-between text-tertiary group">
                <span className="group-hover:text-primary transition-colors">PDF Password Protect</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded border border-amber-200">Soon</span>
              </li>
            </ul>
          </div>

          {/* Col 4: India Office */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e11d48] sm:text-primary">
              INDIA OFFICE:
            </h4>
            <div className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5 text-tertiary">
                <MapPin className="h-5 w-5 shrink-0 text-[#e11d48] mt-0.5" />
                <span className="leading-relaxed">
                  NX One, T1 - 507, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201318
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#e11d48]" />
                <a
                  href="tel:+919116011899"
                  className="text-tertiary hover:text-primary font-medium transition-colors"
                >
                  +91 9116011899
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#e11d48]" />
                <a
                  href="tel:+919599287094"
                  className="text-tertiary hover:text-primary font-medium transition-colors"
                >
                  +91 9599287094
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#e11d48]" />
                <a
                  href="mailto:sales@scriza.in"
                  className="text-tertiary hover:text-primary font-medium transition-colors"
                >
                  sales@scriza.in
                </a>
              </div>
            </div>
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
