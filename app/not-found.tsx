"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
        <FileQuestion className="h-8 w-8" />
      </div>

      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
        404 Error
      </span>

      <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        Tool or Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600">
        The tool or page you are looking for doesn’t exist or has moved. Explore our comprehensive suite of free Image &amp; PDF tools on the homepage.
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-primary-hover transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Explore All Tools</span>
        </Link>
      </div>
    </div>
  );
}
