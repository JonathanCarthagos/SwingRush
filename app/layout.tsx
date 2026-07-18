import type { Metadata, Viewport } from "next";

import { DesktopNotice } from "@/components/sections/desktop-notice";
import { Nav } from "@/components/sections/nav";
import { fontBody, fontDisplay, fontNav } from "@/lib/fonts";

import "./globals.css";

const SITE_URL = "https://swingrush.vercel.app";

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

export default async function RootLayout({
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
        <div className="flex min-h-full flex-1 flex-col md:hidden">
          <Nav />
          {children}
        </div>
        <DesktopNotice />
      </body>
    </html>
  );
}
