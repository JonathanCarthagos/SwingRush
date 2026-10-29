import { Footer } from "@/components/sections/footer";

export default function SiteTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
      <Footer />
    </div>
  );
}
