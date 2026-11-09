import Link from "next/link";
import Image from "next/image";
import { nav, logos, SITE } from "@/lib/data";
import { Wordmark } from "./Nav";

export default function Footer() {
  return (
    <footer className="mt-6 rounded-t-[2.5rem] bg-ink-2 px-6 pb-10 pt-16 shadow-[inset_0_16px_30px_-16px_var(--sh-d)] md:rounded-t-[3.5rem] md:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Wordmark className="text-4xl text-bone" />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-mute">
            Fine-art wildlife photography from the national parks of Sri Lanka, by Adheesha Salpitikorala.
          </p>
          <Link
            href="/foundation"
            className="soft-sm mt-7 flex max-w-sm items-center gap-4 rounded-[1.5rem] p-3.5 transition-shadow hover:shadow-[3px_3px_8px_var(--sh-d),-3px_-3px_8px_var(--sh-l)]"
          >
            <Image src={logos.mark.src} alt="Human Elephant Conflict Conservation Foundation" width={48} height={48} className="h-12 w-auto rounded-lg bg-cream p-1" />
            <span className="text-[0.82rem] leading-snug text-mute">5% of every sale supports the Human Elephant Conflict Conservation Fund.</span>
          </Link>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-2.5 text-[0.95rem] text-bone/85">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline pb-0.5">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-5">Showroom</p>
          <address className="text-[0.95rem] not-italic leading-relaxed text-bone/85">
            Wildy Dots Showroom<br />
            Marino Mall, Colombo 03<br />
            Sri Lanka
          </address>
          <Link href="/showrooms" className="link-underline mt-4 inline-block pb-0.5 text-[0.9rem] font-medium text-accent">Showroom details</Link>
        </div>

        <div>
          <p className="eyebrow mb-5">Contact</p>
          <ul className="space-y-2.5 text-[0.95rem] text-bone/85">
            <li><a href={SITE.phoneHref} className="link-underline pb-0.5">{SITE.phone}</a></li>
            <li><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link-underline pb-0.5">WhatsApp</a></li>
            <li><Link href="/contact" className="link-underline pb-0.5">Send an enquiry</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col justify-between gap-3 border-t border-line pt-6 text-[0.82rem] text-mute md:flex-row">
        <p>© 2026 Wildy Dots. All photographs © Adheesha Salpitikorala — all rights reserved.</p>
        <ul className="flex gap-6">
          <li><Link href="/privacy" className="link-underline pb-0.5">Privacy</Link></li>
          <li><Link href="/framing" className="link-underline pb-0.5">Framing &amp; pricing</Link></li>
        </ul>
      </div>
    </footer>
  );
}
