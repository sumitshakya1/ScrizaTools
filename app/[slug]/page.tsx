import React from "react";
import { ToolRenderer } from "@/components/tool-renderer";

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

  return <ToolRenderer slug={slug} />;
}
