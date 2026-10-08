import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-3 focus:font-body focus:text-[1.0625rem] focus:text-black"
      >
        Skip to content
      </a>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
