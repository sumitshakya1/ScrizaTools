import React from "react";
import { Metadata } from "next";
import { getPolicyById } from "@/data/policies";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { SubprocessorTable } from "@/components/legal/subprocessor-table";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Subprocessor List — ToolOn | Scriza Private Limited",
  description: "Official Subprocessor List for ToolOn.in services operated by Scriza Private Limited (CIN: U74999RJ2022PTC082624). Effective date: 16 September 2026.",
  alternates: {
    canonical: "https://www.toolon.in/subprocessors",
  },
};

export default function SubprocessorsPage() {
  const policy = getPolicyById("subprocessors");

  if (!policy) {
    notFound();
  }

  return (
    <LegalPageLayout
      policyId={policy.id}
      title={policy.title}
      headings={policy.headings}
      htmlContent={policy.html}
    >
      <SubprocessorTable />
    </LegalPageLayout>
  );
}
