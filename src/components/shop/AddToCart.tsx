"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ShopVariant } from "@/data/shop";
import { cart, MAX_QTY, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Choix du format, de la quantité, et ajout au panier (fiche produit). */
export function AddToCart({ variants, productName }: { variants: ShopVariant[]; productName: string }) {
  const firstAvailable = variants.find((v) => v.available) ?? variants[0];
  const [sku, setSku] = useState(firstAvailable.sku);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0); // nombre d'ajouts : relance l'animation du tampon
  const lines = useCart();
  const variant = variants.find((v) => v.sku === sku) ?? firstAvailable;
  const inCart = lines.find((l) => l.sku === sku)?.qty ?? 0;

  return (
    <div className="space-y-6">
      {variants.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-ui font-bold tracking-[0.06em] uppercase">Format</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <label
                key={v.sku}
                className={cn(
                  "flex min-h-12 cursor-pointer flex-col justify-center border-2 border-ink px-4 py-1.5 transition-colors has-[:focus-visible]:outline-[2.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink has-[:focus-visible]:outline-solid",
                  v.sku === sku ? "bg-ink text-kraft" : "hover:bg-kraft/40",
                  !v.available && "cursor-not-allowed opacity-50",
                )}
              >
                <input
                  type="radio"
                  name="format"
                  value={v.sku}
                  checked={v.sku === sku}
                  disabled={!v.available}
                  onChange={() => setSku(v.sku)}
                  className="sr-only"
                />
                <span className="font-bold">{v.label}</span>
                <span className="font-mono text-data-sm tabular-nums">{formatPrice(v.price)}{!v.available && " · épuisé"}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <span id="qty-label" className="mb-2 block text-ui font-bold tracking-[0.06em] uppercase">
            Quantité
          </span>
          <div role="group" aria-labelledby="qty-label" className="inline-flex h-13 items-stretch border-2 border-ink">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="w-12 hover:bg-ink hover:text-kraft disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink">
              <Minus className="mx-auto h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Retirer un</span>
            </button>
            <output aria-live="polite" className="flex w-12 items-center justify-center border-x-2 border-ink font-mono text-lg tabular-nums">
              {qty}
            </output>
            <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="w-12 hover:bg-ink hover:text-kraft">
              <Plus className="mx-auto h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Ajouter un</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!variant.available}
          onClick={() => {
            cart.add(variant.sku, qty);
            setAdded((n) => n + 1);
          }}
          className="inline-flex min-h-13 flex-1 items-center justify-center gap-3 bg-ink px-6 font-bold tracking-[0.06em] text-kraft uppercase transition-colors hover:bg-ink-deep active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          Ajouter au panier
          <span className="font-mono font-medium tabular-nums">{formatPrice(variant.price * qty)}</span>
        </button>
      </div>

      {variant.referencePrice && (
        <p className="font-mono text-data">
          soit {formatPrice(variant.referencePrice.price)} / {variant.referencePrice.unit}
        </p>
      )}

      <p aria-live="polite" className="min-h-7">
        {added > 0 && (
          <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
            <span key={added} className="stamp is-stamped -rotate-3 text-xl" data-stamp style={{ ["--stamp-rotate" as string]: "-3deg" }}>
              Ajouté
            </span>
            <span>
              {productName} · {variant.label} — {inCart} au panier.
            </span>
            <Link href="/commander/panier" className="font-bold tracking-[0.06em] uppercase underline decoration-2 underline-offset-4">
              Voir le panier
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}

/** Ajout direct depuis une carte (produit à format unique). */
export function QuickAdd({ sku, productName, price }: { sku: string; productName: string; price: number }) {
  const [done, setDone] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        cart.add(sku, 1);
        setDone((n) => n + 1);
      }}
      aria-label={`Ajouter ${productName} au panier (${formatPrice(price)})`}
      className="relative z-10 inline-flex min-h-11 items-center justify-center bg-ink px-3 text-ui font-bold tracking-[0.06em] text-kraft uppercase transition-colors hover:bg-ink-deep active:translate-y-px"
    >
      <span key={done} className={done ? "animate-[stamp-land_0.42s_var(--ease-out)]" : undefined}>
        {done ? "Ajouté" : "Ajouter"}
      </span>
    </button>
  );
}
