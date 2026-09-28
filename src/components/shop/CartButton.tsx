"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/** Accès au panier dans l'en-tête, avec le nombre d'articles. */
export function CartButton({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const count = cartCount(useCart());
  return (
    <Link
      href="/commander/panier"
      onClick={onNavigate}
      aria-label={count ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier, vide"}
      className={cn("relative inline-flex h-11 items-center gap-2 px-2 text-ui font-bold tracking-[0.06em] uppercase", className)}
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      <span className="hidden xl:inline">Panier</span>
      {count > 0 && (
        <span aria-hidden="true" className="min-w-6 bg-kraft px-1.5 py-0.5 text-center font-mono text-data-sm leading-none font-medium text-ink tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
