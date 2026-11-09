"use client";

import { useState } from "react";
import type { Theme } from "@/lib/data";
import PhotoGrid from "./PhotoGrid";

export default function RhythmsTabs({ themes }: { themes: Theme[] }) {
  const [t, setT] = useState(0);
  return (
    <>
      <div className="noscroll mb-12 flex gap-3 overflow-x-auto pb-2">
        {themes.map((th, i) => (
          <button
            key={th.name}
            onClick={() => setT(i)}
            className={`shrink-0 px-5 py-3 text-[0.9rem] font-medium transition-colors ${
              i === t ? "bg-copper font-semibold" : "glass text-bone/70 hover:text-bone"
            }`}
          >
            {th.name} <span className="ml-2 opacity-60">{th.photos.length}</span>
          </button>
        ))}
      </div>
      <PhotoGrid photos={themes[t].photos} />
    </>
  );
}
