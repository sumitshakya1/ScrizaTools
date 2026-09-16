"use client";

import React, { useState, useEffect } from "react";
import { Download, Sparkles, Check, Copy, SlidersHorizontal, ArrowRight } from "lucide-react";
import { ToolSectionCard } from "./tool-section-card";
import { formatFileSize, SupportedFormat, triggerFileDownload, ExportOptions } from "@/lib/image-engine";
import { DownloadCountdownModal } from "./download-countdown-modal";

interface SaveImageCardProps {
  onDownload: (options: ExportOptions) => Promise<void> | void;
  outputBlob?: Blob | null;
  defaultFormat?: string;
  defaultQuality?: number;
  originalFileName?: string;
  isProcessing?: boolean;
  onQuickPreviewToggle?: () => void;
  showPreviewToggle?: boolean;
}

export function SaveImageCard({
  onDownload,
  outputBlob,
  defaultFormat = "image/png",
  defaultQuality = 90,
  originalFileName = "image",
  isProcessing = false,
  onQuickPreviewToggle,
  showPreviewToggle = false,
}: SaveImageCardProps) {
  const [format, setFormat] = useState<string>(defaultFormat);
  const [quality, setQuality] = useState<number>(defaultQuality);
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [customBgHex, setCustomBgHex] = useState<string>("#ffffff");
  const [colorDepth, setColorDepth] = useState<string>("auto");
  const [effect, setEffect] = useState<string>("none");

  // Countdown Modal State (30 seconds for AdSense revenue)
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [pendingOptions, setPendingOptions] = useState<ExportOptions | null>(null);

  // Derive base filename without extension
  const cleanBase = (name: string) => name.replace(/\.[^/.]+$/, "");
  const [fileName, setFileName] = useState<string>(`${cleanBase(originalFileName)}-processed`);

  // Sync fileName state when originalFileName prop changes
  useEffect(() => {
    if (originalFileName) {
      setFileName(`${cleanBase(originalFileName)}-processed`);
    }
  }, [originalFileName]);

  // Sync default format if changed externally
  useEffect(() => {
    if (defaultFormat) {
      setFormat(defaultFormat);
    }
  }, [defaultFormat]);

  // Auto-update filename extension label
  const getExtension = () => {
    switch (format) {
      case "image/jpeg":
        return ".jpg";
      case "image/webp":
        return ".webp";
      case "image/gif":
        return ".gif";
      case "image/x-icon":
        return ".ico";
      case "image/bmp":
        return ".bmp";
      default:
        return ".png";
    }
  };

  const handleDownloadClick = () => {
    const ext = getExtension();
    let base = fileName.trim();
    if (!base) base = "image-processed";

    // Clean any trailing dots or old extensions
    base = base.replace(/\.(png|jpe?g|webp|gif|ico|bmp|tiff?|heic)$/i, "");
    const finalFileName = `${base}${ext}`;

    const finalBg =
      format === "image/jpeg" && (bgColor === "transparent" || !bgColor)
        ? "#ffffff"
        : bgColor === "custom"
        ? customBgHex
        : bgColor;

    const opts: ExportOptions = {
      format,
      quality: quality / 100,
      backgroundColor: finalBg,
      colorDepth: colorDepth as any,
      effect: effect as any,
      fileName: finalFileName,
    };

    // Always trigger 30s Countdown Interstitial for AdSense monetization (bypassed only for Pro subscribers)
    const isPro = typeof window !== "undefined" && localStorage.getItem("toolon_pro_active") === "true";
    if (isPro) {
      onDownload(opts);
    } else {
      setPendingOptions(opts);
      setShowCountdown(true);
    }
  };

  const handleCountdownComplete = () => {
    if (pendingOptions) {
      onDownload(pendingOptions);
    }
  };

  const isLossy = format === "image/jpeg" || format === "image/webp";

  return (
    <ToolSectionCard
      title="Save Image"
      infoTooltip="Configure output format, compression quality, and background before saving."
      className="border-primary/30"
    >
      <div className="space-y-5">
        {/* Form Controls Grid matching RedKetchup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Format Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface">
              Export As
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-xs focus:border-primary focus:outline-none"
            >
              <option value="image/png">PNG — Portable Network Graphics (.png)</option>
              <option value="image/jpeg">JPEG — Joint Photographic Experts (.jpg)</option>
              <option value="image/webp">WEBP — Modern Web Format (.webp)</option>
              <option value="image/gif">GIF — Graphics Interchange (.gif)</option>
              <option value="image/x-icon">ICO — Windows Favicon (.ico)</option>
              <option value="image/bmp">BMP — Bitmap Image (.bmp)</option>
            </select>
          </div>

          {/* Quality Slider (Lossy only) */}
          {isLossy ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface">
                  Quality
                </label>
                <span className="text-xs font-mono font-bold text-primary">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-tertiary">
                <span>Smaller size</span>
                <span>Best quality</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface">
                Color Depth
              </label>
              <select
                value={colorDepth}
                onChange={(e) => setColorDepth(e.target.value)}
                className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-xs focus:border-primary focus:outline-none"
              >
                <option value="auto">Auto-Detect (Original Depth)</option>
                <option value="32-bit">32-bit RGBA (Millions of Colors)</option>
                <option value="24-bit">24-bit RGB (No Transparency)</option>
                <option value="8-bit">8-bit Indexed (256 Colors)</option>
                <option value="grayscale">8-bit Grayscale</option>
              </select>
            </div>
          )}

          {/* Background Color */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <select
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-xs focus:border-primary focus:outline-none"
              >
                <option value="transparent">Transparent (Alpha)</option>
                <option value="#ffffff">White (#FFFFFF)</option>
                <option value="#000000">Black (#000000)</option>
                <option value="custom">Custom Color...</option>
              </select>

              {bgColor === "custom" && (
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="color"
                    value={customBgHex}
                    onChange={(e) => setCustomBgHex(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-surface-dim p-0.5"
                  />
                  <input
                    type="text"
                    value={customBgHex}
                    onChange={(e) => setCustomBgHex(e.target.value)}
                    className="w-20 rounded border border-surface-dim px-2 py-1.5 text-xs font-mono uppercase"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Color Effects */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface">
              Color Filter / Effect
            </label>
            <select
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-xs focus:border-primary focus:outline-none"
            >
              <option value="none">None (Standard)</option>
              <option value="grayscale">Grayscale (Black &amp; White)</option>
              <option value="sepia">Sepia (Vintage Warmth)</option>
              <option value="invert">Invert Colors (Negative)</option>
            </select>
          </div>

          {/* Output Filename */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-on-surface">
              File Name
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="image-processed"
                className="w-full rounded-l-lg border border-r-0 border-surface-dim bg-white px-3 py-2 text-xs font-mono text-on-surface shadow-xs focus:border-primary focus:outline-none"
              />
              <span className="flex items-center rounded-r-lg border border-surface-dim bg-surface-low px-3 py-2 text-xs font-mono font-semibold text-tertiary">
                {getExtension()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row matching RedKetchup Download Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-dim">
          <div className="flex items-center gap-3">
            {outputBlob && (
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                <span className="text-tertiary">Estimated Size:</span>
                <span className="font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {formatFileSize(outputBlob.size)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadClick}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary hover:bg-primary-hover active:scale-[0.98] px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>{isProcessing ? "PROCESSING..." : "DOWNLOAD"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 30-Second Countdown Interstitial Modal for AdSense Monetization */}
      <DownloadCountdownModal
        isOpen={showCountdown}
        durationSeconds={30}
        fileName={pendingOptions?.fileName || `${fileName}${getExtension()}`}
        onComplete={handleCountdownComplete}
        onClose={() => setShowCountdown(false)}
      />
    </ToolSectionCard>
  );
}
