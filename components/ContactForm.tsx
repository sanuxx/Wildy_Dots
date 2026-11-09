"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SITE } from "@/lib/data";

/**
 * There is no mail server behind this form: the enquiry is composed here and handed to WhatsApp,
 * so it reaches the photographer directly. The page says so plainly.
 */
export default function ContactForm() {
  const params = useSearchParams();
  const photo = params.get("photo") ?? "";
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState(photo ? `I'm interested in: ${photo}.\n\n` : "");
  const [sent, setSent] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Wildy Dots,\n\n${msg.trim()}\n\n— ${name.trim()}${from.trim() ? ` (${from.trim()})` : ""}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const field =
    "soft-inset mt-2 w-full rounded-2xl px-5 py-4 text-base text-bone outline-none transition-shadow placeholder:text-mute/70 focus:shadow-[inset_6px_6px_14px_var(--sh-d),inset_-6px_-6px_14px_var(--sh-l),0_0_0_2px_rgba(168,121,44,0.5)]";

  return (
    <form onSubmit={send} className="space-y-6">
      <div>
        <label htmlFor="cf-name" className="text-[0.9rem] font-medium">Your name <span className="text-accent" aria-hidden>*</span></label>
        <input id="cf-name" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Full name" />
      </div>
      <div>
        <label htmlFor="cf-from" className="text-[0.9rem] font-medium">Email or phone <span className="font-normal text-mute">(optional)</span></label>
        <input id="cf-from" name="contact" autoComplete="email" value={from} onChange={(e) => setFrom(e.target.value)} className={field} placeholder="So we can reply" />
      </div>
      <div>
        <label htmlFor="cf-msg" className="text-[0.9rem] font-medium">Your enquiry <span className="text-accent" aria-hidden>*</span></label>
        <textarea id="cf-msg" name="message" required rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} className={`${field} resize-y`} placeholder="Which photograph, size and frame are you after?" />
      </div>
      <div>
        <button type="submit" className="bg-copper px-8 py-4 text-[0.95rem] font-semibold">
          Send enquiry via WhatsApp
        </button>
        <p className="mt-4 text-[0.85rem] leading-relaxed text-mute" role="status">
          {sent
            ? "WhatsApp should have opened with your message ready to send. If it did not, call us on " + SITE.phone + "."
            : "This opens WhatsApp with your message ready to send to us. Prefer to talk? Call " + SITE.phone + "."}
        </p>
      </div>
    </form>
  );
}
