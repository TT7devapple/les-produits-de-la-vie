import type { Metadata } from "next";
import { site } from "@/data/site";
import { store } from "@/data/store";
import { images } from "@/data/images";

const DAY_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path === "/" ? "" : path}`;
}

/** Métadonnées d'une page : titre, description, canonique, Open Graph. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Données structurées de la boutique (schema.org GroceryStore). */
export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": `${site.url}/#boutique`,
    name: store.name,
    description: site.description,
    url: site.url,
    image: absoluteUrl(images.hero.src.src),
    ...(store.phone ? { telephone: store.phone.international } : {}),
    ...(store.email ? { email: store.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address.street,
      postalCode: store.address.postalCode,
      addressLocality: store.address.city,
      addressRegion: store.address.region,
      addressCountry: store.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.geo.latitude,
      longitude: store.geo.longitude,
    },
    openingHoursSpecification: store.openingHours.map((p) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: p.days.map((d) => DAY_SCHEMA[d]),
      opens: p.opens,
      closes: p.closes,
    })),
    ...(store.socials.length ? { sameAs: store.socials.map((s) => s.url) } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
