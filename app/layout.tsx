import type { Metadata, Viewport } from "next";

import { DesktopNotice } from "@/components/sections/desktop-notice";
import { Nav } from "@/components/sections/nav";
import { fontBody, fontDisplay, fontNav } from "@/lib/fonts";

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
