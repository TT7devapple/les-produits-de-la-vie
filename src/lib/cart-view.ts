import index from "@/data/shop-index.json";
import type { CartLine } from "./cart";

/** Entrée de l'index léger généré par `npm run sync:shop`. */
export interface IndexedVariant {
  slug: string;
  name: string;
  label: string;
  price: number;
  image: string | null;
}

const refs = index as Record<string, IndexedVariant>;

/** Lignes du panier enrichies (nom, format, prix du catalogue à jour) et totaux. */
export function describeCart(lines: CartLine[]) {
  const items = lines.flatMap((l) => {
    const ref = refs[l.sku];
    // une référence retirée du catalogue depuis l'ajout au panier est ignorée
    return ref ? [{ ...l, ...ref, total: Math.round(ref.price * l.qty * 100) / 100 }] : [];
  });
  return {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: Math.round(items.reduce((s, i) => s + i.total, 0) * 100) / 100,
    unknown: lines.filter((l) => !refs[l.sku]).map((l) => l.sku),
  };
}

export function priceOf(sku: string): IndexedVariant | undefined {
  return refs[sku];
}
