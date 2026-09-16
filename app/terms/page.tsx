import React from "react";
import { Metadata } from "next";
import { getPolicyById } from "@/data/policies";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Terms of Service — ToolOn | Scriza Private Limited",
  description: "Official Terms of Service for ToolOn.in services operated by Scriza Private Limited (CIN: U74999RJ2022PTC082624). Effective date: 16 September 2026.",
  alternates: {
    canonical: "https://www.toolon.in/terms",
  },
};

export default function TermsPage() {
  const policy = getPolicyById("terms");

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
