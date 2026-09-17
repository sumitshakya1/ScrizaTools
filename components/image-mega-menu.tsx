"use client";

import React from "react";
import Link from "next/link";
import {
  Maximize2,
  Layers,
  Wand2,
  RefreshCw,
  Crop,
  FileImage,
  ArrowRight,
  Shield,
  LucideIcon,
} from "lucide-react";

export interface MegaMenuItem {
  name: string;
  href: string;
  desc: string;
  icon: LucideIcon;
  badge?: string;
  isLive?: boolean;
}

export interface MegaMenuCategory {
  title: string;
  color: {
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
    hoverBg: string;
    border: string;
  };
  tools: MegaMenuItem[];
}

// Data extracted and organized from data/tools.ts for Image Tools
export const IMAGE_MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    title: "ESSENTIAL EDITING",
    color: {
      badgeBg: "bg-orange-50",
      badgeText: "text-orange-700",
      iconBg: "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
      iconText: "text-orange-600",
      hoverBg: "hover:bg-orange-50/50",
      border: "border-orange-100",
    },
    tools: [
      {
        name: "Image Resizer",
        href: "/image-resizer",
        desc: "Resize any image to exact pixel dimensions",
        icon: Maximize2,
        isLive: true,
        badge: "Popular",
      },
      {
        name: "Image Cropper",
        href: "/image-cropper",
        desc: "Crop to exact dimensions or social media presets",
        icon: Crop,
        isLive: true,
      },
    ],
  },
  {
    title: "OPTIMIZATION",
    color: {
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
      iconText: "text-emerald-600",
      hoverBg: "hover:bg-emerald-50/50",
      border: "border-emerald-100",
    },
    tools: [
      {
        name: "Image Compressor",
        href: "/image-compressor",
        desc: "Reduce file size up to 85% instantly",
        icon: Wand2,
        isLive: true,
        badge: "Fast",
      },
      {
        name: "Bulk Image Resizer",
        href: "/bulk-image-resizer",
        desc: "Resize up to 50 images simultaneously",
        icon: Layers,
        isLive: true,
        badge: "Bulk",
      },
    ],
  },
  {
    title: "CONVERSION",
    color: {
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-700",
      iconBg: "bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
      iconText: "text-purple-600",
      hoverBg: "hover:bg-purple-50/50",
      border: "border-purple-100",
    },
    tools: [
      {
        name: "Image Converter",
        href: "/image-converter",
        desc: "Convert images between standard formats",
        icon: RefreshCw,
        isLive: true,
      },
      {
        name: "Format Converter",
        href: "/image-format-converter",
        desc: "Advanced format conversion and vectors",
        icon: FileImage,
        isLive: true,
      },
    ],
  },
];

interface ImageMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ImageMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ImageMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 pt-2 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="mx-auto max-w-[1024px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/12 overflow-hidden backdrop-blur-xl">
          
          {/* Main Grid Layout */}
          <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-4 xl:gap-6 bg-gradient-to-b from-slate-50/60 to-white">
            {IMAGE_MEGA_MENU_CATEGORIES.map((category) => (
              <div key={category.title} className="flex flex-col space-y-3 min-w-0">
                
                {/* Column Category Title */}
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-[11px] font-black tracking-wider text-slate-500 uppercase">
                    {category.title}
                  </h4>
                </div>

                {/* Column Items */}
                <ul className="space-y-1">
                  {category.tools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          onClick={onClose}
                          className={`group flex items-start gap-2.5 p-2 rounded-xl transition-all ${category.color.hoverBg}`}
                        >
                          {/* Vibrant Icon Box */}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${category.color.iconBg}`}
                          >
                            <IconComponent className="h-3.5 w-3.5" />
                          </div>

                          {/* Tool Name and Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[13px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span
                                  className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                                    tool.badge === "Popular"
                                      ? "bg-amber-100 text-amber-800"
                                      : tool.badge === "Fast"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : tool.badge === "Bulk"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            {tool.desc && (
                              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 leading-snug">
                                {tool.desc}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Feature Strip */}
          <div className="bg-slate-50/90 border-t border-slate-100 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Shield className="h-3 w-3" />
              </span>
              <span className="font-medium text-slate-700">
                100% Client-Side Processing • Fast & Secure Editing
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/#image-tools"
                onClick={onClose}
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
              >
                <span>View All In Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
