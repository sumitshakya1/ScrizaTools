import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

export const metadata: Metadata = {
  title: "ToolOn — Free Online Image & PDF Tools | Resize, Compress, Convert",
  description:
    "Free browser-based tools by ToolOn.in. Resize, compress, crop, and convert images & PDFs online — fast, private, and zero installs. Core browser tools process files locally where stated. Operated by Scriza Private Limited.",
  keywords: [
    "ToolOn",
    "toolon.in",
    "Scriza Private Limited",
    "online tools",
    "image resizer",
    "image compressor",
    "image converter",
    "pdf tools",
    "pdf compressor",
    "pdf to word",
    "images to pdf",
    "free online tools",
    "browser image processing",
    "bulk email marketing platform",
  ],
  authors: [{ name: "Scriza Private Limited" }],
  metadataBase: new URL("https://www.toolon.in"),
  alternates: {
    canonical: "https://www.toolon.in",
  },
  openGraph: {
    title: "ToolOn — Free Online Image & PDF Tools | Resize, Compress, Convert",
    description:
      "Free browser-based tools by ToolOn.in. Resize, compress, crop, and convert images & PDFs online. Operated by Scriza Private Limited (CIN: U74999RJ2022PTC082624).",
    url: "https://www.toolon.in",
    siteName: "ToolOn.in",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolOn.in — Free Online Tools for Everyday Tasks",
    description:
      "Resize, compress, crop, and convert images & PDFs directly in your browser. Operated by Scriza Private Limited.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0070f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased flex flex-col justify-between font-sans">
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
