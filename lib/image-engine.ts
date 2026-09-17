// Real Client-Side Image Processing Engine using HTML5 Canvas & Browser APIs

export type SupportedFormat =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/gif"
  | "image/x-icon"
  | "image/bmp";

export interface ImageMetadata {
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
  aspectRatio: number;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  scalePercent?: number;
  lockAspectRatio?: boolean;
  resamplingFilter?: "bilinear" | "bicubic" | "nearest" | "lanczos";
  fillMode?: "contain" | "cover" | "stretch" | "pad";
  backgroundColor?: string;
  rotate?: number; // 0, 90, 180, 270
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExportOptions {
  format?: SupportedFormat | string;
  quality?: number; // 0.0 to 1.0 (or 1 to 100)
  backgroundColor?: string;
  colorDepth?: "auto" | "8-bit" | "16-bit" | "24-bit" | "32-bit" | "grayscale";
  effect?: "none" | "grayscale" | "sepia" | "invert" | "sharpen" | "blur";
  fileName?: string;
}

export interface CompressOptions {
  quality: number; // 1-100
  targetSizeKB?: number;
  format?: SupportedFormat | string;
  preserveMetadata?: boolean;
}

/**
 * Loads a File or Blob into an HTMLImageElement safely in client side
 */
export async function loadImage(fileOrUrl: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise(async (resolve, reject) => {
    let url: string;
    let isTempUrl = false;

    if (typeof fileOrUrl === "string") {
      url = fileOrUrl;
    } else {
      let file = fileOrUrl;
      if (
        file.type.includes("heic") ||
        file.type.includes("heif") ||
        (file instanceof File && file.name.toLowerCase().endsWith(".heic"))
      ) {
        try {
          const heic2any = (await import("heic2any")).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.95,
          });
          file = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        } catch (e) {
          console.warn("HEIC decoding failed or unsupported:", e);
        }
      }

      url = URL.createObjectURL(file);
      isTempUrl = true;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if ("decode" in img) {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = (err) => {
      if (isTempUrl) URL.revokeObjectURL(url);
      reject(new Error("Failed to load image file. Invalid or corrupted image format."));
    };
    img.src = url;
  });
}

/**
 * Inspect file metadata
 */
export async function inspectImageFile(file: File): Promise<ImageMetadata> {
  const img = await loadImage(file);
  return {
    name: file.name,
    size: file.size,
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
    type: file.type || "image/png",
    aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height || 1),
  };
}

/**
 * Format bytes into human readable format (e.g. 1.25 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Apply effects and filters to Canvas Rendering Context
 */
export function applyCanvasEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  effect?: string
) {
  if (!effect || effect === "none") return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  if (effect === "grayscale") {
    for (let i = 0; i < data.length; i += 4) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (effect === "sepia") {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (effect === "invert") {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

/**
 * High-quality multi-step downsampling for super clean resize results
 */
export function stepDownscale(
  sourceCanvas: HTMLCanvasElement | HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  let curWidth = sourceCanvas instanceof HTMLImageElement ? sourceCanvas.naturalWidth : sourceCanvas.width;
  let curHeight = sourceCanvas instanceof HTMLImageElement ? sourceCanvas.naturalHeight : sourceCanvas.height;

  if (targetWidth >= curWidth * 0.5 && targetHeight >= curHeight * 0.5) {
    const directCanvas = document.createElement("canvas");
    directCanvas.width = targetWidth;
    directCanvas.height = targetHeight;
    const ctx = directCanvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    return directCanvas;
  }

  let currentCanvas = document.createElement("canvas");
  currentCanvas.width = curWidth;
  currentCanvas.height = curHeight;
  let ctx = currentCanvas.getContext("2d")!;
  ctx.drawImage(sourceCanvas, 0, 0);

  while (curWidth * 0.5 > targetWidth && curHeight * 0.5 > targetHeight) {
    curWidth = Math.floor(curWidth * 0.5);
    curHeight = Math.floor(curHeight * 0.5);
    const stepCanvas = document.createElement("canvas");
    stepCanvas.width = curWidth;
    stepCanvas.height = curHeight;
    const stepCtx = stepCanvas.getContext("2d")!;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(currentCanvas, 0, 0, curWidth, curHeight);
    currentCanvas = stepCanvas;
  }

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;
  const finalCtx = finalCanvas.getContext("2d")!;
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = "high";
  finalCtx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);

  return finalCanvas;
}

/**
 * Main Client-Side Render Pipeline: Transform, Crop, Resize, Filter, Background
 * 100% Synchronous for instant performance and preserving User Gesture context.
 */
export function processImageToCanvas(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  resizeOpts: ResizeOptions = {},
  exportOpts: ExportOptions = {}
): HTMLCanvasElement {
  const origW = imageSource instanceof HTMLImageElement ? imageSource.naturalWidth : imageSource.width;
  const origH = imageSource instanceof HTMLImageElement ? imageSource.naturalHeight : imageSource.height;

  const crop = resizeOpts.crop || { x: 0, y: 0, width: origW, height: origH };
  const cropW = Math.max(1, Math.min(crop.width, origW - crop.x));
  const cropH = Math.max(1, Math.min(crop.height, origH - crop.y));

  let destW = resizeOpts.width || cropW;
  let destH = resizeOpts.height || cropH;

  if (resizeOpts.scalePercent && resizeOpts.scalePercent > 0) {
    destW = Math.round((cropW * resizeOpts.scalePercent) / 100);
    destH = Math.round((cropH * resizeOpts.scalePercent) / 100);
  } else if (resizeOpts.lockAspectRatio) {
    if (resizeOpts.width && !resizeOpts.height) {
      destH = Math.round((resizeOpts.width / cropW) * cropH);
    } else if (resizeOpts.height && !resizeOpts.width) {
      destW = Math.round((resizeOpts.height / cropH) * cropW);
    }
  }

  destW = Math.max(1, destW);
  destH = Math.max(1, destH);

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = cropW;
  cropCanvas.height = cropH;
  const cropCtx = cropCanvas.getContext("2d")!;
  cropCtx.imageSmoothingEnabled = true;
  cropCtx.imageSmoothingQuality = "high";

  const rotation = (resizeOpts.rotate || 0) % 360;
  const flipH = resizeOpts.flipHorizontal ? -1 : 1;
  const flipV = resizeOpts.flipVertical ? -1 : 1;

  if (rotation !== 0 || flipH !== 1 || flipV !== 1) {
    const rotCanvas = document.createElement("canvas");
    const isSideways = rotation === 90 || rotation === 270;
    rotCanvas.width = isSideways ? origH : origW;
    rotCanvas.height = isSideways ? origW : origH;
    const rotCtx = rotCanvas.getContext("2d")!;

    rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
    rotCtx.rotate((rotation * Math.PI) / 180);
    rotCtx.scale(flipH, flipV);
    rotCtx.drawImage(imageSource, -origW / 2, -origH / 2);

    cropCtx.drawImage(rotCanvas, crop.x, crop.y, cropW, cropH, 0, 0, cropW, cropH);
  } else {
    cropCtx.drawImage(imageSource, crop.x, crop.y, cropW, cropH, 0, 0, cropW, cropH);
  }

  const resizedCanvas = stepDownscale(cropCanvas, destW, destH);

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = destW;
  outputCanvas.height = destH;
  const outCtx = outputCanvas.getContext("2d")!;

  const bg = exportOpts.backgroundColor || resizeOpts.backgroundColor;
  const isJpeg = (exportOpts.format || "").includes("jpeg") || (exportOpts.format || "").includes("jpg");

  if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
    outCtx.fillStyle = bg;
    outCtx.fillRect(0, 0, destW, destH);
  } else if (isJpeg) {
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, destW, destH);
  }

  outCtx.drawImage(resizedCanvas, 0, 0);

  if (exportOpts.effect) {
    applyCanvasEffects(outCtx, destW, destH, exportOpts.effect);
  }

  return outputCanvas;
}

/**
 * Export Canvas to Blob with specified quality and MIME type
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string = "image/png",
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let validFormat = format;
    if (validFormat === "image/x-icon" || validFormat === "image/ico" || validFormat === "image/bmp") {
      validFormat = "image/png";
    }

    let q = quality > 1 ? quality / 100 : quality;
    q = Math.max(0.01, Math.min(1.0, q));

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          try {
            const dataUrl = canvas.toDataURL(validFormat, q);
            const arr = dataUrl.split(",");
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            resolve(new Blob([u8arr], { type: mime }));
          } catch (e) {
            reject(new Error("Failed to export canvas to Blob"));
          }
        }
      },
      validFormat,
      q
    );
  });
}

/**
 * 100% Direct Synchronous Canvas Download
 * Preserves User Activation Gesture context so Chrome/macOS never strips the filename/extension.
 */
export function downloadCanvasDirectly(
  canvas: HTMLCanvasElement,
  filename: string,
  format: string = "image/png",
  quality: number = 0.92
) {
  let defaultExt = ".png";
  let targetMime = "image/png";

  if (format.includes("jpeg") || format.includes("jpg")) {
    defaultExt = ".jpg";
    targetMime = "image/jpeg";
  } else if (format.includes("webp")) {
    defaultExt = ".webp";
    targetMime = "image/webp";
  } else if (format.includes("gif")) {
    defaultExt = ".gif";
    targetMime = "image/gif";
  } else if (format.includes("x-icon") || format.includes("ico")) {
    defaultExt = ".ico";
    targetMime = "image/png";
  } else if (format.includes("bmp")) {
    defaultExt = ".bmp";
    targetMime = "image/png";
  }

  let cleanName = filename.trim().replace(/[/\\?%*:|"<>]/g, "_");
  if (!cleanName) cleanName = `image-processed${defaultExt}`;

  if (!/\.(png|jpe?g|webp|gif|ico|bmp)$/i.test(cleanName)) {
    cleanName = `${cleanName}${defaultExt}`;
  }

  let q = quality > 1 ? quality / 100 : quality;
  q = Math.max(0.01, Math.min(1.0, q));

  // If format is JPEG, ensure canvas has solid background (white if transparent)
  let exportCanvas = canvas;
  if (targetMime === "image/jpeg") {
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    const bgCtx = bgCanvas.getContext("2d")!;
    bgCtx.fillStyle = "#ffffff";
    bgCtx.fillRect(0, 0, canvas.width, canvas.height);
    bgCtx.drawImage(canvas, 0, 0);
    exportCanvas = bgCanvas;
  }

  let dataUrl = "";
  try {
    dataUrl = exportCanvas.toDataURL(targetMime, q);
  } catch (e) {
    dataUrl = exportCanvas.toDataURL("image/png");
  }

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = dataUrl;
  a.setAttribute("download", cleanName);
  a.download = cleanName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
  }, 100);
}

export const downloadCanvas = downloadCanvasDirectly;

/**
 * Download a Blob (for ZIP packages)
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  let cleanName = filename.trim().replace(/[/\\?%*:|"<>]/g, "_");
  if (!cleanName) cleanName = "download.zip";

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = dataUrl;
    a.setAttribute("download", cleanName);
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 100);
  };
  reader.readAsDataURL(blob);
}

/**
 * Intelligent file compressor
 */
export async function compressImageClient(
  file: File,
  options: CompressOptions
): Promise<{ blob: Blob; originalSize: number; newSize: number; reductionPercent: number }> {
  const img = await loadImage(file);
  const canvas = await processImageToCanvas(img, {}, { format: options.format });

  const format = options.format || (file.type.includes("png") ? "image/webp" : "image/jpeg");
  let quality = options.quality / 100;
  let blob = await canvasToBlob(canvas, format, quality);

  if (options.targetSizeKB && options.targetSizeKB > 0) {
    const targetBytes = options.targetSizeKB * 1024;
    let minQ = 0.05;
    let maxQ = 1.0;
    let bestBlob = blob;

    for (let iter = 0; iter < 6; iter++) {
      const testQ = (minQ + maxQ) / 2;
      const testBlob = await canvasToBlob(canvas, format, testQ);
      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        minQ = testQ;
      } else {
        maxQ = testQ;
      }
    }
    blob = bestBlob;
  }

  const reductionPercent = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

  return {
    blob,
    originalSize: file.size,
    newSize: blob.size,
    reductionPercent,
  };
}

/**
 * Batch multi-file ZIP generator using JSZip
 */
export async function createZipArchive(
  files: { name: string; blob: Blob }[]
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  files.forEach((item) => {
    zip.file(item.name, item.blob);
  });

  return await zip.generateAsync({ type: "blob" });
}
