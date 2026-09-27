import { cn } from "@/lib/utils";

/**
 * Logotype provisoire : le nom imprimé comme un tampon sur le sac.
 * Remplacer ici si la boutique fournit un logo officiel.
 */
export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <span className={cn("inline-flex flex-col border-current leading-[0.86]", lg ? "border-[3px] px-3 pt-1.5 pb-1" : "border-2 px-2 pt-1 pb-0.5", className)}>
      <span className={cn("display leading-[0.86] tracking-[0.02em]", lg ? "text-lead" : "text-ui")}>Les Produits</span>
      <span className={cn("display leading-[0.86] tracking-[0.01em]", lg ? "text-subhead" : "text-title")}>de la Vie</span>
    </span>
  );
}
