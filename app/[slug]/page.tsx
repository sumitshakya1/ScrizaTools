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
    title: "Image Resizer — Free Online Image Resize Tool | ToolOn",
    description: "Resize any image to exact pixel dimensions or scale by percentage. 100% client-side, free, and private.",
  },
  "bulk-image-resizer": {
    title: "Bulk Image Resizer — Resize Up to 50 Images | ToolOn",
    description: "Resize up to 50 images simultaneously with batch processing. Download all resized images as ZIP.",
  },
  "image-compressor": {
    title: "Image Compressor — Reduce Image File Size Online | ToolOn",
    description: "Compress PNG, JPEG, WEBP, and HEIC images up to 85% while maintaining visual sharpness.",
  },
  "image-converter": {
    title: "Image Converter — Convert Between Image Formats | ToolOn",
    description: "Convert images between PNG, JPG, WEBP, AVIF, GIF, and SVG formats seamlessly in your browser.",
  },
  "image-cropper": {
    title: "Image Cropper — Crop Images to Exact Dimensions | ToolOn",
    description: "Crop images to exact dimensions, social media presets (16:9, 1:1, 4:5), or freeform shapes.",
  },
  "image-format-converter": {
    title: "Image Format Converter — PNG, JPG, WEBP, ICO | ToolOn",
    description: "Convert PNG, JPG, WEBP, ICO, TIFF, and RAW formats with custom color profiles.",
  },
  // PDF — Convert to PDF
  "images-to-pdf": {
    title: "Images to PDF — Free JPG & PNG to PDF Converter | ToolOn",
    description: "Convert and merge multiple JPG, PNG, WEBP, and BMP images into a single PDF document in your browser.",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF — Convert JPEG Photos to PDF Online | ToolOn",
    description: "Convert JPG and JPEG photos into a clean single-page or multi-page PDF document. 100% free and private.",
  },
  "html-to-pdf": {
    title: "HTML to PDF — Convert HTML to PDF Document | ToolOn",
    description: "Convert HTML content or web page markup into a downloadable PDF document with live preview.",
  },
  "word-to-pdf": {
    title: "Word to PDF — Convert DOCX to PDF Online | ToolOn",
    description: "Convert Microsoft Word documents (.docx, .doc) to PDF format preserving all formatting.",
  },
  "pptx-to-pdf": {
    title: "PowerPoint to PDF — Convert PPTX to PDF | ToolOn",
    description: "Convert PowerPoint presentations (.pptx) to high-quality PDF documents.",
  },
  "excel-to-pdf": {
    title: "Excel to PDF — Convert XLSX to PDF Online | ToolOn",
    description: "Convert Excel spreadsheets (.xlsx) to formatted PDF documents with table layouts.",
  },
  // PDF — Convert from PDF
  "pdf-to-image": {
    title: "PDF to JPG / PNG — Extract Images from PDF | ToolOn",
    description: "Convert every page of a PDF document into high-resolution JPG or PNG images. Custom DPI rendering.",
  },
  "pdf-to-word": {
    title: "PDF to Word — Convert PDF to DOCX Online | ToolOn",
    description: "Convert PDF documents back to editable Microsoft Word (.docx) files preserving formatting.",
  },
  "pdf-to-pptx": {
    title: "PDF to PowerPoint — Convert PDF to PPTX | ToolOn",
    description: "Convert PDF pages into editable PowerPoint presentation slides.",
  },
  "pdf-to-excel": {
    title: "PDF to Excel — Extract Tables from PDF | ToolOn",
    description: "Extract tables and data from PDF documents into Excel spreadsheet format.",
  },
  // PDF Utilities
  "pdf-merger": {
    title: "PDF Merger & Splitter — Combine or Split PDFs | ToolOn",
    description: "Merge multiple PDF files into one document or split a PDF by extracting specific page ranges.",
  },
  "split-pdf": {
    title: "Split PDF — Separate PDF Pages Online | ToolOn",
    description: "Extract pages from your PDF or save each page as a separate PDF. 100% free and secure.",
  },
  "remove-pdf-pages": {
    title: "Remove PDF Pages — Delete Pages from PDF | ToolOn",
    description: "Remove unwanted pages from a PDF document securely in your browser.",
  },
  "extract-pdf-pages": {
    title: "Extract PDF Pages — Pull specific pages | ToolOn",
    description: "Extract specific pages from a PDF document into a new PDF securely.",
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages — Rotate PDF Online | ToolOn",
    description: "Rotate specific pages or entire PDF documents securely in your browser.",
  },
  "pdf-compressor": {
    title: "PDF Compressor — Reduce PDF File Size | ToolOn",
    description: "Compress large PDF documents for email and web. Optimize by removing unused objects and compressing streams.",
  },
  "unlock-pdf": {
    title: "Unlock PDF — Remove PDF Password | ToolOn",
    description: "Remove password protection from your PDF files instantly securely in your browser.",
  },
  "add-watermark": {
    title: "Add Watermark to PDF | ToolOn",
    description: "Stamp text over your PDF pages to add a watermark securely in your browser.",
  },
  "add-page-numbers": {
    title: "Add Page Numbers to PDF | ToolOn",
    description: "Automatically insert page numbers into your PDF document securely in your browser.",
  },
  "pdf-protect": {
    title: "PDF Password Protect — Encrypt PDF Files | ToolOn",
    description: "Add password protection to secure PDF files. Restrict printing, copying, and editing permissions.",
  },
  "organize-pdf": {
    title: "Organize PDF Pages | ToolOn",
    description: "Sort, rearrange, and order your PDF pages securely in your browser.",
  },
  "sign-pdf": {
    title: "Sign PDF Document | ToolOn",
    description: "Add your digital signature image to a PDF securely in your browser.",
  },
  "crop-pdf": {
    title: "Crop PDF Margins | ToolOn",
    description: "Trim white margins or edges from your PDF pages securely in your browser.",
  },
  "pdf-to-pdfa": {
    title: "Convert to PDF/A | ToolOn",
    description: "Standardize your PDF documents for long-term archiving and preservation.",
  },
  "scan-to-pdf": {
    title: "Scan to PDF | ToolOn",
    description: "Convert your JPG and PNG images into a single PDF document instantly.",
  },
  "repair-pdf": {
    title: "Repair Corrupted PDF | ToolOn",
    description: "Attempt to recover data from corrupted or damaged PDF documents securely.",
  },
  "compare-pdf": {
    title: "Compare PDF Files | ToolOn",
    description: "Visually compare two PDF documents side-by-side securely in your browser.",
  },
  "edit-pdf": {
    title: "Edit PDF | ToolOn",
    description: "Add text annotations to your PDF document securely in your browser.",
  },
  "ocr-pdf": {
    title: "OCR PDF | ToolOn",
    description: "Extract text from scanned PDFs and images using Optical Character Recognition.",
  },
  "redact-pdf": {
    title: "Redact PDF | ToolOn",
    description: "Permanently remove sensitive text and graphics from your PDF documents.",
  },
  "pdf-ai-summarizer": {
    title: "AI Summarizer | ToolOn",
    description: "Let AI read your long PDFs and instantly generate a concise, accurate summary.",
  },
  "translate-pdf": {
    title: "Translate PDF | ToolOn",
    description: "Instantly translate your PDF documents into over 100 languages.",
  },
  "pdf-to-markdown": {
    title: "PDF to Markdown | ToolOn",
    description: "Convert your PDF files into clean, beautifully formatted Markdown text.",
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
    title: `${formattedTitle} — Free Online Tool | ToolOn`,
    description: `Free client-side ${formattedTitle} by ToolOn.in. Process files directly in your browser with 100% privacy.`,
  };
}

export default async function ToolDynamicPage({ params }: ToolPageProps) {
  const { slug } = await params;

  return <ToolRenderer slug={slug} />;
}
