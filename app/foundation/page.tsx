import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProjectExplorer, { type Pillar } from "@/components/ProjectExplorer";
import { Reveal } from "@/components/motion";
import { logos, projects, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Human Elephant Conflict Conservation Foundation",
  description:
    "Project Kalawewa: 5% of every Wildy Dots sale funds homes, repairs, scholarships and medical support for families affected by human–elephant conflict in Sri Lanka.",
  alternates: { canonical: "/foundation" },
};

/**
 * Photos kept off the public page: supplier receipts and handwritten cost sheets found in the project folders.
 * Remove entries from this set to show them again.
 */
const HIDDEN = new Set([
  "/img/foundation/house-01/1.webp",
  "/img/foundation/house-02/1.webp",
  "/img/foundation/house-02/3.webp",
  "/img/foundation/house-03/1.webp",
  "/img/foundation/house-05/1.webp",
  "/img/foundation/house-repair-01/1.webp",
  "/img/foundation/house-repair-02/4.webp",
  "/img/foundation/house-repair-03/4.webp",
  "/img/foundation/house-repair-04/4.webp",
]);

const group = (re: RegExp, label: (n: string) => string) =>
  projects
    .filter((x) => re.test(x.name))
    .map((x) => ({ name: x.name, label: label(x.name), photos: x.photos.filter((ph) => !HIDDEN.has(ph.src)) }))
    .filter((x) => x.photos.length);

const PILLARS: Pillar[] = [
  {
    key: "homes",
    title: "New cement houses",
    text: "Constructing basic cement houses to replace clay houses damaged in elephant confrontations.",
    unit: "homes",
    projects: group(/^House \d/, (n) => n.replace("House", "Home")),
  },
  {
    key: "repairs",
    title: "Repairing homes",
    text: "Repairing cement houses damaged in elephant confrontations.",
    unit: "repairs",
    projects: group(/Repair/, (n) => n.replace("House Repair", "Repair")),
  },
  {
    key: "scholarships",
    title: "Scholarships",
    text: "Scholarships for the children of those who were killed or disabled in elephant confrontations.",
    unit: "programme",
    projects: group(/Sholar/, () => "Scholarships"),
  },
  {
    key: "medical",
    title: "Medical & rations",
    text: "Supporting families with medical expenses and supplies following such incidents.",
    unit: "programme",
    projects: group(/Rations/, () => "Rations & medical supplies"),
  },
];

const homes = PILLARS[0].projects.length;
const repairs = PILLARS[1].projects.length;

const STORY = [
  {
    n: "01",
    t: "Why Kalawewa",
    p: [
      "With the start of my photography career seven years ago, the Tuskers of Sri Lanka became one of my favourites. Among the best places to see them — Kaudulla, Minneriya, Wasgamuwa, Udawalawa, Kalawewa and Galigamuwa — Kalawewa became my favourite.",
      "Herds migrate there in the dry season, when grasslands appear on the bed of the tank as the water falls, and the Tuskers follow them from April to August.",
    ],
  },
  {
    n: "02",
    t: "The conflict",
    p: [
      "Kalawewa is one of the smallest reserves in the country, and most of the migration routes run through human habitation.",
      "Direct confrontations happen every day, causing invaluable damage to both sides — to families and to the elephants.",
    ],
  },
  {
    n: "03",
    t: "Our response",
    p: [
      "With fellow photographers, we began collecting funds through our personal contacts to help the people affected by these confrontations.",
      "A Wildlife Ranger at the Kalawewa Wildlife Reserve helps identify, organise and monitor all the work and construction.",
    ],
  },
];

const TEAM = [
  { name: "Adheesha Salpitikorala", role: "Founder, Wildy Dots" },
  { name: "Nalin Kulathunga", role: "Wildlife photographer" },
  { name: "Kasun Perera", role: "Wildlife photographer" },
  { name: "Ananda Bandara", role: "Wildlife Ranger, Kalawewa Wildlife Reserve" },
];

const NAV = [
  { id: "overview", l: "Overview" },
  { id: "story", l: "The story" },
  { id: "team", l: "The team" },
  { id: "work", l: "Our work" },
  { id: "help", l: "How to help" },
];

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

function SectionTitle({ eyebrow, title, id, intro }: { eyebrow: string; title: string; id: string; intro?: string }) {
  return (
    <Reveal>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 id={id} className="font-display text-[clamp(2rem,4.2vw,3.6rem)]">{title}</h2>
      {intro && <p className="mt-4 max-w-2xl text-mute">{intro}</p>}
    </Reveal>
  );
}

export default function Foundation() {
  return (
    <>
      <PageHeader
        eyebrow="Human Elephant Conflict Conservation Foundation"
        lines={["Project Kalawewa"]}
        intro="Supporting families affected by human–elephant conflict in Sri Lanka. 5% of every Wildy Dots sale goes to the Fund."
        bg={3}
      />

      {/* in-page navigation */}
      <nav aria-label="On this page" className="sticky top-[4.6rem] z-30 border-y border-line bg-[#0f1110]/90 backdrop-blur-md">
        <ul className="noscroll mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-6 py-2 md:px-12">
          {NAV.map((n) => (
            <li key={n.id} className="shrink-0">
              <a href={`#${n.id}`} className="block rounded-lg px-4 py-2 text-[0.88rem] font-medium text-bone/70 transition-colors hover:bg-white/8 hover:text-white">
                {n.l}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1 · overview */}
      <section id="overview" className="mx-auto max-w-[1500px] scroll-mt-36 px-6 py-20 md:px-12 md:py-24" aria-labelledby="overview-title">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <Reveal className="h-full">
            <div className="soft flex h-full flex-col justify-between gap-8 rounded-[2rem] p-8 md:p-10">
              <div className="rounded-2xl bg-cream p-6">
                <Image src={logos.full.src} alt="Human Elephant Conflict Conservation Foundation logo" width={600} height={480} className="mx-auto w-full max-w-[320px]" />
              </div>
              <div>
                <h2 id="overview-title" className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)]">5% of every purchase</h2>
                <p className="mt-3 text-mute">
                  goes towards the Human Elephant Conflict Conservation Fund — helping the families who live alongside Kalawewa’s elephants, so that both people and elephants are safer.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid h-full grid-cols-2 gap-4">
              {[
                { v: "5%", l: "of every Wildy Dots sale goes to the Fund" },
                { v: String(homes), l: "new cement homes, replacing damaged clay houses" },
                { v: String(repairs), l: "damaged houses repaired" },
                { v: "Apr–Aug", l: "the season the herds and tuskers gather at Kalawewa" },
              ].map((s) => (
                <div key={s.l} className="soft flex flex-col justify-end rounded-[1.5rem] p-6 md:p-7">
                  <dt className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none">{s.v}</dt>
                  <dd className="mt-3 max-w-[16rem] text-[0.92rem] leading-snug text-mute">{s.l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* 2 · the story */}
      <section id="story" className="mx-auto max-w-[1500px] scroll-mt-36 px-6 pb-20 md:px-12 md:pb-24" aria-labelledby="story-title">
        <SectionTitle eyebrow="The story" id="story-title" title="Why this project exists" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STORY.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="soft h-full rounded-[1.75rem] p-7 md:p-8">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-[0.8rem] font-semibold tabular-nums text-[#c6ebc4] ring-1 ring-white/10">
                    {s.n}
                  </span>
                  <h3 className="font-display mt-6 text-[1.7rem]">{s.t}</h3>
                  {s.p.map((t, k) => (
                    <p key={k} className="mt-3 text-[0.98rem] leading-relaxed text-mute">{t}</p>
                  ))}
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal>
          <blockquote className="mt-10 border-l-2 border-[#c6ebc4] pl-6">
            <p className="font-display max-w-3xl text-[clamp(1.4rem,2.4vw,2rem)]">
              “In turn, we expect the hatred and anger towards the elephants to reduce, resulting in less harm to the elephant population.”
            </p>
            <footer className="mt-3 text-[0.9rem] text-mute">— Adheesha Salpitikorala</footer>
          </blockquote>
        </Reveal>
      </section>

      {/* 3 · team */}
      <section id="team" className="mx-auto max-w-[1500px] scroll-mt-36 px-6 pb-20 md:px-12 md:pb-24" aria-labelledby="team-title">
        <SectionTitle eyebrow="The team" id="team-title" title="The people behind it" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="soft flex h-full items-center gap-4 rounded-[1.5rem] p-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#a3d9a5] text-[1rem] font-semibold text-[#0f1a10]">
                    {initials(m.name)}
                  </span>
                  <span>
                    <span className="block font-semibold leading-tight">{m.name}</span>
                    <span className="mt-1 block text-[0.86rem] leading-snug text-mute">{m.role}</span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · the work */}
      <section id="work" className="scroll-mt-36 border-y border-line bg-ink-2 px-6 py-20 md:px-12 md:py-24" aria-labelledby="work-title">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="Our work"
            id="work-title"
            title="Four ways we help"
            intro="Choose an area to see the projects and photographs from the field. Select any photograph to view it larger."
          />
          <div className="mt-10">
            <ProjectExplorer pillars={PILLARS} />
          </div>
        </div>
      </section>

      {/* 5 · how to help */}
      <section id="help" className="mx-auto max-w-[1500px] scroll-mt-36 px-6 py-20 md:px-12 md:py-24" aria-labelledby="help-title">
        <SectionTitle eyebrow="How to help" id="help-title" title="Every contribution is welcome" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Buy a print",
              d: "5% of every photograph sold goes straight to the Fund.",
              cta: "Browse the collections",
              href: "/gallery",
            },
            {
              t: "Contribute directly",
              d: "To support Project Kalawewa with a contribution of your own, call us and we will explain how.",
              cta: `Call ${SITE.phone}`,
              href: SITE.phoneHref,
            },
            {
              t: "Visit the showroom",
              d: "See the prints in person at Marino Mall, Colombo 03, and ask us about the project.",
              cta: "Showroom details",
              href: "/showrooms",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08} className="h-full">
              <div className="soft flex h-full flex-col rounded-[1.75rem] p-7 md:p-8">
                <h3 className="font-display text-[1.6rem]">{c.t}</h3>
                <p className="mt-3 flex-1 text-mute">{c.d}</p>
                {c.href.startsWith("tel:") ? (
                  <a href={c.href} className={`hm-btn mt-7 self-start ${i === 1 ? "hm-btn-primary" : "hm-btn-ghost"}`}>{c.cta}</a>
                ) : (
                  <Link href={c.href} className={`hm-btn mt-7 self-start ${i === 1 ? "hm-btn-primary" : "hm-btn-ghost"}`}>{c.cta}</Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
