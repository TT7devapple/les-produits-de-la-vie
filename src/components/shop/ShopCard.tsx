import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { QuickAdd } from "./AddToCart";

/** Données minimales d'une carte, calculées côté serveur (pas de catalogue complet envoyé au navigateur). */
export interface ShopCardData {
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  image: string | null;
  organic: boolean;
  fresh: boolean;
  minPrice: number;
  formats: number;
  /** Référence unique quand le produit n'a qu'un format (ajout direct depuis la carte). */
  singleSku: string | null;
  singleLabel: string | null;
}

/** Un produit à commander = son étiquette de balance, avec le prix et l'ajout au panier. */
export function ShopCard({ p }: { p: ShopCardData }) {
  return (
    <article className="label group relative flex h-full flex-col p-2.5 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:-rotate-[0.6deg] hover:shadow-[0_2px_2px_rgb(60_40_15/0.18),0_22px_32px_-14px_rgb(60_40_15/0.6)] has-[a:focus-visible]:outline-[2.5px] has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-ink has-[a:focus-visible]:outline-solid sm:p-3">
      <div className="relative aspect-square overflow-hidden rounded-[2px] bg-white">
        {p.image && <Image src={p.image} alt="" fill sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 48vw" className="object-contain p-2" />}
        <div className="absolute top-1.5 left-1.5 flex gap-1 font-mono text-data-sm uppercase">
          {p.organic && <span className="border border-print bg-white px-1 leading-tight">Bio</span>}
          {p.fresh && <span className="border border-print bg-white px-1 leading-tight">Frais</span>}
        </div>
      </div>

      <p className="mt-3 truncate font-mono text-data-sm tracking-[0.06em] text-print-soft uppercase">{p.subcategory ?? p.category}</p>
      <h3 className="mt-1 text-title font-bold">
        <Link href={`/commander/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {p.name}
        </Link>
      </h3>

      <div className="mt-auto pt-3">
        <div className="flex flex-col gap-2 border-t border-dashed border-print/35 pt-2 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-mono leading-tight">
            <span className="block text-data-sm text-print-soft">{p.formats > 1 ? `${p.formats} formats, dès` : (p.singleLabel ?? "Prix")}</span>
            <span className="text-lg font-medium tabular-nums">{formatPrice(p.minPrice)}</span>
          </p>
          {p.singleSku ? (
            <QuickAdd sku={p.singleSku} productName={p.name} price={p.minPrice} />
          ) : (
            <span aria-hidden="true" className="relative z-10 inline-flex min-h-11 items-center justify-center border-2 border-print px-3 text-ui font-bold tracking-[0.06em] uppercase transition-colors group-hover:bg-print group-hover:text-label">
              Choisir
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
