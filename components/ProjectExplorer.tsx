"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PhotoGrid from "./PhotoGrid";
import type { Img } from "@/lib/data";

export type Pillar = {
  key: string;
  title: string;
  text: string;
  unit: string; // e.g. "homes built"
  projects: { name: string; label: string; photos: Img[] }[];
};

/** Four areas of support → the individual projects in each → their photographs. */
export default function ProjectExplorer({ pillars }: { pillars: Pillar[] }) {
  const [pi, setPi] = useState(0);
  const [pj, setPj] = useState<number | "all">("all");
  const p = pillars[pi];
  const photos =
    pj === "all"
      ? p.projects.flatMap((x) => x.photos.map((ph, k) => ({ ...ph, title: `${x.label} · photo ${k + 1}` })))
      : p.projects[pj].photos.map((ph, k) => ({ ...ph, title: `${p.projects[pj].label} · photo ${k + 1}` }));

  return (
    <div>
      {/* the four areas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist" aria-label="Areas of support">
        {pillars.map((x, i) => {
          const on = i === pi;
          const cover = x.projects[0]?.photos[0];
          return (
            <button
              key={x.key}
              role="tab"
              aria-selected={on}
              onClick={() => {
                setPi(i);
                setPj("all");
              }}
              className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
                on ? "ring-2 ring-[#c6ebc4]" : "ring-1 ring-white/10 hover:ring-white/30"
              }`}
            >
              {cover && (
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className={`object-cover transition-all duration-500 ${on ? "opacity-45" : "opacity-20 group-hover:opacity-35"}`}
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-[#0f1110] via-[#0f1110]/70 to-[#0f1110]/30" />
              <span className="relative block">
                <span className={`text-[0.72rem] font-semibold tabular-nums tracking-[0.2em] ${on ? "text-[#c6ebc4]" : "text-white/50"}`}>0{i + 1}</span>
                <span className="mt-6 block text-[1.15rem] font-semibold leading-tight text-white md:text-[1.3rem]">{x.title}</span>
                <span className="mt-1 block text-[0.85rem] text-white/60">
                  {x.projects.length} {x.unit}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.key}
          role="tabpanel"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10"
        >
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h3 className="font-display text-[clamp(1.7rem,3vw,2.6rem)]">{p.title}</h3>
              <p className="mt-2 max-w-2xl text-mute">{p.text}</p>
            </div>
            <p className="text-[0.9rem] text-mute">
              {p.projects.length} {p.unit} · {photos.length} photographs
            </p>
          </div>

          {/* individual projects */}
          {p.projects.length > 1 && (
            <div className="noscroll mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Projects">
              {(["all", ...p.projects.map((_, k) => k)] as const).map((k) => {
                const on = k === pj;
                const label = k === "all" ? "All" : p.projects[k].label;
                return (
                  <button
                    key={String(k)}
                    onClick={() => setPj(k)}
                    aria-pressed={on}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-[0.88rem] font-medium transition-colors ${
                      on ? "bg-white/12 text-white ring-1 ring-white/20" : "text-bone/60 ring-1 ring-white/10 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <PhotoGrid key={`${p.key}-${pj}`} photos={photos} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
