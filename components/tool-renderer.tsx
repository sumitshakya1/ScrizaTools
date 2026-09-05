"use client";

import React from "react";
import dynamic from "next/dynamic";
import { GoogleVignetteModal } from "@/components/google-vignette-modal";

const ImageResizerTool = dynamic(
  () => import("@/components/tools/image-resizer").then((m) => m.ImageResizerTool),
  { ssr: false }
);

const ImageCompressorTool = dynamic(
  () => import("@/components/tools/image-compressor").then((m) => m.ImageCompressorTool),
  { ssr: false }
);

const ImageConverterTool = dynamic(
  () => import("@/components/tools/image-converter").then((m) => m.ImageConverterTool),
  { ssr: false }
);

const ImageCropperTool = dynamic(
  () => import("@/components/tools/image-cropper").then((m) => m.ImageCropperTool),
  { ssr: false }
);

const BulkImageResizerTool = dynamic(
  () => import("@/components/tools/bulk-image-resizer").then((m) => m.BulkImageResizerTool),
  { ssr: false }
);

const ImageFormatConverterTool = dynamic(
  () => import("@/components/tools/image-format-converter").then((m) => m.ImageFormatConverterTool),
  { ssr: false }
);

const ImagesToPdfTool = dynamic(
  () => import("@/components/tools/images-to-pdf").then((m) => m.ImagesToPdfTool),
  { ssr: false }
);

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
    default:
      ToolComponent = <ImageResizerTool />;
      break;
  }

  return (
    <>
      {ToolComponent}
      <GoogleVignetteModal />
    </>
  );
}
