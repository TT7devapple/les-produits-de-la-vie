import Link from "next/link";
import { directionsUrl, store } from "@/data/store";

/**
 * Barre d'actions fixe en bas d'écran, sur mobile uniquement :
 * itinéraire et appel toujours à portée de pouce.
 */
export function MobileActionBar() {
  const block = "flex min-h-12 items-center justify-center text-ui font-bold tracking-[0.06em] uppercase";
  return (
    <nav aria-label="Actions rapides" className="on-ink fixed inset-x-0 bottom-0 z-30 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={`${block} bg-kraft text-ink`}>
          Itinéraire
        </a>
        {store.phone ? (
          <a href={store.phone.href} className={`${block} border-2 border-kraft`}>
            Appeler
          </a>
        ) : (
          <Link href="/contact#venir" className={`${block} border-2 border-kraft`}>
            Horaires
          </Link>
        )}
      </div>
    </nav>
  );
}
