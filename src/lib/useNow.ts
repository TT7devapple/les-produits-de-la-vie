"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}

// Valeur stable à la minute près, pour éviter des rendus inutiles.
const getSnapshot = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerSnapshot = () => null;

/**
 * Heure courante côté navigateur (rafraîchie chaque minute).
 * Renvoie `null` pendant le rendu serveur et l'hydratation :
 * les pages restent statiques et aucun décalage d'hydratation n'est possible.
 */
export function useNow(): Date | null {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return ms === null ? null : new Date(ms);
}
