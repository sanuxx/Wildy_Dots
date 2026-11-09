import type { Metadata } from "next";
import GalleryIndex from "@/components/GalleryIndex";

export const metadata: Metadata = {
  title: "Photo Categories",
  description:
    "Eleven collections of fine-art wildlife photography from Sri Lanka — elephants, leopards, birds, bears, deer, monkeys, reptiles and more. Available as framed prints.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  return <GalleryIndex />;
}
