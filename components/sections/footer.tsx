import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";

import {
  FooterSocialIcon,
  type FooterSocialIconName,
} from "@/components/ui/footer-social-icon";
import { cn } from "@/lib/utils";

const footerVariants = cva(
  "flex w-full flex-col items-center gap-5 pt-[1.5rem] pr-2 pb-4 pl-2.5 min-[768px]:gap-[clamp(1.25rem,calc(0.3125rem+1.953125vw),1.875rem)] min-[768px]:px-[clamp(0.625rem,calc(-4.25rem+10.15625vw),3.875rem)] min-[768px]:pt-[clamp(1.5rem,3.125vw,2.5rem)] min-[768px]:pb-[clamp(1rem,calc(-1.25rem+4.6875vw),2.5rem)] min-[1280px]:gap-[1.875rem] min-[1280px]:px-desktop-gutter min-[1280px]:py-10",
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

const legalLinkClass =
  "font-nav text-[0.875rem] uppercase leading-[1.3] tracking-nav focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current min-[768px]:text-[clamp(0.875rem,calc(0.125rem+1.5625vw),1.375rem)] min-[1280px]:text-footer-nav-desktop";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

const socialLinks = [
  { name: "facebook", label: "Facebook", href: "#" },
  { name: "instagram", label: "Instagram", href: "#" },
  { name: "tiktok", label: "TikTok", href: "#" },
  { name: "youtube", label: "YouTube", href: "#" },
] as const satisfies ReadonlyArray<{
  name: FooterSocialIconName;
  label: string;
  href: string;
}>;

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {}

export function Footer({ className, variant, ...props }: FooterProps) {
  return (
    <footer className={cn(footerVariants({ variant, className }))} {...props}>
      <div className="flex items-center justify-center gap-[0.36025rem]">
        {socialLinks.map(({ name, label, href }) => (
          <a
            key={name}
            href={href}
            aria-label={label}
            className="inline-flex size-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <FooterSocialIcon name={name} />
          </a>
        ))}
      </div>

      <nav
        aria-label="Footer"
        className="flex items-center justify-center gap-5 min-[768px]:gap-[clamp(1.25rem,calc(-1.46875rem+5.6640625vw),3.0625rem)] min-[1280px]:gap-12.25"
      >
        {legalLinks.map((link) => (
          <Link key={link.href} href={link.href} className={legalLinkClass}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

export { footerVariants };
