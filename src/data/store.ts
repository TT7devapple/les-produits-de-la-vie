import type { OpeningPeriod } from "@/types";

/**
 * ============================================================
 *  INFORMATIONS DE LA BOUTIQUE — à modifier ici uniquement.
 *  Tout le site (en-tête, pied de page, page contact, données
 *  structurées Google) lit ce fichier.
 * ============================================================
 *
 * Sources utilisées (vérifiées le 26/09/2026) :
 * - Adresse, horaires, « 100 % vegan », réassort du jeudi :
 *   publication « Vincennes, mes commerces » du 19/02/2026
 *   (Facebook & Instagram @vincennesmescommerces).
 * - Coordonnées GPS : OpenStreetMap (Nominatim).
 * - Stations à proximité : OpenStreetMap.
 * - Démarche de la marque (8 fermes en Bavière, depuis 1983,
 *   « du champ au client ») : site officiel produits-de-la-vie.com
 *   et fiche exposant du salon Marjolaine.
 */
export const store = {
  name: "Les Produits de la Vie",
  shortDescription: "Épicerie 100 % végétale à Vincennes",

  address: {
    street: "45 avenue de Paris",
    postalCode: "94300",
    city: "Vincennes",
    region: "Île-de-France",
    country: "FR",
  },

  geo: { latitude: 48.8453359, longitude: 2.4292295 },

  /**
   * ⚠️ À CONFIRMER — numéro trouvé uniquement sur l'annuaire HappyCow.
   * Mettre `phone: null` pour masquer toutes les mentions du téléphone.
   */
  phone: {
    display: "09 83 43 30 10",
    href: "tel:+33983433010",
    international: "+33 9 83 43 30 10",
  } as { display: string; href: string; international: string } | null,

  /** Aucune adresse e-mail publique connue pour la boutique. */
  email: null as string | null,

  /** Horaires vérifiés (heure de Paris). */
  openingHours: [
    { days: [1, 2, 3, 4, 5, 6], opens: "09:30", closes: "19:30" },
    { days: [0], opens: "10:30", closes: "14:30" },
  ] satisfies OpeningPeriod[],

  /** Jour de réassort (pain, légumes, produits frais). */
  restockDay: "jeudi",
  /** Même jour, en numéro (0 = dimanche … 4 = jeudi). */
  restockWeekday: 4,

  access: [
    { line: "Métro 1", station: "Bérault", note: "juste devant la boutique" },
    { line: "RER A", station: "Vincennes", note: "à environ 500 m" },
  ],

  /**
   * ⚠️ À CONFIRMER — compte Instagram trouvé en ligne, non confirmé
   * comme étant celui de la boutique de Vincennes.
   */
  socials: [
    {
      network: "instagram" as const,
      label: "Instagram",
      handle: "@produitsdelavie_",
      url: "https://www.instagram.com/produitsdelavie_/",
    },
  ],

  /** Site officiel de la marque (boutique en ligne). */
  brandWebsite: "https://www.produits-de-la-vie.com",
} as const;

export const fullAddress = `${store.address.street}, ${store.address.postalCode} ${store.address.city}`;

const encodedAddress = encodeURIComponent(`${store.name}, ${fullAddress}`);

/** Lien d'itinéraire universel (ouvre Google Maps ou l'app de navigation sur mobile). */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

/** Carte intégrée (sans clé d'API). Chargée uniquement à la demande du visiteur. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&z=17&output=embed`;
