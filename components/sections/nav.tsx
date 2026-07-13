"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LogoLockup } from "@/components/ui/logo-lockup";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Challenges", href: "/challenges" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
];

const BAR_W = "w-[23.907px]";
const BAR_H = "h-[4.781px]";
const BAR_GAP = "gap-[4.667px]";
// 4.781px bar + 4.667px gap — distância do centro top/bottom ao centro middle (Figma).
const BAR_OFFSET = "9.448px";

const barClass = `block shrink-0 ${BAR_H} ${BAR_W} origin-center bg-white`;

// Curva drawer (Ionic) — desaceleração longa, sensação premium e fluida.
const MOTION_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOTION_EASE_IN: [number, number, number, number] = [0.76, 0, 0.24, 1];

const panelEnter: Transition = { duration: 0.55, ease: MOTION_EASE };
const panelExit: Transition = { duration: 0.38, ease: MOTION_EASE_IN };
const iconTransition: Transition = { duration: 0.42, ease: MOTION_EASE };
const linkEnter: Transition = { duration: 0.42, ease: MOTION_EASE };
const linkExit: Transition = { duration: 0.2, ease: MOTION_EASE_IN };

const linkContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      // Links começam enquanto o painel ainda desacelera (overlap, não pausa seca).
      delayChildren: 0.18,
      staggerChildren: 0.07,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const linkContainerReduced: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
  exit: {},
};

const linkItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: linkEnter,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: linkExit,
  },
};

const linkItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const reduce = useReducedMotion();

  const iconMotion = reduce ? { duration: 0 } : iconTransition;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-nav-bar-px pb-nav-bar-py pt-[max(0.8333125rem,env(safe-area-inset-top))] text-white",
          isOpen ? "bg-brand" : "bg-transparent",
        )}
      >
        <div className="flex h-nav-bar-inner-h items-center justify-between">
          <Link href="/" aria-label="SwingRush home" onClick={() => setIsOpen(false)}>
            <LogoLockup className="h-nav-logo-h w-auto" />
          </Link>

          <motion.button
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((value) => !value)}
            className="-my-[calc(1.041625rem/2)] flex size-11 shrink-0 items-center justify-center"
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.12, ease: MOTION_EASE }}
          >
            <span
              className={`relative flex ${BAR_W} h-[23.677px] flex-col ${BAR_GAP}`}
            >
              <motion.span
                className={barClass}
                initial={false}
                animate={{
                  y: isOpen ? BAR_OFFSET : 0,
                  rotate: isOpen ? 45 : 0,
                }}
                transition={iconMotion}
              />
              <motion.span
                className={barClass}
                initial={false}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.22, ease: MOTION_EASE }
                }
              />
              <motion.span
                className={barClass}
                initial={false}
                animate={{
                  y: isOpen ? `-${BAR_OFFSET}` : 0,
                  rotate: isOpen ? -45 : 0,
                }}
                transition={iconMotion}
              />
            </span>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-40 overflow-hidden bg-brand will-change-transform"
            initial={
              reduce
                ? { opacity: 0 }
                : { transform: "translate3d(0, -100%, 0)" }
            }
            animate={
              reduce ? { opacity: 1 } : { transform: "translate3d(0, 0, 0)" }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    transform: "translate3d(0, -100%, 0)",
                    transition: panelExit,
                  }
            }
            transition={reduce ? { duration: 0.2 } : panelEnter}
          >
            <motion.nav
              id="site-menu"
              aria-label="Main"
              className="flex h-full flex-col items-center justify-center gap-[0.834rem]"
              variants={reduce ? linkContainerReduced : linkContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={reduce ? linkItemReduced : linkItem}
                  className="list-none"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    translate="no"
                    className="notranslate block box-border max-w-[calc(100vw-2rem)] px-[0.08em] text-center font-display text-[clamp(3rem,13.6vw,4rem)] uppercase leading-[0.88] text-white"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
