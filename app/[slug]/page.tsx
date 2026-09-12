import React from "react";
import { ToolRenderer } from "@/components/tool-renderer";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SEO_MAP: Record<string, { title: string; description: string }> = {
  // Image Tools
  "image-resizer": {
    title: "Image Resizer — Free Online Image Resize Tool | Scriza",
    description: "Resize any image to exact pixel dimensions or scale by percentage. 100% client-side, free, and private.",
  },
  "bulk-image-resizer": {
    title: "Bulk Image Resizer — Resize Up to 50 Images | Scriza",
    description: "Resize up to 50 images simultaneously with batch processing. Download all resized images as ZIP.",
  },
  "image-compressor": {
    title: "Image Compressor — Reduce Image File Size Online | Scriza",
    description: "Compress PNG, JPEG, WEBP, and HEIC images up to 85% while maintaining visual sharpness.",
  },
  "image-converter": {
    title: "Image Converter — Convert Between Image Formats | Scriza",
    description: "Convert images between PNG, JPG, WEBP, AVIF, GIF, and SVG formats seamlessly in your browser.",
  },
  "image-cropper": {
    title: "Image Cropper — Crop Images to Exact Dimensions | Scriza",
    description: "Crop images to exact dimensions, social media presets (16:9, 1:1, 4:5), or freeform shapes.",
  },
  "image-format-converter": {
    title: "Image Format Converter — PNG, JPG, WEBP, ICO | Scriza",
    description: "Convert PNG, JPG, WEBP, ICO, TIFF, and RAW formats with custom color profiles.",
  },
  // PDF — Convert to PDF
  "images-to-pdf": {
    title: "Images to PDF — Free JPG & PNG to PDF Converter | Scriza",
    description: "Convert and merge multiple JPG, PNG, WEBP, and BMP images into a single PDF document in your browser.",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF — Convert JPEG Photos to PDF Online | Scriza",
    description: "Convert JPG and JPEG photos into a clean single-page or multi-page PDF document. 100% free and private.",
  },
  "html-to-pdf": {
    title: "HTML to PDF — Convert HTML to PDF Document | Scriza",
    description: "Convert HTML content or web page markup into a downloadable PDF document with live preview.",
  },
  "word-to-pdf": {
    title: "Word to PDF — Convert DOCX to PDF Online | Scriza",
    description: "Convert Microsoft Word documents (.docx, .doc) to PDF format preserving all formatting.",
  },
  "pptx-to-pdf": {
    title: "PowerPoint to PDF — Convert PPTX to PDF | Scriza",
    description: "Convert PowerPoint presentations (.pptx) to high-quality PDF documents.",
  },
  "excel-to-pdf": {
    title: "Excel to PDF — Convert XLSX to PDF Online | Scriza",
    description: "Convert Excel spreadsheets (.xlsx) to formatted PDF documents with table layouts.",
  },
  // PDF — Convert from PDF
  "pdf-to-image": {
    title: "PDF to JPG / PNG — Extract Images from PDF | Scriza",
    description: "Convert every page of a PDF document into high-resolution JPG or PNG images. Custom DPI rendering.",
  },
  "pdf-to-word": {
    title: "PDF to Word — Convert PDF to DOCX Online | Scriza",
    description: "Convert PDF documents back to editable Microsoft Word (.docx) files preserving formatting.",
  },
  "pdf-to-pptx": {
    title: "PDF to PowerPoint — Convert PDF to PPTX | Scriza",
    description: "Convert PDF pages into editable PowerPoint presentation slides.",
  },
  "pdf-to-excel": {
    title: "PDF to Excel — Extract Tables from PDF | Scriza",
    description: "Extract tables and data from PDF documents into Excel spreadsheet format.",
  },
  // PDF Utilities
  "pdf-merger": {
    title: "PDF Merger & Splitter — Combine or Split PDFs | Scriza",
    description: "Merge multiple PDF files into one document or split a PDF by extracting specific page ranges.",
  },
  "pdf-compressor": {
    title: "PDF Compressor — Reduce PDF File Size | Scriza",
    description: "Compress large PDF documents for email and web. Optimize by removing unused objects and compressing streams.",
  },
  "pdf-protect": {
    title: "PDF Password Protect — Encrypt PDF Files | Scriza",
    description: "Add password protection to secure PDF files. Restrict printing, copying, and editing permissions.",
  },
};

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;

  if (SEO_MAP[slug]) {
    return {
      title: SEO_MAP[slug].title,
      description: SEO_MAP[slug].description,
    };
  }

  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} — Free Online Tool | Scriza`,
    description: `Free client-side ${formattedTitle} by Scriza. Process files directly in your browser with 100% privacy.`,
  };
}

export default async function ToolDynamicPage({ params }: ToolPageProps) {
  const { slug } = await params;

  return <ToolRenderer slug={slug} />;
}
