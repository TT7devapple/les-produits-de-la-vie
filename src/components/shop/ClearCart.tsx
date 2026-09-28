"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart";

/** Vide le panier une fois le paiement confirmé par Stripe. */
export function ClearCart() {
  useEffect(() => {
    cart.clear();
  }, []);
  return null;
}
