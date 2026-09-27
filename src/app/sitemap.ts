import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/la-boutique"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/nos-produits"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
  const products: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: absoluteUrl(`/nos-produits/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...pages, ...products];
}
