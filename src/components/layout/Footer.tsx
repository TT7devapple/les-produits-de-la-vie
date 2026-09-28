import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { directionsUrl, store } from "@/data/store";
import { HoursTable } from "@/components/store/HoursTable";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const linkClass = "underline-offset-4 hover:underline decoration-2";

  return (
    <footer className="serrated-top-kraft">
      {/* pb-28 sur mobile : réserve la place de la barre d'actions fixe */}
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-28 sm:px-8 md:pb-10 lg:pt-20">
        {/* Le bas du sac : la marque et l'adresse imprimées d'un seul passage d'encre */}
        <div className="flex flex-col gap-6 border-t-2 border-ink pt-10 sm:flex-row sm:items-end sm:justify-between">
          <Logo size="lg" className="self-start" />
          <p className="max-w-sm text-lg sm:text-right">La boutique de Vincennes d&apos;une marque qui cultive, transforme et vend elle-même. Tout est végétal.</p>
        </div>
        <div className="mt-14 grid gap-10 border-t-2 border-ink pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <address className="not-italic">
            <h2 className="mb-3 font-bold tracking-[0.06em] uppercase">Adresse</h2>
            {store.address.street}
            <br />
            {store.address.postalCode} {store.address.city}
            <br />
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block ${linkClass} underline`}>
              Itinéraire
            </a>
          </address>

          <div>
            <h2 className="mb-3 font-bold tracking-[0.06em] uppercase">Horaires</h2>
            <HoursTable className="text-data" />
          </div>

          <div>
            <h2 className="mb-3 font-bold tracking-[0.06em] uppercase">Contact</h2>
            <ul className="space-y-1">
              {store.phone && (
                <li>
                  <a href={store.phone.href} className={linkClass}>
                    {store.phone.display}
                  </a>
                </li>
              )}
              {store.email && (
                <li>
                  <a href={`mailto:${store.email}`} className={linkClass}>
                    {store.email}
                  </a>
                </li>
              )}
              {store.socials.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label} {s.handle}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/contact" className={linkClass}>
                  Écrire à la boutique
                </Link>
              </li>
            </ul>
          </div>

          <nav aria-label="Pied de page">
            <h2 className="mb-3 font-bold tracking-[0.06em] uppercase">Le site</h2>
            <ul className="space-y-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t-2 border-ink pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {store.name} · Vincennes
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/mentions-legales" className={linkClass}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className={linkClass}>
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/conditions-de-vente" className={linkClass}>
                Conditions de vente
              </Link>
            </li>
            <li>
              <a href={store.brandWebsite} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${linkClass}`}>
                Site de la marque <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
