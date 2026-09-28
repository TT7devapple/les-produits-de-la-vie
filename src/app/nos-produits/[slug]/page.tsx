import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getCategory } from "@/data/categories";
import { site } from "@/data/site";
import { directionsUrl, store } from "@/data/store";
import { formatPrice, getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { OpenStatus } from "@/components/store/OpenStatus";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Availability } from "@/types";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

// Seuls les produits connus existent : toute autre URL renvoie une 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/nos-produits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const category = getCategory(product.category);
  const title = `${product.name} — ${category.name}`;
  const description = `${product.excerpt} ${product.format ? `Format : ${product.format}. ` : ""}À retrouver chez Les Produits de la Vie, épicerie végétale au 45 avenue de Paris, Vincennes.`;
  return {
    title,
    description,
    alternates: { canonical: `/nos-produits/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/nos-produits/${product.slug}`,
      images: [{ url: absoluteUrl(product.image.src.src), width: product.image.src.width, height: product.image.src.height, alt: product.image.alt }],
    },
  };
}

const availabilityLabel: Record<Exclude<Availability, "unknown">, string> = {
  "in-store": "Disponible en boutique",
  seasonal: "Selon la saison",
  "out-of-stock": "Momentanément indisponible",
};

export default async function ProductPage({ params }: PageProps<"/nos-produits/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelatedProducts(product, 3);
  const showPrice = site.features.showPrices && product.price !== undefined;

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Nos produits", path: "/nos-produits" },
    { name: product.name, path: `/nos-produits/${product.slug}` },
  ];

  const details = [
    { label: "Rayon", value: category.name },
    ...(product.format ? [{ label: "Format", value: product.format }] : []),
    ...(product.organic ? [{ label: "Mention", value: "Bio" }] : []),
    { label: "Composition", value: "100 % végétale" },
    ...(product.details ?? []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <section className="pt-24 pb-20 sm:pt-28 lg:pt-32 lg:pb-28">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
            {/* Photo, posée comme une étiquette sur le kraft */}
            <div className="lg:col-span-6">
              <div className="label -rotate-[0.6deg] p-2.5 lg:sticky lg:top-28">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-print/10">
                  <Image src={product.image.src} alt={product.image.alt} fill preload placeholder="blur" sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" style={product.image.position ? { objectPosition: product.image.position } : undefined} />
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="lg:col-span-6">
              <h1 className="display text-display">{product.name}</h1>
              {showPrice && <p className="mt-5 font-mono text-3xl">{formatPrice(product.price!)}</p>}
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed sm:text-xl">{product.description}</p>

              {/* Étiquette de balance du produit */}
              <div className="label mt-10 max-w-md rotate-[0.5deg] px-5 pt-4 pb-4 font-mono text-data">
                <p className="flex justify-between gap-3 border-b border-dashed border-print/40 pb-2 text-data-sm tracking-[0.08em] uppercase">
                  <span>{store.name}</span>
                  <span>Vincennes</span>
                </p>
                <p className="mt-3 font-sans text-xl leading-tight font-bold">{product.name}</p>
                <dl className="mt-3 space-y-1 border-t border-dashed border-print/40 pt-3">
                  {details.map((d) => (
                    <div key={d.label} className="leader">
                      <dt>{d.label}</dt>
                      <dd className="text-right">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* En boutique */}
              <div className="mt-10 border-t-2 border-ink pt-6">
                <h2 className="text-lg font-bold tracking-[0.06em] uppercase">En boutique</h2>
                {product.availability !== "unknown" ? (
                  <p className="mt-2 text-lg">{availabilityLabel[product.availability]}</p>
                ) : (
                  <p className="mt-2 max-w-[52ch] text-lg leading-snug">
                    La sélection évolue chaque semaine, avec un arrivage le {store.restockDay}.
                    {store.phone ? " Pour être sûr de le trouver, appelez avant de venir." : " Demandez-nous pour être sûr de le trouver."}
                  </p>
                )}
                <OpenStatus className="mt-4" />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact#venir" icon={<ArrowRight className="h-4 w-4" />}>
                    Voir en boutique
                  </Button>
                  {store.phone ? (
                    <Button href={store.phone.href} variant="outline">
                      Appeler la boutique
                    </Button>
                  ) : (
                    <Button href={directionsUrl} variant="outline">
                      Voir l&apos;itinéraire
                    </Button>
                  )}
                </div>
              </div>

              <Link href={`/nos-produits?categorie=${category.slug}`} className="group mt-10 inline-flex items-center gap-2 font-bold tracking-[0.05em] uppercase underline decoration-2 underline-offset-4">
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                Rayon {category.name}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="suggestions-titre" className="border-t-2 border-ink py-20 sm:py-24">
          <Container>
            <h2 id="suggestions-titre" className="display text-headline">
              Vous pourriez également aimer
            </h2>
            <ProductGrid products={related} wide={false} className="mt-10" />
          </Container>
        </section>
      )}
    </>
  );
}