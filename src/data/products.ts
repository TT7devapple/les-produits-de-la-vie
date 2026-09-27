import type { Product } from "@/types";
import { images } from "./images";

/**
 * ============================================================
 *  PRODUITS — données de démonstration réalistes
 * ============================================================
 * Noms, formats et mention « Bio » : repris tels quels de la gamme
 * publiée sur le site officiel de la marque (produits-de-la-vie.com,
 * consulté le 26/09/2026).
 *
 * ⚠️ À VALIDER AVEC LA BOUTIQUE :
 *  - la présence de chaque produit en rayon à Vincennes ;
 *  - les prix en boutique (champ `price`, laissé vide volontairement) ;
 *  - les photos (temporaires, voir src/data/images.ts).
 *
 * Pour ajouter un produit : copier un bloc, changer `id`, `slug`
 * (unique, sans accents ni espaces) et les textes.
 * Pour le mettre en avant sur l'accueil : `featured: true`.
 */
export const products: Product[] = [
  // ——— Pains & viennoiseries ———
  {
    id: "pain-paysan-nature",
    slug: "pain-paysan-nature",
    name: "Pain paysan nature",
    category: "pains",
    excerpt: "La grande miche de campagne, vendue au quart.",
    description:
      "Le pain de tous les jours : une grande miche paysanne, découpée et vendue au quart. On la tranche au fil des repas, du petit-déjeuner au dîner, et elle se marie avec à peu près tout ce que vous trouverez dans la boutique.",
    format: "1/4 de miche de 1 kg",
    organic: true,
    availability: "unknown",
    featured: true,
    image: images.rusticLoaf,
  },
  {
    id: "pain-seigle-avoine",
    slug: "pain-seigle-avoine",
    name: "Pain seigle-avoine",
    category: "pains",
    excerpt: "Un pain de seigle et d'avoine, en format d'un kilo.",
    description:
      "Un pain au seigle et à l'avoine, pour celles et ceux qui aiment les mies plus denses et les saveurs de céréales. Parfait en tartine, avec un tartinable ou une confiture.",
    format: "1 kg",
    organic: true,
    availability: "unknown",
    image: images.slicedSeedBread,
  },
  {
    id: "miche-seigle-epeautre",
    slug: "miche-seigle-epeautre",
    name: "Miche seigle-épeautre",
    category: "pains",
    excerpt: "Le mariage du seigle et de l'épeautre, en belle miche.",
    description:
      "Une miche qui associe seigle et épeautre. Un pain de caractère, à poser au centre de la table.",
    format: "1 kg",
    organic: true,
    availability: "unknown",
    image: images.loafBoard,
  },
  {
    id: "croissants-epeautre",
    slug: "croissants-epeautre",
    name: "Croissants d'épeautre",
    category: "pains",
    excerpt: "Des croissants à l'épeautre, pour le petit-déjeuner.",
    description:
      "Des croissants à base d'épeautre, vendus par cinq. De quoi préparer un petit-déjeuner du week-end entièrement végétal.",
    format: "5 pièces de 75 g",
    organic: true,
    availability: "unknown",
    image: images.croissant,
  },

  // ——— Tartinables ———
  {
    id: "ibi-tziki",
    slug: "ibi-tziki",
    name: "iBi-tziki avec beaucoup d'ail",
    category: "tartinables",
    excerpt: "Un tartinable qui annonce la couleur : beaucoup d'ail.",
    description:
      "Un tartinable de la gamme iBi, qui ne cache pas son ingrédient vedette : l'ail, et beaucoup. Sur une tranche de pain paysan, avec des crudités ou à l'heure de l'apéritif.",
    format: "170 g",
    organic: true,
    availability: "unknown",
    featured: true,
    image: images.spreadGarlic,
  },
  {
    id: "ibi-ail-des-ours",
    slug: "ibi-ail-des-ours",
    name: "iBi Ail des ours",
    category: "tartinables",
    excerpt: "Le goût vert et doux de l'ail des ours, à tartiner.",
    description:
      "Un tartinable de la gamme iBi à l'ail des ours. À étaler sur du pain frais, ou à servir en petit bol avec des légumes croquants.",
    format: "135 g",
    organic: true,
    availability: "unknown",
    image: images.spreadsBowls,
  },

  // ——— Épicerie salée ———
  {
    id: "pesto-basilic-citron",
    slug: "pesto-basilic-citron",
    name: "Pesto basilic et citron",
    category: "epicerie",
    excerpt: "Un pesto au basilic relevé d'une touche de citron.",
    description:
      "Un pesto au basilic et au citron, en bocal. Sur des pâtes, dans une salade, sur une tartine grillée ou un légume rôti.",
    format: "190 ml",
    organic: true,
    availability: "unknown",
    featured: true,
    image: images.pestoJar,
  },
  {
    id: "sapori",
    slug: "sapori",
    name: "Sapori",
    category: "epicerie",
    excerpt: "L'assaisonnement de la maison, en boîte.",
    description:
      "Sapori, c'est le mélange d'assaisonnement de la marque. Une pincée dans une soupe, sur des légumes ou dans une sauce. Il existe aussi en recharge et en versions à l'ail ou au piment fort.",
    format: "Boîte de 250 g",
    organic: true,
    availability: "unknown",
    image: images.seasoning,
  },
  {
    id: "spaghettis-faits-main",
    slug: "spaghettis-faits-main",
    name: "Spaghettis de blé dur faits à la main",
    category: "epicerie",
    excerpt: "Des spaghettis de blé dur, faits à la main.",
    description:
      "Des spaghettis de blé dur faits à la main, vendus par deux paquets. Avec un pesto de la boutique ou une simple sauce tomate.",
    format: "2 × 250 g",
    organic: true,
    availability: "unknown",
    image: images.spaghetti,
  },
  {
    id: "pates-fraiches-potimarron",
    slug: "pates-fraiches-potimarron",
    name: "Pâtes fraîches aux potimarrons",
    category: "epicerie",
    excerpt: "Des pâtes fraîches aux couleurs de l'automne.",
    description:
      "Des pâtes fraîches au potimarron. Un filet d'huile, quelques herbes, et le dîner est prêt.",
    format: "250 g",
    organic: true,
    availability: "unknown",
    image: images.pumpkin,
  },

  // ——— Douceurs & biscuits ———
  {
    id: "croquants-amandes",
    slug: "croquants-amandes",
    name: "Croquants aux amandes",
    category: "douceurs",
    excerpt: "Des biscuits croquants aux amandes, pour le thé.",
    description:
      "Des croquants aux amandes, à glisser à côté d'une tisane ou d'un café. Le genre de biscuit qu'on promet de ne pas finir dans la journée.",
    format: "200 g",
    organic: true,
    availability: "unknown",
    featured: true,
    image: images.almondCookies,
  },
  {
    id: "galets-chocolat",
    slug: "galets-chocolat",
    name: "Galets au chocolat",
    category: "douceurs",
    excerpt: "Des biscuits au chocolat, ronds comme des galets.",
    description:
      "Des biscuits au chocolat en forme de galets. Pour le goûter, ou pour la pause de l'après-midi.",
    format: "200 g",
    organic: true,
    availability: "unknown",
    image: images.chocolateCookies,
  },
  {
    id: "confiture-prunes",
    slug: "confiture-prunes",
    name: "Confiture aux prunes",
    category: "douceurs",
    excerpt: "Une confiture de prunes, pour les tartines du matin.",
    description:
      "Une confiture aux prunes, en pot. Sur une tranche de pain paysan ou de pain seigle-avoine, c'est un petit-déjeuner qui a du sens. Existe aussi au cassis, aux framboises, aux groseilles et aux mûres.",
    format: "190 g",
    organic: true,
    availability: "unknown",
    featured: true,
    image: images.plumJam,
  },
  {
    id: "gelee-fleurs-sureau",
    slug: "gelee-fleurs-sureau",
    name: "Gelée de fleurs de sureau",
    category: "douceurs",
    excerpt: "Une gelée délicate, parfumée à la fleur de sureau.",
    description:
      "Une gelée de fleurs de sureau, au parfum floral. À déguster sur une tartine, ou avec des biscuits nature.",
    format: "150 g",
    organic: true,
    availability: "unknown",
    image: images.elderflower,
  },
  {
    id: "chips-de-pommes",
    slug: "chips-de-pommes",
    name: "Chips de pommes",
    category: "douceurs",
    excerpt: "Des pommes séchées en fines chips, à grignoter.",
    description:
      "Des chips de pommes, à grignoter telles quelles ou à parsemer sur un yaourt végétal ou un porridge.",
    format: "250 g",
    organic: true,
    availability: "unknown",
    image: images.appleBasket,
  },
  {
    id: "graines-courge-nature",
    slug: "graines-courge-nature",
    name: "Graines de courge « nature »",
    category: "douceurs",
    excerpt: "Des graines de courge nature, en grand sachet.",
    description:
      "Des graines de courge nature, en sachet de 400 g. À l'apéritif, dans une salade ou sur une soupe.",
    format: "400 g",
    organic: true,
    availability: "unknown",
    image: images.pumpkinSeeds,
  },

  // ——— Jus, sirops & tisanes ———
  {
    id: "jus-de-carotte",
    slug: "jus-de-carotte",
    name: "Jus de carotte",
    category: "boissons",
    excerpt: "Un jus de carotte en bouteille d'un demi-litre.",
    description:
      "Un jus de carotte, en bouteille de 50 cl. Bien frais, au petit-déjeuner ou à l'apéritif. La gamme compte aussi un jus de légumes, un jus de betterave rouge et un jus de choucroute.",
    format: "0,5 l",
    organic: true,
    availability: "unknown",
    featured: true,
    image: images.carrotJuice,
  },
  {
    id: "jus-betterave-rouge",
    slug: "jus-betterave-rouge",
    name: "Jus de betterave rouge",
    category: "boissons",
    excerpt: "Un jus de betterave rouge, d'un rose profond.",
    description:
      "Un jus de betterave rouge, en bouteille de 50 cl. À boire frais, seul ou coupé avec un peu de jus de carotte.",
    format: "0,5 l",
    organic: true,
    availability: "unknown",
    image: images.beetJuice,
  },
  {
    id: "tisane-du-soir",
    slug: "tisane-du-soir",
    name: "Tisane du soir",
    category: "boissons",
    excerpt: "Un mélange de plantes pour la tasse du soir.",
    description:
      "Un mélange de plantes à infuser, pour la tasse de fin de journée. En sachet de 100 g.",
    format: "100 g",
    organic: true,
    availability: "unknown",
    image: images.mintTea,
  },
  {
    id: "tisane-vitalite",
    slug: "tisane-vitalite",
    name: "Tisane « Vitalité »",
    category: "boissons",
    excerpt: "Un mélange de plantes à infuser, pour la journée.",
    description:
      "Un mélange de plantes à infuser, en sachet de 100 g. Une tasse le matin ou dans l'après-midi.",
    format: "100 g",
    organic: true,
    availability: "unknown",
    image: images.nettleTea,
  },
  {
    id: "cafe-arabica-rwanda-moulu",
    slug: "cafe-arabica-rwanda-moulu",
    name: "Café pur arabica du Rwanda, moulu",
    category: "boissons",
    excerpt: "Un café 100 % arabica du Rwanda, déjà moulu.",
    description:
      "Un café pur arabica originaire du Rwanda, moulu et prêt pour la cafetière. Il existe aussi en grains.",
    format: "250 g",
    availability: "unknown",
    image: images.coffeeBeans,
  },
];
