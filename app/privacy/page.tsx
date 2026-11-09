import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the Wildy Dots website handles your information.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    h: "What this website collects",
    p: "This website does not use cookies, advertising trackers or analytics, and it does not ask you to create an account. We do not store personal information about visitors on our own servers.",
  },
  {
    h: "Enquiries",
    p: `When you use the enquiry form, your message is prepared in your browser and opened in WhatsApp so you can send it to us. It is only sent if you choose to send it. WhatsApp’s own privacy policy applies to messages sent through it. You can also simply call us on ${SITE.phone}.`,
  },
  {
    h: "The map",
    p: "The field map on the home page loads map images from OpenStreetMap’s servers. As with any map provider, your browser’s IP address is visible to them when those images load. See openstreetmap.org/copyright for details.",
  },
  {
    h: "Photographs",
    p: "All photographs on this website are © Adheesha Salpitikorala and are protected by copyright. Please do not copy, download or reuse them without written permission. Prints can be ordered through the showroom or by enquiry.",
  },
  {
    h: "Questions",
    p: `If you have any question about this page, contact us on ${SITE.phone} or through the enquiry form.`,
  },
];

export default function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Privacy" lines={["Privacy"]} intro="A short, plain-language note on how this website handles your information." bg={2} />
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-3xl">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-mute">{s.p}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-[0.88rem] text-mute">Last updated 1 November 2026. <Link href="/" className="link-underline pb-0.5 font-medium text-accent">Back to home</Link></p>
      </section>
    </>
  );
}
