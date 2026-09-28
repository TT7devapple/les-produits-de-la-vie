import { images } from "@/data/images";
import { store } from "@/data/store";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrintedImage } from "@/components/ui/PrintedImage";
import { Stamp } from "@/components/ui/Stamp";
import { PageHeader } from "@/components/sections/PageHeader";
import { Gallery } from "@/components/sections/Gallery";
import { LocationBlock } from "@/components/sections/LocationBlock";
import { CategoryIndex } from "@/components/products/CategoryIndex";

export const metadata = pageMetadata({
  title: "La boutique — épicerie 100 % végétale, avenue de Paris",
  description:
    "Découvrez Les Produits de la Vie, épicerie 100 % végétale au 45 avenue de Paris à Vincennes : des produits issus de fermes écologiques de Bavière, du champ au client, sans intermédiaire.",
  path: "/la-boutique",
});

/**
 * Démarche de la marque, reprise du site officiel produits-de-la-vie.com
 * (page « L'agriculture pacifique végétalienne »).
 */
const principles = [
  { title: "Pas d'élevage", text: "Les fermes ne pratiquent pas l'élevage : aucun produit animal, ni dans les assiettes, ni dans les champs." },
  {
    title: "Des sols respectés",
    text: "Pas de fumier, pas de lisier, pas d'engrais chimiques ni de pesticides. Les champs se reposent une année complète après deux années de culture.",
  },
  { title: "Moulu sur meule de pierre", text: "Le grain est moulu en douceur sur une meule de pierre, pour conserver son germe intact." },
  { title: "Sans intermédiaire", text: "Moulin, boulangerie, biscuiterie : les fermes transforment elles-mêmes et vendent directement, jusqu'aux rayons de Vincennes." },
];

export default function BoutiquePage() {
  return (
    <>
      <PageHeader
        title="Une épicerie 100 % végétale au cœur de Vincennes"
        intro="Pain, tartinables, épicerie fine, jus, douceurs et légumes. Tout vient des mêmes fermes, et tout est végétal."
        image={images.oliveBread}
      />

      {/* Présentation */}
      <section aria-labelledby="presentation-titre" className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-10 border-t-2 border-ink pt-10 lg:grid-cols-12">
            <h2 id="presentation-titre" className="display text-subhead lg:col-span-4">
              Bienvenue au 45, avenue de Paris
            </h2>
            <div className="space-y-5 text-lg leading-relaxed lg:col-span-7 lg:col-start-6">
              <p className="text-lead leading-snug font-semibold">
                Les Produits de la Vie, c&apos;est une marque qui cultive, transforme et vend elle-même ce qu&apos;elle produit. À Vincennes, c&apos;est
                aussi une boutique de quartier où l&apos;on vient faire ses courses et demander conseil.
              </p>
              <p>
                En rayon, tout est végétal. De grosses miches de pain paysan vendues au quart, une large gamme de tartinables, des pestos, des pâtes,
                des jus de légumes, des biscuits, des confitures, des tisanes… et des fruits et légumes qui changent avec les saisons.
              </p>
              <p>
                Le réassort arrive chaque {store.restockDay} : c&apos;est le bon jour pour trouver le pain et les légumes au plus frais. On vous accueille
                toute la semaine, et même le dimanche matin.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Philosophie */}
      <section aria-labelledby="philosophie-titre" className="on-ink serrated-top py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionTitle
                id="philosophie-titre"
                title="Du champ au client"
                intro="Depuis 1983, huit fermes écologiques de Bavière travaillent selon ce que la marque appelle l'« agriculture pacifique »."
              />
              <div className="relative mt-10">
                <PrintedImage image={images.stoneMill} sizes="(min-width: 1024px) 36vw, 100vw" className="aspect-[4/5] max-w-md" />
                <div className="absolute -right-2 bottom-8 text-kraft sm:right-auto sm:left-[18rem]">
                  <Stamp rotate={4} className="bg-ink text-2xl">
                    Meule de pierre
                  </Stamp>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <dl className="border-t-2 border-kraft/40">
                {principles.map((p) => (
                  <div key={p.title} className="border-b-2 border-kraft/40 py-6">
                    <dt className="display text-subhead">{p.title}</dt>
                    <dd className="mt-2 max-w-[52ch] text-lg leading-snug">{p.text}</dd>
                  </div>
                ))}
              </dl>
              <blockquote className="mt-12">
                <p className="display text-headline">«&nbsp;Du champ au client — sans intermédiaires.&nbsp;»</p>
                <footer className="mt-4 font-mono text-sm">
                  La devise de la marque ·{" "}
                  <a href={store.brandWebsite} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">
                    produits-de-la-vie.com
                  </a>
                </footer>
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* Sélection */}
      <section aria-labelledby="selection-titre" className="py-20 sm:py-28">
        <Container>
          <SectionTitle id="selection-titre" title="Ce que vous trouverez en rayon" intro="Six rayons pour remplir le panier de la semaine." />
          <CategoryIndex className="mt-10" showDescription />
        </Container>
      </section>

      {/* Galerie */}
      <section aria-labelledby="galerie-titre" className="pb-20 sm:pb-28">
        <Container>
          <SectionTitle id="galerie-titre" title="Un avant-goût de la boutique" />
          <Gallery
            className="mt-10"
            items={[
              { ...images.standCounter, caption: "Au comptoir" },
              images.mandeletti,
              { ...images.brandJuices, caption: "Jus de légumes" },
              images.pestoToast,
              { ...images.rusticLoaf, caption: "Pain paysan" },
              { ...images.beets, caption: "Selon la saison" },
            ]}
          />
        </Container>
      </section>

      <LocationBlock
        title="Venir nous voir"
        id="infos-titre"
        closing={{ question: "Une question ?", text: "Un produit à retrouver, une envie à satisfaire : demandez-nous." }}
      />
    </>
  );
}
