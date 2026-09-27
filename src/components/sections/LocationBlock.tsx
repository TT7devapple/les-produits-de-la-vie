import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { directionsUrl, store } from "@/data/store";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HoursTable } from "@/components/store/HoursTable";
import { MapEmbed } from "@/components/store/MapEmbed";

/**
 * Adresse, horaires de la semaine, accès et plan : l'aplat d'encre du sac.
 * `closing` : la dernière invitation de la page (question + lien de contact),
 * intégrée ici plutôt qu'en bandeau séparé.
 */
export function LocationBlock({
  title = "Au cœur de Vincennes",
  id = "vincennes-titre",
  closing,
}: {
  title?: string;
  id?: string;
  closing?: { question: string; text: string };
}) {
  return (
    <section aria-labelledby={id} className="on-ink serrated-top py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 id={id} className="display text-headline">
              {title}
            </h2>
            <p className="mt-5 max-w-md text-lg sm:text-xl">Sur l&apos;avenue de Paris, juste à la sortie du métro Bérault.</p>

            <address className="mt-12 text-subhead leading-[1.1] font-bold not-italic">
              {store.address.street}
              <br />
              {store.address.postalCode} {store.address.city}
            </address>
            <ul className="mt-5 space-y-1">
              {store.access.map((a) => (
                <li key={a.line}>
                  <span className="font-bold">{a.line}</span> · {a.station} — {a.note}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={directionsUrl} variant="knockout" icon={<ArrowRight className="h-4 w-4" />}>
                Voir l&apos;itinéraire
              </Button>
              {store.phone && (
                <Button href={store.phone.href} variant="outline-light" icon={<Phone className="h-4 w-4" />}>
                  {store.phone.display}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="label rotate-[0.8deg] px-5 pt-4 pb-3 text-data">
              <p className="border-b border-dashed border-print/40 pb-2 font-mono text-data-sm tracking-[0.08em] uppercase">Horaires de la semaine</p>
              <HoursTable className="mt-2" />
              <p className="mt-2 border-t border-dashed border-print/40 pt-2 font-mono text-data-sm">Arrivage chaque {store.restockDay}.</p>
            </div>
            <MapEmbed ground="var(--color-ink)" className="aspect-[4/3]" />
          </div>
        </div>

        {closing && (
          <p className="mt-16 flex flex-col gap-3 border-t-2 border-kraft/40 pt-6 text-lg sm:flex-row sm:items-center sm:justify-between">
            <span>
              <strong>{closing.question}</strong> {closing.text}
            </span>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 font-bold tracking-[0.06em] uppercase underline decoration-2 underline-offset-[6px] hover:decoration-4"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </p>
        )}
      </Container>
    </section>
  );
}
