import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f92524",
          dark: "#920909",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        nav: ["var(--font-nav)", "monospace"],
      },
      fontSize: {
        // Fluid clamp(min, preferred, max), interpolated 375px -> 1440px viewport.
        // Desktop maxes are proportional estimates pending desktop Figma frames.
        hero: [
          "clamp(6.25rem, 4.7535rem + 0.399vw, 10.5rem)", // 100px -> 168px
          { lineHeight: "0.84" },
        ],
        h1: [
          "clamp(4rem, 3.1197rem + 0.2347vw, 6.5rem)", // 64px -> 104px
          { lineHeight: "1.05" },
        ],
        h2: [
          "clamp(3.125rem, 2.4648rem + 0.1761vw, 5rem)", // 50px -> 80px
          { lineHeight: "1.05" },
        ],
        nav: "0.9375rem",
      },
      letterSpacing: {
        // 0.03em matches Figma's true 3% tracking (was 0.51px / 0.45px at fixed sizes).
        body: "0.03em",
        nav: "0.03em",
      },
      spacing: {
        "gutter-x": "clamp(1rem, 0.2958rem + 0.1878vw, 3rem)", // 16px -> 48px
        "gutter-y": "clamp(3rem, 2.6479rem + 0.0939vw, 4rem)", // 48px -> 64px
        // Figma mobile nav bar (node 1126:1741)
        "nav-bar-h": "3.375rem", // 54px
        "nav-bar-py": "0.8333125rem", // 13.333px
        "nav-bar-px": "0.9791875rem", // 15.667px
        "nav-bar-inner-h": "1.708375rem", // 27.334px
        "nav-logo-h": "1.6789375rem", // 26.863px
        // Full fixed header height (safe-area + bar)
        "nav-offset":
          "calc(max(0.8333125rem, env(safe-area-inset-top)) + 1.708375rem + 0.8333125rem)",
      },
    },
  },
  plugins: [],
};

export default config;
