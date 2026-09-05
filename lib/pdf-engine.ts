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

// Helper to convert margin key to points
function getMarginPoints(margin: PDFExportOptions["margin"]): number {
  switch (margin) {
    case "none":
      return 0;
    case "small":
      return 18; // 0.25 inch
    case "normal":
      return 36; // 0.5 inch
    case "large":
      return 54; // 0.75 inch
    default:
      return 0;
  }
}

// Convert image dataUrl to optimized JPEG/PNG bytes via canvas
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

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply grayscale filter if requested
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

      // Convert to JPEG with quality
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

/**
 * Generates a multi-page PDF document entirely client-side
 */
export async function generatePdfFromImages(
  items: PDFImageItem[],
  options: PDFExportOptions
): Promise<Uint8Array> {
  if (items.length === 0) {
    throw new Error("No images provided to generate PDF");
  }

  // Dynamic import of pdf-lib to prevent SSR node issues
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
      // Page matches image dimensions + margin
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
      // Standard page dimensions (A4 or Letter)
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

    // Available drawing area
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    // Calculate aspect-ratio fit
    const scale = Math.min(
      availableWidth / imgWidth,
      availableHeight / imgHeight
    );

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    // Center image on the page
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
