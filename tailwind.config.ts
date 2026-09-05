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
          DEFAULT: "#b50a53",
          container: "#d72f6b",
          fixed: "#ffd9df",
          "fixed-dim": "#ffb1c2",
          "on-fixed": "#3f0018",
        },
        secondary: {
          DEFAULT: "#6f2be3",
          container: "#894cfd",
          fixed: "#eaddff",
          "fixed-dim": "#d2bcff",
        },
        tertiary: {
          DEFAULT: "#565c6c",
          container: "#6e7485",
          fixed: "#dde2f5",
          "fixed-dim": "#c1c6d9",
        },
        outline: {
          DEFAULT: "#8d7075",
          variant: "#e1bec4",
        },
        navy: "#1E2432",
        "on-surface": "#191c1f",
        "on-surface-variant": "#594045",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0px 4px 20px rgba(30, 36, 50, 0.05)",
        "card-hover": "0px 12px 32px rgba(111, 43, 227, 0.09), 0px 4px 12px rgba(181, 10, 83, 0.06)",
        dropdown: "0px 8px 30px rgba(30, 36, 50, 0.12)",
        glow: "0 0 24px -4px rgba(181, 10, 83, 0.35)",
        "glow-purple": "0 0 24px -4px rgba(111, 43, 227, 0.35)",
      },
      borderRadius: {
        card: "16px",
        button: "8px",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #b50a53 0%, #6f2be3 100%)",
        "gradient-brand-light": "linear-gradient(135deg, rgba(181,10,83,0.06) 0%, rgba(111,43,227,0.06) 100%)",
        "gradient-brand-subtle": "linear-gradient(135deg, rgba(181,10,83,0.03) 0%, rgba(111,43,227,0.03) 100%)",
        "gradient-hero-card": "linear-gradient(145deg, #ffffff 0%, #faf9fe 100%)",
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
