import type { Metadata, Viewport } from "next";

import { fontBody, fontDisplay, fontNav } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SwingRush",
    template: "%s | SwingRush",
  },
  description:
    "SwingRush is the world’s first arena golf gauntlet, blending one-of-a-kind skills challenges, team formats, and competitive social golf.",
  applicationName: "SwingRush",
  openGraph: {
    siteName: "SwingRush",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontNav.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        {children}
      </body>
    </html>
  );
}
