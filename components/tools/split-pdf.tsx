"use client";

import React from "react";
import { PdfMergerTool } from "./pdf-merger";

export function SplitPdfTool() {
  return <PdfMergerTool initialMode="split" />;
}
