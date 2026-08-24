import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const footerSocialIconLayers = {
  facebook: [
    {
      asset: "/icons/footer/facebook.svg",
      inset: "0 0 0.37% 0",
    },
  ],
  instagram: [
    {
      asset: "/icons/footer/instagram-outline.svg",
      inset: "0 0.06% 0.02% 0",
    },
    {
      asset: "/icons/footer/instagram-ring.svg",
      inset: "24.32%",
    },
    {
      asset: "/icons/footer/instagram-dot.svg",
      inset: "17.3% 17.3% 70.7% 70.7%",
    },
  ],
  tiktok: [
    {
      asset: "/icons/footer/tiktok.svg",
      inset: "0 6.25% 0 8.33%",
    },
  ],
  youtube: [
    {
      asset: "/icons/footer/youtube.svg",
      inset: "14.82% 0 14.84% 0",
    },
  ],
} as const;

export type FooterSocialIconName = keyof typeof footerSocialIconLayers;

interface FooterSocialIconProps {
  className?: string;
  name: FooterSocialIconName;
}

function getMaskStyle(asset: string, inset: string): CSSProperties {
  const mask = `url("${asset}")`;

  return {
    inset,
    maskImage: mask,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "100% 100%",
    WebkitMaskImage: mask,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
  };
}

export function FooterSocialIcon({ className, name }: FooterSocialIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative h-[1.82325rem] w-[1.769625rem] shrink-0 overflow-clip",
        className,
      )}
    >
      {footerSocialIconLayers[name].map(({ asset, inset }) => (
        <span
          key={asset}
          className="absolute bg-current"
          style={getMaskStyle(asset, inset)}
        />
      ))}
    </span>
  );
}
