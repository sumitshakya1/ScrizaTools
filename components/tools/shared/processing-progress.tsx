"use client";

import React from "react";
import { Loader2, CheckCircle2, Sparkles, X } from "lucide-react";

export interface ProgressState {
  isProcessing: boolean;
  progress: number; // 0 to 100
  statusText?: string;
  stepName?: string;
  totalItems?: number;
  completedItems?: number;
  onCancel?: () => void;
}

interface ProcessingProgressProps {
  progress: number;
  statusText?: string;
  stepName?: string;
  completedItems?: number;
  totalItems?: number;
  onCancel?: () => void;
  className?: string;
}

export function ProcessingProgress({
  progress,
  statusText = "Processing...",
  stepName,
  completedItems,
  totalItems,
  onCancel,
  className = "",
}: ProcessingProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-xs transition-all ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-2xs">
            {clampedProgress >= 100 ? (
              <CheckCircle2 className="h-4 w-4 animate-in zoom-in" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              {stepName || (clampedProgress >= 100 ? "Complete!" : "Processing Document")}
            </p>
            <p className="text-xs text-tertiary">
              {statusText}
              {totalItems !== undefined && completedItems !== undefined && (
                <span className="font-semibold text-primary ml-1">
                  ({completedItems}/{totalItems})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold text-primary font-mono tabular-nums">
            {clampedProgress}%
          </span>
          {onCancel && clampedProgress < 100 && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              title="Cancel processing"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

interface ProcessingModalProps extends ProcessingProgressProps {
  isOpen: boolean;
}

export function ProcessingModal({ isOpen, ...props }: ProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <ProcessingProgress {...props} />
      </div>
    </div>
  );
}
