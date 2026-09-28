"use client";

import { useSyncExternalStore } from "react";

/**
 * Panier de l'onglet « Commander », conservé dans le navigateur (localStorage).
 * Petit magasin externe lu avec useSyncExternalStore : aucun fournisseur de
 * contexte, aucun décalage d'hydratation (panier vide côté serveur).
 * Seules les références et quantités sont stockées — ce module n'importe aucun
 * catalogue, il reste donc léger sur toutes les pages (compteur de l'en-tête).
 * Les prix sont relus dans l'index synchronisé (voir cart-view.ts).
 */
export interface CartLine {
  sku: string;
  qty: number;
}

const KEY = "lpdlv-panier-v1";
export const MAX_QTY = 99;
const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter((l): l is CartLine => typeof l?.sku === "string" && Number.isFinite(l?.qty) && l.qty > 0)
      .map((l) => ({ sku: l.sku, qty: Math.min(MAX_QTY, Math.floor(l.qty)) }));
  } catch {
    return EMPTY;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  lines = read();
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* navigation privée : le panier vit le temps de la page */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  // synchronise les onglets ouverts sur le site
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    lines = read();
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return lines;
};
const getServerSnapshot = () => EMPTY;

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartCount(cartLines: CartLine[]): number {
  return cartLines.reduce((s, l) => s + l.qty, 0);
}

export const cart = {
  add(sku: string, qty = 1) {
    load();
    const existing = lines.find((l) => l.sku === sku);
    commit(
      existing
        ? lines.map((l) => (l.sku === sku ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
        : [...lines, { sku, qty: Math.min(MAX_QTY, qty) }],
    );
  },
  setQty(sku: string, qty: number) {
    load();
    commit(qty <= 0 ? lines.filter((l) => l.sku !== sku) : lines.map((l) => (l.sku === sku ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  },
  remove(sku: string) {
    load();
    commit(lines.filter((l) => l.sku !== sku));
  },
  clear() {
    commit(EMPTY);
  },
};
