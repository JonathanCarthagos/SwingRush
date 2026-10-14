/**
 * Studio must stay full-bleed on every viewport. It sits outside the (site)
 * route group so the site nav never wraps it. DesktopNotice is not mounted.
 */
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-[100] h-dvh w-dvw overflow-hidden bg-black">
      {children}
    </div>
  );
}
