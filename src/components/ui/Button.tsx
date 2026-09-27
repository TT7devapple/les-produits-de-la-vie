import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Bouton-lien : un bloc d'encre imprimé, angles droits.
 * - ink       : aplat d'encre sur kraft (action principale)
 * - outline   : filet d'encre sur kraft (action secondaire)
 * - knockout  : kraft réservé sur un aplat d'encre (action principale sur fond bleu)
 * - outline-light : filet clair sur fond bleu
 */
type Variant = "ink" | "outline" | "knockout" | "outline-light";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-kraft hover:bg-ink-deep",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-kraft",
  knockout: "bg-kraft text-ink hover:bg-label",
  "outline-light": "border-2 border-kraft/80 text-kraft hover:border-kraft hover:bg-kraft hover:text-ink",
};

type ButtonProps = {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href">;

export function Button({ href, variant = "ink", icon, className, children, ...rest }: ButtonProps) {
  const classes = cn(
    "group inline-flex min-h-13 items-center justify-center gap-3 px-6 text-ui font-bold tracking-[0.06em] uppercase transition-colors duration-200 active:translate-y-px",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span aria-hidden="true" className="shrink-0 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {content}
    </a>
  );
}
