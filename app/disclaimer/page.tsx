import React from "react";
import { Metadata } from "next";
import { getPolicyById } from "@/data/policies";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Service Disclaimer — ToolOn | Scriza Private Limited",
  description: "Official Service Disclaimer for ToolOn.in services operated by Scriza Private Limited (CIN: U74999RJ2022PTC082624). Effective date: 16 September 2026.",
  alternates: {
    canonical: "https://www.toolon.in/disclaimer",
  },
};

export default function DisclaimerPage() {
  const policy = getPolicyById("disclaimer");

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
    </LegalPageLayout>
  );
}
