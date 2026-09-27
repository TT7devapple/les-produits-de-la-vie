"use client";

import { fullAddress, store } from "@/data/store";
import { getOpenStatus, labelDate, nextRestock, todayHours } from "@/lib/hours";
import { useNow } from "@/lib/useNow";
import { cn } from "@/lib/utils";

/**
 * L'étiquette de balance du jour : statut, horaires et prochain arrivage,
 * calculés à l'heure de Paris. Imprimée une fois au chargement.
 * Avant l'hydratation, les valeurs du jour sont remplacées par « … » :
 * la page reste statique et la hauteur de l'étiquette ne bouge pas.
 */
export function ScaleLabel({ className, print = true }: { className?: string; print?: boolean }) {
  const now = useNow();
  const status = now ? getOpenStatus(now) : null;
  const [state, detail] = status ? status.label.split(" · ") : [null, null];
  const restock = now ? nextRestock(now) : null;

  return (
    <div className={cn("label relative font-mono text-data leading-[1.55]", print && "label-print", className)}>
      {/* Agrafe */}
      <svg aria-hidden="true" viewBox="0 0 40 10" className="absolute -top-1 left-1/2 h-2.5 w-10 -translate-x-1/2 text-print/70">
        <path d="M2 8V3a1 1 0 0 1 1-1h34a1 1 0 0 1 1 1v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <div className="px-4 pt-4 pb-3">
        <p className="flex items-baseline justify-between gap-3 border-b border-dashed border-print/40 pb-2 text-data-sm tracking-[0.08em] uppercase">
          <span>{store.name}</span>
          <span className="tabular-nums">{now ? labelDate(now) : "…"}</span>
        </p>

        {/* L'état du jour est tamponné, pas coloré. */}
        <p aria-live="polite" className="mt-3 min-h-[2.6rem]">
          {state && <span className="stamp -rotate-2 text-subhead">{state}</span>}
        </p>
        <p className="min-h-[1.55em] text-print-soft">{detail ?? ""}</p>

        <dl className="mt-3 space-y-0.5 border-t border-dashed border-print/40 pt-2.5">
          <div className="leader">
            <dt>Aujourd&apos;hui</dt>
            <dd className="tabular-nums">{now ? todayHours(now) : "…"}</dd>
          </div>
          <div className="leader">
            <dt>Arrivage</dt>
            <dd>{restock ? restock.label : "…"}</dd>
          </div>
          <div className="leader">
            <dt>Métro 1</dt>
            <dd>{store.access[0].station}</dd>
          </div>
        </dl>

        <p className="mt-3 border-t border-dashed border-print/40 pt-2.5 text-data-sm leading-snug tracking-[0.04em] uppercase">
          {fullAddress}
          <br />
          100&nbsp;% végétal · du champ au client
        </p>
      </div>
    </div>
  );
}
