import Link from "next/link";
import { Tool } from "@/data/tools";
import { DynamicIcon } from "@/components/icons";

interface ToolSectionProps {
  id: string;
  title: string;
  description?: string;
  badgeText?: string;
  tools: Tool[];
  accentColor?: "primary" | "secondary";
}

export function ToolSection({
  id,
  title,
  tools,
  accentColor = "primary",
}: ToolSectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      {/* RedKetchup Exact Table Panel Container */}
      <div className="rounded-lg border border-[#d0d7de] bg-white shadow-xs overflow-hidden transition-all">
        
        {/* Table Header Bar */}
        <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-6 py-3.5">
          <h2 className="text-xl sm:text-[1.35rem] font-medium tracking-tight text-[#24292f]">
            {title}
          </h2>
        </div>

        {/* Table Body Grid of Tools with Bullet Points */}
        <div className="p-6 sm:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
          {tools.map((tool) => (
            <ToolItem key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PDF Section with Subcategories ─────────────────────────

interface PdfToolSectionProps {
  id: string;
  convertToPdf: Tool[];
  convertFromPdf: Tool[];
  utilities: Tool[];
}

export function PdfToolSection({
  id,
  convertToPdf,
  convertFromPdf,
  utilities,
}: PdfToolSectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="rounded-lg border border-[#d0d7de] bg-white shadow-xs overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-6 py-3.5">
          <h2 className="text-xl sm:text-[1.35rem] font-medium tracking-tight text-[#24292f]">
            PDF Tools
          </h2>
        </div>

        <div className="p-6 sm:p-8 bg-white space-y-8">
          {/* Convert TO PDF + Convert FROM PDF — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Convert TO PDF */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#57606a] mb-4 flex items-center gap-2">
                <span className="inline-block h-1 w-4 rounded-full bg-primary" />
                Convert to PDF
              </h3>
              <div className="space-y-5">
                {convertToPdf.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Convert FROM PDF */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#57606a] mb-4 flex items-center gap-2">
                <span className="inline-block h-1 w-4 rounded-full bg-rose-500" />
                Convert from PDF
              </h3>
              <div className="space-y-5">
                {convertFromPdf.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#d0d7de]" />

          {/* PDF Utilities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#57606a] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-4 rounded-full bg-amber-500" />
              PDF Utilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              {utilities.map((tool) => (
                <ToolItem key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Shared Tool Item ───────────────────────────────────────

function ToolItem({ tool }: { tool: Tool }) {
  return (
    <div className="group flex flex-col justify-start">
      {/* Tool Header: Icon + Name + Badge */}
      <div className="flex items-center gap-2.5">
        <Link
          href={tool.href}
          className="inline-flex items-center gap-2.5 text-lg font-semibold text-[#24292f] hover:text-[#0969da] transition-colors focus:outline-none group"
        >
          <span className="flex h-6 w-6 items-center justify-center text-[#57606a] group-hover:text-[#0969da] transition-colors">
            <DynamicIcon
              name={tool.iconName}
              className="h-5 w-5 stroke-[2] shrink-0"
            />
          </span>
          <span className="group-hover:underline underline-offset-2">
            {tool.name}
          </span>
        </Link>
        {tool.badge === "Soon" && (
          <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            Coming Soon
          </span>
        )}
      </div>

      {/* Bullet Points List */}
      <ul className="mt-2 space-y-1 list-disc list-outside ml-6 text-[0.875rem] text-[#424a53] leading-relaxed">
        {tool.bulletPoints && tool.bulletPoints.length > 0 ? (
          tool.bulletPoints.map((bullet, idx) => (
            <li key={idx} className="pl-0.5">
              {bullet}
            </li>
          ))
        ) : (
          <>
            <li className="pl-0.5">{tool.description}</li>
            {tool.features?.map((feat, idx) => (
              <li key={idx} className="pl-0.5">
                {feat}
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}
