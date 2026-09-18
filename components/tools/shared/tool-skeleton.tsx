"use client";

import React from "react";
import { UploadCloud, ShieldCheck } from "lucide-react";

export function ToolSkeleton() {
  return (
    <div className="min-h-screen bg-[#f4f6fa] text-on-surface flex flex-col animate-in fade-in duration-150">
      {/* Top Breadcrumb Bar Placeholder */}
      <div className="border-b border-surface-dim bg-white">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-12 py-3 flex items-center gap-2">
          <div className="h-3.5 w-12 rounded-md bg-slate-200 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-3.5 w-20 rounded-md bg-slate-200 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-3.5 w-32 rounded-md bg-slate-300 animate-pulse" />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 mx-auto max-w-[1536px] w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 sm:w-80 rounded-xl bg-slate-300 animate-pulse" />
            <div className="h-4 w-80 sm:w-96 rounded-lg bg-slate-200 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Browser-Based Processing • Private</span>
          </div>
        </div>

        {/* 2-Column Grid Matching Tool Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Area Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Upload Dropzone */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="h-5 w-48 rounded-lg bg-slate-200 animate-pulse mb-2" />
              <div className="h-3.5 w-72 rounded-lg bg-slate-100 animate-pulse mb-6" />

              <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <UploadCloud className="h-6 w-6 animate-pulse" />
                </div>
                <div className="h-4 w-52 rounded-md bg-slate-200 animate-pulse" />
                <div className="h-3 w-36 rounded-md bg-slate-100 animate-pulse" />
              </div>
            </div>

            {/* Card 2: Options Panel Placeholder */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <div className="h-5 w-40 rounded-lg bg-slate-200 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="h-11 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-11 rounded-xl bg-slate-100 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <div className="h-4 w-32 rounded-lg bg-slate-200 animate-pulse" />
              <div className="space-y-2 pt-2">
                <div className="h-8 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-8 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-8 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-8 rounded-lg bg-slate-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
