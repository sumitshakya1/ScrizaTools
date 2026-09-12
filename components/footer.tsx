import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  Lock,
  FileText,
  ImageIcon,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { imageTools, convertToPdfTools, convertFromPdfTools, pdfUtilityTools } from "@/data/tools";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/80 pt-16 pb-12 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlight Strip */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5 px-3 py-2">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">100% Client-Side Privacy</p>
              <p className="text-[11px] text-slate-500">Your files never leave your device</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Instant Execution</p>
              <p className="text-[11px] text-slate-500">Zero queue times & no file upload lag</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Free & Unlimited</p>
              <p className="text-[11px] text-slate-500">No account required, no daily caps</p>
            </div>
          </div>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand & Overview */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="Scriza Homepage"
            >
              <Image
                src="/scriza-logo-full.png"
                alt="SCRIZA"
                width={140}
                height={36}
                className="h-8 sm:h-9 w-auto object-contain object-left"
              />
            </Link>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Professional, free browser-based image and PDF utilities designed for fast digital workflows. No file size tracking, no server storage.
            </p>

            <div className="mt-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700 font-semibold border border-emerald-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All 19 Tools Operational
              </div>
            </div>
          </div>

          {/* Col 2: Image Tools */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon className="h-3 w-3" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Image Tools
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/image-resizer" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform font-medium">Image Resizer</span>
                  <span className="text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.2 rounded">Popular</span>
                </Link>
              </li>
              <li>
                <Link href="/bulk-image-resizer" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Bulk Resizer</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.2 rounded border border-blue-100">Bulk</span>
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Image Compressor</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-100">Lossless</span>
                </Link>
              </li>
              <li>
                <Link href="/image-converter" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Image Converter</span>
                </Link>
              </li>
              <li>
                <Link href="/image-cropper" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Image Cropper</span>
                </Link>
              </li>
              <li>
                <Link href="/image-format-converter" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Format Converter</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Convert to PDF */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="h-5 w-5 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-600">
                <FileText className="h-3 w-3" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Convert to PDF
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/images-to-pdf" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform font-medium">Images to PDF</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-1.5 py-0.2 rounded border border-rose-100">Multi</span>
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-pdf" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">JPG to PDF</span>
                </Link>
              </li>
              <li>
                <Link href="/word-to-pdf" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Word to PDF</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.2 rounded border border-blue-100">DOCX</span>
                </Link>
              </li>
              <li>
                <Link href="/excel-to-pdf" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Excel to PDF</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-100">XLSX</span>
                </Link>
              </li>
              <li>
                <Link href="/pptx-to-pdf" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">PowerPoint to PDF</span>
                  <span className="text-[10px] bg-orange-50 text-orange-700 font-semibold px-1.5 py-0.2 rounded border border-orange-100">PPTX</span>
                </Link>
              </li>
              <li>
                <Link href="/html-to-pdf" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">HTML to PDF</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Convert From PDF & Utilities */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="h-5 w-5 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Layers className="h-3 w-3" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                PDF Tools & Export
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf-to-word" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform font-medium">PDF to Word</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.2 rounded border border-blue-100">DOCX</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-excel" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">PDF to Excel</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-100">XLSX</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-pptx" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">PDF to PowerPoint</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-image" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">PDF to JPG / PNG</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-merger" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform font-medium">PDF Merger & Split</span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-1.5 py-0.2 rounded border border-purple-100">Merge</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-compressor" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">PDF Compressor</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-protect" className="flex items-center justify-between py-0.5 text-slate-600 hover:text-primary transition-all group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Password Protect</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.2 rounded border border-amber-100">AES-256</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: India Office Contact */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="h-5 w-5 rounded-md bg-rose-500/10 flex items-center justify-center text-[#e11d48]">
                <MapPin className="h-3 w-3" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                India Office
              </h4>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#e11d48] mt-0.5" />
                <span className="leading-relaxed text-[11.5px]">
                  NX One, T1 - 507, Tech Zone IV, Amrapali Dream Valley, Greater Noida, UP 201318
                </span>
              </div>

              <div className="pt-1 space-y-1.5 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#e11d48]" />
                  <a
                    href="tel:+919116011899"
                    className="hover:text-primary font-medium transition-colors"
                  >
                    +91 9116011899
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#e11d48]" />
                  <a
                    href="tel:+919599287094"
                    className="hover:text-primary font-medium transition-colors"
                  >
                    +91 9599287094
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#e11d48]" />
                  <a
                    href="mailto:sales@scriza.in"
                    className="hover:text-primary font-medium transition-colors"
                  >
                    sales@scriza.in
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Scriza. All rights reserved. Free browser-based tools.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-slate-900 transition-colors">
              Security Overview
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
