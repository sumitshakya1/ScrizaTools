import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap, CheckCircle2, Play, Cpu, ShieldCheck, Mail, Sliders, BarChart3, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32">
      {/* Rich multi-layered background */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/12 via-secondary/12 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-20 right-[-15%] -z-10 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl animate-pulse"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-10%] -z-10 h-[300px] w-[300px] rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed/40 px-3.5 py-1 text-xs font-semibold text-primary shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Next-Gen Productivity Suite 2026</span>
              <span className="text-tertiary">|</span>
              <span className="text-secondary font-medium">All-in-One</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.12]">
              Powerful Tools.{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                Smarter Automation.
              </span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-tertiary max-w-2xl leading-relaxed">
              Everything you need to simplify everyday work, automate repetitive tasks, and get more done with ToolOn.in. High-speed browser tools and automated workflow pipelines in one unified platform.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="#image-tools"
                id="hero-explore-tools-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-gradient-brand hover:opacity-95 shadow-md shadow-primary/20 hover:shadow-glow rounded-button transition-all duration-200 active:scale-[0.98] w-full sm:w-auto text-center"
              >
                <span>Explore Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#email-automation"
                id="hero-explore-automation-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-navy bg-white hover:bg-surface-low border border-surface-dim hover:border-secondary/40 shadow-card rounded-button transition-all duration-200 w-full sm:w-auto text-center"
              >
                <span>Explore Automation</span>
                <Sparkles className="h-4 w-4 text-secondary" />
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-surface-dim/60 w-full max-w-lg">
              <div>
                <div className="text-2xl font-bold text-on-surface">50+</div>
                <div className="text-xs text-tertiary">Productivity Tools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">0s</div>
                <div className="text-xs text-tertiary">Server Wait Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-tertiary">Private & In-Browser</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Premium Floating Dashboard */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            
            {/* Multi-layer ambient glow */}
            <div className="absolute inset-0 -m-12 rounded-[40px] bg-gradient-to-br from-primary/15 via-secondary/20 to-primary/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-secondary/20 blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 h-36 w-36 rounded-full bg-primary/20 blur-3xl -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />

            <div className="relative group">
              {/* Floating animation wrapper */}
              <div className="animate-float">
                {/* Main image container with premium styling */}
                <div className="relative rounded-2xl overflow-hidden transition-all duration-700 group-hover:-translate-y-2">
                  {/* Decorative ring glow behind the image */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 -z-10 blur-sm group-hover:blur-md transition-all duration-500" />
                  
                  <Image
                    src="/toolon-dashboard-laptop.jpg"
                    alt="ToolOn Dashboard - Free Online Image & PDF Tools displayed on a laptop"
                    width={800}
                    height={533}
                    priority
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                  
                  {/* Glass overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/3 via-transparent to-white/5 pointer-events-none rounded-2xl" />
                </div>
              </div>

              {/* Floating Live Dashboard badge — glass style */}
              <div className="absolute -top-4 -right-2 sm:-right-4 z-10 inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-emerald-200/80 shadow-xl shadow-emerald-100/40">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                Live Dashboard
              </div>

              {/* Floating metric card — top-left */}
              <div className="absolute -top-3 -left-2 sm:-left-6 z-10 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-surface-dim/60 shadow-lg animate-float-delayed">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-tertiary font-medium">Campaigns Sent</div>
                  <div className="text-xs font-bold text-on-surface">142,850</div>
                </div>
              </div>

              {/* Floating KPI Badge — Bottom */}
              <div className="absolute -bottom-5 left-3 right-3 sm:left-6 sm:right-6 z-10 flex items-center justify-between rounded-xl bg-navy/95 backdrop-blur-md px-4 py-3.5 text-white shadow-2xl shadow-navy/30 border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                    <Cpu className="h-3.5 w-3.5 text-primary-fixed" />
                  </div>
                  <span className="text-xs font-medium">ToolOn Edge Processing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-secondary-fixed">
                    0.04ms latency
                  </span>
                </div>
              </div>

              {/* Floating open rate badge — right side */}
              <div className="absolute top-1/2 -right-2 sm:-right-8 z-10 hidden sm:flex flex-col items-center bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-xl border border-surface-dim/60 shadow-lg animate-float-slow">
                <TrendingUp className="h-4 w-4 text-emerald-500 mb-1" />
                <div className="text-sm font-bold text-emerald-600">68.5%</div>
                <div className="text-[9px] text-tertiary font-medium">Open Rate</div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
