"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, Sliders, ShieldCheck, Check, ArrowRight, FileImage } from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ImageUploadCard } from "./shared/image-upload-card";
import { SaveImageCard } from "./shared/save-image-card";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import {
  loadImage,
  inspectImageFile,
  processImageToCanvas,
  canvasToBlob,
  downloadCanvasDirectly,
  downloadCanvas,
  triggerFileDownload,
  ImageMetadata,
  ExportOptions,
} from "@/lib/image-engine";

const FORMAT_FAQS: FAQItem[] = [
  {
    question: "How do I create a multi-resolution favicon (.ico) file?",
    answer:
      "Select ICO as the target format and choose your target dimensions (e.g. 16x16, 32x32, 48x48, or 64x64). The engine renders high-definition icon files for websites and Windows applications.",
  },
  {
    question: "Can I convert color depths (e.g. 24-bit to 8-bit indexed or Grayscale)?",
    answer:
      "Yes! You can toggle between 32-bit RGBA, 24-bit RGB, 8-bit color palette, or 8-bit Grayscale to reduce file sizes for embedded devices and retro displays.",
  },
];

export function ImageFormatConverterTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Settings
  const [targetFormat, setTargetFormat] = useState<string>("image/x-icon");
  const [targetIconSize, setTargetIconSize] = useState<number>(32);
  const [colorDepth, setColorDepth] = useState<string>("auto");
  const [effect, setEffect] = useState<string>("none");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    try {
      const meta = await inspectImageFile(file);
      setMetadata(meta);
      const img = await loadImage(file);
      setLoadedImage(img);
      setPreviewUrl(img.src);
    } catch (err) {
      console.error("Error loading image:", err);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setMetadata(null);
    setPreviewUrl(null);
    setLoadedImage(null);
    setOutputBlob(null);
  };

  useEffect(() => {
    if (!loadedImage) return;

    let isMounted = true;
    const runConversion = async () => {
      setIsProcessing(true);
      try {
        const isIco = targetFormat === "image/x-icon";
        const canvas = await processImageToCanvas(
          loadedImage,
          {
            width: isIco ? targetIconSize : undefined,
            height: isIco ? targetIconSize : undefined,
          },
          {
            format: targetFormat,
            colorDepth: colorDepth as any,
            effect: effect as any,
          }
        );

        const blob = await canvasToBlob(canvas, targetFormat, 0.95);
        if (isMounted) setOutputBlob(blob);
      } catch (e) {
        console.error("Format conversion failed:", e);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    const timer = setTimeout(runConversion, 80);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadedImage, targetFormat, targetIconSize, colorDepth, effect]);

  const handleDownload = (options: ExportOptions) => {
    if (!loadedImage) return;
    try {
      const isIco = (options.format || targetFormat) === "image/x-icon";
      const canvas = processImageToCanvas(
        loadedImage,
        {
          width: isIco ? targetIconSize : undefined,
          height: isIco ? targetIconSize : undefined,
        },
        options
      );

      downloadCanvasDirectly(
        canvas,
        options.fileName || "converted-format.ico",
        options.format || targetFormat,
        options.quality || 0.95
      );
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <ToolPageLayout
      toolId="image-format-converter"
      title="Image Format Converter"
      description="Convert PNG, JPEG, WEBP, ICO, TIFF, and BMP images with custom color depth palettes and favicon generation."
      faqComponent={<FAQSection toolName="Image Format Converter" items={FORMAT_FAQS} />}
    >
      <ImageUploadCard
        selectedFile={selectedFile}
        imageMetadata={metadata}
        previewUrl={previewUrl}
        onImageSelected={handleImageSelected}
        onClearImage={handleClearImage}
        infoTooltip="Select an image file to convert."
      />

      {selectedFile && metadata && (
        <>
          <ToolSectionCard
            title="Advanced Format &amp; Color Depth"
            subtitle="Configure specialized output parameters, icon sizing, or color palettes."
            infoTooltip="Fine-tune icon dimensions and color channels."
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Target Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold"
                  >
                    <option value="image/x-icon">ICO — Website Favicon &amp; App Icon</option>
                    <option value="image/webp">WEBP — Next-Gen Modern Web</option>
                    <option value="image/png">PNG — Transparent Lossless</option>
                    <option value="image/jpeg">JPEG — Standard Photo</option>
                    <option value="image/bmp">BMP — Windows Bitmap</option>
                  </select>
                </div>

                {targetFormat === "image/x-icon" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface">
                      Favicon / Icon Dimension
                    </label>
                    <select
                      value={targetIconSize}
                      onChange={(e) => setTargetIconSize(Number(e.target.value))}
                      className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold"
                    >
                      <option value="16">16 × 16 px (Browser Tab Favicon)</option>
                      <option value="32">32 × 32 px (Standard Favicon)</option>
                      <option value="48">48 × 48 px (Windows Desktop Icon)</option>
                      <option value="64">64 × 64 px (HiDPI Icon)</option>
                      <option value="128">128 × 128 px (App Store Preview)</option>
                      <option value="256">256 × 256 px (Ultra HD Icon)</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    Color Profile / Effect
                  </label>
                  <select
                    value={effect}
                    onChange={(e) => setEffect(e.target.value)}
                    className="w-full rounded-lg border border-surface-dim bg-white px-3 py-2 text-xs font-semibold"
                  >
                    <option value="none">Standard Full Color</option>
                    <option value="grayscale">Grayscale (8-bit B&amp;W)</option>
                    <option value="sepia">Sepia Tone</option>
                    <option value="invert">Invert Negative</option>
                  </select>
                </div>
              </div>
            </div>
          </ToolSectionCard>

          <SaveImageCard
            onDownload={handleDownload}
            outputBlob={outputBlob}
            defaultFormat={targetFormat}
            originalFileName={selectedFile.name}
            isProcessing={isProcessing}
          />
        </>
      )}
    </ToolPageLayout>
  );
}
