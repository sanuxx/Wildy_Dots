"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { nav, landing, SITE } from "@/lib/data";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark italic ${className}`} style={{ letterSpacing: "-0.01em" }}>
      Wildy Dots<span className="text-accent">.</span>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // over the full-bleed home hero the wordmark turns light
  const onHero = pathname === "/" && !solid && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-4 py-3 transition-all duration-500 md:px-8 ${
          solid && !open ? "bg-ink/92 shadow-[0_10px_30px_-14px_var(--sh-d)] backdrop-blur-md" : ""
        }`}
      >
        <Link href="/" className={`relative z-[85] text-[1.7rem] leading-none transition-colors duration-500 ${onHero ? "text-cream" : "text-bone"}`} aria-label="Wildy Dots — home">
          <Wordmark />
        </Link>

        {/* floating pill navigation (desktop) */}
        <nav className="soft hidden items-center gap-1 rounded-full p-1.5 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[0.88rem] font-medium transition-all duration-300 ${
                isActive(n.href) ? "soft-inset text-accent" : "text-bone/70 hover:text-bone"
              }`}
            >
              {n.short}
            </Link>
          ))}
        </nav>

        <div className="relative z-[85] flex items-center gap-3">
          <a
            href={SITE.phoneHref}
            className="bg-copper hidden px-5 py-3 text-[0.82rem] font-semibold md:inline-block"
          >
            {SITE.phone}
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="soft flex h-12 w-12 items-center justify-center rounded-full lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-[1.5px] w-full bg-bone transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-bone transition-all duration-500 ${open ? "top-1.5 opacity-0" : "top-1.5"}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-bone transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </header>

      {/* full-screen menu (mobile / tablet) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[75] overflow-hidden bg-ink lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          >
            <nav className="flex h-full flex-col justify-center gap-3 px-6 pt-16">
              {nav.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6 }}
                >
                  <Link
                    href={n.href}
                    className={`flex items-center justify-between rounded-3xl px-6 py-4 ${isActive(n.href) ? "soft-inset" : "soft-sm"}`}
                  >
                    <span className={`font-display text-3xl ${isActive(n.href) ? "text-accent" : ""}`}>{n.label}</span>
                    <span className="label">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
              <p className="label mt-4 text-center">{SITE.phone}</p>
            </nav>
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 overflow-hidden rounded-full opacity-60">
              <Image src={landing[0].src} alt="" fill sizes="300px" className="object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
