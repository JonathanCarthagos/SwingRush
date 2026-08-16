import { draftMode } from "next/headers";

import { DesktopNotice } from "@/components/sections/desktop-notice";
import { Nav } from "@/components/sections/nav";
import { cn } from "@/lib/utils";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <div
        className={cn(
          "flex min-h-full flex-1 flex-col",
          isDraftMode
            ? "mx-auto w-full max-w-[25.125rem]"
            : "min-[480px]:hidden",
        )}
      >
        <Nav />
        {children}
      </div>
      {isDraftMode ? null : <DesktopNotice />}
    </>
  );
}
