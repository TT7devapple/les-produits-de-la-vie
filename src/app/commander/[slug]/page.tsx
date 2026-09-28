import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getShopProduct, getShopProducts, lowestPrice, slugifyCategory } from "@/data/shop";
import { formatPrice } from "@/lib/products";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Stamp } from "@/components/ui/Stamp";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { AddToCart } from "@/components/shop/AddToCart";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return getShopProducts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/commander/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getShopProduct(slug);
  if (!p) return {};
  const description = `${p.name} — dès ${formatPrice(lowestPrice(p))}. À commander en ligne et retirer chez Les Produits de la Vie, 45 avenue de Paris, Vincennes.`;
  return {
    title: `${p.name} — commander`,
    description,
    alternates: { canonical: `/commander/${p.slug}` },
    openGraph: { title: p.name, description, url: `/commander/${p.slug}`, ...(p.image ? { images: [{ url: absoluteUrl(p.image), width: 640, height: 640, alt: p.name }] } : {}) },
  };
}

const n = (v: number | null, unit = "g") => (v === null ? "—" : `${v.toLocaleString("fr-FR")} ${unit}`);

export default async function ShopProductPage({ params }: PageProps<"/commander/[slug]">) {
  const { slug } = await params;
  const p = getShopProduct(slug);
  if (!p) notFound();

  const crumbs = [
    { name: "Commander", path: "/commander" },
    { name: p.category, path: `/commander?rayon=${slugifyCategory(p.category)}` },
    { name: p.name, path: `/commander/${p.slug}` },
  ];
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    ...(p.description ? { description: p.description.slice(0, 500) } : {}),
    sku: p.id,
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      name: v.label,
      price: v.price.toFixed(2),
      priceCurrency: "EUR",
      availability: v.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/commander/${p.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={productLd} />

      <section className="pt-24 pb-20 sm:pt-28 lg:pt-32 lg:pb-28">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="label relative -rotate-[0.6deg] p-3 lg:sticky lg:top-28">
                <div className="relative aspect-square bg-white">
                  {p.image && <Image src={p.image} alt={p.name} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-4" />}
                </div>
                {p.fresh && (
                  <div className="absolute -top-3 right-4 text-ink">
                    <Stamp rotate={6} className="bg-kraft text-xl">
                      Produit frais
                    </Stamp>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <h1 className="display text-display [text-wrap:balance]">{p.name}</h1>
              {p.description && (
                <div className="mt-6 max-w-[60ch] space-y-3 text-lg leading-relaxed">
                  {p.description.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              <div className="mt-10 border-t-2 border-ink pt-8">
                <AddToCart variants={p.variants} productName={p.name} />
              </div>
              <p className="mt-2 text-sm">Retrait au 45 avenue de Paris, Vincennes. Prix TTC, identiques à la boutique en ligne de la marque.</p>

              {/* Composition imprimée sur l'étiquette */}
              {(p.ingredients || p.nutrition || p.organic) && (
                <div className="label mt-12 max-w-xl rotate-[0.4deg] px-5 pt-4 pb-5 text-data">
                  <p className="flex justify-between gap-3 border-b border-dashed border-print/40 pb-2 font-mono text-data-sm tracking-[0.08em] uppercase">
                    <span>Composition</span>
                    <span>{p.id}</span>
                  </p>
                  {p.ingredients && (
                    <div className="mt-3">
                      <p className="font-mono text-data-sm uppercase">Ingrédients</p>
                      <p className="mt-1 leading-relaxed">{p.ingredients}</p>
                    </div>
                  )}
                  {p.traces && <p className="mt-2 text-print-soft">{p.traces}</p>}
                  {p.organic && (
                    <p className="mt-3 font-mono text-data-sm">
                      Bio{p.organicControl ? ` · certification ${p.organicControl}` : ""}
                    </p>
                  )}
                  {p.nutrition && (
                    <div className="mt-4 border-t border-dashed border-print/40 pt-3">
                      <p className="font-mono text-data-sm uppercase">Valeurs nutritionnelles pour {p.nutrition.per}</p>
                      <dl className="mt-2 space-y-0.5 font-mono">
                        {[
                          ["Énergie", p.nutrition.kj !== null ? `${n(p.nutrition.kj, "kJ")} / ${n(p.nutrition.kcal, "kcal")}` : "—"],
                          ["Matières grasses", n(p.nutrition.fat)],
                          ["dont acides gras saturés", n(p.nutrition.saturated)],
                          ["Glucides", n(p.nutrition.carbs)],
                          ["dont sucres", n(p.nutrition.sugar)],
                          ["Protéines", n(p.nutrition.protein)],
                          ["Sel", n(p.nutrition.salt)],
                        ].map(([k, v]) => (
                          <div key={k} className="leader">
                            <dt className={k.startsWith("dont") ? "pl-3" : undefined}>{k}</dt>
                            <dd className="tabular-nums">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              )}

              <Link href={`/commander?rayon=${slugifyCategory(p.category)}`} className="group mt-10 inline-flex items-center gap-2 font-bold tracking-[0.05em] uppercase underline decoration-2 underline-offset-4">
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                Rayon {p.category}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
