"use client";

import { getOpenStatus } from "@/lib/hours";
import { useNow } from "@/lib/useNow";
import { cn } from "@/lib/utils";

/**
 * Statut du jour en une ligne : « OUVERT jusqu'à 19h30 ».
 * L'état se lit au mot imprimé en capitales, pas à une pastille de couleur.
 */
export function OpenStatus({ className }: { className?: string }) {
  const now = useNow();
  const status = now ? getOpenStatus(now) : null;
  const [state, detail] = status ? status.label.split(" · ") : ["", ""];

  return (
    <p aria-live="polite" className={cn("min-h-6 transition-opacity duration-300", status ? "opacity-100" : "opacity-0", className)}>
      <span className="mr-2 border-[1.5px] border-current px-1.5 py-px text-[0.8em] font-bold tracking-[0.08em] uppercase">{state || "…"}</span>
      {detail}
    </p>
  );
}
