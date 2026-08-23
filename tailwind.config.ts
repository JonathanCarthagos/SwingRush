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
        // Approved mobile type scale. Tablet and desktop overrides live on
        // their components so these mobile endpoints remain stable.
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
        // Challenges tablet scale: 768px -> 1280px. These tokens are only
        // consumed behind the tablet media query so the approved mobile type
        // scale remains untouched.
        "challenge-title-tablet": [
          "clamp(4rem, calc(2.96875rem + 2.1484375vw), 4.6875rem)",
          { lineHeight: "0.85" },
        ],
        "challenge-copy-tablet": [
          "clamp(1.125rem, calc(0.75rem + 0.78125vw), 1.375rem)",
          { lineHeight: "1.3" },
        ],
        "challenge-body-tablet": [
          "clamp(1.0625rem, calc(0.78125rem + 0.5859375vw), 1.25rem)",
          { lineHeight: "1.3" },
        ],
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
        // Tablet interpolation: 32px at 768px -> 48px at 1280px.
        "tablet-gutter": "clamp(2rem, calc(0.5rem + 3.125vw), 3rem)",
        "tablet-content": "72rem",
        "challenge-tablet-media": "56rem",
        "challenge-tablet-copy": "48rem",
        "challenge-tablet-card-gap": "clamp(1.5rem, 3.125vw, 2.5rem)",
        "challenge-tablet-section-gap":
          "clamp(4.5rem, calc(0.75rem + 7.8125vw), 7rem)",
        "challenge-tablet-pt":
          "clamp(5rem, calc(2rem + 6.25vw), 7rem)",
        "challenge-tablet-pb":
          "clamp(6rem, calc(1.5rem + 9.375vw), 9rem)",
        // Section interpolation: 455px at 768px -> 600px at 1280px.
        "tablet-band":
          "clamp(28.4375rem, calc(14.84375rem + 28.3203125vw), 37.5rem)",
        "desktop-gutter": "3.875rem",
        "desktop-content": "80.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
