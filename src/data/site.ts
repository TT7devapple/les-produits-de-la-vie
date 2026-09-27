/**
 * Réglages généraux du site.
 */
export const site = {
  /**
   * ⚠️ À REMPLACER par le vrai nom de domaine avant la mise en ligne
   * (ou définir la variable d'environnement NEXT_PUBLIC_SITE_URL).
   * Utilisé pour le sitemap, les URL canoniques et Open Graph.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.lesproduitsdelavie-vincennes.fr").replace(/\/$/, ""),
  locale: "fr_FR",
  title: "Les Produits de la Vie — Épicerie végétale à Vincennes",
  description:
    "Épicerie 100 % végétale au 45 avenue de Paris à Vincennes : pain paysan, tartinables, épicerie fine, jus, douceurs et légumes, réassortis chaque jeudi. Ouvert 7 jours sur 7.",

  nav: [
    { href: "/", label: "Accueil" },
    { href: "/la-boutique", label: "La boutique" },
    { href: "/nos-produits", label: "Nos produits" },
    { href: "/contact", label: "Contact" },
  ],

  /**
   * Fonctionnalités à activer plus tard.
   * `onlineOrdering` : prévu pour la future commande en ligne
   * (panier, click & collect). Laisser à false tant que rien n'est branché.
   */
  features: {
    onlineOrdering: false,
    showPrices: false,
  },
} as const;
