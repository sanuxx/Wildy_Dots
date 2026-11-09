import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import PhotoGrid from "@/components/PhotoGrid";
import RhythmsTabs from "@/components/RhythmsTabs";
import { categories, getCategory, allPhotos, coverOf, SITE } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gallery/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return { title: "Gallery" };
  const n = allPhotos(c).length;
  const description = n
    ? `${c.title} — ${n} fine-art ${c.sub.toLowerCase()} photographs from Sri Lanka by Adheesha Salpitikorala, available as framed prints.`
    : `${c.title} — limited editions by Adheesha Salpitikorala, shown by appointment.`;
  return {
    title: `${c.title} — ${c.sub}`,
    description,
    alternates: { canonical: `/gallery/${c.slug}` },
    openGraph: { title: `${c.title} — ${c.sub} | Wildy Dots`, description, images: [coverOf(c).src] },
  };
}

export default async function CategoryPage({ params }: PageProps<"/gallery/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const i = categories.indexOf(c);
  const next = categories[(i + 1) % categories.length];
  const count = allPhotos(c).length;

  return (
    <>
      <PageHeader
        eyebrow={`Collection ${String(i + 1).padStart(2, "0")} · ${c.sub}`}
        lines={[c.title]}
        intro={count ? `${count} photographs. Select any photograph to view it larger and enquire about a print.` : undefined}
        src={coverOf(c, i).src}
      />
      <section className="mx-auto max-w-[1700px] px-4 py-14 md:px-10">
        <nav aria-label="Breadcrumb" className="mb-8 text-[0.88rem] text-mute">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="link-underline pb-0.5">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/gallery" className="link-underline pb-0.5">Photo categories</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-bone">{c.title}</li>
          </ol>
        </nav>
        {c.themes.length ? (
          <RhythmsTabs themes={c.themes} />
        ) : count ? (
          <PhotoGrid photos={c.photos} />
        ) : (
          <div className="soft mx-auto max-w-xl rounded-[2rem] p-10 text-center md:p-14">
            <h2 className="font-display text-4xl">A private collection</h2>
            <p className="mt-5 text-mute">
              The Wildy Dots Exclusive editions are shown and sold by appointment. Call {SITE.phone} or get in touch to arrange a private viewing.
            </p>
            <Link href="/contact" className="bg-copper mt-8 inline-block px-8 py-4 text-[0.92rem] font-semibold">Request a viewing</Link>
          </div>
        )}
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12" aria-label="Next collection">
        <Link href={`/gallery/${next.slug}`} className="soft-card group flex items-center justify-between gap-6 rounded-[2rem] px-8 py-8 md:px-12">
          <span>
            <span className="label block">Next collection</span>
            <span className="font-display mt-1 block text-[clamp(1.8rem,4vw,3.2rem)]">{next.title}</span>
          </span>
          <span className="soft-inset flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </section>
    </>
  );
}
