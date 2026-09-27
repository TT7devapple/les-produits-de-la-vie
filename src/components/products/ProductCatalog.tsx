"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { CategorySlug, Product } from "@/types";
import { categories, isCategorySlug } from "@/data/categories";
import { normalize } from "@/lib/products";
import { ProductGrid } from "./ProductGrid";
import { cn } from "@/lib/utils";

/**
 * Catalogue filtrable. La famille sélectionnée est gardée dans l'URL
 * (?categorie=pains) : le lien est partageable et le bouton retour fonctionne.
 */
export function ProductCatalog({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("categorie");
  const active: CategorySlug | null = isCategorySlug(param) ? param : null;

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const setCategory = (slug: CategorySlug | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("categorie", slug);
    else params.delete("categorie");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const counts = useMemo(() => {
    const map = new Map<CategorySlug, number>();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery);
    return products.filter((p) => {
      if (active && p.category !== active) return false;
      if (!q) return true;
      const category = categories.find((c) => c.slug === p.category)?.name ?? "";
      return normalize(`${p.name} ${p.excerpt} ${p.description} ${category}`).includes(q);
    });
  }, [products, active, deferredQuery]);

  const activeCategory = categories.find((c) => c.slug === active);

  return (
    <div>
      {/* Barre d'outils : onglets de rayon et recherche */}
      <div className="sticky top-16 z-20 -mx-5 border-y-2 border-ink bg-kraft bg-[url('/textures/kraft.png')] bg-[length:256px] px-5 py-3 sm:-mx-8 sm:px-8 lg:top-[4.5rem]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrer par rayon" className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            <FilterTab selected={!active} onClick={() => setCategory(null)}>
              Tout
            </FilterTab>
            {categories.map((c) => (
              <FilterTab key={c.slug} selected={active === c.slug} onClick={() => setCategory(c.slug)}>
                {c.name}
                {counts.get(c.slug) ? <span className="ml-1.5 font-mono text-[0.8em] font-normal tabular-nums">{counts.get(c.slug)}</span> : null}
              </FilterTab>
            ))}
          </div>

          <div className="relative lg:w-72">
            <label htmlFor="recherche-produit" className="sr-only">
              Rechercher un produit
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              id="recherche-produit"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pain, pesto, tisane…"
              autoComplete="off"
              className="h-11 w-full border-2 border-ink bg-label pr-11 pl-10 text-base text-ink placeholder:text-ink/60 focus:bg-label focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center hover:bg-ink hover:text-kraft">
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Effacer la recherche</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Résultat */}
      <div className="pt-8">
        <h2 className="sr-only">Produits</h2>
        <p aria-live="polite" className="mb-6 font-mono text-sm">
          {filtered.length === 0 ? "Aucun produit" : `${filtered.length} produit${filtered.length > 1 ? "s" : ""}`}
          {activeCategory && <> · {activeCategory.name}</>}
          {deferredQuery && <> · « {deferredQuery} »</>}
        </p>

        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <EmptyState
            category={active}
            onReset={() => {
              setQuery("");
              setCategory(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function FilterTab({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center border-2 border-ink px-3.5 text-ui font-bold tracking-[0.05em] whitespace-nowrap uppercase transition-colors duration-150",
        selected ? "bg-ink text-kraft" : "hover:bg-kraft",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ category, onReset }: { category: CategorySlug | null; onReset: () => void }) {
  const isProduce = category === "fruits-legumes";
  return (
    <div className="label mx-auto max-w-xl px-6 py-10 sm:px-10">
      <p className="display text-4xl">{isProduce ? "Ça se passe en boutique." : "Rien sur cette étiquette."}</p>
      <p className="mt-4 text-print-soft">
        {isProduce
          ? "Les fruits et légumes changent avec les saisons et les arrivages du jeudi. Le plus simple : passer les voir, ou nous appeler pour savoir ce qui vient d'arriver."
          : "La gamme en boutique est plus large que ce catalogue. Demandez-nous directement, on vous dira si nous l'avons."}
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onReset} className="min-h-12 border-2 border-print px-5 font-bold tracking-[0.05em] uppercase hover:bg-print hover:text-label">
          Voir tous les produits
        </button>
        <Link href="/contact" className="inline-flex min-h-12 items-center justify-center bg-ink px-5 font-bold tracking-[0.05em] text-kraft uppercase hover:bg-ink-deep">
          Nous contacter
        </Link>
      </div>
    </div>
  );
}