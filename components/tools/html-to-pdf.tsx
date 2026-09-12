"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, Download, Loader2, Sparkles, Globe, Eye,
  Code, Trash2,
} from "lucide-react";
import { ToolPageLayout } from "./shared/tool-page-layout";
import { ToolSectionCard } from "./shared/tool-section-card";
import { FAQSection, FAQItem } from "./shared/faq-section";
import { DownloadCountdownModal } from "./shared/download-countdown-modal";
import { convertHtmlToPdf } from "@/lib/pdf-engine";

const FAQS: FAQItem[] = [
  { question: "What HTML content is supported?", answer: "You can paste any valid HTML including headings, paragraphs, tables, lists, images (base64 or public URLs), and inline CSS styles. JavaScript is not executed." },
  { question: "Can I convert a live web page?", answer: "Currently this tool works with pasted HTML content. Full URL-based web page capture requires server-side rendering and is coming in a future update." },
  { question: "Are my documents uploaded?", answer: "No. The HTML is rendered inside your browser using canvas technology and converted to PDF entirely client-side. Nothing leaves your device." },
];

const SAMPLE_HTML = `<h1 style="color: #1a1a2e; font-family: Arial;">Welcome to Scriza Tools</h1>
<p style="font-size: 16px; line-height: 1.6; color: #444;">
  This is a <strong>sample HTML document</strong> that demonstrates the HTML to PDF converter.
</p>
<h2 style="color: #0f3460;">Features</h2>
<ul style="font-size: 14px; line-height: 1.8; color: #555;">
  <li>✅ Supports headings, paragraphs, and lists</li>
  <li>✅ Tables and formatted text</li>
  <li>✅ Inline CSS styling</li>
  <li>✅ 100% client-side processing</li>
</ul>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px; margin-top: 16px;">
  <tr style="background: #f0f0f0;">
    <th>Feature</th><th>Status</th>
  </tr>
  <tr><td>Text Rendering</td><td>✅ Supported</td></tr>
  <tr><td>CSS Styling</td><td>✅ Supported</td></tr>
  <tr><td>Images</td><td>✅ Supported</td></tr>
</table>`;

export function HtmlToPdfTool() {
  const [htmlContent, setHtmlContent] = useState("");
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!htmlContent.trim()) { alert("Please enter some HTML content."); return; }
    setIsProcessing(true);
    try {
      const pdfBytes = await convertHtmlToPdf(htmlContent, pageSize);
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPendingUrl(url);
      setShowCountdown(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "Conversion failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!pendingUrl) return;
    const a = document.createElement("a");
    a.href = pendingUrl;
    a.download = "scriza-html-to-pdf.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout toolId="html-to-pdf" title="HTML to PDF" description="Convert HTML content or web page markup into a downloadable PDF document.">
      <div className="space-y-6">
        <ToolSectionCard title="HTML Editor" subtitle="Paste or type your HTML content below.">
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHtmlContent(SAMPLE_HTML)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim px-3 py-1.5 text-xs font-semibold text-tertiary hover:bg-surface-low transition-colors"
                >
                  <Sparkles className="h-3 w-3" /> Load Sample
                </button>
                <button
                  onClick={() => setHtmlContent("")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-dim px-3 py-1.5 text-xs font-semibold text-tertiary hover:bg-surface-low transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as "a4" | "letter")}
                  className="rounded-lg border border-surface-dim px-2 py-1.5 text-xs bg-white"
                >
                  <option value="a4">A4 Page</option>
                  <option value="letter">US Letter</option>
                </select>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${showPreview ? "border-primary bg-primary/10 text-primary" : "border-surface-dim text-tertiary hover:bg-surface-low"}`}
                >
                  <Eye className="h-3 w-3" /> Preview
                </button>
              </div>
            </div>

            {/* Editor / Preview */}
            <div className={`grid gap-4 ${showPreview ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {/* Code Editor */}
              <div>
                <div className="flex items-center gap-1.5 bg-gray-800 rounded-t-lg px-3 py-1.5">
                  <Code className="h-3 w-3 text-gray-400" />
                  <span className="text-[11px] font-mono text-gray-400">HTML</span>
                </div>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<h1>Hello World</h1>\n<p>Paste your HTML here...</p>"
                  className="w-full h-64 rounded-b-lg border border-surface-dim p-3 font-mono text-xs bg-gray-900 text-green-400 focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Live Preview */}
              {showPreview && (
                <div>
                  <div className="flex items-center gap-1.5 bg-surface-low rounded-t-lg px-3 py-1.5 border border-surface-dim border-b-0">
                    <Eye className="h-3 w-3 text-tertiary" />
                    <span className="text-[11px] font-semibold text-tertiary">Preview</span>
                  </div>
                  <div
                    className="w-full h-64 overflow-auto rounded-b-lg border border-surface-dim p-4 bg-white text-sm"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleConvert}
              disabled={isProcessing || !htmlContent.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : <><Globe className="h-4 w-4" /> Convert to PDF</>}
            </button>
          </div>
        </ToolSectionCard>

        <FAQSection toolName="HTML to PDF" items={FAQS} />
      </div>

      <DownloadCountdownModal isOpen={showCountdown} fileName="scriza-html-to-pdf.pdf" onComplete={triggerDownload} onClose={() => setShowCountdown(false)} />
    </ToolPageLayout>
  );
}
