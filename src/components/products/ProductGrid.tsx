import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

/** `wide` : jusqu'à 4 colonnes sur très grand écran (catalogue) ; sinon 3 au maximum. */
export function ProductGrid({ products, className, wide = true }: { products: Product[]; className?: string; wide?: boolean }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-7", wide && "xl:grid-cols-4", className)}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
