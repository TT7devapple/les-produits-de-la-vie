import Image from "next/image";
import type { SiteImage } from "@/types";
import { PrintedImage } from "@/components/ui/PrintedImage";
import { cn } from "@/lib/utils";

/**
 * Planche de photos (6 images) : les vraies photos de la marque restent en couleur,
 * les photos provisoires sont imprimées à l'encre.
 * Les quatre premières sont de vraies photos de la marque ; les deux dernières restent provisoires.
 * Mobile (2 col.) : A A / B C / D C / E F — Desktop (4 col.) : A A B C / A A D C / E E F F
 */
const layout = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1 lg:col-span-2",
  "col-span-1 row-span-1 lg:col-span-2",
];

export function Gallery({ items, className }: { items: (SiteImage & { caption?: string })[]; className?: string }) {
  return (
    <ul className={cn("grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[12rem] lg:auto-rows-[14rem] lg:grid-cols-4", className)}>
      {items.map((item, i) => (
        <li key={i} className={cn("relative", layout[i % layout.length])}>
          {item.genuine ? (
            <div className="absolute inset-0 overflow-hidden bg-print">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style={item.position ? { objectPosition: item.position } : undefined}
              />
            </div>
          ) : (
            <PrintedImage image={item} sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0" />
          )}
          {item.caption && (
            <span className="absolute bottom-0 left-0 bg-ink px-2 py-1 font-mono text-data-sm tracking-[0.06em] text-kraft uppercase">{item.caption}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
