import Image from "next/image";
import type { SiteImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Photo « imprimée » sur le sac : bichromie encre bleue / kraft clair.
 * Donne une unité aux photos d'ambiance, quelle que soit leur source.
 * Les photos de produits, elles, restent en couleur (sur les étiquettes).
 */
export function PrintedImage({
  image,
  sizes,
  className,
  preload,
  decorative,
}: {
  image: SiteImage;
  sizes: string;
  className?: string;
  preload?: boolean;
  decorative?: boolean;
}) {
  return (
    <div className={cn("printed", className)}>
      <Image src={image.src} alt={decorative ? "" : image.alt} fill sizes={sizes} preload={preload} className="object-cover" />
    </div>
  );
}
