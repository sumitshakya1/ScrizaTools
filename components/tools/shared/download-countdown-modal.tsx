"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Download, CheckCircle2, ShieldCheck, Clock, ArrowRight } from "lucide-react";

interface DownloadCountdownModalProps {
  isOpen: boolean;
  durationSeconds?: number;
  fileName: string;
  onComplete: () => void;
  onClose: () => void;
}

export function DownloadCountdownModal({
  isOpen,
  durationSeconds = 30,
  fileName,
  onComplete,
  onClose,
}: DownloadCountdownModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationSeconds);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(durationSeconds);
      setIsFinished(false);
      return;
    }

    setSecondsRemaining(durationSeconds);
    setIsFinished(false);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, durationSeconds, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((durationSeconds - secondsRemaining) / durationSeconds) * 100);

  // Dynamic status messages throughout the 30s countdown
  const getStatusText = () => {
    if (secondsRemaining > 22) return "Processing image resolution and fine details...";
    if (secondsRemaining > 15) return "Applying high-fidelity compression & filters...";
    if (secondsRemaining > 8) return "Generating valid file headers and metadata...";
    if (secondsRemaining > 0) return "Finalizing download stream...";
    return "Your file is ready! Download started.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-surface-dim overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-dim">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <h3 className="text-base font-extrabold text-on-surface">
              {isFinished ? "Download Ready!" : "Preparing Your Download"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-tertiary hover:bg-surface-low hover:text-on-surface transition-colors"
            aria-label="Cancel download"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filename & Progress Bar Section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-on-surface truncate max-w-[280px]">
              {fileName}
            </span>
            <span className="font-mono font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-md border border-primary/20">
              {isFinished ? "Ready" : `${secondsRemaining}s remaining`}
            </span>
          </div>

          {/* Smooth Linear Progress Bar */}
          <div className="w-full bg-surface-dim h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-primary h-full transition-all duration-1000 ease-linear rounded-full"
            />
          </div>

          <p className="text-[11px] text-tertiary font-medium text-center">
            {getStatusText()}
          </p>
        </div>

        {/* High-Impact 300x250 Sponsored Ad Unit for AdSense Revenue */}
        <div className="mt-4 rounded-xl border border-surface-dim bg-surface-low/60 p-3 text-center">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-tertiary mb-2 px-1">
            <span>Sponsored Advertisement</span>
            <span className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-surface-dim">
              Ad
            </span>
          </div>

          {/* GoDaddy 300x250 Medium Rectangle Ad */}
          <div className="mx-auto w-[300px] h-[200px] sm:h-[220px] relative rounded-lg border border-surface-dim bg-white shadow-xs overflow-hidden">
            <a
              href="https://www.godaddy.com"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative w-full h-full"
              title="GoDaddy - Ready to check-out? Your cart is waiting"
            >
              <Image
                src="/images/godaddy-ad-unit.png"
                alt="Sponsored Advertisement - GoDaddy"
                fill
                sizes="300px"
                className="object-contain p-2"
                priority
              />
            </a>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-surface-dim px-4 py-2.5 text-xs font-semibold text-tertiary hover:bg-surface-low hover:text-on-surface transition-colors"
          >
            Cancel
          </button>

          {isFinished ? (
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download Again</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs font-bold text-tertiary bg-surface-low px-4 py-2.5 rounded-xl border border-surface-dim font-mono">
              <Clock className="h-4 w-4 text-primary animate-spin" />
              <span>Download starting in {secondsRemaining}s...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
