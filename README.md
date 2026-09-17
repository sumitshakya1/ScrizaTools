# ToolOn (Scriza Tools Platform)

> High-performance, browser-native file and image utilities engineered for speed, privacy, and seamless everyday productivity. Operated by **Scriza Private Limited**.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)

---

## 🛠 Features & Architecture

- **100% Client-Side Processing**: Heavy image resizing, compression, cropping, and PDF transformations occur locally in the client browser using WebAssembly and HTML5 Canvas — zero file uploads to external servers.
- **Complete PDF Suite**:
  - Image to PDF, JPG to PDF, HTML to PDF, Word to PDF, PPTX to PDF, Excel to PDF
  - PDF to Image, PDF to Word, PDF to PowerPoint, PDF to Excel
  - PDF Compressor, PDF Merger & Split, PDF Protect & Encryption
- **Full Authentication & SSO Hub**:
  - Unified Sign In / Sign Up portal (`/signin`, `/signup`)
  - 2-Step Password Recovery with email OTP verification (`/landing/auth/forgot-password`, `/landing/auth/reset-password`)
  - Seamless Single Sign-On (SSO) handoff to the Email Automation Software
- **Legal & Compliance Infrastructure**:
  - Compliant with Indian DPDP Act 2023 and Consumer Protection (E-Commerce) Rules
  - Granular Cookie & Privacy Preferences manager
  - Full statutory legal disclosure suite (`/terms`, `/privacy`, `/cookies`, `/anti-spam`, `/company`, `/grievance`, `/subprocessors`, etc.)
- **AdSense & Monetization Integration**:
  - Fully compliant Google AdSense ad slots (`ads.txt`, responsive skyscraper rail, inline banners, Google Vignette modal ad triggers)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.18+ or 20+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SITE_URL=https://www.toolon.in
NEXT_PUBLIC_API_URL=https://www.toolon.in/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5009
NEXT_PUBLIC_SOFTWARE_URL=http://localhost:3001
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🏢 Operating Entity
- **Company**: Scriza Private Limited
- **CIN**: U74999RJ2022PTC082624
- **Registered Office**: Udaipur, Rajasthan, India
- **Platform**: [toolon.in](https://www.toolon.in)
