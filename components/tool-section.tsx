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
  const isPrimary = accentColor === "primary";

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

        {/* Table Body Grid of Tools with Bullet Points (Exact RedKetchup Layout) */}
        <div className="p-6 sm:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
          {tools.map((tool) => {
            return (
              <div key={tool.id} className="group flex flex-col justify-start">
                {/* Tool Header: Icon + Name */}
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
                </div>

                {/* Bullet Points List (Matching RedKetchup) */}
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
          })}
        </div>

      </div>
    </section>
  );
}
