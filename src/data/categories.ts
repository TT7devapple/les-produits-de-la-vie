import type { Category, CategorySlug } from "@/types";
import { images } from "./images";

/**
 * Familles de produits présentées sur le site.
 *
 * Basées sur la gamme de la marque (produits-de-la-vie.com) et sur la
 * description de la boutique de Vincennes : « pain, légumes, jus,
 * tartinables, épicerie fine… ». L'ordre ici = l'ordre d'affichage.
 */
export const categories: Category[] = [
  {
    slug: "pains",
    name: "Pains & viennoiseries",
    tagline: "Miches paysannes, seigle, épeautre.",
    description:
      "De grosses miches vendues au quart ou à la demie, des pains d'épeautre et de seigle, et quelques croissants pour le week-end.",
    image: images.slicedSeedBread,
  },
  {
    slug: "tartinables",
    name: "Tartinables",
    tagline: "Pour l'apéritif ou la tartine du matin.",
    description:
      "Une large gamme de tartinables végétaux, de l'ail des ours à l'aubergine, à poser sur une tranche de pain paysan.",
    image: images.spreadsBowls,
  },
  {
    slug: "epicerie",
    name: "Épicerie salée",
    tagline: "Pestos, pâtes, sauces, assaisonnements.",
    description:
      "Les bases d'une bonne cuisine : pestos, pâtes sèches et fraîches, sauces tomate, légumineuses et mélanges d'assaisonnement.",
    image: images.herbsMortar,
  },
  {
    slug: "douceurs",
    name: "Douceurs & biscuits",
    tagline: "Biscuits, confitures, petites gourmandises.",
    description:
      "Biscuits, croquants, confitures et gelées, chips de pommes et graines à grignoter.",
    image: images.jamCookies,
  },
  {
    slug: "boissons",
    name: "Jus, sirops & tisanes",
    tagline: "Jus de légumes, sirops, infusions.",
    description:
      "Jus de légumes, sirops de fleurs, tisanes et café : de quoi remplir le placard des boissons.",
    image: images.carrotJuiceGlasses,
  },
  {
    slug: "fruits-legumes",
    name: "Fruits & légumes",
    tagline: "Selon la saison et les arrivages.",
    description:
      "Des fruits et légumes qui changent avec les saisons, réassortis chaque semaine avec le reste de la boutique.",
    image: images.leeksCarrots,
  },
];

export function getCategory(slug: CategorySlug): Category {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Catégorie inconnue : ${slug}`);
  return category;
}

export function isCategorySlug(value: string | null | undefined): value is CategorySlug {
  return categories.some((c) => c.slug === value);
}
