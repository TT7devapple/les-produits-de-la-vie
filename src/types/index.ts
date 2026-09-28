import type { StaticImageData } from "next/image";

/** Une image du site : fichier + texte alternatif (obligatoire pour l'accessibilité). */
export interface SiteImage {
  src: StaticImageData;
  alt: string;
  /** Point de cadrage (object-position), ex. "40% 25%". Centre par défaut. */
  position?: string;
  /** Vraie photo de la marque : reste en couleur, même dans les planches « imprimées ». */
  genuine?: boolean;
}

export type CategorySlug =
  | "pains"
  | "tartinables"
  | "epicerie"
  | "douceurs"
  | "boissons"
  | "fruits-legumes";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Phrase courte affichée sur les cartes de catégorie. */
  tagline: string;
  /** Texte un peu plus long pour la page « La boutique ». */
  description: string;
  image: SiteImage;
}

/**
 * Disponibilité en boutique.
 * - "unknown" : non renseignée → aucun badge affiché, message générique.
 * Préparé pour une future synchronisation avec une caisse / un stock.
 */
export type Availability = "in-store" | "seasonal" | "out-of-stock" | "unknown";

export interface ProductDetail {
  label: string;
  value: string;
}

export interface Product {
  /** Identifiant stable (futur SKU / référence de commande). */
  id: string;
  /** Utilisé dans l'URL : /nos-produits/[slug] */
  slug: string;
  name: string;
  category: CategorySlug;
  /** Une phrase, affichée sur les cartes. */
  excerpt: string;
  /** Texte complet de la page produit. */
  description: string;
  /** Format / contenance, tel qu'indiqué par la marque. */
  format?: string;
  /** Mention « Bio » telle qu'affichée par la marque. */
  organic?: boolean;
  /** Prix en boutique, en euros. Laisser vide tant qu'il n'est pas confirmé. */
  price?: number;
  details?: ProductDetail[];
  availability: Availability;
  /** Affiché dans « Nos coups de cœur » sur l'accueil. */
  featured?: boolean;
  image: SiteImage;
}

export interface OpeningPeriod {
  /** 0 = dimanche, 1 = lundi … 6 = samedi */
  days: number[];
  /** Format "HH:MM" (heure de Paris) */
  opens: string;
  closes: string;
}
