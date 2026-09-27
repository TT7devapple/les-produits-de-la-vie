import { ArrowRight } from "lucide-react";
import { directionsUrl, store } from "@/data/store";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MapEmbed } from "@/components/store/MapEmbed";
import { HoursTable } from "@/components/store/HoursTable";
import { OpenStatus } from "@/components/store/OpenStatus";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = pageMetadata({
  title: "Contact & accès — 45 avenue de Paris, Vincennes",
  description:
    "Adresse, horaires, itinéraire et contact de l'épicerie Les Produits de la Vie : 45 avenue de Paris, 94300 Vincennes. Métro 1 Bérault. Ouvert du lundi au samedi 9h30–19h30 et le dimanche 10h30–14h30.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      {/* L'adresse est le titre de la page : c'est ce qu'on vient chercher. */}
      <header className="pt-28 pb-12 sm:pt-32 lg:pt-40">
        <Container>
          <h1 className="display text-display">
            45 avenue de Paris
            <br />
            94300 Vincennes
          </h1>
          <OpenStatus className="mt-6 text-lg" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={directionsUrl} icon={<ArrowRight className="h-4 w-4" />}>
              Voir l&apos;itinéraire
            </Button>
            {store.phone && (
              <Button href={store.phone.href} variant="outline">
                Appeler · {store.phone.display}
              </Button>
            )}
          </div>
        </Container>
      </header>

      <section id="venir" aria-labelledby="venir-titre" className="on-ink serrated-top scroll-mt-16 py-16 sm:py-24">
        <Container>
          <h2 id="venir-titre" className="sr-only">
            Horaires, accès et plan
          </h2>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-12 lg:col-span-5">
              <div className="label -rotate-[0.6deg] px-5 pt-4 pb-4 text-data">
                <p className="border-b border-dashed border-print/40 pb-2 font-mono text-data-sm tracking-[0.08em] uppercase">Horaires d&apos;ouverture</p>
                <HoursTable variant="daily" className="mt-2" />
                <p className="mt-2 border-t border-dashed border-print/40 pt-2 font-mono text-data-sm">
                  Arrivage chaque {store.restockDay}. Horaires susceptibles de varier les jours fériés.
                </p>
              </div>

              <div>
                <h3 className="mb-3 font-bold tracking-[0.06em] uppercase">Accès</h3>
                <ul className="space-y-1.5 text-lg">
                  {store.access.map((a) => (
                    <li key={a.line}>
                      <span className="font-bold">{a.line}</span> · {a.station} — {a.note}
                    </li>
                  ))}
                </ul>
              </div>

              {(store.phone || store.email || store.socials.length > 0) && (
                <div>
                  <h3 className="mb-3 font-bold tracking-[0.06em] uppercase">Nous joindre</h3>
                  <ul className="space-y-1.5 text-lg">
                    {store.phone && (
                      <li>
                        <a href={store.phone.href} className="font-mono underline decoration-2 underline-offset-4">
                          {store.phone.display}
                        </a>
                      </li>
                    )}
                    {store.email && (
                      <li>
                        <a href={`mailto:${store.email}`} className="underline decoration-2 underline-offset-4">
                          {store.email}
                        </a>
                      </li>
                    )}
                    {store.socials.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">
                          {s.label} {s.handle}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              <MapEmbed ground="var(--color-ink)" className="aspect-[4/5] sm:aspect-[4/3] lg:sticky lg:top-24 lg:aspect-auto lg:h-[min(40rem,calc(100svh-8rem))]" />
            </div>
          </div>
        </Container>
      </section>

      <section id="formulaire" aria-labelledby="formulaire-titre" className="scroll-mt-16 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionTitle
              id="formulaire-titre"
              className="lg:col-span-4"
              title="Une question ?"
              intro="Un produit à retrouver, une disponibilité à vérifier : laissez-nous un message."
            />
            <div className="lg:col-span-7 lg:col-start-6">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
