"use client";

import React from "react";
import { ImageResizerTool } from "@/components/tools/image-resizer";
import { ImageCompressorTool } from "@/components/tools/image-compressor";
import { ImageConverterTool } from "@/components/tools/image-converter";
import { ImageCropperTool } from "@/components/tools/image-cropper";
import { BulkImageResizerTool } from "@/components/tools/bulk-image-resizer";
import { ImageFormatConverterTool } from "@/components/tools/image-format-converter";
import { ImagesToPdfTool } from "@/components/tools/images-to-pdf";
import { PdfToImageTool } from "@/components/tools/pdf-to-image";
import { PdfMergerTool } from "@/components/tools/pdf-merger";
import { PdfCompressorTool } from "@/components/tools/pdf-compressor";
import { PdfProtectTool } from "@/components/tools/pdf-protect";
import { HtmlToPdfTool } from "@/components/tools/html-to-pdf";
import { JpgToPdfTool } from "@/components/tools/jpg-to-pdf";
import { WordToPdfTool } from "@/components/tools/word-to-pdf";
import { PptxToPdfTool } from "@/components/tools/pptx-to-pdf";
import { ExcelToPdfTool } from "@/components/tools/excel-to-pdf";
import { PdfToWordTool } from "@/components/tools/pdf-to-word";
import { PdfToPptxTool } from "@/components/tools/pdf-to-pptx";
import { PdfToExcelTool } from "@/components/tools/pdf-to-excel";
import { ComingSoonTool } from "@/components/tools/coming-soon-tool";

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  let ToolComponent: React.ReactNode;

  switch (slug) {
    // ── Image Tools ──
    case "image-resizer":
      ToolComponent = <ImageResizerTool />;
      break;
    case "image-compressor":
      ToolComponent = <ImageCompressorTool />;
      break;
    case "image-converter":
      ToolComponent = <ImageConverterTool />;
      break;
    case "image-cropper":
      ToolComponent = <ImageCropperTool />;
      break;
    case "bulk-image-resizer":
      ToolComponent = <BulkImageResizerTool />;
      break;
    case "image-format-converter":
      ToolComponent = <ImageFormatConverterTool />;
      break;

    // ── Convert TO PDF ──
    case "images-to-pdf":
      ToolComponent = <ImagesToPdfTool />;
      break;
    case "jpg-to-pdf":
      ToolComponent = <JpgToPdfTool />;
      break;
    case "html-to-pdf":
      ToolComponent = <HtmlToPdfTool />;
      break;
    case "word-to-pdf":
      ToolComponent = <WordToPdfTool />;
      break;
    case "pptx-to-pdf":
      ToolComponent = <PptxToPdfTool />;
      break;
    case "excel-to-pdf":
      ToolComponent = <ExcelToPdfTool />;
      break;

    // ── Convert FROM PDF ──
    case "pdf-to-image":
      ToolComponent = <PdfToImageTool />;
      break;
    case "pdf-to-word":
      ToolComponent = <PdfToWordTool />;
      break;
    case "pdf-to-pptx":
      ToolComponent = <PdfToPptxTool />;
      break;
    case "pdf-to-excel":
      ToolComponent = <PdfToExcelTool />;
      break;

    // ── PDF Utilities ──
    case "pdf-merger":
      ToolComponent = <PdfMergerTool />;
      break;
    case "pdf-compressor":
      ToolComponent = <PdfCompressorTool />;
      break;
    case "pdf-protect":
      ToolComponent = <PdfProtectTool />;
      break;

    // ── Default Fallback ──
    default:
      ToolComponent = <ComingSoonTool toolId={slug} />;
      break;
  }

  return <>{ToolComponent}</>;
}
