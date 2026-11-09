"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { allPhotos, categories, frameSizes, framingShots, rs, type Img } from "@/lib/data";
import NextImage from "next/image";

/**
 * Frame studio. Choose a photograph, frame colour, glass, orientation and size, and see it
 * at true scale on a wall above a sofa — or close up, where the glass catches the light.
 */

const COLORS = {
  Black: { frame: "#141210", edge: "#3a3631", swatch: "#1d1b18" },
  Brown: { frame: "#4a2f1d", edge: "#7a5233", swatch: "#6b4428" },
} as const;
type ColorName = keyof typeof COLORS;


/* photographs on offer: the priced collections only (the price list excludes these two) */
const EXCLUDED = new Set(["wildy-dots-exclusive", "rhythms-of-tranquility"]);
const POOL = categories.filter((c) => !EXCLUDED.has(c.slug)).flatMap((c) => allPhotos(c).map((p) => ({ p, c })));
const STARTERS = categories
  .filter((c) => !EXCLUDED.has(c.slug) && allPhotos(c).length)
  .map((c) => {
    const ph = allPhotos(c);
    return { p: ph[Math.floor(ph.length * 0.35)], c };
  });

/* the room photograph, measured in its own pixels */
const ROOM = {
  src: "/img/room/armchair-wall.webp",
  w: 736,
  h: 1104,
  chairIn: 32, // the armchair is taken as ~32 in wide…
  chairLeft: 225, // …spanning these x positions in the photo
  chairRight: 668,
  chairTop: 560, // top of the chair back
  gapIn: 4, // gap between chair back and frame bottom
};
const ROOM_PPI = (ROOM.chairRight - ROOM.chairLeft) / ROOM.chairIn; // photo pixels per inch

export default function FramePicker() {
  const [pick, setPick] = useState(STARTERS[0]);
  const [color, setColor] = useState<ColorName>("Black");
  const [glass, setGlass] = useState<"nonReflective" | "normal">("nonReflective");
  const [size, setSize] = useState(2);
  const [orient, setOrient] = useState<"landscape" | "portrait">(pick.p.w >= pick.p.h ? "landscape" : "portrait");
  const [view, setView] = useState<"wall" | "close">("wall");

  const s = frameSizes[size];
  const price = glass === "normal" ? s.normal : s.nonReflective;
  const [fw, fh] = orient === "landscape" ? [s.h, s.w] : [s.w, s.h]; // inches
  const shots = framingShots.filter((f) => f.color === color);
  const glassLabel = glass === "normal" ? "normal glass" : "non-reflective glass";

  const choose = (x: (typeof STARTERS)[number]) => {
    setPick(x);
    setOrient(x.p.w >= x.p.h ? "landscape" : "portrait");
  };
  const surprise = () => choose(POOL[Math.floor(Math.random() * POOL.length)]);

  const enquiry = `${pick.p.title ?? pick.c.title} — framed print, ${s.size} in (${orient}), ${color.toLowerCase()} frame, ${glassLabel} (${rs(price)})`;

  return (
    <div className="space-y-12">
      {/* 1 · choose a photograph */}
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Step 1</p>
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)]">Choose a photograph</h2>
          </div>
          <button onClick={surprise} className="hm-btn hm-btn-ghost">
            <span aria-hidden>⟳</span> Surprise me
          </button>
        </div>
        <ul className="noscroll -mx-1 flex gap-3 overflow-x-auto px-1 pb-2" aria-label="Photographs">
          {[pick, ...STARTERS.filter((x) => x.p.src !== pick.p.src)].slice(0, 10).map((x) => {
            const on = x.p.src === pick.p.src;
            return (
              <li key={x.p.src} className="shrink-0">
                <button
                  onClick={() => choose(x)}
                  aria-pressed={on}
                  aria-label={x.p.title ?? x.c.title}
                  className={`relative block h-24 w-36 overflow-hidden rounded-xl transition-all duration-300 ${
                    on ? "ring-2 ring-[#c6ebc4] ring-offset-2 ring-offset-[#0f1110]" : "opacity-60 ring-1 ring-white/10 hover:opacity-100"
                  }`}
                >
                  <Image src={x.p.src} alt="" fill sizes="144px" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[0.9rem] text-mute">
          <span className="font-semibold text-bone">{pick.p.title}</span> · {pick.c.title}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14">
        {/* 2 · the stage */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Segmented
              label="Preview"
              value={view}
              onChange={(v) => setView(v as "wall" | "close")}
              options={[
                { v: "wall", l: "On the wall" },
                { v: "close", l: "Close up" },
              ]}
            />
          </div>

          <div
            className="relative mx-auto overflow-hidden rounded-[1.75rem] ring-1 ring-white/10"
            style={view === "wall" ? { width: `min(100%, calc(min(80vh, 820px) * ${ROOM.w / ROOM.h}))` } : undefined}
          >
            <AnimatePresence mode="wait" initial={false}>
              {view === "wall" ? (
                <motion.div key="wall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <WallScene img={pick.p} fw={fw} fh={fh} color={color} glass={glass} />
                </motion.div>
              ) : (
                <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <CloseUp img={pick.p} fw={fw} fh={fh} color={color} glass={glass} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-3 text-[0.85rem] text-mute">
            {view === "wall"
              ? `Shown approximately to scale: a ${s.size} in frame above an armchair about 32 in wide.`
              : glass === "normal"
                ? "Move your cursor over the frame — normal glass catches the light."
                : "Move your cursor over the frame — non-reflective glass keeps the photograph clear."}
          </p>
        </div>

        {/* 3 · options + price */}
        <div className="space-y-7">
          <div>
            <p className="eyebrow mb-2">Step 2</p>
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)]">Make it yours</h2>
          </div>

          <Field label="Orientation">
            <Segmented
              label="Orientation"
              value={orient}
              onChange={(v) => setOrient(v as "landscape" | "portrait")}
              options={[
                { v: "landscape", l: "Landscape" },
                { v: "portrait", l: "Portrait" },
              ]}
            />
          </Field>

          <Field label="Frame colour">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(COLORS) as ColorName[]).map((c) => (
                <Chip key={c} on={c === color} onClick={() => setColor(c)}>
                  <span className="mr-2.5 inline-block h-4 w-4 rounded-full ring-2 ring-white/20" style={{ background: COLORS[c].swatch }} />
                  {c}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Glass">
            <div className="flex flex-wrap gap-2">
              <Chip on={glass === "nonReflective"} onClick={() => setGlass("nonReflective")}>Non-reflective</Chip>
              <Chip on={glass === "normal"} onClick={() => setGlass("normal")}>Normal</Chip>
            </div>
          </Field>

          <Field label="Size (inches)">
            <div className="grid grid-cols-5 gap-2">
              {frameSizes.map((f, i) => {
                const on = i === size;
                const [iw, ih] = orient === "landscape" ? [f.h, f.w] : [f.w, f.h];
                return (
                  <button
                    key={f.size}
                    onClick={() => setSize(i)}
                    aria-pressed={on}
                    aria-label={`${f.size} inch`}
                    className={`flex flex-col items-center justify-end gap-2 rounded-xl px-1 pb-2.5 pt-3 transition-all ${
                      on ? "soft-inset text-white" : "glass text-bone/70 hover:text-bone"
                    }`}
                  >
                    <span className="flex h-12 items-end">
                      <span
                        className={`block rounded-[2px] border-2 transition-colors ${on ? "border-[#c6ebc4] bg-[#c6ebc4]/15" : "border-white/30"}`}
                        style={{ width: iw * 1.25, height: ih * 1.25 }}
                      />
                    </span>
                    <span className="text-[0.78rem] font-semibold tabular-nums">{f.size}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* summary */}
          <div className="soft rounded-[1.5rem] p-6">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-mute">Your framed print</p>
            <Price value={price} />
            <ul className="mt-4 space-y-1.5 text-[0.92rem] text-mute">
              <li><span className="text-bone">{pick.p.title}</span></li>
              <li>{s.size} in · {orient} · {color.toLowerCase()} frame · {glassLabel}</li>
            </ul>
            <Link href={`/contact?photo=${encodeURIComponent(enquiry)}`} className="hm-btn hm-btn-primary mt-6 w-full justify-center">
              Enquire about this print <span aria-hidden>→</span>
            </Link>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-mute">
              Custom-made frames and sizes are available on pre-order.
            </p>
          </div>
        </div>
      </div>

      {/* real mock-ups */}
      {shots.length > 0 && (
        <div>
          <p className="eyebrow mb-5">The {color.toLowerCase()} frame, photographed</p>
          <div className="noscroll flex gap-4 overflow-x-auto pb-2">
            {shots.map((f) => (
              <div key={f.src} className="relative h-64 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ aspectRatio: `${f.w}/${f.h}` }}>
                <Image src={f.src} alt={`${color} frame example`} fill sizes="400px" placeholder={f.blur ? "blur" : "empty"} blurDataURL={f.blur} className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── the framed print itself (shared by both views) ───────── */
function FramedPrint({
  img,
  color,
  moulding,
  children,
}: {
  img: Img;
  color: ColorName;
  moulding: number; // px
  children?: React.ReactNode;
}) {
  const c = COLORS[color];
  return (
    <div
      className="relative h-full w-full"
      style={{
        background: `linear-gradient(135deg, ${c.edge}, ${c.frame} 40%, ${c.frame} 60%, ${c.edge})`,
        padding: moulding,
        boxShadow: `0 ${moulding * 2}px ${moulding * 4}px -${moulding}px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.08)`,
        transition: "background 0.5s",
      }}
    >
      <div className="relative h-full w-full bg-[#f4efe4] shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]" style={{ padding: "8%" }}>
        <div className="relative h-full w-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]">
          <Image src={img.src} alt="" fill sizes="600px" className="object-cover" />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───────── on-the-wall scene: the room photograph, with the frame hung to scale ───────── */
function WallScene({ img, fw, fh, color, glass }: { img: Img; fw: number; fh: number; color: ColorName; glass: "nonReflective" | "normal" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(500);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // frame geometry in photo pixels, centred over the chair, hanging just above its back
  const pw = fw * ROOM_PPI;
  const ph = fh * ROOM_PPI;
  const cx = (ROOM.chairLeft + ROOM.chairRight) / 2;
  const bottom = ROOM.chairTop - ROOM.gapIn * ROOM_PPI;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const spring = { type: "spring", stiffness: 120, damping: 20 } as const;
  const scale = W / ROOM.w; // screen px per photo px

  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: `${ROOM.w} / ${ROOM.h}` }}>
      <NextImage src={ROOM.src} alt="A living room wall with an armchair, side table and vase" fill priority sizes="(min-width:1024px) 520px, 100vw" className="object-cover" />

      <motion.div
        className="absolute"
        initial={false}
        animate={{ left: pct(cx - pw / 2, ROOM.w), top: pct(bottom - ph, ROOM.h), width: pct(pw, ROOM.w), height: pct(ph, ROOM.h) }}
        transition={spring}
      >
        {/* shadow cast on the wall — the sunlight comes from the upper left */}
        <div className="absolute inset-0 translate-x-[4%] translate-y-[4%] bg-black/40 blur-[8px]" aria-hidden />
        <FramedPrint img={img} color={color} moulding={Math.max(2, 1.1 * ROOM_PPI * scale)}>
          {glass === "normal" && (
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(118deg, transparent 30%, rgba(255,255,255,0.3) 45%, transparent 58%)" }} />
          )}
        </FramedPrint>
      </motion.div>
    </div>
  );
}

/* ───────── close up: 3D tilt, and glare that follows the cursor ───────── */
function CloseUp({ img, fw, fh, color, glass }: { img: Img; fw: number; fh: number; color: ColorName; glass: "nonReflective" | "normal" }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotY = useTransform(sx, [0, 1], [-12, 12]);
  const rotX = useTransform(sy, [0, 1], [9, -9]);
  const glareX = useTransform(sx, [0, 1], ["-40%", "40%"]);
  const glareO = useTransform(sx, [0, 0.5, 1], [0.55, 0.9, 0.55]);

  // fit the frame inside the stage, keeping its proportions
  const box = 380;
  const k = box / Math.max(fw, fh);

  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#2a312d,#0f1311_75%)]"
      style={{ perspective: 1100 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <motion.div
        animate={{ width: fw * k, height: fh * k }}
        initial={false}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="max-h-[78%] max-w-[78%]"
      >
        <FramedPrint img={img} color={color} moulding={16}>
          {glass === "normal" ? (
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-[200%]"
              style={{
                x: glareX,
                opacity: glareO,
                background: "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.7) 47%, rgba(255,255,255,0.22) 53%, transparent 60%)",
              }}
            />
          ) : (
            <div className="pointer-events-none absolute inset-0 bg-white/[0.03]" />
          )}
        </FramedPrint>
      </motion.div>
      <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl" />
    </div>
  );
}

/* ───────── small pieces ───────── */
function Price({ value }: { value: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = animate(prev.current, value, {
      duration: 0.7,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => (el.textContent = rs(Math.round(v / 10) * 10)),
    });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return (
    <p ref={ref} className="font-display mt-2 whitespace-nowrap text-[clamp(2.4rem,4vw,3.4rem)] tabular-nums" aria-live="polite">
      {rs(value)}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[0.88rem] font-semibold">{label}</p>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center px-5 py-3 text-[0.92rem] font-medium transition-colors ${
        on ? "soft-inset font-semibold text-white" : "glass text-bone/70 hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div className="glass inline-flex rounded-xl p-1" role="group" aria-label={label}>
      {options.map((o) => {
        const on = o.v === value;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            aria-pressed={on}
            className="relative rounded-lg px-4 py-2 text-[0.88rem] font-medium"
          >
            {on && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-lg bg-white/12 ring-1 ring-white/15" />}
            <span className={`relative ${on ? "text-white" : "text-bone/60"}`}>{o.l}</span>
          </button>
        );
      })}
    </div>
  );
}
