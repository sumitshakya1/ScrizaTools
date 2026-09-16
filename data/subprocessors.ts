export interface Subprocessor {
  id: string;
  category: string;
  provider: string;
  legalEntity: string;
  purpose: string;
  location: string;
  privacyPolicyUrl: string;
  status: "active" | "planned" | "tbd";
}

export const SUBPROCESSORS: Subprocessor[] = [
  {
    id: "adsense-google",
    category: "Display Advertising & Measurement",
    provider: "Google AdSense",
    legalEntity: "Google LLC / Google Ireland Limited",
    purpose:
      "Contextual and personalised display advertising, ad frequency capping, fraud prevention, and invalid traffic filtering on free browser tools.",
    location: "United States / European Economic Area / Global",
    privacyPolicyUrl: "https://policies.google.com/privacy",
    status: "active",
  },
  {
    id: "cloud-hosting",
    category: "Cloud Hosting & Global CDN",
    provider: "Cloudflare / Vercel [TBD - Pending Final Deployment Verification]",
    legalEntity: "Cloudflare, Inc. / Vercel Inc. [TBD]",
    purpose:
      "Website hosting, DNS routing, DDoS protection, edge caching, and web asset delivery.",
    location: "Global Edge Network / India Points of Presence",
    privacyPolicyUrl: "https://www.cloudflare.com/privacypolicy/",
    status: "tbd",
  },
  {
    id: "database-storage",
    category: "Database & Secure Object Storage",
    provider: "[TBD - Selection in Progress prior to Communication Services Launch]",
    legalEntity: "AWS / Google Cloud India [TBD]",
    purpose:
      "Secure encrypted storage of customer account credentials, billing logs, campaign metadata, and suppression lists.",
    location: "India (Mumbai / Hyderabad Regions)",
    privacyPolicyUrl: "https://aws.amazon.com/privacy/",
    status: "tbd",
  },
  {
    id: "payment-gateway",
    category: "Payment Gateway & Tokenization",
    provider: "Razorpay / Cashfree / Stripe [TBD - Gateway Integration in Progress]",
    legalEntity: "Razorpay Software Private Limited / Cashfree Payments India [TBD]",
    purpose:
      "Processing subscription payments, tokenized card vaulting, UPI intents, and generating GST-compliant tax invoices. Raw card data is never stored by ToolOn.",
    location: "India",
    privacyPolicyUrl: "https://razorpay.com/privacy/",
    status: "tbd",
  },
  {
    id: "email-infrastructure",
    category: "Email Delivery Infrastructure (MTA)",
    provider: "[TBD - Proprietary Scriza MTA Cluster / Tier-1 Relay]",
    legalEntity: "Scriza Private Limited / Authorized Relay Partner [TBD]",
    purpose:
      "Transmission of outbound permission-based marketing and transactional emails, bounce processing, feedback loop (FBL) ingestion, and complaint handling.",
    location: "India / Tier-3 Data Center Facilities",
    privacyPolicyUrl: "https://www.toolon.in/privacy",
    status: "tbd",
  },
  {
    id: "domain-verification",
    category: "Identity & Domain Authentication",
    provider: "ToolOn Built-in DNS Verifier",
    legalEntity: "Scriza Private Limited",
    purpose:
      "Automated verification of customer SPF, DKIM, and DMARC DNS records before email sending permission is activated.",
    location: "India",
    privacyPolicyUrl: "https://www.toolon.in/privacy",
    status: "active",
  },
  {
    id: "analytics-monitoring",
    category: "Performance Monitoring & Analytics",
    provider: "[TBD - Privacy-First Self-Hosted or Local Analytics]",
    legalEntity: "[TBD - To be published before commercial go-live]",
    purpose:
      "Aggregated website visit measurement, error diagnostic telemetry, and system uptime monitoring. No personal recipient data is processed.",
    location: "India / Global",
    privacyPolicyUrl: "https://www.toolon.in/privacy",
    status: "tbd",
  },
  {
    id: "customer-support",
    category: "Customer Support & Grievance Desk",
    provider: "Scriza Support Desk",
    legalEntity: "Scriza Private Limited",
    purpose:
      "Customer inquiry handling, grievance escalation tracking, abuse reports, and technical troubleshooting.",
    location: "Greater Noida, Uttar Pradesh, India",
    privacyPolicyUrl: "https://www.toolon.in/privacy",
    status: "active",
  },
];
