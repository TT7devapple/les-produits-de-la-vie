import type { MetadataRoute } from "next";
import { store } from "@/data/store";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${store.name} — Vincennes`,
    short_name: store.name,
    description: store.shortDescription,
    start_url: "/",
    display: "browser",
    background_color: "#c7a06f",
    theme_color: "#6e1a2f",
    lang: "fr",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
