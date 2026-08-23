import { cva, type VariantProps } from "class-variance-authority";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

import { LogoMark } from "@/components/ui/logo-mark";
import { cn } from "@/lib/utils";

const footerVariants = cva(
  "flex w-full flex-col items-start gap-[3.6875rem] pl-2.5 pr-2 py-8 min-[768px]:grid min-[768px]:min-h-[36rem] min-[768px]:grid-cols-2 min-[768px]:gap-x-16 min-[768px]:gap-y-0 min-[768px]:px-tablet-gutter min-[768px]:py-12 min-[1280px]:flex min-[1280px]:h-[46.1857rem] min-[1280px]:min-h-0 min-[1280px]:flex-row min-[1280px]:justify-between min-[1280px]:px-desktop-gutter min-[1280px]:py-[3.875rem]",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white",
        secondary: "bg-brand text-black",
        dark: "bg-black text-white",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const navLinkClass = "font-nav text-nav uppercase tracking-nav";

interface FooterLink {
  label: string;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const footerLinks: FooterLink[] = [
  {
    label: "Challenges",
    href: "/challenges",
    secondaryLabel: "Register Now",
    secondaryHref: "/challenges",
  },
  { label: "Locations", href: "/locations" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const socialLinks = [
  { Icon: SiFacebook, label: "Facebook", href: "#" },
  { Icon: SiInstagram, label: "Instagram", href: "#" },
  { Icon: SiTiktok, label: "TikTok", href: "#" },
  { Icon: SiYoutube, label: "YouTube", href: "#" },
];

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {}

export function Footer({ className, variant, ...props }: FooterProps) {
  return (
    <footer className={cn(footerVariants({ variant, className }))} {...props}>
      <nav aria-label="Footer" className="order-1 flex w-full flex-col gap-1 min-[768px]:order-2 min-[768px]:gap-3 min-[768px]:[&_a]:text-base min-[1280px]:hidden">
        {footerLinks.map((link) => (
          <div key={link.label} className="flex w-full items-center justify-between">
            <a href={link.href} className={navLinkClass}>
              {link.label}
            </a>
            {link.secondaryLabel && link.secondaryHref && (
              <a
                href={link.secondaryHref}
                className={cn(navLinkClass, "underline underline-offset-2")}
              >
                {link.secondaryLabel}
              </a>
            )}
          </div>
        ))}
      </nav>

      <nav aria-label="Footer desktop" className="order-2 hidden w-[31.5625rem] justify-end gap-10 min-[1280px]:flex">
        <div className="flex flex-1 flex-col gap-2.5">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className={navLinkClass}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="/challenges" className={cn(navLinkClass, "h-fit underline underline-offset-2")}>
          Register
        </a>
      </nav>

      <div className="flex w-full flex-col gap-11 min-[768px]:order-1 min-[768px]:h-full min-[768px]:justify-between min-[1280px]:h-[38.4375rem] min-[1280px]:w-[11.27475rem]">
        <LogoMark className="h-[5.4219rem] w-[7.1848rem] min-[768px]:h-auto min-[768px]:w-[clamp(8.5rem,14vw,10rem)] min-[1280px]:h-[8.5079rem] min-[1280px]:w-[11.27475rem]" />
        <div className="flex items-center gap-[1.3406rem]">
          {socialLinks.map(({ Icon, label, href }) => (
            <a key={label} href={href} aria-label={label}>
              <Icon className="size-7" aria-hidden="true" focusable="false" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export { footerVariants };
