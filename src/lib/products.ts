import type { CategorySlug, Product } from "@/types";
import { products } from "@/data/products";

/**
 * Point d'accès unique aux produits.
 * Aujourd'hui : lecture du fichier src/data/products.ts.
 * Demain : ces fonctions pourront interroger un CMS ou une API
 * (Shopify, Sanity…) sans modifier les composants.
 */
export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

/** 3 suggestions : d'abord la même famille, puis le reste de la gamme. */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const others = products.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category && p.featured);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Recherche insensible à la casse et aux accents. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
}
