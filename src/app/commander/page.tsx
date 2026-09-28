import { Suspense } from "react";
import { getShopProducts, lowestPrice, shopCategories } from "@/data/shop";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { ShopCard, type ShopCardData } from "@/components/shop/ShopCard";

export const metadata = pageMetadata({
  title: "Commander — toute la gamme, à retirer en boutique",
  description:
    "Commandez en ligne toute la gamme Les Produits de la Vie — pains, tartinades, pestos, douceurs, boissons, cosmétiques — aux prix de la marque, et retirez-la au 45 avenue de Paris à Vincennes.",
  path: "/commander",
});

export default function OrderPage() {
  // Données allégées pour les cartes : le catalogue complet reste côté serveur.
  const cards: ShopCardData[] = getShopProducts().map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    image: p.image,
    organic: p.organic,
    fresh: p.fresh,
    minPrice: lowestPrice(p),
    formats: p.variants.length,
    singleSku: p.variants.length === 1 && p.variants[0].available ? p.variants[0].sku : null,
    singleLabel: p.variants.length === 1 ? p.variants[0].label : null,
  }));

  return (
    <>
      <PageHeader
        title="Commander"
        intro={
          <>
            Toute la gamme de la marque, aux mêmes prix que sa boutique en ligne. Vous commandez ici, vous choisissez votre jour, vous retirez au 45
            avenue de Paris — sans frais de livraison.
          </>
        }
      >
        <ol className="mt-8 grid max-w-3xl gap-2 font-mono text-data sm:grid-cols-3">
          {["Remplissez le panier", "Choisissez le jour de retrait", "Récupérez en boutique"].map((s, i) => (
            <li key={s} className="flex items-center gap-3 border-t-2 border-ink pt-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-ink text-kraft">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </PageHeader>

      <section aria-label="Catalogue à commander" className="pb-20 sm:pb-28">
        <Container>
          <Suspense
            fallback={
              <ul className="grid grid-cols-2 gap-3 pt-24 sm:gap-5 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
                {cards.map((p) => (
                  <li key={p.slug}>
                    <ShopCard p={p} />
                  </li>
                ))}
              </ul>
            }
          >
            <ShopCatalog products={cards} categories={shopCategories} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
