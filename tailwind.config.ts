import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8f9fe",
        surface: {
          DEFAULT: "#ffffff",
          dim: "#d8dadf",
          bright: "#f8f9fe",
          container: "#edeef3",
          low: "#f2f3f8",
          high: "#e7e8ed",
          variant: "#e1e2e7",
        },
        primary: {
          DEFAULT: "#0070f3",
          container: "#005ac2",
          fixed: "#dbeafe",
          "fixed-dim": "#bfdbfe",
          "on-fixed": "#1e3a8a",
        },
        secondary: {
          DEFAULT: "#0284c7",
          container: "#0369a1",
          fixed: "#e0f2fe",
          "fixed-dim": "#bae6fd",
        },
        tertiary: {
          DEFAULT: "#475569",
          container: "#64748b",
          fixed: "#e2e8f0",
          "fixed-dim": "#cbd5e1",
        },
        outline: {
          DEFAULT: "#94a3b8",
          variant: "#e2e8f0",
        },
        navy: "#0f172a",
        "on-surface": "#0f172a",
        "on-surface-variant": "#334155",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0px 4px 20px rgba(15, 23, 42, 0.05)",
        "card-hover": "0px 12px 32px rgba(0, 112, 243, 0.12), 0px 4px 12px rgba(2, 132, 199, 0.08)",
        dropdown: "0px 8px 30px rgba(15, 23, 42, 0.12)",
        glow: "0 0 24px -4px rgba(0, 112, 243, 0.4)",
        "glow-purple": "0 0 24px -4px rgba(2, 132, 199, 0.4)",
      },
      borderRadius: {
        card: "16px",
        button: "8px",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0070f3 0%, #0284c7 100%)",
        "gradient-brand-light": "linear-gradient(135deg, rgba(0,112,243,0.08) 0%, rgba(2,132,199,0.08) 100%)",
        "gradient-brand-subtle": "linear-gradient(135deg, rgba(0,112,243,0.03) 0%, rgba(2,132,199,0.03) 100%)",
        "gradient-hero-card": "linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 5s ease-in-out 1s infinite',
        'float-slow': 'float-slow 8s ease-in-out 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
