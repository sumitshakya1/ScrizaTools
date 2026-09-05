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

// Browser-based Image Tools
export const imageTools: Tool[] = [
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images by pixels, percentage or ratio with high-fidelity resampling.",
    href: "/image-resizer",
    iconName: "Scan",
    badge: "Popular",
    isPopular: true,
    actionLabel: "Open Tool",
    features: ["Custom Dimensions", "Aspect Ratio Lock", "Bulk Export"],
    bulletPoints: [
      "Resize an image in pixels, percentage, or ratio online.",
      "Downscale or upscale using filters and sharpening.",
      "Supports the PNG, JPEG, WEBP, HEIC, GIF, ICO, TIFF, BMP, and SVG formats.",
    ],
  },
  {
    id: "bulk-image-resizer",
    name: "Bulk Image Resizer",
    description: "Resize and process multiple images quickly in batch mode.",
    href: "/bulk-image-resizer",
    iconName: "ImageIcon",
    actionLabel: "Open Tool",
    features: ["Batch Processing", "ZIP Download", "Zero Upload Wait"],
    bulletPoints: [
      "Resize, convert, or compress multiple images quickly.",
      "Compress PNG, JPEG, WEBP, or HEIC images in batch.",
      "Convert multiple images to the PNG, JPEG, WEBP, HEIC, GIF, ICO, TIFF, or BMP formats.",
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

// Browser-based PDF Tools
export const pdfTools: Tool[] = [
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
    id: "pdf-to-image",
    name: "PDF to JPG / PNG",
    description: "Extract high-resolution image pages from any PDF document.",
    href: "/images-to-pdf",
    iconName: "FileImage",
    badge: "Soon",
    actionLabel: "Open Tool",
    features: ["High-DPI Render", "Export Single or All", "ZIP Download"],
    bulletPoints: [
      "Convert every page of a PDF document into high-resolution JPG or PNG images.",
      "Select custom DPI rendering (150, 300, 600 DPI) for print-ready clarity.",
      "Download individual page images or all pages bundled in a ZIP archive.",
    ],
  },
  {
    id: "pdf-merger",
    name: "PDF Merger & Splitter",
    description: "Combine multiple PDF files into one or extract specific page ranges.",
    href: "/images-to-pdf",
    iconName: "Layers",
    badge: "Soon",
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
    href: "/images-to-pdf",
    iconName: "Wand2",
    badge: "Soon",
    actionLabel: "Open Tool",
    features: ["DPI Downscale", "Remove Duplicate Streams", "Email Ready"],
    bulletPoints: [
      "Compress large PDF documents for email attachments and web uploads.",
      "Optimize embedded images and vector graphics without quality degradation.",
      "View before-and-after file size comparisons before downloading.",
    ],
  },
  {
    id: "pdf-protect",
    name: "PDF Password Protect",
    description: "Encrypt and protect sensitive PDF files with standard AES encryption.",
    href: "/images-to-pdf",
    iconName: "ShieldCheck",
    badge: "Soon",
    actionLabel: "Open Tool",
    features: ["AES-256 Encryption", "Permission Restrictions", "Zero Uploads"],
    bulletPoints: [
      "Add password protection to secure invoices, statements, and contracts.",
      "Restrict printing, copying, and editing permissions.",
      "100% browser-based encryption ensures passwords never touch the cloud.",
    ],
  },
];

export const allTools: Tool[] = [...imageTools, ...pdfTools];

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

export const whyScrizaItems = [
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
