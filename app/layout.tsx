import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import { SITE } from "@/lib/data";

// Soft UI type: Fraunces (a warm, soft-cornered serif) for titles and DM Sans for everything else.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});
const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const DESCRIPTION =
  "Fine-art wildlife photography from the national parks of Sri Lanka by Adheesha Salpitikorala — framed prints, a showroom in Colombo, and 5% of every sale supporting the Human Elephant Conflict Conservation Fund.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Wildy Dots — Fine-Art Wildlife Photography, Sri Lanka", template: "%s — Wildy Dots" },
  description: DESCRIPTION,
  applicationName: "Wildy Dots",
  authors: [{ name: "Adheesha Salpitikorala" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Wildy Dots",
    locale: "en_LK",
    title: "Wildy Dots — Fine-Art Wildlife Photography, Sri Lanka",
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "A leopard crouching in the grass — Wildy Dots wildlife photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wildy Dots — Fine-Art Wildlife Photography, Sri Lanka",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0f1110", width: "device-width", initialScale: 1 };

// Structured data so search engines understand the business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ArtGallery",
  name: "Wildy Dots",
  url: SITE.url,
  description: DESCRIPTION,
  telephone: SITE.phone,
  image: `${SITE.url}/og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Marino Mall",
    addressLocality: "Colombo 03",
    addressCountry: "LK",
  },
  founder: { "@type": "Person", name: "Adheesha Salpitikorala" },
  sameAs: [],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
