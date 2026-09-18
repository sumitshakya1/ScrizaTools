"use client";

import React, { useEffect, useState } from "react";

interface AdSlotProps {
  placement?: "sticky-rail" | "in-feed" | "hero-bottom";
  format?: "skyscraper" | "rectangle" | "banner";
  enabled?: boolean;
  className?: string;
  adUnitId?: string;
}

export function AdSlot({
  placement = "sticky-rail",
  format = "skyscraper",
  enabled = true,
  className = "",
  adUnitId = "toolon-sidebar-top-300x600",
}: AdSlotProps) {
  if (!enabled) {
    return null;
  }

  if (placement === "sticky-rail" || format === "skyscraper") {
    return (
      <aside
        aria-label="Advertisement Space"
        className={`w-[300px] flex flex-col shrink-0 self-stretch ${className}`}
      >
        {/* Sticky wrapper maintaining exact column spacing for AdSense */}
        <div className="sticky top-20 z-20 flex flex-col items-center">
          <div
            id={adUnitId}
            data-ad-format="vertical"
            className="w-[300px] min-h-[600px] rounded-lg bg-transparent"
          />
        </div>
      </aside>
    );
  }

  return (
    <div
      id={adUnitId}
      data-ad-placement={placement}
      className={`toolon-ad-banner my-6 mx-auto w-full max-w-5xl min-h-[90px] bg-transparent ${className}`}
    />
  );
}
