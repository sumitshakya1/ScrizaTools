"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/tools/shared/tool-skeleton";

// Loading fallback
function ToolLoading() {
  return <ToolSkeleton />;
}

// ── Image Tools ──
const ImageResizerTool = dynamic(() => import("@/components/tools/image-resizer").then(m => ({ default: m.ImageResizerTool })), { loading: ToolLoading });
const ImageCompressorTool = dynamic(() => import("@/components/tools/image-compressor").then(m => ({ default: m.ImageCompressorTool })), { loading: ToolLoading });
const ImageConverterTool = dynamic(() => import("@/components/tools/image-converter").then(m => ({ default: m.ImageConverterTool })), { loading: ToolLoading });
const ImageCropperTool = dynamic(() => import("@/components/tools/image-cropper").then(m => ({ default: m.ImageCropperTool })), { loading: ToolLoading });
const BulkImageResizerTool = dynamic(() => import("@/components/tools/bulk-image-resizer").then(m => ({ default: m.BulkImageResizerTool })), { loading: ToolLoading });
const ImageFormatConverterTool = dynamic(() => import("@/components/tools/image-format-converter").then(m => ({ default: m.ImageFormatConverterTool })), { loading: ToolLoading });

// ── Convert TO PDF ──
const ImagesToPdfTool = dynamic(() => import("@/components/tools/images-to-pdf").then(m => ({ default: m.ImagesToPdfTool })), { loading: ToolLoading });
const JpgToPdfTool = dynamic(() => import("@/components/tools/jpg-to-pdf").then(m => ({ default: m.JpgToPdfTool })), { loading: ToolLoading });
const HtmlToPdfTool = dynamic(() => import("@/components/tools/html-to-pdf").then(m => ({ default: m.HtmlToPdfTool })), { loading: ToolLoading });
const WordToPdfTool = dynamic(() => import("@/components/tools/word-to-pdf").then(m => ({ default: m.WordToPdfTool })), { loading: ToolLoading });
const PptxToPdfTool = dynamic(() => import("@/components/tools/pptx-to-pdf").then(m => ({ default: m.PptxToPdfTool })), { loading: ToolLoading });
const ExcelToPdfTool = dynamic(() => import("@/components/tools/excel-to-pdf").then(m => ({ default: m.ExcelToPdfTool })), { loading: ToolLoading });

// ── Convert FROM PDF ──
const PdfToImageTool = dynamic(() => import("@/components/tools/pdf-to-image").then(m => ({ default: m.PdfToImageTool })), { loading: ToolLoading });
const PdfToWordTool = dynamic(() => import("@/components/tools/pdf-to-word").then(m => ({ default: m.PdfToWordTool })), { loading: ToolLoading });
const PdfToPptxTool = dynamic(() => import("@/components/tools/pdf-to-pptx").then(m => ({ default: m.PdfToPptxTool })), { loading: ToolLoading });
const PdfToExcelTool = dynamic(() => import("@/components/tools/pdf-to-excel").then(m => ({ default: m.PdfToExcelTool })), { loading: ToolLoading });

// ── PDF Utilities ──
const PdfMergerTool = dynamic(() => import("@/components/tools/pdf-merger").then(m => ({ default: m.PdfMergerTool })), { loading: ToolLoading });
const PdfCompressorTool = dynamic(() => import("@/components/tools/pdf-compressor").then(m => ({ default: m.PdfCompressorTool })), { loading: ToolLoading });
const PdfProtectTool = dynamic(() => import("@/components/tools/pdf-protect").then(m => ({ default: m.PdfProtectTool })), { loading: ToolLoading });
const SplitPdfTool = dynamic(() => import("@/components/tools/split-pdf").then(m => ({ default: m.SplitPdfTool })), { loading: ToolLoading });
const RemovePdfPagesTool = dynamic(() => import("@/components/tools/remove-pdf-pages").then(m => ({ default: m.RemovePdfPagesTool })), { loading: ToolLoading });
const ExtractPdfPagesTool = dynamic(() => import("@/components/tools/extract-pdf-pages").then(m => ({ default: m.ExtractPdfPagesTool })), { loading: ToolLoading });
const RotatePdfTool = dynamic(() => import("@/components/tools/rotate-pdf").then(m => ({ default: m.RotatePdfTool })), { loading: ToolLoading });
const UnlockPdfTool = dynamic(() => import("@/components/tools/unlock-pdf").then(m => ({ default: m.UnlockPdfTool })), { loading: ToolLoading });
const PdfWatermarkTool = dynamic(() => import("@/components/tools/pdf-watermark").then(m => ({ default: m.PdfWatermarkTool })), { loading: ToolLoading });
const AddPageNumbersTool = dynamic(() => import("@/components/tools/add-page-numbers").then(m => ({ default: m.AddPageNumbersTool })), { loading: ToolLoading });
const OrganizePdfTool = dynamic(() => import("@/components/tools/organize-pdf").then(m => ({ default: m.OrganizePdfTool })), { loading: ToolLoading });
const SignPdfTool = dynamic(() => import("@/components/tools/sign-pdf").then(m => ({ default: m.SignPdfTool })), { loading: ToolLoading });
const CropPdfTool = dynamic(() => import("@/components/tools/crop-pdf").then(m => ({ default: m.CropPdfTool })), { loading: ToolLoading });
const PdfToPdfATool = dynamic(() => import("@/components/tools/pdf-to-pdfa").then(m => ({ default: m.PdfToPdfATool })), { loading: ToolLoading });
const ScanToPdfTool = dynamic(() => import("@/components/tools/scan-to-pdf").then(m => ({ default: m.ScanToPdfTool })), { loading: ToolLoading });
const RepairPdfTool = dynamic(() => import("@/components/tools/repair-pdf").then(m => ({ default: m.RepairPdfTool })), { loading: ToolLoading });
const ComparePdfTool = dynamic(() => import("@/components/tools/compare-pdf").then(m => ({ default: m.ComparePdfTool })), { loading: ToolLoading });
const EditPdfTool = dynamic(() => import("@/components/tools/edit-pdf").then(m => ({ default: m.EditPdfTool })), { loading: ToolLoading, ssr: false });
const OcrPdfTool = dynamic(() => import("@/components/tools/ocr-pdf").then(m => ({ default: m.OcrPdfTool })), { loading: ToolLoading });
const RedactPdfTool = dynamic(() => import("@/components/tools/redact-pdf").then(m => ({ default: m.RedactPdfTool })), { loading: ToolLoading });
const PdfAiSummarizerTool = dynamic(() => import("@/components/tools/pdf-ai-summarizer").then(m => ({ default: m.PdfAiSummarizerTool })), { loading: ToolLoading });
const TranslatePdfTool = dynamic(() => import("@/components/tools/translate-pdf").then(m => ({ default: m.TranslatePdfTool })), { loading: ToolLoading });
const PdfToMarkdownTool = dynamic(() => import("@/components/tools/pdf-to-markdown").then(m => ({ default: m.PdfToMarkdownTool })), { loading: ToolLoading });
const ComingSoonTool = dynamic(() => import("@/components/tools/coming-soon-tool").then(m => ({ default: m.ComingSoonTool })), { loading: ToolLoading });

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  switch (slug) {
    // ── Image Tools ──
    case "image-resizer":
      return <ImageResizerTool />;
    case "image-compressor":
      return <ImageCompressorTool />;
    case "image-converter":
      return <ImageConverterTool />;
    case "image-cropper":
      return <ImageCropperTool />;
    case "bulk-image-resizer":
      return <BulkImageResizerTool />;
    case "image-format-converter":
      return <ImageFormatConverterTool />;

    // ── Convert TO PDF ──
    case "images-to-pdf":
      return <ImagesToPdfTool />;
    case "jpg-to-pdf":
      return <JpgToPdfTool />;
    case "html-to-pdf":
      return <HtmlToPdfTool />;
    case "word-to-pdf":
      return <WordToPdfTool />;
    case "pptx-to-pdf":
      return <PptxToPdfTool />;
    case "excel-to-pdf":
      return <ExcelToPdfTool />;

    // ── Convert FROM PDF ──
    case "pdf-to-image":
      return <PdfToImageTool />;
    case "pdf-to-word":
      return <PdfToWordTool />;
    case "pdf-to-pptx":
      return <PdfToPptxTool />;
    case "pdf-to-excel":
      return <PdfToExcelTool />;

    // ── PDF Utilities ──
    case "pdf-merger":
      return <PdfMergerTool />;
    case "pdf-compressor":
      return <PdfCompressorTool />;
    case "pdf-protect":
      return <PdfProtectTool />;
    case "split-pdf":
      return <SplitPdfTool />;
    case "remove-pdf-pages":
      return <RemovePdfPagesTool />;
    case "extract-pdf-pages":
      return <ExtractPdfPagesTool />;
    case "rotate-pdf":
      return <RotatePdfTool />;
    case "unlock-pdf":
      return <UnlockPdfTool />;
    case "add-watermark":
      return <PdfWatermarkTool />;
    case "add-page-numbers":
      return <AddPageNumbersTool />;
    case "organize-pdf":
      return <OrganizePdfTool />;
    case "sign-pdf":
      return <SignPdfTool />;
    case "crop-pdf":
      return <CropPdfTool />;
    case "pdf-to-pdfa":
      return <PdfToPdfATool />;
    case "scan-to-pdf":
      return <ScanToPdfTool />;
    case "repair-pdf":
      return <RepairPdfTool />;
    case "compare-pdf":
      return <ComparePdfTool />;
    case "edit-pdf":
      return <EditPdfTool />;
    case "ocr-pdf":
      return <OcrPdfTool />;
    case "redact-pdf":
      return <RedactPdfTool />;
    case "pdf-ai-summarizer":
      return <PdfAiSummarizerTool />;
    case "translate-pdf":
      return <TranslatePdfTool />;
    case "pdf-to-markdown":
      return <PdfToMarkdownTool />;

    // ── Default Fallback ──
    default:
      return <ComingSoonTool toolId={slug} />;
  }
}
