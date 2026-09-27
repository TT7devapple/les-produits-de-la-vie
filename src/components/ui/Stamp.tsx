import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Marque de tampon encreur. `rotate` en degrés, pour éviter l'uniformité. */
export function Stamp({ children, rotate = -4, className }: { children: ReactNode; rotate?: number; className?: string }) {
  return (
    <span data-stamp className={cn("stamp", className)} style={{ "--stamp-rotate": `${rotate}deg` } as CSSProperties}>
      {children}
    </span>
  );
}
