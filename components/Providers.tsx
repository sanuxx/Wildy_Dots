"use client";

import { MotionConfig } from "framer-motion";

/** Honour the visitor's "reduce motion" setting across every animation on the site. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
