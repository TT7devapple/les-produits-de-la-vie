import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Hero } from "@/components/home/Hero";
import { FarmToShop } from "@/components/home/FarmToShop";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryIndex } from "@/components/products/CategoryIndex";
import { LocationBlock } from "@/components/sections/LocationBlock";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FarmToShop />
      <section aria-labelledby="rayons-titre" className="pt-20 sm:pt-28">
        <Container>
          <SectionTitle id="rayons-titre" title="À découvrir en boutique" intro="Six rayons, du pain du matin aux douceurs du goûter." />
          <CategoryIndex className="mt-10" />
        </Container>
      </section>
      <FeaturedProducts />
      <LocationBlock closing={{ question: "Une envie particulière ?", text: "Passez nous voir en boutique." }} />
    </>
  );
}
