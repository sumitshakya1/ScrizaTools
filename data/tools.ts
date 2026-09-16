export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  iconName: string;
  badge?: string;
  isPopular?: boolean;
  features?: string[];
  actionLabel?: string;
  bulletPoints?: string[];
}

export interface ToolCategory {
  id: string;
  title: string;
  description: string;
  badgeText?: string;
  tools: Tool[];
}

export interface FutureCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  toolCount: number;
  previewTools: string[];
}

// ═══════════════════════════════════════════════════════════
// IMAGE TOOLS
// ═══════════════════════════════════════════════════════════

export const imageTools: Tool[] = [
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize any image to exact pixel dimensions or scale by percentage.",
    href: "/image-resizer",
    iconName: "Maximize2",
    badge: "Popular",
    isPopular: true,
    actionLabel: "Open Tool",
    features: ["Exact Pixel Dimensions", "Scale by Percentage", "Maintain Aspect Ratio"],
    bulletPoints: [
      "Resize a PNG, JPEG, WEBP, or HEIC image to exact dimensions.",
      "Set a new height, width, or percentage scale for the image.",
      "Convert multiple images to the PNG, JPEG, WEBP, HEIC, GIF, ICO, TIFF, or BMP formats.",
    ],
  },
  {
    id: "bulk-image-resizer",
    name: "Bulk Image Resizer",
    description: "Resize up to 50 images simultaneously with batch processing.",
    href: "/bulk-image-resizer",
    iconName: "Layers",
    badge: "Bulk",
    actionLabel: "Open Tool",
    features: ["Up to 50 Images", "ZIP Download", "Consistent Dimensions"],
    bulletPoints: [
      "Resize up to 50 images simultaneously with batch processing.",
      "Maintain consistent dimensions across all images in the batch.",
      "Download all resized images as a single ZIP archive.",
    ],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file size up to 85% while maintaining visual sharpness.",
    href: "/image-compressor",
    iconName: "Wand2",
    badge: "Fast",
    isPopular: true,
    actionLabel: "Open Tool",
    features: ["Lossy / Lossless", "Real-time Preview", "Target File Size"],
    bulletPoints: [
      "Compress the file size of a PNG, JPEG, WEBP, or HEIC image online.",
      "Reduce the image dimensions based on KB or MB.",
      "Improve the quality of PNG compression with dithering.",
    ],
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert images between PNG, JPG, WEBP, AVIF, GIF, and SVG formats seamlessly.",
    href: "/image-converter",
    iconName: "RefreshCw",
    actionLabel: "Open Tool",
    features: ["WEBP & AVIF support", "Retain Metadata", "Instant Convert"],
    bulletPoints: [
      "Convert an image to the PNG, JPEG, WEBP, HEIC, GIF, ICO, TIFF, or BMP format online.",
      "WEBP to JPEG — WEBP to PNG — JPEG to PNG.",
      "HEIC to JPEG — PNG to JPEG.",
    ],
  },
  {
    id: "image-cropper",
    name: "Image Cropper",
    description: "Crop images to exact dimensions, social media presets, or freeform shapes.",
    href: "/image-cropper",
    iconName: "Crop",
    actionLabel: "Open Tool",
    features: ["Social Presets (16:9, 1:1, 4:5)", "Rotate & Flip", "Grid Overlay"],
    bulletPoints: [
      "Crop images to exact dimensions, social media presets, or freeform shapes.",
      "Crop images by aspect ratio or custom bounding box.",
      "Rotate, flip horizontally or vertically, and zoom canvas.",
    ],
  },
  {
    id: "image-format-converter",
    name: "Image Format Converter",
    description: "Convert PNG, JPG, WEBP, ICO, TIFF, and RAW formats with custom color profiles.",
    href: "/image-format-converter",
    iconName: "FileImage",
    actionLabel: "Open Tool",
    features: ["Vector to Raster", "ICO Favicon Maker", "CMYK to RGB"],
    bulletPoints: [
      "Convert PNG, JPG, WEBP, ICO, TIFF, and RAW formats with custom color profiles.",
      "Retain metadata and color depth profiles.",
      "Create multi-size favicon ICO and modern WebP formats.",
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// PDF TOOLS — Organized into Subcategories
// ═══════════════════════════════════════════════════════════

// ── Convert TO PDF ─────────────────────────────────────────
export const convertToPdfTools: Tool[] = [
  {
    id: "images-to-pdf",
    name: "Images to PDF",
    description: "Convert and merge multiple JPG, PNG, WEBP, and BMP images into a single PDF document.",
    href: "/images-to-pdf",
    iconName: "FileText",
    badge: "Live",
    isPopular: true,
    actionLabel: "Open Tool",
    features: ["A4 & Letter Presets", "Drag Reorder", "Quality Optimization"],
    bulletPoints: [
      "Convert multiple JPG, PNG, WEBP, and BMP images into a single PDF.",
      "Custom page sizes (A4, US Letter, Fit Image) and custom margins.",
      "100% client-side privacy with zero server uploads.",
    ],
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG and JPEG photos into a clean, single-page or multi-page PDF document.",
    href: "/jpg-to-pdf",
    iconName: "FileImage",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Auto Page Fit", "Batch Convert", "High Quality"],
    bulletPoints: [
      "Drag and drop JPG or JPEG photos to create a PDF instantly.",
      "Automatically fits images to A4 or Letter page sizes.",
      "100% browser-based — your photos never leave your device.",
    ],
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert HTML content or web page markup into a downloadable PDF document.",
    href: "/html-to-pdf",
    iconName: "Globe",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Live Preview", "A4 & Letter", "Custom Styling"],
    bulletPoints: [
      "Paste HTML code and instantly convert to a clean PDF document.",
      "Live preview panel shows exactly how the PDF will render.",
      "Supports CSS styling, images, tables, and formatted text.",
    ],
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word documents (.docx, .doc) to PDF format preserving formatting.",
    href: "/word-to-pdf",
    iconName: "FileText",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["DOCX & DOC Support", "Preserve Formatting", "Batch Convert"],
    bulletPoints: [
      "Upload .docx or .doc files and convert to PDF with original formatting.",
      "Preserves fonts, images, tables, and page layouts.",
      "100% secure — documents processed entirely in your browser.",
    ],
  },
  {
    id: "pptx-to-pdf",
    name: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations (.pptx) to high-quality PDF documents.",
    href: "/pptx-to-pdf",
    iconName: "Presentation",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Slide Layouts", "Animations Flatten", "Speaker Notes"],
    bulletPoints: [
      "Convert .pptx presentations into print-ready PDF documents.",
      "Each slide becomes a full-page PDF with preserved graphics.",
      "Optionally include speaker notes in the PDF output.",
    ],
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets (.xlsx) to formatted PDF documents with table layouts.",
    href: "/excel-to-pdf",
    iconName: "FileSpreadsheet",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Table Formatting", "Multi-Sheet Support", "Print-Ready"],
    bulletPoints: [
      "Convert .xlsx spreadsheets to PDF with proper table formatting.",
      "Handles multiple sheets, merged cells, and conditional formatting.",
      "Choose landscape or portrait orientation for wide spreadsheets.",
    ],
  },
];

// ── Convert FROM PDF ───────────────────────────────────────
export const convertFromPdfTools: Tool[] = [
  {
    id: "pdf-to-image",
    name: "PDF to JPG / PNG",
    description: "Extract high-resolution image pages from any PDF document.",
    href: "/pdf-to-image",
    iconName: "ImageIcon",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["High-DPI Render", "Export Single or All", "ZIP Download"],
    bulletPoints: [
      "Convert every page of a PDF document into high-resolution JPG or PNG images.",
      "Select custom DPI rendering (72, 150, 300 DPI) for print-ready clarity.",
      "Download individual page images or all pages bundled in a ZIP archive.",
    ],
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents back to editable Microsoft Word (.docx) files.",
    href: "/pdf-to-word",
    iconName: "FileText",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Text Extraction", "Layout Preserve", "Editable Output"],
    bulletPoints: [
      "Extract text, images, and tables from PDF and reconstruct as DOCX.",
      "Maintains paragraph structure, headings, and basic formatting.",
      "Ideal for editing scanned documents and archived PDFs.",
    ],
  },
  {
    id: "pdf-to-pptx",
    name: "PDF to PowerPoint",
    description: "Convert PDF pages into editable PowerPoint presentation slides.",
    href: "/pdf-to-pptx",
    iconName: "Presentation",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Slide Reconstruction", "Image Extraction", "Editable Text"],
    bulletPoints: [
      "Each PDF page becomes an editable PowerPoint slide.",
      "Extracts text blocks and images for easy slide editing.",
      "Perfect for repurposing PDF reports into presentation decks.",
    ],
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract tables and data from PDF documents into Excel spreadsheet format.",
    href: "/pdf-to-excel",
    iconName: "FileSpreadsheet",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Table Detection", "Multi-Page Support", "CSV Alternative"],
    bulletPoints: [
      "Automatically detect and extract tables from PDF documents.",
      "Convert extracted data into .xlsx spreadsheets with proper columns.",
      "Also supports CSV export for simple tabular data.",
    ],
  },
];

// ── PDF Utilities ──────────────────────────────────────────
export const pdfUtilityTools: Tool[] = [
  {
    id: "pdf-merger",
    name: "PDF Merger & Splitter",
    description: "Combine multiple PDF files into one or extract specific page ranges.",
    href: "/pdf-merger",
    iconName: "Layers",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Drag Reorder", "Selective Page Extract", "Instant Merge"],
    bulletPoints: [
      "Merge multiple PDF documents together in any custom order.",
      "Extract or delete unwanted pages from existing PDF files.",
      "Client-side processing preserves all document metadata and hyperlinks.",
    ],
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    description: "Reduce PDF document file size while preserving sharp text and images.",
    href: "/pdf-compressor",
    iconName: "Wand2",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Object Stream Compression", "Remove Duplicates", "Email Ready"],
    bulletPoints: [
      "Compress large PDF documents for email attachments and web uploads.",
      "Optimize by removing unused objects and compressing streams.",
      "View before-and-after file size comparisons before downloading.",
    ],
  },
  {
    id: "pdf-protect",
    name: "PDF Password Protect",
    description: "Encrypt and protect sensitive PDF files with password protection.",
    href: "/pdf-protect",
    iconName: "ShieldCheck",
    badge: "Live",
    actionLabel: "Open Tool",
    features: ["Password Encryption", "Permission Restrictions", "Zero Uploads"],
    bulletPoints: [
      "Add password protection to secure invoices, statements, and contracts.",
      "Restrict printing, copying, and editing permissions.",
      "100% browser-based encryption ensures passwords never touch the cloud.",
    ],
  },
];

// Combined PDF tools array for routing and navigation
export const pdfTools: Tool[] = [
  ...convertToPdfTools,
  ...convertFromPdfTools,
  ...pdfUtilityTools,
];

// All tools combined
export const allTools: Tool[] = [...imageTools, ...pdfTools];

// ═══════════════════════════════════════════════════════════
// FUTURE CATEGORIES
// ═══════════════════════════════════════════════════════════

export const futureCategories: FutureCategory[] = [
  {
    id: "developer-tools",
    title: "Developer Tools",
    description: "JSON formatter, Base64 encoder, Regex tester, JWT debugger, and UUID generator.",
    iconName: "Code2",
    toolCount: 12,
    previewTools: ["JSON Beautifier", "JWT Inspector", "Regex Tester", "Hash Generator"],
  },
  {
    id: "file-tools",
    title: "File Tools",
    description: "Archive extractor, checksum calculator, duplicate finder, and filename sanitizers.",
    iconName: "FolderArchive",
    toolCount: 5,
    previewTools: ["ZIP Extractor", "MD5 Hash Check", "Batch Renamer", "File Splitter"],
  },
  {
    id: "utility-tools",
    title: "Utility Tools",
    description: "QR code generator, color palette studio, unit converters, and timestamp calculators.",
    iconName: "Wrench",
    toolCount: 9,
    previewTools: ["QR Studio", "Color Harmonizer", "Timestamp Calc", "Unit Converter"],
  },
  {
    id: "marketing-tools",
    title: "Marketing Tools",
    description: "UTM campaign builder, OpenGraph tag previewer, meta tag tester, and link shortener.",
    iconName: "TrendingUp",
    toolCount: 7,
    previewTools: ["UTM Builder", "Social Card Tester", "Meta Auditor", "SERP Preview"],
  },
];

export const valueHighlights = [
  {
    iconName: "Zap",
    title: "Instant Execution",
    description: "Zero wait times with client-side & edge acceleration",
  },
  {
    iconName: "ShieldCheck",
    title: "Private & Secure",
    description: "Files are processed securely and never retained",
  },
  {
    iconName: "Sparkles",
    title: "Simple & Clean",
    description: "Clutter-free interface built for fast daily work",
  },
  {
    iconName: "Gauge",
    title: "Built for Scale",
    description: "Handles single files to high-volume automations",
  },
];

export const whyToolOnItems = [
  {
    iconName: "Zap",
    title: "Fast",
    description: "Get things done without unnecessary complexity. Tools load instantly with zero bloat.",
    highlight: "Sub-second processing",
  },
  {
    iconName: "Smile",
    title: "Simple",
    description: "Tools designed to be easy to understand and use right away without steep learning curves.",
    highlight: "Zero training required",
  },
  {
    iconName: "Layers",
    title: "Powerful",
    description: "Practical features for everyday digital workflows with deep customization when you need it.",
    highlight: "Enterprise-ready precision",
  },
  {
    iconName: "ShieldCheck",
    title: "Private",
    description: "All processing happens in your browser. Your files never leave your device — zero uploads, zero tracking.",
    highlight: "100% client-side",
  },
];

export const whyScrizaItems = whyToolOnItems;
