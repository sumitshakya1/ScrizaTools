import React from "react";
import { Metadata } from "next";
import { getPolicyById } from "@/data/policies";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Advertising and Third Party Ads Disclosure — ToolOn | Scriza Private Limited",
  description: "Official Advertising and Third Party Ads Disclosure for ToolOn.in services operated by Scriza Private Limited (CIN: U74999RJ2022PTC082624). Effective date: 16 September 2026.",
  alternates: {
    canonical: "https://www.toolon.in/advertising-disclosure",
  },
};

export default function AdvertisingDisclosurePage() {
  const policy = getPolicyById("advertising-disclosure");

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
