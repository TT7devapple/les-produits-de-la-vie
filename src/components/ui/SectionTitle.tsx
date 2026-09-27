import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Titre de section en capitales imprimées, suivi d'un chapeau facultatif. */
export function SectionTitle({
  title,
  intro,
  id,
  as: Heading = "h2",
  className,
}: {
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Heading
        id={id}
        className={cn("display", Heading === "h1" ? "text-display" : "text-headline")}
      >
        {title}
      </Heading>
      {intro && <div className="mt-5 max-w-xl text-lg leading-snug sm:text-xl">{intro}</div>}
    </div>
  );
}
