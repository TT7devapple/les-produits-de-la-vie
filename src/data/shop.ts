/**
 * Onglet « Commander » : le catalogue complet de la boutique en ligne de la marque.
 *
 * Données générées par `npm run sync:shop` (scripts/sync-shop.mjs) depuis
 * produits-de-la-vie.com : produits, variantes et PRIX identiques à leur site
 * (prix TTC affichés à tout visiteur). Ne pas modifier le JSON à la main :
 * relancer la synchronisation pour mettre les prix à jour.
 */
import catalog from "./shop-catalog.json";

export interface ShopVariant {
  sku: string;
  label: string;
  price: number;
  tiers?: { from: number; price: number }[];
  referencePrice: { price: number; unit: string } | null;
  available: boolean;
}

export interface ShopNutrition {
  per: string;
  kj: number | null;
  kcal: number | null;
  fat: number | null;
  saturated: number | null;
  carbs: number | null;
  sugar: number | null;
  protein: number | null;
  salt: number | null;
}

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string;
  ingredients: string | null;
  traces: string | null;
  organic: boolean;
  organicControl: string | null;
  fresh: boolean;
  nutrition: ShopNutrition | null;
  image: string | null;
  variants: ShopVariant[];
}

const data = catalog as { source: string; syncedAt: string; products: ShopProduct[] };

/** Ordre des rayons, identique à la navigation de leur boutique. */
export const shopCategories = [
  "Pains & Tartinades",
  "Assaisonner & Cuisiner",
  "Douceurs & Biscuits",
  "Boissons",
  "Cosmétique",
  "Pour animaux",
].filter((c) => data.products.some((p) => p.category === c));

export const shopSyncedAt = data.syncedAt;
export const shopSource = data.source;

export function getShopProducts(): ShopProduct[] {
  return data.products;
}

export function getShopProduct(slug: string): ShopProduct | undefined {
  return data.products.find((p) => p.slug === slug);
}

export function slugifyCategory(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function lowestPrice(p: ShopProduct): number {
  return Math.min(...p.variants.map((v) => v.price));
}
