import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create Your Free Account — ToolOn | Free Online Tools",
  description:
    "Join ToolOn free. Access unlimited high-speed browser-based PDF converters, image resizers, and compression utilities with client-side privacy.",
  alternates: {
    canonical: "https://www.toolon.in/signup",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FE] selection:bg-primary-fixed selection:text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#0070F3]/8 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#0284C7]/8 blur-[120px]" />

        <div className="w-full relative z-10">
          <Suspense
            fallback={
              <div className="max-w-md mx-auto p-12 bg-white rounded-3xl shadow-lg text-center text-slate-500 animate-pulse">
                Loading registration portal...
              </div>
            }
          >
            <AuthForm initialMode="signup" />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
