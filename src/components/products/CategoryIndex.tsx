import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * Les rayons de la boutique, imprimés comme la liste au dos du sac.
 * Au survol, la ligne passe en aplat d'encre.
 */
export function CategoryIndex({ className, showDescription = false }: { className?: string; showDescription?: boolean }) {
  const products = getAllProducts();
  return (
    <ul className={cn("border-t-2 border-ink", className)}>
      {categories.map((c) => {
        const count = products.filter((p) => p.category === c.slug).length;
        return (
          <li key={c.slug} className="border-b-2 border-ink">
            <Link
              href={`/nos-produits?categorie=${c.slug}`}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-1 py-4 transition-colors duration-200 hover:bg-ink hover:text-kraft focus-visible:bg-ink focus-visible:text-kraft focus-visible:outline-none sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:px-3 sm:py-5"
            >
              <span className="display text-subhead">{c.name}</span>
              <span className="col-start-1 row-start-2 text-base leading-snug sm:col-start-2 sm:row-start-1">
                {showDescription ? c.description : c.tagline}
              </span>
              <span className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 font-mono text-sm sm:col-start-3 sm:row-span-1">
                <span className="hidden tabular-nums sm:inline">{count > 0 ? `${count} réf.` : "selon arrivage"}</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
