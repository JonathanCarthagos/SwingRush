import { LogoLockup } from "@/components/ui/logo-lockup";

export function DesktopNotice() {
  return (
    <div className="hidden min-h-dvh w-full flex-col items-center justify-center gap-6 bg-black px-8 text-center md:flex">
      <LogoLockup className="h-8 w-auto text-white" />
      <p className="max-w-md font-body text-base text-white/80">
        SwingRush is currently built mobile-first only. Tablet and desktop
        breakpoints are still in development — please view this site on a
        mobile device for now.
      </p>
    </div>
  );
}
