"use client";

import { dailyHours, groupedHours, nowInParis } from "@/lib/hours";
import { useNow } from "@/lib/useNow";
import { cn } from "@/lib/utils";

/**
 * Horaires en lignes d'étiquette (intitulé … valeur).
 * - "grouped" : Lundi – samedi / Dimanche
 * - "daily"   : un jour par ligne, aujourd'hui en gras et signalé
 */
export function HoursTable({ variant = "grouped", className }: { variant?: "grouped" | "daily"; className?: string }) {
  const now = useNow();
  const today = now ? nowInParis(now).day : null;
  const rows = variant === "daily" ? dailyHours().map((r) => ({ ...r, days: [r.day] })) : groupedHours();

  return (
    <dl className={cn("font-mono", className)}>
      {rows.map((row) => {
        const isToday = today !== null && row.days.includes(today);
        return (
          <div key={row.label} className={cn("leader py-1", isToday && "font-medium")}>
            <dt>
              {row.label}
              {isToday && variant === "daily" && <span className="ml-2 border border-current px-1 text-[0.72em] tracking-[0.06em] uppercase">aujourd&apos;hui</span>}
            </dt>
            <dd className="tabular-nums">{row.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
