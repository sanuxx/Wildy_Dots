import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/motion";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Enquire about a print or visit the Wildy Dots showroom at Marino Mall, Colombo 03. Call +94 77 712 1446 or send an enquiry.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        lines={["Enquire about", "a print"]}
        intro="Tell us which photograph, size and frame you have in mind and we will take it from there."
        bg={0}
      />
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:px-12 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl">Get in touch</h2>
          <dl className="mt-8 space-y-7">
            <div>
              <dt className="label">Phone</dt>
              <dd className="mt-1"><a href={SITE.phoneHref} className="link-underline pb-0.5 text-xl font-medium">{SITE.phone}</a></dd>
            </div>
            <div>
              <dt className="label">WhatsApp</dt>
              <dd className="mt-1"><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link-underline pb-0.5 text-xl font-medium">Message us on WhatsApp</a></dd>
            </div>
            <div>
              <dt className="label">Showroom</dt>
              <dd className="mt-1 leading-relaxed">Wildy Dots Showroom<br />Marino Mall, Colombo 03<br />Sri Lanka</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="soft rounded-[2rem] p-6 md:p-10">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </Reveal>
      </section>
    </>
  );
}
