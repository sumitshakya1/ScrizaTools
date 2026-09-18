export interface PDFImageItem {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

export interface PDFExportOptions {
  pageSize: "a4" | "letter" | "fit";
  orientation: "portrait" | "landscape" | "auto";
  margin: "none" | "small" | "normal" | "large";
  quality: number; // 0.1 to 1.0
  grayscale?: boolean;
}

// ─── PDF-to-Image Types ────────────────────────────────────
export interface PdfToImageOptions {
  dpi: number;       // 72, 150, 300
  format: "jpg" | "png";
  quality: number;   // 0.1 – 1.0  (only for jpg)
}

export interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
  blob: Blob;
}

// ─── PDF Merge/Split Types ─────────────────────────────────
export interface PageRange {
  start: number; // 1-indexed
  end: number;   // 1-indexed, inclusive
}

// ─── PDF Protect Types ─────────────────────────────────────
export interface PdfPermissions {
  printing: boolean;
  copying: boolean;
  modifying: boolean;
}

// ─── Helpers ───────────────────────────────────────────────

function getMarginPoints(margin: PDFExportOptions["margin"]): number {
  switch (margin) {
    case "none":   return 0;
    case "small":  return 18;
    case "normal": return 36;
    case "large":  return 54;
    default:       return 0;
  }
}

async function prepareImageBytes(
  item: PDFImageItem,
  quality: number,
  grayscale: boolean = false
): Promise<{ bytes: Uint8Array; format: "jpg" | "png" }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Canvas processing must run on client"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || item.width;
      canvas.height = img.naturalHeight || item.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get 2D canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (grayscale) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const jpegDataUrl = canvas.toDataURL("image/jpeg", Math.max(0.1, Math.min(1.0, quality)));
      const base64 = jpegDataUrl.split(",")[1];
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      resolve({ bytes, format: "jpg" });
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${item.name}`));
    img.src = item.dataUrl;
  });
}

/** Helper: read a File as ArrayBuffer */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

/** Helper: dataURL → Blob */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const bStr = atob(parts[1]);
  const u8 = new Uint8Array(bStr.length);
  for (let i = 0; i < bStr.length; i++) u8[i] = bStr.charCodeAt(i);
  return new Blob([u8], { type: mime });
}

// ═══════════════════════════════════════════════════════════
// 1. GENERATE PDF FROM IMAGES  (existing — unchanged)
// ═══════════════════════════════════════════════════════════

export async function generatePdfFromImages(
  items: PDFImageItem[],
  options: PDFExportOptions,
  onProgress?: (progress: number, message: string) => void
): Promise<Uint8Array> {
  if (items.length === 0) {
    throw new Error("No images provided to generate PDF");
  }

  if (onProgress) onProgress(10, "Initializing PDF compiler...");
  const { PDFDocument, PageSizes } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  const margin = getMarginPoints(options.margin);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (onProgress) {
      const pct = 10 + Math.round(((i + 0.3) / items.length) * 80);
      onProgress(pct, `Processing image ${i + 1} of ${items.length}: "${item.name}"...`);
    }
    const { bytes } = await prepareImageBytes(item, options.quality, options.grayscale);
    const embeddedImage = await pdfDoc.embedJpg(bytes);

    let imgWidth = embeddedImage.width;
    let imgHeight = embeddedImage.height;

    let pageWidth = 0;
    let pageHeight = 0;

    if (options.pageSize === "fit") {
      if (options.orientation === "landscape" && imgHeight > imgWidth) {
        pageWidth = imgHeight + margin * 2;
        pageHeight = imgWidth + margin * 2;
      } else if (options.orientation === "portrait" && imgWidth > imgHeight) {
        pageWidth = imgHeight + margin * 2;
        pageHeight = imgWidth + margin * 2;
      } else {
        pageWidth = imgWidth + margin * 2;
        pageHeight = imgHeight + margin * 2;
      }
    } else {
      const baseDimensions =
        options.pageSize === "letter" ? PageSizes.Letter : PageSizes.A4;

      let isLandscape = false;
      if (options.orientation === "auto") {
        isLandscape = imgWidth > imgHeight;
      } else {
        isLandscape = options.orientation === "landscape";
      }

      if (isLandscape) {
        pageWidth = baseDimensions[1];
        pageHeight = baseDimensions[0];
      } else {
        pageWidth = baseDimensions[0];
        pageHeight = baseDimensions[1];
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(
      availableWidth / imgWidth,
      availableHeight / imgHeight
    );

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const drawX = margin + (availableWidth - drawWidth) / 2;
    const drawY = margin + (availableHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  if (onProgress) onProgress(95, "Finalizing and assembling PDF file...");
  const pdfBytes = await pdfDoc.save();
  if (onProgress) onProgress(100, "Done!");
  return pdfBytes;
}

// ═══════════════════════════════════════════════════════════
// 2. PDF → IMAGES  (pdfjs-dist)
// ═══════════════════════════════════════════════════════════

export async function convertPdfToImages(
  file: File,
  options: PdfToImageOptions,
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPage[]> {
  if (typeof window === "undefined") {
    throw new Error("PDF rendering must run on the client");
  }

  // Dynamic import of pdfjs-dist
  const pdfjsLib = await import("pdfjs-dist");

  // Set worker source — use CDN for reliability
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;

  const results: RenderedPage[] = [];
  const scaleFactor = options.dpi / 72; // 72 DPI is baseline

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    onProgress?.(pageNum, totalPages);

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: scaleFactor });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Failed to get canvas context");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const mimeType = options.format === "png" ? "image/png" : "image/jpeg";
    const dataUrl =
      options.format === "png"
        ? canvas.toDataURL("image/png")
        : canvas.toDataURL("image/jpeg", options.quality);

    const blob = dataUrlToBlob(dataUrl);

    results.push({
      pageNumber: pageNum,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      blob,
    });

    // Cleanup
    canvas.width = 0;
    canvas.height = 0;
  }

  return results;
}

// ═══════════════════════════════════════════════════════════
// 3. PDF MERGE
// ═══════════════════════════════════════════════════════════

export async function mergePdfs(
  files: File[],
  onProgress?: (progress: number, message: string) => void
): Promise<Uint8Array> {
  if (files.length === 0) throw new Error("No PDF files provided");

  const { PDFDocument } = await import("pdf-lib");
  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      const pct = Math.round(((i + 0.2) / files.length) * 85);
      onProgress(pct, `Reading and parsing "${file.name}" (${i + 1}/${files.length})...`);
    }
    const arrayBuffer = await readFileAsArrayBuffer(file);
    try {
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      copiedPages.forEach((page) => mergedDoc.addPage(page));
      if (onProgress) {
        const pct = Math.round(((i + 1) / files.length) * 85);
        onProgress(pct, `Appended pages from "${file.name}" (${i + 1}/${files.length})`);
      }
    } catch (err) {
      console.warn(`Skipping unreadable PDF: ${file.name}`, err);
      throw new Error(`Failed to process "${file.name}". The file may be corrupted or password-protected.`);
    }
  }

  if (onProgress) onProgress(92, "Encoding merged PDF streams...");
  const saved = await mergedDoc.save();
  if (onProgress) onProgress(100, "Done!");
  return saved;
}

// ═══════════════════════════════════════════════════════════
// 4. PDF SPLIT  (extract page ranges)
// ═══════════════════════════════════════════════════════════

export async function splitPdf(
  file: File,
  ranges: PageRange[],
  onProgress?: (progress: number, message: string) => void
): Promise<Uint8Array> {
  if (ranges.length === 0) throw new Error("No page ranges specified");

  if (onProgress) onProgress(15, "Loading source PDF document...");
  const { PDFDocument } = await import("pdf-lib");
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const newDoc = await PDFDocument.create();

  // Collect unique 0-indexed page indices from all ranges
  const pageIndices = new Set<number>();
  for (const range of ranges) {
    const start = Math.max(1, range.start);
    const end = Math.min(totalPages, range.end);
    for (let i = start; i <= end; i++) {
      pageIndices.add(i - 1); // convert to 0-indexed
    }
  }

  const sortedIndices = Array.from(pageIndices).sort((a, b) => a - b);

  if (sortedIndices.length === 0) {
    throw new Error("No valid pages in the specified ranges");
  }

  if (onProgress) onProgress(45, `Extracting ${sortedIndices.length} selected pages...`);
  const copiedPages = await newDoc.copyPages(srcDoc, sortedIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  if (onProgress) onProgress(90, "Assembling extracted PDF...");
  const saved = await newDoc.save();
  if (onProgress) onProgress(100, "Done!");
  return saved;
}

/** Get page count of a PDF file */
export async function getPdfPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import("pdf-lib");
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return doc.getPageCount();
}

// ═══════════════════════════════════════════════════════════
// 5. PDF COMPRESS
// ═══════════════════════════════════════════════════════════

export async function compressPdf(
  file: File,
  compressionLevel: "low" | "medium" | "high"
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Create a new document and copy all pages — this strips unused objects
  const newDoc = await PDFDocument.create();
  const pageIndices = srcDoc.getPageIndices();
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  // Copy metadata
  const srcTitle = srcDoc.getTitle();
  const srcAuthor = srcDoc.getAuthor();
  const srcSubject = srcDoc.getSubject();
  if (srcTitle) newDoc.setTitle(srcTitle);
  if (srcAuthor) newDoc.setAuthor(srcAuthor);
  if (srcSubject) newDoc.setSubject(srcSubject);

  // Save with specific options to reduce size
  const compressedBytes = await newDoc.save({
    useObjectStreams: true,       // Compress object streams
    addDefaultPage: false,
    objectsPerTick: 50,
  });

  return compressedBytes;
}

// ═══════════════════════════════════════════════════════════
// 6. PDF PASSWORD PROTECT
// ═══════════════════════════════════════════════════════════

export async function protectPdf(
  file: File,
  userPassword: string,
  ownerPassword: string,
  permissions: PdfPermissions
): Promise<Uint8Array> {
  if (!userPassword && !ownerPassword) {
    throw new Error("At least one password is required");
  }

  const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt");
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const inputBytes = new Uint8Array(arrayBuffer);

  // Encrypt PDF with standard AES-256 encryption
  const encryptedBytes = await encryptPDF(inputBytes, userPassword || ownerPassword, {
    ownerPassword: ownerPassword || userPassword,
    algorithm: "AES-256",
    allowPrinting: permissions.printing,
    allowCopying: permissions.copying,
    allowModifying: permissions.modifying,
    allowAnnotating: permissions.modifying,
    allowFillingForms: true,
  });

  return encryptedBytes;
}

// ═══════════════════════════════════════════════════════════
// 7. HTML → PDF
// ═══════════════════════════════════════════════════════════

export async function convertHtmlToPdf(
  htmlContent: string,
  pageSize: "a4" | "letter" = "a4"
): Promise<Uint8Array> {
  if (typeof window === "undefined") {
    throw new Error("HTML to PDF must run on the client");
  }

  const html2canvas = (await import("html2canvas")).default;
  const { PDFDocument, PageSizes } = await import("pdf-lib");

  // Create a hidden container to render HTML
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // A4 width at 96 DPI
  container.style.backgroundColor = "white";
  container.style.padding = "40px";
  container.style.fontFamily = "Arial, Helvetica, sans-serif";
  container.style.fontSize = "14px";
  container.style.lineHeight = "1.6";
  container.style.color = "#333";
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Convert canvas to JPEG bytes
    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const base64 = jpegDataUrl.split(",")[1];
    const binaryString = atob(base64);
    const imgBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      imgBytes[i] = binaryString.charCodeAt(i);
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const embeddedImage = await pdfDoc.embedJpg(imgBytes);

    const dims = pageSize === "letter" ? PageSizes.Letter : PageSizes.A4;
    const pageWidth = dims[0];
    const pageHeight = dims[1];
    const margin = 36; // 0.5 inch

    const availW = pageWidth - margin * 2;
    const availH = pageHeight - margin * 2;

    // Calculate how many pages we need for the full image
    const scale = availW / embeddedImage.width;
    const scaledHeight = embeddedImage.height * scale;
    const totalPages = Math.ceil(scaledHeight / availH);

    for (let p = 0; p < totalPages; p++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Crop the portion of the image for this page
      const srcY = p * (availH / scale);
      const srcH = Math.min(availH / scale, embeddedImage.height - srcY);
      const drawH = srcH * scale;

      page.drawImage(embeddedImage, {
        x: margin,
        y: pageHeight - margin - drawH,
        width: availW,
        height: drawH,
      });
    }

    return pdfDoc.save();
  } finally {
    document.body.removeChild(container);
  }
}

// ═══════════════════════════════════════════════════════════
// 8. WORD (.DOCX) → PDF
// ═══════════════════════════════════════════════════════════

export async function convertWordToPdf(file: File): Promise<Uint8Array> {
  const mammoth = await import("mammoth");
  const { jsPDF } = await import("jspdf");

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  // Create a temporary container for rendering
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:595px;padding:40px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#000;background:#fff;";
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availW = pageWidth - margin * 2;
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = availW / imgWidth;
    const scaledHeight = imgHeight * ratio;
    const availH = pageHeight - margin * 2;

    let yOffset = 0;
    let pageNum = 0;

    while (yOffset < scaledHeight) {
      if (pageNum > 0) pdf.addPage();
      const srcY = yOffset / ratio;
      const srcH = Math.min(availH / ratio, imgHeight - srcY);
      const drawH = srcH * ratio;

      // Create a cropped canvas for this page
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.ceil(srcH);
      const ctx = pageCanvas.getContext("2d")!;
      ctx.drawImage(canvas, 0, srcY, imgWidth, srcH, 0, 0, imgWidth, srcH);

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(pageImgData, "JPEG", margin, margin, availW, drawH);

      yOffset += availH;
      pageNum++;
    }

    const output = pdf.output("arraybuffer");
    return new Uint8Array(output);
  } finally {
    document.body.removeChild(container);
  }
}

// ═══════════════════════════════════════════════════════════
// 9. POWERPOINT (.PPTX) → PDF
// ═══════════════════════════════════════════════════════════

export async function convertPptxToPdf(file: File): Promise<Uint8Array> {
  const JSZip = (await import("jszip")).default;
  const { jsPDF } = await import("jspdf");

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Parse slide dimensions from presentation.xml
  const presXml = await zip.file("ppt/presentation.xml")?.async("string");
  let slideWidth = 960;  // default 10 inches * 96
  let slideHeight = 540; // default 7.5 inches * 72

  if (presXml) {
    const sldSzMatch = presXml.match(/sldSz[^>]*cx="(\d+)"[^>]*cy="(\d+)"/);
    if (sldSzMatch) {
      slideWidth = parseInt(sldSzMatch[1]) / 12700;  // EMU to points
      slideHeight = parseInt(sldSzMatch[2]) / 12700;
    }
  }

  // Find all slide files
  const slideFiles: string[] = [];
  zip.forEach((path) => {
    const match = path.match(/^ppt\/slides\/slide(\d+)\.xml$/);
    if (match) slideFiles.push(path);
  });
  slideFiles.sort((a, b) => {
    const na = parseInt(a.match(/slide(\d+)/)?.[1] || "0");
    const nb = parseInt(b.match(/slide(\d+)/)?.[1] || "0");
    return na - nb;
  });

  if (slideFiles.length === 0) throw new Error("No slides found in this PowerPoint file.");

  // Render each slide to a canvas → PDF page
  const pdf = new jsPDF({
    orientation: slideWidth > slideHeight ? "l" : "p",
    unit: "pt",
    format: [slideWidth, slideHeight],
  });

  for (let i = 0; i < slideFiles.length; i++) {
    if (i > 0) pdf.addPage([slideWidth, slideHeight], slideWidth > slideHeight ? "l" : "p");

    const slideXml = await zip.file(slideFiles[i])?.async("string");
    if (!slideXml) continue;

    // Extract text content from slide XML
    const textBlocks: { text: string; x: number; y: number; fontSize: number; bold: boolean }[] = [];
    const spMatches = slideXml.matchAll(/<p:sp>([\s\S]*?)<\/p:sp>/g);

    for (const spMatch of spMatches) {
      const spContent = spMatch[1];

      // Get position
      let x = 50, y = 50;
      const offMatch = spContent.match(/<a:off\s+x="(\d+)"\s+y="(\d+)"/);
      if (offMatch) {
        x = parseInt(offMatch[1]) / 12700;
        y = parseInt(offMatch[2]) / 12700;
      }

      // Get text runs
      const runs = spContent.matchAll(/<a:r>([\s\S]*?)<\/a:r>/g);
      for (const run of runs) {
        const runContent = run[1];
        const textMatch = runContent.match(/<a:t>([\s\S]*?)<\/a:t>/);
        if (!textMatch) continue;

        const text = textMatch[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        const sizeMatch = runContent.match(/sz="(\d+)"/);
        const fontSize = sizeMatch ? parseInt(sizeMatch[1]) / 100 : 18;
        const bold = /<a:rPr[^>]*\bb="1"/.test(runContent);

        textBlocks.push({ text, x, y, fontSize, bold });
      }
    }

    // Draw background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, slideWidth, slideHeight, "F");

    // Draw text blocks
    for (const block of textBlocks) {
      pdf.setFontSize(block.fontSize);
      if (block.bold) {
        pdf.setFont("helvetica", "bold");
      } else {
        pdf.setFont("helvetica", "normal");
      }
      pdf.setTextColor(0, 0, 0);
      const clampedX = Math.max(10, Math.min(block.x, slideWidth - 50));
      const clampedY = Math.max(20, Math.min(block.y + block.fontSize, slideHeight - 10));
      pdf.text(block.text, clampedX, clampedY, { maxWidth: slideWidth - clampedX - 20 });
    }

    // Try to render images from slide relationships
    try {
      const relsPath = slideFiles[i].replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
      const relsXml = await zip.file(relsPath)?.async("string");
      if (relsXml) {
        const imgRels = relsXml.matchAll(/Target="\.\.\/media\/([^"]+)"/g);
        for (const imgRel of imgRels) {
          const imgPath = `ppt/media/${imgRel[1]}`;
          const imgFile = zip.file(imgPath);
          if (imgFile) {
            const imgData = await imgFile.async("base64");
            const ext = imgRel[1].split(".").pop()?.toLowerCase() || "png";
            const format = ext === "jpg" || ext === "jpeg" ? "JPEG" : "PNG";
            try {
              pdf.addImage(
                `data:image/${ext};base64,${imgData}`,
                format,
                50,
                50,
                Math.min(slideWidth - 100, 400),
                Math.min(slideHeight - 100, 300)
              );
            } catch {
              // Skip unsupported image formats
            }
          }
        }
      }
    } catch {
      // Silently skip image extraction errors
    }
  }

  const output = pdf.output("arraybuffer");
  return new Uint8Array(output);
}

// ═══════════════════════════════════════════════════════════
// 10. EXCEL (.XLSX) → PDF
// ═══════════════════════════════════════════════════════════

export async function convertExcelToPdf(
  file: File,
  orientation: "portrait" | "landscape" = "portrait"
): Promise<Uint8Array> {
  const XLSX = await import("xlsx");
  const { jsPDF } = await import("jspdf");

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const pdf = new jsPDF({
    orientation: orientation === "landscape" ? "l" : "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  let isFirstSheet = true;

  for (const sheetName of workbook.SheetNames) {
    if (!isFirstSheet) pdf.addPage();
    isFirstSheet = false;

    const sheet = workbook.Sheets[sheetName];
    const jsonData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as string[][];

    if (jsonData.length === 0) continue;

    // Sheet name header
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text(sheetName, margin, margin + 5);

    // Calculate column widths
    const maxCols = Math.max(...jsonData.map((row) => row.length));
    const colWidth = Math.min((pageWidth - margin * 2) / maxCols, 40);
    const rowHeight = 7;
    let currentY = margin + 12;

    for (let rowIdx = 0; rowIdx < jsonData.length; rowIdx++) {
      // Page break check
      if (currentY + rowHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin + 5;
      }

      const row = jsonData[rowIdx];
      const isHeader = rowIdx === 0;

      for (let colIdx = 0; colIdx < maxCols; colIdx++) {
        const cellX = margin + colIdx * colWidth;
        const cellValue = String(row[colIdx] ?? "");

        // Draw cell border
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(cellX, currentY, colWidth, rowHeight);

        // Fill header row
        if (isHeader) {
          pdf.setFillColor(41, 65, 122);
          pdf.rect(cellX, currentY, colWidth, rowHeight, "F");
          pdf.setTextColor(255, 255, 255);
          pdf.setFont("helvetica", "bold");
        } else {
          if (rowIdx % 2 === 0) {
            pdf.setFillColor(245, 247, 250);
            pdf.rect(cellX, currentY, colWidth, rowHeight, "F");
          }
          pdf.setTextColor(40, 40, 40);
          pdf.setFont("helvetica", "normal");
        }

        pdf.setFontSize(8);
        const truncatedValue = cellValue.length > 15 ? cellValue.substring(0, 14) + "…" : cellValue;
        pdf.text(truncatedValue, cellX + 1.5, currentY + rowHeight - 2, {
          maxWidth: colWidth - 3,
        });
      }

      currentY += rowHeight;
    }
  }

  const output = pdf.output("arraybuffer");
  return new Uint8Array(output);
}

// ═══════════════════════════════════════════════════════════
// 11. PDF → WORD (.DOCX)
// ═══════════════════════════════════════════════════════════

export async function convertPdfToWord(file: File): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, PageBreak } = await import("docx");
  const pdfjsLib = await import("pdfjs-dist");

  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
  });
  const pdfDoc = await loadingTask.promise;

  const allDocChildren: any[] = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    interface TextItem {
      str: string;
      transform: number[];
      width: number;
      height: number;
      fontName?: string;
    }

    const textItems = (textContent.items.filter(
      (item: any) => "str" in item && item.str.trim().length > 0
    ) as any[]) as TextItem[];

    const totalTextLength = textItems.reduce((acc, it) => acc + it.str.trim().length, 0);

    // If page has substantial selectable text, reconstruct paragraphs
    if (totalTextLength >= 10) {
      // Sort by Y (descending: top to bottom) then X (ascending: left to right)
      textItems.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) > 4) return yDiff;
        return a.transform[4] - b.transform[4];
      });

      // Group items into lines by vertical proximity
      const lines: TextItem[][] = [];
      let currentLine: TextItem[] = [];
      let lastY = -9999;

      for (const item of textItems) {
        const y = item.transform[5];
        if (Math.abs(y - lastY) > 4 && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = [];
        }
        currentLine.push(item);
        lastY = y;
      }
      if (currentLine.length > 0) lines.push(currentLine);

      // Convert lines to formatted docx Paragraphs
      for (const line of lines) {
        let lineText = "";
        for (let i = 0; i < line.length; i++) {
          const item = line[i];
          if (i > 0) {
            const prev = line[i - 1];
            const dist = item.transform[4] - (prev.transform[4] + (prev.width || 0));
            if (dist > 1.5) lineText += " ";
          }
          lineText += item.str;
        }

        if (!lineText.trim()) continue;

        // Calculate font size in points from transform matrix scale
        const avgFontSize = Math.max(
          8,
          Math.min(
            36,
            Math.round(
              line.reduce(
                (sum, item) =>
                  sum +
                  (Math.hypot(item.transform[0], item.transform[1]) ||
                    item.height ||
                    12),
                0
              ) / line.length
            )
          )
        );

        let heading: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined;
        if (avgFontSize >= 22) heading = HeadingLevel.HEADING_1;
        else if (avgFontSize >= 17) heading = HeadingLevel.HEADING_2;
        else if (avgFontSize >= 14) heading = HeadingLevel.HEADING_3;

        allDocChildren.push(
          new Paragraph({
            heading,
            spacing: { after: 120, line: 260 },
            children: [
              new TextRun({
                text: lineText,
                size: avgFontSize * 2,
                bold: avgFontSize >= 15,
                font: "Calibri",
              }),
            ],
          })
        );
      }
    } else {
      // Scanned document / graphical page fallback: Render high-res canvas image
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL("image/png");
          const base64Data = dataUrl.split(",")[1] || "";
          const binary = atob(base64Data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          const targetWidth = Math.min(560, Math.round(viewport.width * 0.5));
          const targetHeight = Math.round(targetWidth * (viewport.height / viewport.width));

          allDocChildren.push(
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: { width: targetWidth, height: targetHeight },
                  type: "png",
                }),
              ],
            })
          );
        }
      }
    }

    // Page break between pages (except last)
    if (pageNum < pdfDoc.numPages) {
      allDocChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }
  }

  // Ensure at least one paragraph exists
  if (allDocChildren.length === 0) {
    allDocChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Document content converted from PDF.",
            size: 24,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  const doc = new Document({
    creator: "ToolOn Tools",
    title: file.name.replace(/.pdf$/i, ""),
    description: "Converted from PDF using ToolOn.in",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: allDocChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

// ═══════════════════════════════════════════════════════════
// 12. PDF → POWERPOINT (.PPTX)
// ═══════════════════════════════════════════════════════════

export async function convertPdfToPptx(file: File): Promise<Blob> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pdfjsLib = await import("pdfjs-dist");

  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const pres = new PptxGenJS();

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    // Render page to canvas
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    // Add slide with page image
    const slide = pres.addSlide();
    slide.addImage({
      data: imgData,
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
    });
  }

  // Generate blob
  const pptxBlob = await pres.write({ outputType: "blob" });
  return pptxBlob as Blob;
}

// ═══════════════════════════════════════════════════════════
// 13. PDF → EXCEL (.XLSX)
// ═══════════════════════════════════════════════════════════

export async function convertPdfToExcel(file: File): Promise<Blob> {
  const XLSX = await import("xlsx");
  const pdfjsLib = await import("pdfjs-dist");

  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const workbook = XLSX.utils.book_new();

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    interface TextItem {
      str: string;
      transform: number[];
      width: number;
      height: number;
    }

    const textItems = (textContent.items.filter(
      (item: any) => "str" in item && item.str.trim().length > 0
    ) as any[]) as TextItem[];

    // Sort by Y (descending = top first) then X (left first)
    textItems.sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5];
      if (Math.abs(yDiff) > 5) return yDiff;
      return a.transform[4] - b.transform[4];
    });

    // Group into rows by Y proximity
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let lastY = -9999;

    for (const item of textItems) {
      const y = item.transform[5];
      if (Math.abs(y - lastY) > 5 && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      currentRow.push(item.str);
      lastY = y;
    }
    if (currentRow.length > 0) rows.push(currentRow);

    // Create worksheet from rows
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const sheetName = pdfDoc.numPages === 1 ? "Sheet1" : `Page ${pageNum}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  // Generate xlsx blob
  const xlsxArrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([xlsxArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// ── BATCH 1: PDF ORGANIZATION TOOLS ────────────────────────

export async function extractPdfPages(file: File, pagesToExtract: number[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const newPdf = await PDFDocument.create();
  // PDF-lib pages are 0-indexed, pagesToExtract is 1-indexed.
  const indices = pagesToExtract.map(p => p - 1).filter(i => i >= 0 && i < pdfDoc.getPageCount());
  
  const copiedPages = await newPdf.copyPages(pdfDoc, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
}

export async function removePdfPages(file: File, pagesToRemove: number[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  // Sort descending so removing pages doesn't shift indices of subsequent removals
  const indices = pagesToRemove
    .map(p => p - 1)
    .filter(i => i >= 0 && i < pdfDoc.getPageCount())
    .sort((a, b) => b - a);
    
  for (const index of indices) {
    pdfDoc.removePage(index);
  }
  
  return await pdfDoc.save();
}

export async function rotatePdfPages(file: File, rotationDegrees: number = 90, specificPages?: number[]): Promise<Uint8Array> {
  const { PDFDocument, degrees } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const totalPages = pdfDoc.getPageCount();
  const pagesToRotate = specificPages 
    ? specificPages.map(p => p - 1).filter(i => i >= 0 && i < totalPages)
    : Array.from({ length: totalPages }, (_, i) => i);
  
  for (const index of pagesToRotate) {
    const page = pdfDoc.getPage(index);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotationDegrees));
  }
  
  return await pdfDoc.save();
}

// ── BATCH 2: PDF SECURITY & WATERMARKS ─────────────────────

export async function unlockPdf(file: File, password: string): Promise<Uint8Array> {
  if (typeof window === "undefined") {
    throw new Error("PDF unlocking must run on the client");
  }

  // Step 1: Use pdfjs-dist to open the encrypted PDF (it supports AES-256 decryption)
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();

  let pdfDoc;
  try {
    pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer, password }).promise;
  } catch (err: any) {
    if (err?.name === "PasswordException" || (err?.message && err.message.toLowerCase().includes("password"))) {
      throw new Error("Incorrect password. Please check and try again.");
    }
    throw err;
  }

  const totalPages = pdfDoc.numPages;

  // Step 2: Render every page at high DPI to preserve quality
  const DPI_SCALE = 3; // 216 DPI — sharp text
  const pageImages: { jpgBytes: Uint8Array; width: number; height: number }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: DPI_SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Convert to JPEG bytes
    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const base64 = jpegDataUrl.split(",")[1];
    const binaryString = atob(base64);
    const jpgBytes = new Uint8Array(binaryString.length);
    for (let j = 0; j < binaryString.length; j++) {
      jpgBytes[j] = binaryString.charCodeAt(j);
    }

    pageImages.push({
      jpgBytes,
      width: viewport.width / DPI_SCALE,  // original PDF points
      height: viewport.height / DPI_SCALE,
    });

    // Cleanup canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  // Step 3: Build a new, unprotected PDF with pdf-lib
  const { PDFDocument: PdfLibDoc } = await import("pdf-lib");
  const newPdf = await PdfLibDoc.create();

  for (const img of pageImages) {
    const embedded = await newPdf.embedJpg(img.jpgBytes);
    const page = newPdf.addPage([img.width, img.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: img.width, height: img.height });
  }

  return await newPdf.save();
}

export interface WatermarkOptions {
  position: "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";
  layout: "horizontal" | "diagonal";
  size: number;
  opacity: number;
}

export async function addPdfWatermark(file: File, watermarkText: string, options?: WatermarkOptions): Promise<Uint8Array> {
  const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  
  const opts = options || { position: "center", layout: "diagonal", size: 60, opacity: 0.5 };
  
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, opts.size);
    const textHeight = font.heightAtSize(opts.size);
    
    let x = 0;
    let y = 0;
    
    // Horizontal positions
    if (opts.position.includes("left")) x = 50;
    else if (opts.position.includes("right")) x = width - textWidth - 50;
    else x = width / 2 - textWidth / 2; // center
    
    // Vertical positions
    if (opts.position.includes("top")) y = height - textHeight - 50;
    else if (opts.position.includes("bottom")) y = 50;
    else y = height / 2 - textHeight / 2; // center
    
    const rotate = opts.layout === "diagonal" ? degrees(45) : degrees(0);
    
    // If diagonal and center, we might need to adjust (x,y) because rotation is around the bottom-left corner of the text.
    // For simplicity, if diagonal and centered, we can adjust x, y so the center of the text is at the center of the page.
    if (opts.layout === "diagonal") {
      if (opts.position === "center") {
         x = width / 2 - textWidth / 2 + (textHeight / 2);
         y = height / 2 - textWidth / 2 - (textHeight / 2);
      }
    }
    
    page.drawText(watermarkText, {
      x,
      y,
      size: opts.size,
      font,
      color: rgb(0.8, 0.8, 0.8), // light gray
      opacity: opts.opacity,
      rotate,
    });
  }
  
  return await pdfDoc.save();
}

export async function addPdfPageNumbers(file: File): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const text = `${i + 1} / ${pages.length}`;
    const textWidth = font.widthOfTextAtSize(text, 12);
    
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: 20, // 20 points from the bottom
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  }
  
  return await pdfDoc.save();
}

// ── BATCH 3: ORGANIZE & EDIT PDF ────────────────────────────

export async function organizePdfPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const newPdf = await PDFDocument.create();
  // newOrder is 1-indexed, pdf-lib is 0-indexed.
  const indices = newOrder.map(p => p - 1).filter(i => i >= 0 && i < pdfDoc.getPageCount());
  
  const copiedPages = await newPdf.copyPages(pdfDoc, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
}

export interface SignPdfOptions {
  pageNumber?: number; // 1-indexed (default is last page)
  allPages?: boolean;  // apply to all pages if true
  xPercent?: number;   // 0 to 100 percentage from left of page
  yPercent?: number;   // 0 to 100 percentage from top of page
  widthPercent?: number; // percentage of page width (e.g. 25)
}

export async function signPdf(
  file: File,
  signatureSource: File | Blob | string,
  options?: SignPdfOptions
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  let sigArrayBuffer: ArrayBuffer;
  let isPng = true;

  if (typeof signatureSource === "string") {
    // Data URL
    const res = await fetch(signatureSource);
    const blob = await res.blob();
    isPng = blob.type !== "image/jpeg" && blob.type !== "image/jpg";
    sigArrayBuffer = await blob.arrayBuffer();
  } else {
    isPng = (signatureSource as any).type !== "image/jpeg" && (signatureSource as any).type !== "image/jpg";
    sigArrayBuffer = await signatureSource.arrayBuffer();
  }
  
  let image;
  try {
    if (isPng) {
      image = await pdfDoc.embedPng(sigArrayBuffer);
    } else {
      image = await pdfDoc.embedJpg(sigArrayBuffer);
    }
  } catch {
    try {
      image = await pdfDoc.embedPng(sigArrayBuffer);
    } catch {
      image = await pdfDoc.embedJpg(sigArrayBuffer);
    }
  }
  
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const targetPages: number[] = [];
  if (options?.allPages) {
    for (let i = 0; i < totalPages; i++) targetPages.push(i);
  } else {
    const pNum = options?.pageNumber && options.pageNumber > 0 && options.pageNumber <= totalPages
      ? options.pageNumber - 1
      : totalPages - 1;
    targetPages.push(pNum);
  }
  
  for (const pageIdx of targetPages) {
    const page = pages[pageIdx];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    
    const widthPct = options?.widthPercent ?? 25;
    const targetWidth = Math.max(30, (widthPct / 100) * pageWidth);
    const aspect = image.height / image.width;
    const targetHeight = targetWidth * aspect;

    let targetX: number;
    let targetY: number;

    if (options?.xPercent !== undefined && options?.yPercent !== undefined) {
      targetX = (options.xPercent / 100) * pageWidth;
      // Convert top-left CSS coordinates (0% top) to bottom-left PDF coordinates
      targetY = pageHeight - ((options.yPercent / 100) * pageHeight) - targetHeight;
    } else {
      // Default: Bottom-right corner
      targetX = pageWidth - targetWidth - 40;
      targetY = 40;
    }

    // Keep inside page bounds
    targetX = Math.max(0, Math.min(pageWidth - targetWidth, targetX));
    targetY = Math.max(0, Math.min(pageHeight - targetHeight, targetY));
    
    page.drawImage(image, {
      x: targetX,
      y: targetY,
      width: targetWidth,
      height: targetHeight,
    });
  }
  
  return await pdfDoc.save();
}

export async function cropPdf(file: File, margins: { top: number, bottom: number, left: number, right: number }): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    
    // The CropBox determines the visible region. (x, y) is bottom-left.
    page.setCropBox(
      margins.left, 
      margins.bottom, 
      width - margins.left - margins.right, 
      height - margins.bottom - margins.top
    );
  }
  
  return await pdfDoc.save();
}

export async function convertToPdfA(file: File): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  // Note: True PDF/A conversion requires color profile embedding and specific metadata tags (e.g., PDF/A identification).
  // pdf-lib does not support true PDF/A validation directly.
  // We simulate "flattening" and standardizing metadata as a "Lite" conversion.
  pdfDoc.setTitle("PDF/A Compatible Document");
  pdfDoc.setAuthor("ToolOn");
  pdfDoc.setCreator("ToolOn PDF Engine");
  pdfDoc.setModificationDate(new Date());
  
  return await pdfDoc.save({ useObjectStreams: false });
}

// ── BATCH 4: FINAL TOOLS & AI MOCKS ──────────────────────────

export async function scanToPdf(imageFiles: File[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  
  for (const file of imageFiles) {
    const bytes = await file.arrayBuffer();
    let image;
    if (file.type === "image/png") {
      image = await pdfDoc.embedPng(bytes);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(bytes);
    } else {
      continue;
    }
    
    // Create page matching image dimensions
    const dims = image.scale(1);
    const page = pdfDoc.addPage([dims.width, dims.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: dims.width,
      height: dims.height,
    });
  }
  
  return await pdfDoc.save();
}

export async function repairPdf(file: File): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  // By loading and saving with ignoreEncryption and throwOnInvalidObject false, 
  // pdf-lib attempts to parse corrupted catalogs and repair structure.
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true, throwOnInvalidObject: false });
  return await pdfDoc.save();
}

export interface PdfEditElement {
  id: string;
  type: "text" | "image" | "shape" | "draw";
  pageIndex: number; // 0-based
  x: number; // percentage (0 to 100) or canvas normalized
  y: number; // percentage (0 to 100)
  width?: number; // percentage
  height?: number; // percentage
  content?: string; // text string or image base64 dataUrl
  fontSize?: number;
  fontFamily?: "Helvetica" | "TimesRoman" | "Courier";
  color?: string; // hex
  backgroundColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  opacity?: number;
  shapeType?: "rectangle" | "circle" | "line";
  points?: { x: number; y: number }[]; // for freehand drawings
  strokeWidth?: number;
}

export async function editPdfWithElements(
  file: File,
  elements: PdfEditElement[]
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontHelveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const pages = pdfDoc.getPages();

  for (const el of elements) {
    if (el.pageIndex >= pages.length || el.pageIndex < 0) continue;
    const page = pages[el.pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Convert percentage x, y to points (pdf-lib coordinate system has (0,0) at bottom-left)
    const targetX = (el.x / 100) * pageWidth;
    const targetY = pageHeight - (el.y / 100) * pageHeight; // invert Y from top-left to bottom-left

    const hex = (el.color || "#000000").replace("#", "");
    const r = (parseInt(hex.substring(0, 2) || "0", 16) || 0) / 255;
    const g = (parseInt(hex.substring(2, 4) || "0", 16) || 0) / 255;
    const b = (parseInt(hex.substring(4, 6) || "0", 16) || 0) / 255;
    const colorRgb = rgb(r, g, b);
    const opacity = el.opacity !== undefined ? el.opacity : 1;

    if (el.type === "text" && el.content) {
      let chosenFont = fontHelvetica;
      if (el.fontFamily === "TimesRoman") {
        chosenFont = el.isBold ? fontTimesBold : fontTimes;
      } else if (el.fontFamily === "Courier") {
        chosenFont = el.isBold ? fontCourierBold : fontCourier;
      } else {
        if (el.isBold && el.isItalic) chosenFont = fontHelveticaBoldOblique;
        else if (el.isBold) chosenFont = fontHelveticaBold;
        else if (el.isItalic) chosenFont = fontHelveticaOblique;
        else chosenFont = fontHelvetica;
      }

      const size = el.fontSize || 16;
      
      // If element is an inline replacement or has a background fill, draw a whiteout background
      if (el.backgroundColor || el.width) {
        const bgWidth = el.width ? (el.width / 100) * pageWidth : chosenFont.widthOfTextAtSize(el.content, size) + 4;
        const bgHeight = el.height ? (el.height / 100) * pageHeight : size * 1.25;
        
        let bgRgb = rgb(1, 1, 1); // default white
        if (el.backgroundColor && el.backgroundColor !== "#ffffff" && el.backgroundColor !== "transparent") {
          const bgHex = el.backgroundColor.replace("#", "");
          const br = (parseInt(bgHex.substring(0, 2) || "ff", 16) || 255) / 255;
          const bg_g = (parseInt(bgHex.substring(2, 4) || "ff", 16) || 255) / 255;
          const bb = (parseInt(bgHex.substring(4, 6) || "ff", 16) || 255) / 255;
          bgRgb = rgb(br, bg_g, bb);
        }

        page.drawRectangle({
          x: targetX - 2,
          y: Math.max(0, targetY - bgHeight + 2),
          width: bgWidth + 4,
          height: bgHeight,
          color: bgRgb,
          opacity: 1,
        });
      }

      // In PDF coordinate system, text baseline is targetY - size
      page.drawText(el.content, {
        x: targetX,
        y: Math.max(0, targetY - size),
        size,
        font: chosenFont,
        color: colorRgb,
        opacity,
      });
    } else if (el.type === "image" && el.content) {
      try {
        let embeddedImage;
        if (el.content.startsWith("data:image/png")) {
          const base64Data = el.content.split(",")[1];
          const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          const base64Data = el.content.split(",")[1] || el.content;
          const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const imgWidth = el.width ? (el.width / 100) * pageWidth : 120;
        const imgHeight = el.height ? (el.height / 100) * pageHeight : 120;

        page.drawImage(embeddedImage, {
          x: targetX,
          y: Math.max(0, targetY - imgHeight),
          width: imgWidth,
          height: imgHeight,
          opacity,
        });
      } catch (err) {
        console.error("Failed to embed image in PDF:", err);
      }
    } else if (el.type === "shape") {
      const shapeWidth = el.width ? (el.width / 100) * pageWidth : 80;
      const shapeHeight = el.height ? (el.height / 100) * pageHeight : 60;

      if (el.shapeType === "circle") {
        const radius = Math.min(shapeWidth, shapeHeight) / 2;
        page.drawCircle({
          x: targetX + radius,
          y: targetY - radius,
          size: radius,
          borderColor: colorRgb,
          borderWidth: el.strokeWidth || 2,
          opacity,
        });
      } else {
        page.drawRectangle({
          x: targetX,
          y: Math.max(0, targetY - shapeHeight),
          width: shapeWidth,
          height: shapeHeight,
          borderColor: colorRgb,
          borderWidth: el.strokeWidth || 2,
          opacity,
        });
      }
    } else if (el.type === "draw" && el.points && el.points.length > 1) {
      for (let i = 0; i < el.points.length - 1; i++) {
        const p1 = el.points[i];
        const p2 = el.points[i + 1];
        const x1 = (p1.x / 100) * pageWidth;
        const y1 = pageHeight - (p1.y / 100) * pageHeight;
        const x2 = (p2.x / 100) * pageWidth;
        const y2 = pageHeight - (p2.y / 100) * pageHeight;

        page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness: el.strokeWidth || 2,
          color: colorRgb,
          opacity,
        });
      }
    }
  }

  return await pdfDoc.save();
}

export async function editPdf(file: File, text: string, colorHex: string): Promise<Uint8Array> {
  return editPdfWithElements(file, [
    {
      id: "default-1",
      type: "text",
      pageIndex: 0,
      x: 8,
      y: 12,
      content: text,
      color: colorHex,
      fontSize: 20,
      isBold: true,
    },
  ]);
}

// Mock function for simulating heavy backend OCR/AI processing
export async function simulateAiProcess(file: File, delayMs: number = 2000): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a simulated AI response. Please connect a backend API to process real PDF text extraction, summarization, and translation.");
    }, delayMs);
  });
}
