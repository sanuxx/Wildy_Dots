import type { Metadata } from "next";
import AboutStory from "@/components/AboutStory";

export const metadata: Metadata = {
  title: "About the Photographer",
  description:
    "Adheesha Salpitikorala founded Wildy Dots to share the wildlife of Sri Lanka — more than 20,000 frames from years in the national parks, with Wilpattu as a second home.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutStory />;
}
