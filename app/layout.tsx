import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { DesktopNotice } from "@/components/sections/desktop-notice";
import { Nav } from "@/components/sections/nav";
import { fontBody, fontDisplay, fontNav } from "@/lib/fonts";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";
import "lenis/dist/lenis.css";

export const metadata: Metadata = {
  title: {
    default: "SwingRush",
    template: "%s | SwingRush",
  },
  description: "Premium swing dance experiences across cities.",
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
  const isDraftMode = (await draftMode()).isEnabled;

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
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
