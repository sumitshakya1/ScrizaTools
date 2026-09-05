import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scriza — Free Online Image Tools | Resize, Compress, Convert",
  description:
    "Free browser-based image tools by Scriza. Resize, compress, crop, and convert images online — 100% client-side, fast, and private. No uploads required.",
  keywords: [
    "Scriza",
    "online tools",
    "image resizer",
    "image compressor",
    "image converter",
    "image cropper",
    "bulk image resizer",
    "free online image tools",
    "client-side image processing",
  ],
  authors: [{ name: "Scriza Team" }],
  openGraph: {
    title: "Scriza — Free Online Image Tools | Resize, Compress, Convert",
    description:
      "Free browser-based image tools by Scriza. Resize, compress, crop, and convert images online — fast, private, and zero installs.",
    url: "https://scriza.com",
    siteName: "Scriza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scriza — Free Online Image Tools",
    description:
      "Resize, compress, crop, and convert images directly in your browser. 100% free and private.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#b50a53",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased flex flex-col justify-between font-sans">
        {children}
      </body>
    </html>
  );
}
