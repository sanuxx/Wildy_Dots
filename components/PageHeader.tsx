import Image from "next/image";
import { landing } from "@/lib/data";
import { MaskLines, Reveal } from "./motion";

/** Full-bleed page opening in the same language as the home hero. */
export default function PageHeader({
  eyebrow,
  lines,
  intro,
  bg = 0,
  src,
}: {
  eyebrow: string;
  lines: string[];
  intro?: string;
  bg?: number;
  src?: string;
  /** accepted for backwards compatibility */
  colors?: [string, string];
}) {
  const img = src ?? landing[bg % landing.length].src;
  return (
    <section className="relative flex min-h-[72svh] items-end overflow-hidden bg-[#0c0e0d] text-white">
      <Image src={img} alt="" fill priority sizes="100vw" className="kenburns object-cover" />
      {/* the large originals are black & white: give them the same soft colour mood as the home hero */}
      {!src && <div className="absolute inset-0" style={{ background: "#b08a52", mixBlendMode: "color", opacity: 0.32 }} />}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(14,16,15,0.94) 0%, rgba(14,16,15,0.66) 42%, rgba(14,16,15,0.18) 100%)" }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f1110] to-transparent" />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-16 pt-36 md:px-12 md:pb-20">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
        </Reveal>
        <MaskLines as="h1" lines={lines} className="font-display max-w-5xl text-[clamp(2.8rem,7vw,6.6rem)] !leading-[0.98] text-white" delay={0.1} />
        {intro && (
          <Reveal delay={0.4}>
            <p className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-white/80">{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
