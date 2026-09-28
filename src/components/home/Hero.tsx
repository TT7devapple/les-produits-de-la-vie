import { ArrowRight } from "lucide-react";
import { images } from "@/data/images";
import { store } from "@/data/store";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PrintedImage } from "@/components/ui/PrintedImage";
import { Stamp } from "@/components/ui/Stamp";
import { ScaleLabel } from "@/components/store/ScaleLabel";

/** Premier écran : le titre imprimé, l'étiquette du jour agrafée à côté, puis la photo en bandeau. */
export function Hero() {
  return (
    <section aria-labelledby="hero-titre" className="relative">
      <div className="relative pt-24 pb-10 sm:pt-28 lg:pt-32">
        <Container>
          {/* Mobile : titre → étiquette du jour → actions. Desktop : l'étiquette occupe la colonne de droite. */}
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">
            <div className="lg:col-span-8">
              <h1 id="hero-titre" className="display text-display">
                <span className="block">Le goût des bonnes choses,</span>
                <span className="block">À Vincennes.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lead leading-snug">
                La boutique d&apos;une ferme bavaroise, au pied du métro {store.access[0].station}. Pain paysan, épicerie, douceurs&nbsp;: tout
                est végétal, et le réassort arrive chaque {store.restockDay}.
              </p>
            </div>

            <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:pt-3">
              <ScaleLabel className="mx-auto max-w-sm rotate-[1.2deg] sm:mx-0" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-8 lg:row-start-2">
              <Button href="/contact#venir" icon={<ArrowRight className="h-4 w-4" />}>
                Nous trouver
              </Button>
              <Button href="/la-boutique" variant="outline">
                Découvrir la boutique
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <div className="relative mt-4">
        <PrintedImage image={images.hero} sizes="100vw" preload className="aspect-[4/3] sm:aspect-[21/9]" />
        <div className="absolute right-4 bottom-4 text-kraft sm:right-8 sm:bottom-8">
          <Stamp rotate={-6} className="bg-ink text-2xl sm:text-4xl">
            Arrivage le {store.restockDay}
          </Stamp>
        </div>
      </div>
    </section>
  );
}
