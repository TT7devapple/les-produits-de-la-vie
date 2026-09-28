import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { getCategory } from "@/data/categories";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * Un produit = son étiquette de balance : photo du produit, famille,
 * nom et données (format, mention). Toute l'étiquette est cliquable.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw",
  className,
}: {
  product: Product;
  sizes?: string;
  className?: string;
}) {
  const category = getCategory(product.category);
  const showPrice = site.features.showPrices && product.price !== undefined;

  return (
    <article
      className={cn(
        "label group relative flex h-full flex-col p-2.5 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] sm:p-3",
        "hover:-translate-y-1 hover:-rotate-[0.6deg] hover:shadow-[0_2px_2px_rgb(60_40_15/0.18),0_22px_32px_-14px_rgb(60_40_15/0.6)]",
        "has-[:focus-visible]:outline-[2.5px] has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ink has-[:focus-visible]:outline-solid",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-print/10">
        <Image src={product.image.src} alt={product.image.alt} fill sizes={sizes} placeholder="blur" className="object-cover" style={product.image.position ? { objectPosition: product.image.position } : undefined} />
      </div>

      <p className="mt-3 flex items-center justify-between gap-2 font-mono text-data-sm tracking-[0.06em] text-print-soft uppercase">
        <span className="truncate">{category.name}</span>
        {product.organic && <span className="shrink-0 border border-current px-1 leading-tight text-print">Bio</span>}
      </p>
      <h3 className="mt-1 text-title font-bold">
        <Link href={`/nos-produits/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {product.name}
        </Link>
      </h3>
      <p className="mt-1.5 hidden text-sm leading-snug text-print-soft sm:block">{product.excerpt}</p>

      <div className="mt-auto pt-3">
        <div className="leader border-t border-dashed border-print/35 pt-2 font-mono text-data-sm sm:text-data">
          <span>{showPrice ? "Prix" : "Format"}</span>
          <span className="text-right">{showPrice ? formatPrice(product.price!) : (product.format ?? "—")}</span>
        </div>
      </div>
    </article>
  );
}
