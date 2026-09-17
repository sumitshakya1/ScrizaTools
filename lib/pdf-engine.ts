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
  options: PDFExportOptions
): Promise<Uint8Array> {
  if (items.length === 0) {
    throw new Error("No images provided to generate PDF");
  }

  const { PDFDocument, PageSizes } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  const margin = getMarginPoints(options.margin);

  for (const item of items) {
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

  const pdfBytes = await pdfDoc.save();
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
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https:https:https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) throw new Error("No PDF files provided");

  const { PDFDocument } = await import("pdf-lib");
  const mergedDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    try {
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    } catch (err) {
      console.warn(`Skipping unreadable PDF: ${file.name}`, err);
      throw new Error(`Failed to process "${file.name}". The file may be corrupted or password-protected.`);
    }
  }

  return mergedDoc.save();
}

// ═══════════════════════════════════════════════════════════
// 4. PDF SPLIT  (extract page ranges)
// ═══════════════════════════════════════════════════════════

export async function splitPdf(
  file: File,
  ranges: PageRange[]
): Promise<Uint8Array> {
  if (ranges.length === 0) throw new Error("No page ranges specified");

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

  const copiedPages = await newDoc.copyPages(srcDoc, sortedIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return newDoc.save();
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
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https:https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
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
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https:https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
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
