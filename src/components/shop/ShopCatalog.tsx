"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { normalize } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ShopCard, type ShopCardData } from "./ShopCard";

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Catalogue à commander : rayons de la marque (gardés dans l'URL, liens partageables),
 * sous-rayons, recherche insensible aux accents.
 */
export function ShopCatalog({ products, categories }: { products: ShopCardData[]; categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = categories.find((c) => slug(c) === params.get("rayon")) ?? null;
  const subs = useMemo(
    () => (active ? [...new Set(products.filter((p) => p.category === active).map((p) => p.subcategory).filter(Boolean) as string[])] : []),
    [products, active],
  );
  const activeSub = subs.find((s) => slug(s) === params.get("sous")) ?? null;
  const [query, setQuery] = useState("");
  const q = normalize(useDeferredValue(query));

  const go = (rayon: string | null, sous: string | null = null) => {
    const next = new URLSearchParams();
    if (rayon) next.set("rayon", slug(rayon));
    if (sous) next.set("sous", slug(sous));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (!active || p.category === active) &&
          (!activeSub || p.subcategory === activeSub) &&
          (!q || normalize(`${p.name} ${p.category} ${p.subcategory ?? ""}`).includes(q)),
      ),
    [products, active, activeSub, q],
  );

  const tab = (selected: boolean) =>
    cn(
      "inline-flex min-h-11 shrink-0 items-center border-2 border-ink px-3.5 text-ui font-bold tracking-[0.05em] whitespace-nowrap uppercase transition-colors duration-150",
      selected ? "bg-ink text-kraft" : "hover:bg-label/60",
    );

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-5 border-y-2 border-ink bg-kraft bg-[url('/textures/kraft.png')] bg-[length:256px] px-5 py-3 sm:-mx-8 sm:px-8 lg:top-[4.5rem]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrer par rayon" className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            <button type="button" aria-pressed={!active} onClick={() => go(null)} className={tab(!active)}>
              Tout
            </button>
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={active === c} onClick={() => go(c)} className={tab(active === c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <label htmlFor="recherche-commande" className="sr-only">
              Rechercher un produit
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              id="recherche-commande"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesto, pain, tisane…"
              autoComplete="off"
              className="h-11 w-full border-2 border-ink bg-label pr-11 pl-10 text-base text-print placeholder:text-print-soft focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center hover:bg-ink hover:text-kraft">
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Effacer la recherche</span>
              </button>
            )}
          </div>
        </div>

        {subs.length > 1 && (
          <div role="group" aria-label={`Sous-rayons de ${active}`} className="-mx-5 mt-3 flex gap-x-5 gap-y-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {[null, ...subs].map((s) => (
              <button
                key={s ?? "tous"}
                type="button"
                aria-pressed={activeSub === s}
                onClick={() => go(active, s)}
                className={cn("min-h-9 shrink-0 font-mono text-data whitespace-nowrap decoration-2 underline-offset-4 hover:underline", activeSub === s && "font-medium underline")}
              >
                {s ?? `Tout le rayon`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-8">
        <h2 className="sr-only">Produits à commander</h2>
        <p aria-live="polite" className="mb-6 font-mono text-sm">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""}
          {active && <> · {active}</>}
          {activeSub && <> · {activeSub}</>}
          {q && <> · « {query} »</>}
        </p>
        {filtered.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
            {filtered.map((p) => (
              <li key={p.slug}>
                <ShopCard p={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="label mx-auto max-w-xl px-6 py-10 sm:px-10">
            <p className="display text-subhead">Rien sur cette étiquette.</p>
            <p className="mt-4 text-print-soft">Aucun produit ne correspond à cette recherche.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                go(null);
              }}
              className="mt-6 min-h-12 border-2 border-print px-5 font-bold tracking-[0.05em] uppercase hover:bg-print hover:text-label"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
