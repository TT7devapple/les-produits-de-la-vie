import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getShopProducts } from "@/data/shop";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/la-boutique"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/nos-produits"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/commander"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
  const products: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: absoluteUrl(`/nos-produits/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const shop: MetadataRoute.Sitemap = getShopProducts().map((p) => ({
    url: absoluteUrl(`/commander/${p.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));
  return [...pages, ...products, ...shop];
}
