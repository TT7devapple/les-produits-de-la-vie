import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/products/ProductCard";
import { LabelArrival } from "@/components/products/LabelArrival";

// Les étiquettes sont posées à la main : légères inclinaisons, jamais identiques.
const tilts = ["-rotate-[0.8deg]", "rotate-[0.5deg]", "-rotate-[0.3deg]", "rotate-[0.9deg]", "-rotate-[0.6deg]", "rotate-[0.3deg]"];

/** « Nos coups de cœur » : produits marqués `featured: true` dans src/data/products.ts. */
export function FeaturedProducts() {
  const products = getFeaturedProducts(6);

  return (
    <section aria-labelledby="coups-de-coeur-titre" className="overflow-x-clip py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle id="coups-de-coeur-titre" title="Nos coups de cœur" intro="Quelques incontournables de la gamme, à goûter au moins une fois." />
          <Link href="/nos-produits" className="group inline-flex items-center gap-2 font-bold tracking-[0.06em] uppercase underline decoration-2 underline-offset-4">
            Tout le catalogue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>

      <div className="mx-auto mt-12 max-w-7xl lg:px-8">
        <LabelArrival
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pt-8 pb-10 lg:pt-2 lg:pb-6 [scrollbar-width:none] sm:px-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <li key={product.id} className={`w-[70vw] max-w-[19rem] shrink-0 snap-start will-change-transform lg:w-auto lg:max-w-none ${tilts[i % tilts.length]}`}>
              <ProductCard product={product} sizes="(min-width: 1024px) 30vw, 70vw" />
            </li>
          ))}
        </LabelArrival>
      </div>
    </section>
  );
}
