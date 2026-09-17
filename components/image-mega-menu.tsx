"use client";

import React, { useState } from "react";
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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  if (!isOpen) return null;

  const activeCategory = IMAGE_MEGA_MENU_CATEGORIES[activeCategoryIndex];

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 pt-2 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="mx-auto max-w-[1024px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/12 overflow-hidden backdrop-blur-xl flex flex-col md:flex-row">
          
          {/* Left Pane: Categories Sidebar */}
          <div className="w-full md:w-64 lg:w-72 bg-slate-50/80 border-r border-slate-100 p-4 lg:p-6 flex flex-col gap-2 shrink-0">
            <h4 className="text-[11px] font-black tracking-wider text-slate-500 uppercase mb-2 px-3">
              Categories
            </h4>
            <div className="flex flex-col gap-1">
              {IMAGE_MEGA_MENU_CATEGORIES.map((category, index) => {
                const isActive = activeCategoryIndex === index;
                return (
                  <button
                    key={category.title}
                    type="button"
                    onMouseEnter={() => setActiveCategoryIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-default text-left ${
                      isActive
                        ? "bg-white shadow-sm border border-slate-200/60"
                        : "hover:bg-slate-100/60 border border-transparent"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold ${
                        isActive ? "text-primary" : "text-slate-600"
                      }`}
                    >
                      {category.title}
                    </span>
                    {isActive && (
                      <ArrowRight className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Tools Grid */}
          <div className="flex-1 bg-white p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-800 capitalize tracking-tight">
                  {activeCategory.title.toLowerCase()}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 xl:gap-6">
                {activeCategory.tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={onClose}
                      className={`group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 transition-all shadow-sm ${activeCategory.color.hoverBg} hover:shadow-md hover:border-transparent`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${activeCategory.color.iconBg}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      {/* Tool Info */}
                      <div className="min-w-0 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
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
                          <p className="text-xs text-slate-500 leading-snug">
                            {tool.desc}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Strip of Right Pane */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Shield className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-slate-600">
                  100% Client-Side Processing • Fast & Secure Editing
                </span>
              </div>
              <Link
                href="/#image-tools"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
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
