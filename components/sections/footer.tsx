import { cva, type VariantProps } from "class-variance-authority";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

import { LogoMark } from "@/components/ui/logo-mark";
import { cn } from "@/lib/utils";

const footerVariants = cva(
  "flex w-full flex-col items-start gap-[3.6875rem] pl-2.5 pr-2 py-8",
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
      <nav aria-label="Footer" className="flex w-full flex-col gap-1">
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

      <div className="flex w-full flex-col gap-11">
        <LogoMark className="h-[5.4219rem] w-[7.1848rem]" />
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
