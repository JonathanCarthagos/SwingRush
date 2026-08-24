import { draftMode } from "next/headers";

import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <div
      className={
        isDraftMode
          ? "mx-auto flex min-h-full w-full max-w-[25.125rem] flex-1 flex-col"
          : "flex min-h-full flex-1 flex-col"
      }
    >
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
