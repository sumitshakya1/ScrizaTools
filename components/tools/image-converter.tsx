"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, ArrowRight, ShieldCheck, Sparkles, Check, FileType } from "lucide-react";
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
  formatFileSize,
  ImageMetadata,
  ExportOptions,
} from "@/lib/image-engine";

const CONVERTER_FAQS: FAQItem[] = [
  {
    question: "Can I convert transparent PNG or WEBP to JPEG without getting a black background?",
    answer:
      "Yes! When converting an image with transparent areas to JPEG, Scriza allows you to choose a custom solid background color (defaulting to pure white #FFFFFF), so transparent pixels turn cleanly into white instead of unsightly black blocks.",
  },
  {
    question: "How do I convert HEIC iPhone photos to standard JPG/PNG?",
    answer:
      "Simply upload your .heic or .heif photos from your iPhone or Mac. Scriza decodes HEIC client-side inside your browser and lets you download standard JPG or PNG files immediately.",
  },
  {
    question: "Does converting an image reduce its quality?",
    answer:
      "Converting between lossless formats (e.g. PNG to WEBP lossless or BMP to PNG) retains 100% mathematical pixel fidelity. Converting to JPEG allows you to customize the quality slider up to 100%.",
  },
  {
    question: "Can I make a multi-size Windows icon (.ico) or Favicon?",
    answer:
      "Yes, select ICO as your target export format to generate valid icon files compatible with web browser favicons and desktop operating systems.",
  },
];

export function ImageConverterTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Conversion Settings
  const [targetFormat, setTargetFormat] = useState<string>("image/png");
  const [quality, setQuality] = useState<number>(92);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [colorDepth, setColorDepth] = useState<string>("auto");

  // Output
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    try {
      const meta = await inspectImageFile(file);
      setMetadata(meta);
      const img = await loadImage(file);
      setLoadedImage(img);
      setPreviewUrl(img.src);

      // Auto-suggest complementary format (e.g. if jpg -> png/webp; if png -> jpg/webp)
      if (file.type.includes("jpeg") || file.type.includes("jpg")) {
        setTargetFormat("image/png");
      } else if (file.type.includes("png")) {
        setTargetFormat("image/webp");
      } else {
        setTargetFormat("image/jpeg");
      }
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

  // Live conversion preview
  useEffect(() => {
    if (!loadedImage) return;

    let isMounted = true;
    const runConvert = async () => {
      setIsConverting(true);
      try {
        const canvas = await processImageToCanvas(
          loadedImage,
          {},
          {
            format: targetFormat,
            backgroundColor: targetFormat === "image/jpeg" ? bgColor : "transparent",
            colorDepth: colorDepth as any,
          }
        );

        const blob = await canvasToBlob(canvas, targetFormat, quality / 100);
        if (isMounted) setOutputBlob(blob);
      } catch (err) {
        console.error("Conversion error:", err);
      } finally {
        if (isMounted) setIsConverting(false);
      }
    };

    const timer = setTimeout(runConvert, 80);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadedImage, targetFormat, quality, bgColor, colorDepth]);

  const handleDownload = (options: ExportOptions) => {
    if (!loadedImage || !selectedFile) return;
    try {
      const canvas = processImageToCanvas(
        loadedImage,
        {},
        {
          format: options.format || targetFormat,
          backgroundColor:
            (options.format || targetFormat) === "image/jpeg"
              ? options.backgroundColor || bgColor
              : options.backgroundColor,
          colorDepth: options.colorDepth || (colorDepth as any),
          effect: options.effect,
        }
      );

      downloadCanvasDirectly(
        canvas,
        options.fileName || "converted-image.png",
        options.format || targetFormat,
        options.quality || quality / 100
      );
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const formatList = [
    { id: "image/png", label: "PNG", desc: "Lossless • Transparency support" },
    { id: "image/jpeg", label: "JPEG", desc: "Universal photo compatibility" },
    { id: "image/webp", label: "WEBP", desc: "Next-gen web format • High compression" },
    { id: "image/gif", label: "GIF", desc: "Graphics & indexed color" },
    { id: "image/x-icon", label: "ICO", desc: "Browser Favicons & Windows App Icons" },
    { id: "image/bmp", label: "BMP", desc: "Uncompressed Windows Bitmap" },
  ];

  return (
    <ToolPageLayout
      toolId="image-converter"
      title="Image Converter"
      description="Convert images between PNG, JPEG, WEBP, HEIC, GIF, ICO, and BMP formats instantly inside your browser."
      faqComponent={<FAQSection toolName="Image Converter" items={CONVERTER_FAQS} />}
    >
      {/* 1. Upload Card */}
      <ImageUploadCard
        selectedFile={selectedFile}
        imageMetadata={metadata}
        previewUrl={previewUrl}
        onImageSelected={handleImageSelected}
        onClearImage={handleClearImage}
        infoTooltip="Select an image file to convert to any format."
      />

      {selectedFile && metadata && (
        <>
          {/* 2. Format Selection Grid Card matching RedKetchup */}
          <ToolSectionCard
            title="Convert Image"
            subtitle="Choose your target format and color options."
            infoTooltip="Select the output format you would like to convert this file into."
          >
            <div className="space-y-6">
              {/* Source vs Target Format Header */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-surface-low border border-surface-dim text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-tertiary block">
                    Source Format
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-on-surface uppercase font-mono">
                    {selectedFile.type.split("/")[1] || "IMAGE"}
                  </span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-tertiary block">
                    Target Format
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-primary uppercase font-mono">
                    {targetFormat.split("/")[1]}
                  </span>
                </div>
              </div>

              {/* Target Format Grid Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface">
                  Select Target File Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formatList.map((f) => {
                    const isSelected = targetFormat === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTargetFormat(f.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary-fixed/30 ring-2 ring-primary/20 shadow-xs"
                            : "border-surface-dim bg-white hover:border-primary/40 hover:bg-surface-low"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-on-surface font-mono">
                            {f.label}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-tertiary mt-1 leading-tight">
                          {f.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Color Fill for JPEG */}
              {targetFormat === "image/jpeg" && (
                <div className="space-y-2 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900">
                      Transparent Alpha Fill (JPEG does not support transparency)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-8 rounded cursor-pointer border border-amber-300"
                    />
                    <span className="text-xs font-mono font-bold text-amber-950">
                      {bgColor.toUpperCase()}
                    </span>
                    <span className="text-xs text-amber-800">
                      (White is recommended to avoid dark backgrounds)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ToolSectionCard>

          {/* 3. Save Image Card */}
          <SaveImageCard
            onDownload={handleDownload}
            outputBlob={outputBlob}
            defaultFormat={targetFormat}
            originalFileName={selectedFile.name}
            isProcessing={isConverting}
          />
        </>
      )}
    </ToolPageLayout>
  );
}
