import React from "react";
import { notFound } from "next/navigation";
import { ImageResizerTool } from "@/components/tools/image-resizer";
import { ImageCompressorTool } from "@/components/tools/image-compressor";
import { ImageConverterTool } from "@/components/tools/image-converter";
import { ImageCropperTool } from "@/components/tools/image-cropper";
import { BulkImageResizerTool } from "@/components/tools/bulk-image-resizer";
import { ImageFormatConverterTool } from "@/components/tools/image-format-converter";
import { ImagesToPdfTool } from "@/components/tools/images-to-pdf";
import { GoogleVignetteModal } from "@/components/google-vignette-modal";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (slug === "images-to-pdf") {
    return {
      title: "Images to PDF Maker — Free JPG & PNG to PDF Converter | Scriza",
      description: "Convert and merge multiple JPG, PNG, WEBP, and BMP images into a single PDF document in your browser. 100% private, free, and no file limits.",
    };
  }

  return {
    title: `${formattedTitle} — Free Online Image Tool | Scriza`,
    description: `Free client-side ${formattedTitle} by Scriza. Resize, crop, convert, and compress images directly in your browser with 100% privacy.`,
  };
}

export default async function ToolDynamicPage({ params }: ToolPageProps) {
  const { slug } = await params;

  // Render dedicated interactive tool component
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
      // Default to Image Resizer for any related route
      ToolComponent = <ImageResizerTool />;
      break;
  }

  return (
    <>
      {ToolComponent}
      {/* Google Vignette Modal Popup */}
      <GoogleVignetteModal />
    </>
  );
}
