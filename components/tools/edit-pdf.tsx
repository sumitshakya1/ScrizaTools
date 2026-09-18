"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  PenTool,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  Download,
  Sparkles,
  Move,
  CheckCircle2,
  Undo2,
  Plus,
  Palette,
  Edit3,
  MousePointer,
  Highlighter,
  Eraser,
  Search,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { editPdfWithElements, PdfEditElement } from "@/lib/pdf-engine";
import type * as PdfjsType from "pdfjs-dist";

// Lazy-load pdfjs-dist to avoid top-level execution during SSR/hydration
let _pdfjsLib: typeof PdfjsType | null = null;
async function getPdfjsLib(): Promise<typeof PdfjsType> {
  if (_pdfjsLib) return _pdfjsLib;
  const lib = await import("pdfjs-dist");
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.mjs`;
  _pdfjsLib = lib;
  return lib;
}

const FAQS: FAQItem[] = [
  {
    question: "How does 'Direct PDF Text Edit' work?",
    answer:
      "When you click on any existing printed word or line on the PDF, ToolOn automatically detects the exact font size, font style, baseline coordinates, and text content. It instantly creates an inline editable box with a matching background so you can retype, fix typos, or replace words directly in place!",
  },
  {
    question: "Can I also add new images, shapes, and custom text?",
    answer:
      "Yes! You can switch between 'Edit Existing Text' mode, 'Add New Text', 'Add Images', 'Shapes', or 'Freehand Signature'.",
  },
  {
    question: "Is the exported PDF searchable and high quality?",
    answer:
      "Yes. When saved, all edits are stamped with exact vector precision into the PDF structure using native fonts.",
  },
];

type ToolMode = "select" | "edit-text" | "add-text" | "image" | "rectangle" | "circle" | "draw" | "whiteout";

interface ExtractedTextItem {
  id: string;
  str: string;
  x: number; // percentage of page
  y: number; // percentage of page
  width: number; // percentage
  height: number; // percentage
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  pageIndex: number;
}

export function EditPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [activeMode, setActiveMode] = useState<ToolMode>("edit-text");

  // Extracted PDF text layers per page
  const [pageTextItems, setPageTextItems] = useState<Record<number, ExtractedTextItem[]>>({});
  const [isExtractingText, setIsExtractingText] = useState<boolean>(false);

  // User elements & modifications state across all pages
  const [elements, setElements] = useState<PdfEditElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Active styling state for toolbar
  const [textColor, setTextColor] = useState<string>("#0f172a");
  const [fontSize, setFontSize] = useState<number>(16);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<"Helvetica" | "TimesRoman" | "Courier">("Helvetica");

  // Drawing mode state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  // Dragging / moving element state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);

  // Page thumbnails
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modal download
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<PdfjsType.PDFDocumentProxy | null>(null);

  // Load PDF & Extract Text Layer
  const loadPdf = useCallback(async (selectedFile: File) => {
    setIsRendering(true);
    setIsExtractingText(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfjsLib = await getPdfjsLib();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setCurrentPage(1);

      // Generate thumbnails & parse text items for all pages
      const thumbs: string[] = [];
      const textMap: Record<number, ExtractedTextItem[]> = {};

      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const p = await pdf.getPage(i);
        const vp = p.getViewport({ scale: 0.2 });
        const thumbCanvas = document.createElement("canvas");
        thumbCanvas.width = vp.width;
        thumbCanvas.height = vp.height;
        const ctx = thumbCanvas.getContext("2d");
        if (ctx) {
          await p.render({ canvasContext: ctx, viewport: vp }).promise;
          thumbs.push(thumbCanvas.toDataURL("image/jpeg", 0.7));
        }

        // Extract Text Content for in-place editing with word-by-word splitting
        const textContent = await p.getTextContent();
        const baseVp = p.getViewport({ scale: 1.0 });
        const items: ExtractedTextItem[] = [];

        textContent.items.forEach((item: any, idx: number) => {
          if (!item.str || !item.str.trim()) return;

          // Transform PDF coordinates [scaleX, skewY, skewX, scaleY, tx, ty]
          const tx = item.transform;
          const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]) || 12;
          const pdfX = tx[4];
          const pdfY = tx[5];

          const fontNameLower = (item.fontName || "").toLowerCase();
          const bold =
            fontNameLower.includes("bold") ||
            fontNameLower.includes("black") ||
            fontNameLower.includes("heavy") ||
            fontNameLower.includes("b");
          const italic =
            fontNameLower.includes("italic") ||
            fontNameLower.includes("oblique");

          // Split line into distinct words so user can click any individual word or phrase
          const words = item.str.split(/(\s+)/);
          let currentWordOffsetX = 0;
          const totalStrLen = item.str.length || 1;

          words.forEach((w: string, wIdx: number) => {
            const wordLen = w.length;
            const wordFraction = wordLen / totalStrLen;
            const wordWidthPdf = item.width * wordFraction;

            if (w.trim().length > 0) {
              const wordPdfX = pdfX + currentWordOffsetX;
              const percentX = (wordPdfX / baseVp.width) * 100;
              const percentY = ((baseVp.height - pdfY - fontHeight * 0.9) / baseVp.height) * 100;
              const percentW = (wordWidthPdf / baseVp.width) * 100;
              const percentH = (fontHeight / baseVp.height) * 100;

              items.push({
                id: `extracted-${i}-${idx}-${wIdx}`,
                str: w,
                x: Math.max(0, percentX),
                y: Math.max(0, percentY),
                width: Math.max(1, percentW),
                height: Math.max(1.2, percentH),
                fontSize: Math.round(fontHeight),
                fontName: item.fontName || "Helvetica",
                isBold: bold,
                isItalic: italic,
                pageIndex: i - 1,
              });
            }

            currentWordOffsetX += wordWidthPdf;
          });
        });

        textMap[i - 1] = items;
      }

      setPageThumbnails(thumbs);
      setPageTextItems(textMap);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      alert("Failed to load this PDF. Please verify that the file is not password protected or corrupted.");
    } finally {
      setIsRendering(false);
      setIsExtractingText(false);
    }
  }, []);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
    setElements([]);
    setSelectedElementId(null);
    loadPdf(f);
  };

  // Render current page onto main canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !mainCanvasRef.current) return;
    try {
      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = mainCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const baseViewport = page.getViewport({ scale: 1.0 });
      // Calculate responsive display scale based on container width
      const containerWidth = containerRef.current ? containerRef.current.clientWidth - 48 : 800;
      const fitScale = Math.min((containerWidth / baseViewport.width) * zoom, 2.5);
      const viewport = page.getViewport({ scale: fitScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    }
  }, [currentPage, zoom]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderCurrentPage();
    }
  }, [currentPage, zoom, renderCurrentPage]);

  // Click on existing extracted text word/line to convert it into an editable active element
  const handleExistingTextClick = (item: ExtractedTextItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if an editable element already exists for this spot
    const existing = elements.find((el) => el.id === item.id);
    if (existing) {
      setSelectedElementId(existing.id);
      return;
    }

    // Convert into editable element with exact font properties and whiteout background
    const newEl: PdfEditElement = {
      id: item.id,
      type: "text",
      pageIndex: item.pageIndex,
      x: item.x,
      y: item.y,
      width: item.width + 1,
      height: item.height,
      content: item.str,
      fontSize: item.fontSize,
      isBold: item.isBold,
      isItalic: item.isItalic,
      color: textColor,
      backgroundColor: "#ffffff", // whiteout old printed characters
    };

    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    setFontSize(item.fontSize);
    setIsBold(item.isBold);
    setIsItalic(item.isItalic);
  };

  // Handle canvas click to place brand new text or shapes
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;

    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;

    if (activeMode === "add-text") {
      const newEl: PdfEditElement = {
        id: `text-${Date.now()}`,
        type: "text",
        pageIndex: currentPage - 1,
        x: Math.min(Math.max(0, percentX), 85),
        y: Math.min(Math.max(0, percentY), 90),
        content: "Type new text here",
        fontSize,
        color: textColor,
        isBold,
        isItalic,
        fontFamily,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedElementId(newEl.id);
      setActiveMode("select");
    } else if (activeMode === "whiteout") {
      const newEl: PdfEditElement = {
        id: `whiteout-${Date.now()}`,
        type: "shape",
        shapeType: "rectangle",
        pageIndex: currentPage - 1,
        x: Math.min(Math.max(0, percentX - 5), 80),
        y: Math.min(Math.max(0, percentY - 2), 80),
        width: 15,
        height: 5,
        color: "#ffffff",
        backgroundColor: "#ffffff",
        opacity: 1,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedElementId(newEl.id);
      setActiveMode("select");
    } else if (activeMode === "rectangle") {
      const newEl: PdfEditElement = {
        id: `shape-${Date.now()}`,
        type: "shape",
        shapeType: "rectangle",
        pageIndex: currentPage - 1,
        x: Math.min(Math.max(0, percentX), 80),
        y: Math.min(Math.max(0, percentY), 80),
        width: 25,
        height: 15,
        color: textColor,
        strokeWidth: 2,
        opacity: 0.9,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedElementId(newEl.id);
      setActiveMode("select");
    } else if (activeMode === "circle") {
      const newEl: PdfEditElement = {
        id: `shape-${Date.now()}`,
        type: "shape",
        shapeType: "circle",
        pageIndex: currentPage - 1,
        x: Math.min(Math.max(0, percentX), 80),
        y: Math.min(Math.max(0, percentY), 80),
        width: 18,
        height: 18,
        color: textColor,
        strokeWidth: 2,
        opacity: 0.9,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedElementId(newEl.id);
      setActiveMode("select");
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newEl: PdfEditElement = {
        id: `img-${Date.now()}`,
        type: "image",
        pageIndex: currentPage - 1,
        x: 35,
        y: 35,
        width: 28,
        height: 20,
        content: dataUrl,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedElementId(newEl.id);
      setActiveMode("select");
    };
    reader.readAsDataURL(imgFile);
    e.target.value = "";
  };

  // Freehand Drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeMode !== "draw" || !mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || activeMode !== "draw" || !mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentStroke((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || activeMode !== "draw") return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      const newEl: PdfEditElement = {
        id: `draw-${Date.now()}`,
        type: "draw",
        pageIndex: currentPage - 1,
        x: 0,
        y: 0,
        points: currentStroke,
        color: textColor,
        strokeWidth: 3,
      };
      setElements((prev) => [...prev, newEl]);
    }
    setCurrentStroke([]);
  };

  // Dragging elements
  const startDrag = (e: React.MouseEvent, el: PdfEditElement) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    setDraggingId(el.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!draggingId || !dragStart || !mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === draggingId) {
          return {
            ...el,
            x: Math.max(0, Math.min(95, dragStart.elX + deltaX)),
            y: Math.max(0, Math.min(95, dragStart.elY + deltaY)),
          };
        }
        return el;
      })
    );
  };

  const endDrag = () => {
    setDraggingId(null);
    setDragStart(null);
  };

  // Delete element
  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Save changes & download PDF
  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await editPdfWithElements(file, elements);
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.pdf$/i, "-edited.pdf");
      setPendingDownload({ url, name: newName });
      setShowCountdown(true);
    } catch (err) {
      console.error("Failed to save edited PDF:", err);
      alert("An error occurred while saving your changes.");
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!pendingDownload) return;
    const a = document.createElement("a");
    a.href = pendingDownload.url;
    a.download = pendingDownload.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentTextItems = pageTextItems[currentPage - 1] || [];
  const pageElements = elements.filter((el) => el.pageIndex === currentPage - 1);
  return (
    <ToolPageLayout
      toolId="edit-pdf"
      title="Edit PDF"
      description="Click on any line, sentence, or word in your PDF to edit it directly in place, or add new text, signatures, and images."
    >
      {!file ? (
        /* ─── Upload Screen ─── */
        <div className="max-w-3xl mx-auto space-y-8">
          <div
            className="border-2 border-dashed border-slate-300 hover:border-primary rounded-2xl p-12 sm:p-16 flex flex-col items-center justify-center bg-white hover:bg-primary/[0.02] transition-all cursor-pointer shadow-sm hover:shadow-md group text-center"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
              <UploadCloud className="h-10 w-10 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Select PDF file to edit
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Click to browse or drag and drop your document here. 100% private client-side processing.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-hover transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Choose PDF File</span>
            </button>
          </div>

          <FAQSection toolName="Edit PDF" items={FAQS} />
        </div>
      ) : (
        /* ─── Interactive PDF Editor Workspace ─── */
        <div
          className="flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden"
          onMouseMove={onDrag}
          onMouseUp={endDrag}
        >
          {/* Top Main Toolbar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white">
            
            {/* Tool Mode Buttons */}
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
              {/* Edit Existing Text Mode (Primary Feature) */}
              <button
                type="button"
                onClick={() => setActiveMode("edit-text")}
                title="Click any text on PDF to edit in-place"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === "edit-text"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5 text-emerald-300" />
                <span>Edit Existing Text</span>
                <span className="bg-emerald-950/80 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  PRO
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("select")}
                title="Select & Move (Cursor)"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "select"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <MousePointer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Move</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("add-text")}
                title="Insert New Text Anywhere"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "add-text"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Type className="h-3.5 w-3.5" />
                <span>+ Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("whiteout")}
                title="Whiteout / Erase Text Box"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "whiteout"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Eraser className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Whiteout</span>
              </button>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                title="Upload & Add Image"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Image</span>
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("draw")}
                title="Freehand Draw / Signature"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "draw"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign</span>
              </button>
            </div>

            {/* Formatting Sub-Bar (Font, Color, Size) */}
            <div className="flex items-center gap-2">
              {/* Color Picker */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700/60">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    if (selectedElementId) {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedElementId ? { ...el, color: e.target.value } : el
                        )
                      );
                    }
                  }}
                  className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent"
                  title="Text & Shape Color"
                />
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-400">Size:</span>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    const sz = Number(e.target.value);
                    setFontSize(sz);
                    if (selectedElementId) {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedElementId ? { ...el, fontSize: sz } : el
                        )
                      );
                    }
                  }}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value={10} className="bg-slate-800">10px</option>
                  <option value={12} className="bg-slate-800">12px</option>
                  <option value={14} className="bg-slate-800">14px</option>
                  <option value={16} className="bg-slate-800">16px</option>
                  <option value={18} className="bg-slate-800">18px</option>
                  <option value={22} className="bg-slate-800">22px</option>
                  <option value={28} className="bg-slate-800">28px</option>
                  <option value={36} className="bg-slate-800">36px</option>
                </select>
              </div>

              {/* Bold & Italic */}
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsBold(!isBold);
                    if (selectedElementId) {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedElementId ? { ...el, isBold: !el.isBold } : el
                        )
                      );
                    }
                  }}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    isBold ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsItalic(!isItalic);
                    if (selectedElementId) {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedElementId ? { ...el, isItalic: !el.isItalic } : el
                        )
                      );
                    }
                  }}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    isItalic ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons (Save Changes & New File) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setElements([]);
                  setPageTextItems({});
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Change PDF
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 bg-gradient-brand px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-primary/30 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 stroke-[2.5]" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Banner when in Edit Existing Text Mode */}
          {activeMode === "edit-text" && (
            <div className="bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Interactive Text Mode:</strong> Click any highlighted word or sentence on the page to instantly edit or replace it!
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold hidden md:inline">
                {currentTextItems.length} editable text blocks detected on Page {currentPage}
              </span>
            </div>
          )}

          {/* Main Work Area (Thumbnails Sidebar + Interactive Canvas + Right Element Manager) */}
          <div className="flex flex-col lg:flex-row min-h-[620px] bg-slate-950/60 relative">
            
            {/* Left Thumbnail Sidebar */}
            <div className="w-full lg:w-48 bg-slate-900/90 border-r border-slate-800 p-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[680px] shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Pages ({numPages})
              </span>
              {pageThumbnails.map((thumb, idx) => {
                const pageNo = idx + 1;
                const pageAnnotationCount = elements.filter((el) => el.pageIndex === idx).length;
                return (
                  <div
                    key={pageNo}
                    onClick={() => setCurrentPage(pageNo)}
                    className={`relative rounded-xl p-1.5 border-2 transition-all cursor-pointer flex flex-col items-center shrink-0 group ${
                      currentPage === pageNo
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-slate-800 hover:border-slate-700 bg-slate-800/40"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Page ${pageNo}`}
                      className="w-24 sm:w-28 lg:w-full h-auto rounded-lg object-contain bg-white shadow-xs"
                    />
                    <div className="flex items-center justify-between w-full px-1 mt-1 text-[11px] font-semibold text-slate-300">
                      <span>P. {pageNo}</span>
                      {pageAnnotationCount > 0 && (
                        <span className="bg-primary/30 text-primary text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {pageAnnotationCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Central Canvas Viewport */}
            <div
              ref={containerRef}
              className="flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center justify-start bg-slate-950 relative min-h-[500px]"
            >
              {/* Floating Zoom & Page Bar */}
              <div className="mb-4 sticky top-2 z-30 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 shadow-xl text-xs text-white">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-semibold text-slate-200">
                  Page {currentPage} of {numPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  disabled={currentPage >= numPages}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="h-3.5 w-px bg-slate-700 mx-1" />

                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[11px] text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* PDF Document Canvas & Dynamic Overlay Layer */}
              <div
                className={`relative shadow-2xl rounded-lg bg-white overflow-visible select-none ${
                  activeMode === "add-text"
                    ? "cursor-text"
                    : activeMode === "draw"
                    ? "cursor-crosshair"
                    : activeMode === "whiteout"
                    ? "cursor-crosshair"
                    : "cursor-default"
                }`}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* Background Rendered PDF Page */}
                <canvas ref={mainCanvasRef} className="block rounded-lg shadow-sm" />

                {/* ─── Detected Text Overlays for In-Place Clicking ─── */}
                {activeMode === "edit-text" &&
                  currentTextItems.map((item) => {
                    const isAlreadyEdited = elements.some((el) => el.id === item.id);
                    if (isAlreadyEdited) return null; // If already replaced with an active input, hide raw highlight

                    return (
                      <div
                        key={item.id}
                        style={{
                          position: "absolute",
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          width: `${item.width}%`,
                          height: `${item.height}%`,
                        }}
                        onClick={(e) => handleExistingTextClick(item, e)}
                        className="hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-500 rounded transition-all cursor-text z-10 group"
                        title={`Click to edit: "${item.str}"`}
                      >
                        <span className="hidden group-hover:block absolute -top-5 left-0 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30">
                          Click to Edit
                        </span>
                      </div>
                    );
                  })}

                {/* Freehand SVG Drawing Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {pageElements
                    .filter((el) => el.type === "draw" && el.points)
                    .map((el) => {
                      const d = el.points
                        ?.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}%`)
                        .join(" ");
                      return (
                        <path
                          key={el.id}
                          d={d}
                          fill="none"
                          stroke={el.color || "#000000"}
                          strokeWidth={el.strokeWidth || 3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    })}

                  {/* Active drawing stroke in progress */}
                  {isDrawing && currentStroke.length > 1 && (
                    <path
                      d={currentStroke
                        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}%`)
                        .join(" ")}
                      fill="none"
                      stroke={textColor}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>

                {/* Interactive Annotations & Active In-Place Text Replacements */}
                {pageElements.map((el) => {
                  if (el.type === "draw") return null;
                  const isSelected = selectedElementId === el.id;

                  return (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: el.width ? `${el.width}%` : "auto",
                        minWidth: el.type === "text" ? `${Math.max(10, el.width || 10)}%` : undefined,
                        height: el.height ? `${el.height}%` : "auto",
                        backgroundColor: el.backgroundColor || "transparent",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId(el.id);
                      }}
                      className={`group z-20 transition-shadow rounded ${
                        isSelected
                          ? "ring-2 ring-primary ring-offset-1 shadow-lg cursor-move bg-white"
                          : el.backgroundColor
                          ? "bg-white"
                          : "hover:ring-1 hover:ring-primary/60 cursor-pointer"
                      }`}
                    >
                      {/* Drag Handle & Delete Overlay when Selected */}
                      {isSelected && (
                        <div
                          className="absolute -top-7 left-0 flex items-center gap-1 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md z-30 pointer-events-auto"
                          onMouseDown={(e) => startDrag(e, el)}
                        >
                          <Move className="h-3 w-3 cursor-grab" />
                          <span>Move</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(el.id);
                            }}
                            className="ml-1 text-rose-400 hover:text-rose-300"
                            title="Delete / Revert"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Content Renderers */}
                      {el.type === "text" && (
                        <input
                          type="text"
                          value={el.content || ""}
                          autoFocus={isSelected}
                          onChange={(e) => {
                            const val = e.target.value;
                            setElements((prev) =>
                              prev.map((item) =>
                                item.id === el.id ? { ...item, content: val } : item
                              )
                            );
                          }}
                          style={{
                            color: el.color || "#000000",
                            fontSize: `${(el.fontSize || 16) * zoom}px`,
                            fontWeight: el.isBold ? "bold" : "normal",
                            fontStyle: el.isItalic ? "italic" : "normal",
                            fontFamily: el.fontFamily || "Helvetica, sans-serif",
                            backgroundColor: el.backgroundColor || "transparent",
                          }}
                          className="border-0 outline-none px-1 py-0.5 w-full focus:ring-1 focus:ring-primary rounded leading-tight"
                        />
                      )}

                      {el.type === "image" && el.content && (
                        <img
                          src={el.content}
                          alt="Added to PDF"
                          className="w-full h-full object-contain rounded pointer-events-none"
                        />
                      )}

                      {el.type === "shape" && (
                        <div
                          style={{
                            borderColor: el.color || "#000000",
                            borderWidth: el.shapeType === "rectangle" && el.backgroundColor ? "0px" : `${el.strokeWidth || 2}px`,
                            borderStyle: "solid",
                            borderRadius: el.shapeType === "circle" ? "9999px" : "2px",
                            backgroundColor: el.backgroundColor || "transparent",
                            opacity: el.opacity || 1,
                          }}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right-Side Layer Inspector Panel */}
            <div className="w-full lg:w-72 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 text-white flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Modified on P. {currentPage} ({pageElements.length})
                    </h4>
                  </div>
                  {pageElements.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setElements((prev) => prev.filter((el) => el.pageIndex !== currentPage - 1))
                      }
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Reset Page
                    </button>
                  )}
                </div>

                {pageElements.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    <p>No changes made to this page yet.</p>
                    <p className="mt-1.5 text-slate-400">
                      💡 Click on any existing text word on the document to edit it, or use <strong>+ Text</strong> / <strong>Image</strong> above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {pageElements.map((el) => {
                      const isSelected = selectedElementId === el.id;
                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary/20 border-primary text-white"
                              : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {el.type === "text" && <Type className="h-3.5 w-3.5 text-primary shrink-0" />}
                            {el.type === "image" && <ImageIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                            {el.type === "shape" && <Square className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                            {el.type === "draw" && <PenTool className="h-3.5 w-3.5 text-violet-400 shrink-0" />}
                            <span className="truncate font-medium">
                              {el.type === "text"
                                ? el.content || "Empty Text"
                                : el.type === "image"
                                ? "Uploaded Image"
                                : el.type === "shape"
                                ? "Whiteout / Shape"
                                : "Signature / Draw"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(el.id);
                            }}
                            className="text-slate-400 hover:text-rose-400 p-1"
                            title="Revert / Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Quick Tips */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/40 p-3 rounded-xl space-y-1.5">
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Auto Font &amp; Position Detection
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Clicking any word extracts the original font size, style, and baseline coordinates automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Countdown Modal */}
      {showCountdown && (
        <DownloadCountdownModal
          isOpen={showCountdown}
          onClose={() => setShowCountdown(false)}
          onComplete={triggerDownload}
          fileName={pendingDownload?.name || "edited-document.pdf"}
        />
      )}
    </ToolPageLayout>
  );
}
