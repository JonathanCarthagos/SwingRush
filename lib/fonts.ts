import localFont from "next/font/local";

export const fontDisplay = localFont({
  src: "../public/fonts/owners-trial-xnarrow-black-italic.woff2",
  variable: "--font-display",
  weight: "800",
  style: "italic",
  display: "swap",
});

export const fontBody = localFont({
  src: [
    {
      path: "../public/fonts/forma-djr-text-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/forma-djr-text-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const fontNav = localFont({
  src: "../public/fonts/forma-djr-mono-regular.woff2",
  variable: "--font-nav",
  weight: "400",
  display: "swap",
});
