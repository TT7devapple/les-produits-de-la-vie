import { Suspense } from "react";
import { store } from "@/data/store";
import { getAllProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Nos produits — pain, tartinables, épicerie fine végétale",
  description:
    "Pain paysan, tartinables, pestos, pâtes, biscuits, confitures, jus et tisanes : parcourez les produits 100 % végétaux à retrouver chez Les Produits de la Vie, 45 avenue de Paris à Vincennes.",
  path: "/nos-produits",
});

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <>
      <PageHeader
        title="Le catalogue, avant de passer la porte"
        intro={
          <>
            Un aperçu de la gamme. Tout est végétal, et le réassort arrive chaque {store.restockDay} : un produit peut manquer ponctuellement.
            {store.phone && (
              <>
                {" "}
                Un doute ? Appelez le{" "}
                <a href={store.phone.href} className="font-mono whitespace-nowrap underline decoration-2 underline-offset-4">
                  {store.phone.display}
                </a>
                .
              </>
            )}
          </>
        }
      />

      <section aria-label="Catalogue" className="pb-20 sm:pb-28">
        <Container>
          {/* useSearchParams nécessite une frontière Suspense ; le repli affiche toute la gamme (utile pour le référencement) */}
          <Suspense
            fallback={
              <div className="pt-24">
                <h2 className="sr-only">Produits</h2>
                <ProductGrid products={products} />
              </div>
            }
          >
            <ProductCatalog products={products} />
          </Suspense>

          <p className="mt-16 flex flex-col gap-3 border-t-2 border-ink pt-6 text-lg sm:flex-row sm:items-center sm:justify-between">
            <span>Vous ne trouvez pas ? La boutique en a souvent plus en rayon.</span>
            <Link href="/contact" className="font-bold tracking-[0.06em] uppercase underline decoration-2 underline-offset-[6px] hover:decoration-4">
              Demandez-nous
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
