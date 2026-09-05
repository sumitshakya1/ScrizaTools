import { Navbar } from "@/components/navbar";
import { ToolSection } from "@/components/tool-section";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import { GoogleVignetteModal } from "@/components/google-vignette-modal";
import { imageTools } from "@/data/tools";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary-fixed selection:text-primary">
      {/* Top Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Main Content Area with Right-Side Sticky Ad Rail (Matching RedKetchup IA + Lector Design) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-16">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 items-stretch">
            
            {/* Left Primary Tool Directory Column */}
            <div className="flex-1 min-w-0 w-full space-y-12">
              
              {/* Image Tools */}
              <ToolSection
                id="image-tools"
                title="Image Tools"
                description="Quickly resize, compress, convert and optimize your images with simple browser-based tools. Zero desktop installation needed."
                badgeText="Category 01"
                tools={imageTools}
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
