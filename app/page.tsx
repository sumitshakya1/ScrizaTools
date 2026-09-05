import { Navbar } from "@/components/navbar";
import { ToolSection } from "@/components/tool-section";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import { GoogleVignetteModal } from "@/components/google-vignette-modal";
import { imageTools, pdfTools } from "@/data/tools";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary-fixed selection:text-primary">
      {/* Top Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Main Content Area with Right-Side Sticky Ad Rail (Matching RedKetchup IA) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-16">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 items-stretch">
            
            {/* Left Primary Tool Directory Column */}
            <div className="flex-1 min-w-0 w-full space-y-10">
              
              {/* Image Tools Section */}
              <ToolSection
                id="image-tools"
                title="Image Tools"
                tools={imageTools}
                accentColor="primary"
              />

              {/* PDF Tools Section */}
              <ToolSection
                id="pdf-tools"
                title="PDF Tools"
                tools={pdfTools}
                accentColor="primary"
              />

            </div>

            {/* Right-Hand Sticky Ad Slot (Skyscraper 300x600 & Native Display) */}
            <AdSlot placement="sticky-rail" format="skyscraper" enabled={true} className="hidden lg:flex" />

          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Google Vignette Interstitial Ad Modal (#google_vignette) */}
      <GoogleVignetteModal />
    </div>
  );
}
