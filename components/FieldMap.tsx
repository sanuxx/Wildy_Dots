"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LMap, Marker } from "leaflet";

/**
 * The places named in the author's write-ups as where the photographs are made.
 * Coordinates are approximate park / tank centres.
 */
export const SPOTS = [
  { name: "Wilpattu", kind: "National Park", lat: 8.45, lng: 80.0, note: "My second home — five to six days every month for the past five years." },
  { name: "Kalawewa", kind: "Reservoir & wildlife reserve", lat: 8.05, lng: 80.5, note: "My favourite for tuskers: herds gather on the dry tank bed from April to August. Home of Project Kalawewa." },
  { name: "Minneriya", kind: "National Park", lat: 8.03, lng: 80.86, note: "One of the finest places in Sri Lanka to photograph the tuskers." },
  { name: "Kaudulla", kind: "National Park", lat: 8.16, lng: 80.91, note: "Tuskers and herds follow the water here through the dry season." },
  { name: "Wasgamuwa", kind: "National Park", lat: 7.72, lng: 80.96, note: "Wild, quiet country and some of the island's great tuskers." },
  { name: "Udawalawe", kind: "National Park", lat: 6.44, lng: 80.89, note: "Open grassland and reliable elephant sightings in the south." },
  // The write-up spells this "Galigamuwa"; placed at Galgamuwa (a known elephant area). Adjust if a different place was meant.
  { name: "Galigamuwa", kind: "Elephant country", lat: 8.0, lng: 80.27, note: "Another favourite place to follow the tuskers." },
];

const ISLAND: [[number, number], [number, number]] = [
  [5.85, 79.55],
  [9.9, 82.0],
];

export default function FieldMap() {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const pins = useRef<Marker[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const fly = (i: number) => {
    setActive(i);
    const s = SPOTS[i];
    map.current?.flyTo([s.lat, s.lng], 9.4, { duration: 1.5 });
  };
  const reset = () => {
    setActive(null);
    map.current?.flyToBounds(ISLAND, { duration: 1.4, padding: [24, 24] });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;

      const m = L.map(el.current, {
        zoomControl: false,
        scrollWheelZoom: false, // never hijack page scroll; click the map to enable
        dragging: !L.Browser.mobile,
        minZoom: 7,
        maxZoom: 12,
        zoomSnap: 0.25,
        maxBounds: [
          [4.4, 77.8],
          [11.2, 83.8],
        ],
      });
      // OpenStreetMap standard tiles (no API key). For heavy production traffic, swap this URL for a
      // hosted provider such as MapTiler or Stadia Maps (see README).
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(m);
      L.control.zoom({ position: "bottomright" }).addTo(m);
      m.fitBounds(ISLAND, { padding: [24, 24] });
      m.on("click", () => m.scrollWheelZoom.enable());
      m.on("mouseout", () => m.scrollWheelZoom.disable());
      // zoomed right out the labels would collide, so show just the dots until you zoom in / hover / select
      const sync = () => el.current?.classList.toggle("wd-compact", m.getZoom() < 8.6);
      m.on("zoomend", sync);
      sync();

      SPOTS.forEach((s, i) => {
        const icon = L.divIcon({
          className: "wd-pin-wrap",
          iconSize: [0, 0],
          html: `<div class="wd-pin-in" style="--d:${0.5 + i * 0.16}s"><span class="wd-pin-pulse"></span><span class="wd-pin-dot"></span><span class="wd-pin-label">${s.name}</span></div>`,
        });
        const mk = L.marker([s.lat, s.lng], { icon, riseOnHover: true, title: s.name }).addTo(m);
        mk.on("click", () => {
          setActive(i);
          m.flyTo([s.lat, s.lng], 9.4, { duration: 1.5 });
        });
        pins.current.push(mk);
      });
      map.current = m;
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      pins.current = [];
    };
  }, []);

  // reflect selection / hover on the pins
  useEffect(() => {
    pins.current.forEach((mk, i) => {
      const e = mk.getElement();
      if (!e) return;
      e.classList.toggle("is-active", i === active);
      e.classList.toggle("is-hover", i === hover && i !== active);
    });
  }, [active, hover]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      {/* destinations */}
      <ul className="order-2 grid gap-3 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
        {SPOTS.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.name}>
              <button
                onClick={() => fly(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                aria-pressed={on}
                className={`w-full rounded-[1.5rem] px-5 py-4 text-left transition-all duration-500 ${on ? "soft-inset" : "soft-sm hover:-translate-y-0.5"}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-semibold tabular-nums transition-colors ${
                      on ? "bg-accent text-cream" : "bg-ink-2 text-accent"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-[1.35rem] leading-tight">{s.name}</span>
                    <span className="label block !text-[0.74rem]">{s.kind}</span>
                  </span>
                </span>
                <span
                  className={`grid transition-all duration-500 ${on ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  aria-hidden={!on}
                >
                  <span className="overflow-hidden text-[0.9rem] leading-relaxed text-mute">{s.note}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* the live map */}
      <div className="soft-inset order-1 rounded-[2rem] p-2.5 lg:order-2 md:rounded-[2.5rem] md:p-3">
        <div className="relative overflow-hidden rounded-[1.6rem] md:rounded-[2.1rem]">
          <div ref={el} className="wd-map h-[62svh] min-h-[420px] w-full" data-lenis-prevent />
          <button
            onClick={reset}
            className="soft-sm absolute left-4 top-4 z-[500] rounded-full px-4 py-2.5 text-[0.8rem] font-semibold"
          >
            Whole island
          </button>
          <p className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-full bg-ink/85 px-3.5 py-1.5 text-[0.74rem] font-medium text-mute backdrop-blur">
            Select the map to zoom with your scroll wheel
          </p>
        </div>
      </div>
    </div>
  );
}
