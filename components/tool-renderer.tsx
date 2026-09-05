"use client";

import React from "react";
import { ImageResizerTool } from "@/components/tools/image-resizer";
import { ImageCompressorTool } from "@/components/tools/image-compressor";
import { ImageConverterTool } from "@/components/tools/image-converter";
import { ImageCropperTool } from "@/components/tools/image-cropper";
import { BulkImageResizerTool } from "@/components/tools/bulk-image-resizer";
import { ImageFormatConverterTool } from "@/components/tools/image-format-converter";
import { ImagesToPdfTool } from "@/components/tools/images-to-pdf";
import { ComingSoonTool } from "@/components/tools/coming-soon-tool";
import { GoogleVignetteModal } from "@/components/google-vignette-modal";

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  let ToolComponent: React.ReactNode;

  switch (slug) {
    case "images-to-pdf":
      ToolComponent = <ImagesToPdfTool />;
      break;
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
    case "pdf-to-image":
    case "pdf-merger":
    case "pdf-compressor":
    case "pdf-protect":
    default:
      ToolComponent = <ComingSoonTool toolId={slug} />;
      break;
  }

  return (
    <>
      {ToolComponent}
      <GoogleVignetteModal />
    </>
  );
}
