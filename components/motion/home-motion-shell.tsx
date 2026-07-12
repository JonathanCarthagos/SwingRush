"use client";

import { SmoothScrollLayout } from "@/components/motion/smooth-scroll-layout";

export interface HomeMotionShellProps {
  children: React.ReactNode;
}

export function HomeMotionShell({ children }: HomeMotionShellProps) {
  return <SmoothScrollLayout>{children}</SmoothScrollLayout>;
}
