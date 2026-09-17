import policiesData from "./policies-data.json";

export interface PolicyHeading {
  title: string;
  anchor: string;
  level: number;
}

export interface Policy {
  id: string;
  title: string;
  route: string;
  effectiveDate: string;
  headings: PolicyHeading[];
  html: string;
  category: "governance" | "regulatory" | "commercial";
}

const POLICY_METADATA: Record<
  string,
  { category: "governance" | "regulatory" | "commercial"; description: string }
> = {
  company: {
    category: "governance",
    description: "Corporate entity verification, registered address, CIN, leadership, and operational contact channels.",
  },
  terms: {
    category: "governance",
    description: "Binding legal agreement governing access to browser tools, account security, and bulk email services.",
  },
  privacy: {
    category: "regulatory",
    description: "Collection, processing, security, retention, and international transfer of personal and account data.",
  },
  cookies: {
    category: "regulatory",
    description: "Detailed breakdown of strictly necessary, functional, analytics, and advertising cookies.",
  },
  "refund-cancellation": {
    category: "commercial",
    description: "Subscription billing schedules, cancellation rights, cooling-off periods, and refund criteria.",
  },
  delivery: {
    category: "commercial",
    description: "Instant electronic fulfillment timelines, account provisioning, and credit delivery SLA.",
  },
  "acceptable-use": {
    category: "governance",
    description: "Enforceable standards for system security, automated resource limits, and prohibited content.",
  },
  "anti-spam": {
    category: "regulatory",
    description: "Permission-based marketing standards, mandatory consent evidence, authentication, and suppression rules.",
  },
  "data-processing-addendum": {
    category: "regulatory",
    description: "Article 28 GDPR & Indian DPDP compliant customer data processing instructions and security schedules.",
  },
  security: {
    category: "governance",
    description: "Technical safeguards, encryption standards, vulnerability disclosure, and incident management.",
  },
  grievance: {
    category: "regulatory",
    description: "Statutory grievance redressal officer details, escalation procedures, and abuse reporting channels.",
  },
  disclaimer: {
    category: "governance",
    description: "Statutory limitations regarding client-side processing, AI features, and delivery estimations.",
  },
  copyright: {
    category: "governance",
    description: "DMCA and Indian Copyright Act notice submission, counter-notification, and repeat infringer policy.",
  },
  "advertising-disclosure": {
    category: "commercial",
    description: "Transparency on Google AdSense, third-party cookies, behavioral measurement, and invalid traffic policy.",
  },
  subprocessors: {
    category: "regulatory",
    description: "Authorised third-party cloud infrastructure, payment gateways, and communications providers.",
  },
};

export const POLICIES: Policy[] = policiesData.map((p) => ({
  id: p.id,
  title: p.title,
  route: p.route,
  effectiveDate: "16 September 2026",
  headings: p.headings,
  html: p.html,
  category: POLICY_METADATA[p.id]?.category || "governance",
}));

export function getAllPolicies(): Policy[] {
  return POLICIES;
}

export function getPolicyById(id: string): Policy | undefined {
  return POLICIES.find((p) => p.id === id);
}

export const LEGAL_COMPANY_INFO = {
  legalName: "Scriza Private Limited",
  cin: "U74999RJ2022PTC082624",
  brand: "ToolOn",
  domain: "www.toolon.in",
  siteUrl: "https://www.toolon.in",
  corporateOffice:
    "NX One, T1, 507, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201318, India",
  registeredOffice:
    "Udaipur, Rajasthan, India [Full MCA-registered address to be updated before production launch]",
  generalSupportEmail: "sales@scriza.in",
  customerSupportEmail: "support@toolon.in",
  grievanceEmail: "admin@scriza.in",
  grievanceOfficer: "Laxman Singh Sonigara, Director",
  phone: "+91 9116011899",
  alternatePhone: "+91 9599287094",
  businessHours: "Mon–Sat, 10:00 AM–6:00 PM IST, excluding public holidays",
  effectiveDate: "16 September 2026",
};
