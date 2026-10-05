import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
