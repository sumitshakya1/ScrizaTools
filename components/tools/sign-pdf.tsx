"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  PenTool,
  Image as ImageIcon,
  Type,
  Eraser,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Move,
  Layers,
  Check,
  RotateCcw,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { ProcessingProgress } from "./shared/processing-progress";
import { signPdf } from "@/lib/pdf-engine";
import type * as PdfjsType from "pdfjs-dist";

// Lazy-load pdfjs-dist
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
    question: "How do I place my signature on the PDF?",
    answer:
      "Upload your PDF and create your signature (draw, type, or upload an image). Your signature will appear as a movable box on the live PDF preview. Simply drag it anywhere on the page, adjust its size with the slider, or click directly where you want it placed!",
  },
  {
    question: "Can I sign specific pages or multi-page documents?",
    answer:
      "Yes! You can browse through all pages using the page controls and place your signature on any specific page, or choose 'Sign All Pages' with a single click.",
  },
  {
    question: "Is my signature and document private?",
    answer:
      "100% private. All PDF rendering, signature drawing, and cryptographic embedding occur strictly in your browser memory via WebAssembly. Nothing is ever sent to an external server.",
  },
];

type SignatureType = "draw" | "type" | "upload";

const FONT_STYLES = [
  { id: "cursive-1", name: "Elegant Script", font: "cursive" },
  { id: "cursive-2", name: "Classic Calligraphy", font: "'Brush Script MT', cursive, sans-serif" },
  { id: "cursive-3", name: "Handwritten", font: "'Comic Sans MS', cursive, sans-serif" },
  { id: "cursive-4", name: "Modern Signature", font: "'Caveat', cursive, serif" },
];

const PEN_COLORS = [
  { label: "Deep Black", value: "#0f172a" },
  { label: "Navy Blue", value: "#1e3a8a" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Ruby Red", value: "#b91c1c" },
];

export function SignPdfTool() {
  // Document state
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageRendering, setPageRendering] = useState<boolean>(false);

  // Signature state
  const [sigType, setSigType] = useState<SignatureType>("draw");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [penColor, setPenColor] = useState<string>("#0f172a");
  const [penWidth, setPenWidth] = useState<number>(3);
  const [typedName, setTypedName] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("cursive");

  // Placement state (Percentage coordinates on current page)
  const [sigX, setSigX] = useState<number>(65); // 0-100% from left
  const [sigY, setSigY] = useState<number>(78); // 0-100% from top
  const [sigWidthPct, setSigWidthPct] = useState<number>(24); // 10-60% of page width
  const [signAllPages, setSignAllPages] = useState<boolean>(false);

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartPos = useRef<{ mouseX: number; mouseY: number; startSigX: number; startSigY: number }>({
    mouseX: 0,
    mouseY: 0,
    startSigX: 65,
    startSigY: 78,
  });

  // Processing & Download state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; name: string } | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSigInputRef = useRef<HTMLInputElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);

  // ── 1. Document Loading ──
  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF document.");
      return;
    }

    setFile(selectedFile);
    setCurrentPage(1);

    try {
      const pdfjs = await getPdfjsLib();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadedDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      pdfDocRef.current = loadedDoc;
      setNumPages(loadedDoc.numPages);
    } catch (err) {
      console.error("Failed to parse PDF with pdfjs-dist:", err);
      alert("Could not load PDF preview.");
    }
  };

  // ── 2. Render Page to Live Preview Canvas ──
  const renderPdfPage = useCallback(async (pageNum: number) => {
    if (!pdfDocRef.current || !previewCanvasRef.current) return;

    setPageRendering(true);
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fit preview nicely (around 800-1000px width scale)
      const containerWidth = previewContainerRef.current?.clientWidth || 700;
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const scale = Math.min(2.0, (containerWidth * 1.5) / unscaledViewport.width);
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    } finally {
      setPageRendering(false);
    }
  }, []);

  useEffect(() => {
    if (file && numPages > 0) {
      renderPdfPage(currentPage);
    }
  }, [file, numPages, currentPage, renderPdfPage]);

  // ── 3. Drawing Canvas Setup & Handlers ──
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    // Save transparent signature data URL
    setSignatureDataUrl(canvas.toDataURL("image/png"));
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // ── 4. Type Signature to Data URL ──
  const generateTypedSignature = useCallback((text: string, font: string, color: string) => {
    if (!text.trim()) {
      setSignatureDataUrl(null);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `italic 54px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.trim(), canvas.width / 2, canvas.height / 2);

    setSignatureDataUrl(canvas.toDataURL("image/png"));
  }, []);

  useEffect(() => {
    if (sigType === "type" && typedName) {
      generateTypedSignature(typedName, selectedFont, penColor);
    }
  }, [sigType, typedName, selectedFont, penColor, generateTypedSignature]);

  // ── 5. Upload Signature Image Handler ──
  const handleUploadSigFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      alert("Please upload a PNG or JPG image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSignatureDataUrl(reader.result as string);
    };
    reader.readAsDataURL(f);
  };

  // ── 6. Live Draggable Placement Handlers ──
  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPct = Math.max(5, Math.min(95 - sigWidthPct, (clickX / rect.width) * 100 - sigWidthPct / 2));
    const yPct = Math.max(5, Math.min(90, (clickY / rect.height) * 100 - 6));

    setSigX(Math.round(xPct));
    setSigY(Math.round(yPct));
  };

  const startDragSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startSigX: sigX,
      startSigY: sigY,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !previewContainerRef.current) return;
      const rect = previewContainerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartPos.current.mouseX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartPos.current.mouseY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100 - sigWidthPct, dragStartPos.current.startSigX + deltaX));
      const newY = Math.max(0, Math.min(90, dragStartPos.current.startSigY + deltaY));

      setSigX(Math.round(newX));
      setSigY(Math.round(newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, sigWidthPct]);

  // ── 7. Signing & Download Process ──
  const handleSignDocument = async () => {
    if (!file || !signatureDataUrl) {
      alert("Please upload a PDF document and create your signature first.");
      return;
    }

    setIsProcessing(true);
    setProgressPct(20);
    setProgressStatus("Preparing signature stamping...");

    try {
      setProgressPct(50);
      setProgressStatus(`Embedding signature onto ${signAllPages ? "all pages" : `Page ${currentPage}`}...`);

      const signedBytes = await signPdf(file, signatureDataUrl, {
        pageNumber: currentPage,
        allPages: signAllPages,
        xPercent: sigX,
        yPercent: sigY,
        widthPercent: sigWidthPct,
      });

      setProgressPct(90);
      setProgressStatus("Finalizing signed PDF document...");

      const blob = new Blob([new Uint8Array(signedBytes) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const signedName = file.name.replace(/\.pdf$/i, "-signed.pdf");

      setPendingDownload({ url, name: signedName });
      setShowCountdown(true);
    } catch (err: any) {
      console.error("Sign PDF failed:", err);
      alert(err.message || "Failed to sign PDF.");
    } finally {
      setIsProcessing(false);
      setProgressPct(0);
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

  return (
    <ToolPageLayout
      toolId="sign-pdf"
      title="Sign PDF Document"
      description="Draw, type, or upload your signature and place it with live visual preview anywhere on your PDF."
      faqComponent={<FAQSection toolName="Sign PDF" items={FAQS} />}
    >
      <div className="space-y-6">
        {/* Step 1: Select Document */}
        <ToolSectionCard title="1. Select Document" subtitle="Upload the PDF you wish to sign">
          {!file ? (
            <div
              className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group text-center"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="h-14 w-14 bg-white rounded-2xl shadow-xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-primary border border-primary/20">
                <UploadCloud className="h-7 w-7" />
              </div>
              <p className="text-sm font-bold text-on-surface">Click to upload PDF document</p>
              <p className="text-xs text-tertiary mt-1">Files stay private on your device</p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 w-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 border border-rose-100">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {numPages} {numPages === 1 ? "page" : "pages"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setNumPages(0);
                  setSignatureDataUrl(null);
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Remove document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </ToolSectionCard>

        {/* Step 2: Signature Studio */}
        <ToolSectionCard title="2. Create Signature" subtitle="Draw, type, or upload your signature">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
            <button
              type="button"
              onClick={() => setSigType("draw")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                sigType === "draw" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Draw</span>
            </button>
            <button
              type="button"
              onClick={() => setSigType("type")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                sigType === "type" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>Type</span>
            </button>
            <button
              type="button"
              onClick={() => setSigType("upload")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                sigType === "upload" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Upload</span>
            </button>
          </div>

          {/* DRAW MODE */}
          {sigType === "draw" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {/* Pen Colors */}
                <div className="flex items-center gap-1.5">
                  {PEN_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setPenColor(c.value)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform cursor-pointer ${
                        penColor === c.value ? "scale-110 border-primary ring-2 ring-primary/20" : "border-white shadow-2xs"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={clearDrawing}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Canvas Box */}
              <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shadow-inner">
                <canvas
                  ref={drawCanvasRef}
                  width={480}
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-40 cursor-crosshair touch-none"
                />
                {!signatureDataUrl && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 font-medium">
                    ✍️ Sign with your mouse or finger here
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TYPE MODE */}
          {sigType === "type" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Johnathan Smith"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Font Style Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Calligraphy Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_STYLES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFont(f.font)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFont === f.font
                          ? "border-primary bg-primary/5 text-primary shadow-xs font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-base truncate block" style={{ fontFamily: f.font }}>
                        {typedName || "John Doe"}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD MODE */}
          {sigType === "upload" && (
            <div className="space-y-3">
              <div
                onClick={() => uploadSigInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleUploadSigFile(e.dataTransfer.files[0]);
                }}
                className="border-2 border-dashed border-slate-300 hover:border-primary/50 bg-slate-50 hover:bg-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
              >
                <input
                  type="file"
                  ref={uploadSigInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => e.target.files?.[0] && handleUploadSigFile(e.target.files[0])}
                />
                <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700">Upload signature image (PNG / JPG)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Transparent PNG recommended</p>
              </div>
            </div>
          )}
        </ToolSectionCard>

        {/* Step 3: Live PDF Visual Preview */}
        {file && (
          <ToolSectionCard
            title="3. Live PDF Visual Preview"
            subtitle="Click anywhere or drag signature to place it on the page"
            badge={`Page ${currentPage} of ${numPages}`}
          >
            <div className="space-y-4">
              {/* Page Navigator Toolbar */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-slate-800">
                    Page {currentPage} of {numPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= numPages}
                    onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Move className="h-3.5 w-3.5 text-primary" />
                  <span>Click or Drag signature to position</span>
                </div>
              </div>

              {/* PDF Live Page Container with Interactive Draggable Overlay */}
              <div
                ref={previewContainerRef}
                onClick={handlePreviewClick}
                className="relative mx-auto rounded-xl border border-slate-300 bg-white shadow-md overflow-hidden select-none cursor-crosshair transition-all"
                style={{ minHeight: "500px" }}
              >
                {/* Canvas Document Rendering */}
                <canvas ref={previewCanvasRef} className="block w-full h-auto pointer-events-none" />

                {/* Signature Draggable Badge Overlay */}
                {signatureDataUrl && (
                  <div
                    onMouseDown={startDragSignature}
                    className={`absolute z-30 flex flex-col items-center justify-center p-1 rounded-lg border-2 border-primary bg-white/70 backdrop-blur-xs shadow-xl cursor-move transition-all ${
                      isDragging ? "ring-4 ring-primary/30 scale-105" : "hover:border-blue-600"
                    }`}
                    style={{
                      left: `${sigX}%`,
                      top: `${sigY}%`,
                      width: `${sigWidthPct}%`,
                    }}
                    title="Drag to reposition signature"
                  >
                    {/* Drag Handle Bar */}
                    <div className="w-full flex items-center justify-between pb-0.5 px-1 border-b border-primary/20 text-[9px] font-extrabold uppercase text-primary">
                      <span className="flex items-center gap-1">
                        <Move className="h-2.5 w-2.5" /> Move
                      </span>
                      <span>{sigWidthPct}%</span>
                    </div>

                    {/* Signature Image */}
                    <img
                      src={signatureDataUrl}
                      alt="Signature preview"
                      className="w-full h-auto max-h-24 object-contain pointer-events-none mt-1"
                    />
                  </div>
                )}

                {/* Loading indicator */}
                {pageRendering && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-40">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-bold text-slate-700">
                      <span>Rendering Page {currentPage}...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ToolSectionCard>
        )}

        {/* Step 4: Placement Options & Final Sign Button */}
        {signatureDataUrl && file && (
          <ToolSectionCard title="4. Finalize & Sign" subtitle="Scale signature and apply to document">
            <div className="space-y-4">
              {/* Size Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Signature Scale</span>
                  <span className="text-primary">{sigWidthPct}% of page width</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={sigWidthPct}
                  onChange={(e) => setSigWidthPct(parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Page Selection Option */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">Apply Signature To:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSignAllPages(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !signAllPages
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Page {currentPage} Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignAllPages(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      signAllPages
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All Pages
                  </button>
                </div>
              </div>

              {/* Action Button & Progress */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {isProcessing && (
                  <ProcessingProgress
                    progress={progressPct}
                    statusText={progressStatus}
                    stepName="Signing PDF Document"
                  />
                )}

                {!isProcessing && (
                  <button
                    type="button"
                    onClick={handleSignDocument}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <PenTool className="h-4 w-4" />
                    <span>Sign &amp; Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          </ToolSectionCard>
        )}
      </div>

      {/* 30-Second Countdown Modal */}
      <DownloadCountdownModal
        isOpen={showCountdown}
        onClose={() => setShowCountdown(false)}
        onComplete={triggerDownload}
        fileName={pendingDownload?.name || "signed-document.pdf"}
      />
    </ToolPageLayout>
  );
}
