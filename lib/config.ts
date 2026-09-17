export const SITE_CONFIG = {
  name: "ToolOn",
  tagline: "Tools for Everyday Tasks",
  domain: "www.toolon.in",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolon.in",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://www.toolon.in/api",
  supportEmail: "support@toolon.in",
  links: {
    signIn: "/signin",
    signUp: "/signup",
    pricing: "/pricing",
  },
};

/**
 * Global helper to build API URLs targeting www.toolon.in (or configured NEXT_PUBLIC_API_URL)
 * Example usage:
 *   const res = await fetch(getApiUrl("/auth/login"), { method: "POST", ... });
 */
export function getApiUrl(endpoint: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "https://www.toolon.in/api";
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}
