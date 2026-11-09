"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Headline whose lines slide up out of a mask. */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
  as: Tag = "h2",
  grad = false,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
  /** fill the lettering with the brand gradient (applied per animated line) */
  grad?: boolean;
}) {
  const M = motion[Tag];
  return (
    <M className={className} initial="h" whileInView="v" viewport={{ once: true, margin: "-10% 0px" }}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={grad ? "block text-grad" : "block"}
            variants={{ h: { y: "110%" }, v: { y: 0 } }}
            transition={{ duration: 1.1, delay: delay + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

function Word({ w, range, p }: { w: string; range: [number, number]; p: MotionValue<number> }) {
  const o = useTransform(p, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block">
      {w}
    </motion.span>
  );
}

/** Text that lights up word by word as you scroll through it. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} w={w} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, {
      duration: 2.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString("en-US") + suffix),
    });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/** Parallax wrapper: moves children slower/faster than scroll. */
export function Parallax({
  children,
  amount = 80,
  className = "",
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: 1.2 }} className="relative h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
