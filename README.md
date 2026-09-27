# Les Produits de la Vie — Vincennes

Site vitrine de l'épicerie 100 % végétale **Les Produits de la Vie**, 45 avenue de Paris, 94300 Vincennes.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Lucide. Toutes les pages sont générées statiquement.

## Lancer le projet

```bash
npm install
npm run dev        # développement → http://localhost:3000
npm run build      # build de production
npm run start      # servir le build de production
npm run lint       # vérification ESLint
```

Variables d'environnement : copier `.env.example` en `.env.local` (voir les commentaires du fichier).

## Modifier le contenu (sans toucher à l'interface)

| Je veux changer…                                  | Fichier                                  |
| ------------------------------------------------- | ---------------------------------------- |
| Adresse, téléphone, e-mail, horaires, accès, réseaux | `src/data/store.ts`                   |
| Produits (noms, textes, formats, prix, coups de cœur) | `src/data/products.ts`               |
| Familles de produits                              | `src/data/categories.ts`                 |
| Photos et textes alternatifs                      | `src/data/images.ts` + `src/assets/images/` |
| Nom de domaine, titre SEO, menu, options          | `src/data/site.ts`                       |

- **Masquer le téléphone** : `phone: null` dans `store.ts`.
- **Afficher les prix** : renseigner `price` sur les produits, puis `showPrices: true` dans `site.ts`.
- **Mettre un produit en avant** sur l'accueil : `featured: true`.
- **Remplacer une photo** : déposer le fichier dans `src/assets/images/`, changer l'import dans `images.ts`, adapter le `alt`.
  Next.js génère automatiquement les tailles et les formats AVIF/WebP.

## Structure

```
src/
├── app/                      Pages (une URL = un dossier)
│   ├── page.tsx              Accueil
│   ├── la-boutique/          La boutique
│   ├── nos-produits/         Catalogue + [slug]/ fiche produit
│   ├── contact/              Contact / venir (+ actions.ts : envoi du formulaire)
│   ├── mentions-legales/, confidentialite/
│   ├── sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.png, opengraph-image.jpg
│   └── layout.tsx            Polices, SEO global, données structurées GroceryStore
├── components/
│   ├── layout/               Header, MobileMenu, Footer, MobileActionBar
│   ├── home/                 Sections de l'accueil (Hero, FarmToShop, FeaturedProducts)
│   ├── products/             ProductCard (étiquette), ProductGrid, CategoryIndex, ProductCatalog
│   ├── store/                ScaleLabel, HoursTable, OpenStatus, MapEmbed
│   ├── sections/             PageHeader, LocationBlock, CTASection, Gallery, Breadcrumbs, LegalPage
│   ├── contact/              ContactForm
│   ├── ui/                   Button, SectionTitle, Logo, Stamp, PrintedImage, Container, StampObserver
│   └── seo/                  JsonLd
├── data/                     ← contenu modifiable (voir tableau ci-dessus)
├── lib/                      hours.ts (ouvert/fermé), products.ts (accès aux données), seo.ts
└── types/
```

## Direction visuelle : le sac kraft et l'étiquette de balance

Le site est traité comme le sac qu'on emporte de la boutique (détails dans `DESIGN.md`) :

- **un fond** : le kraft (`#c7a06f` + texture de fibres `public/textures/kraft.png`) ;
- **une encre** : le bleu flexo (`#172870`), qui imprime tout le texte, les filets, les tampons et les photos
  d'ambiance (bichromie, classe `.printed`) ; sur les aplats bleus (`.on-ink`), le kraft apparaît en clair ;
- **l'étiquette thermique** (`.label`) porte les données : statut du jour, horaires, produits (photos en couleur) ;
- **typographie** : Archivo condensée en capitales (`.display`) pour les titres, Archivo normale pour le texte,
  Red Hat Mono uniquement pour les données d'étiquette ;
- **l'état est une marque** (tampon `.stamp`, mot en capitales), jamais une couleur d'alerte.

### Animations (inspirées du template « Site Immersif », sélection volontaire)

Moteur maison sans dépendance : `src/lib/scenes.ts` (sections hautes + enfant `position: sticky`,
une seule boucle rAF, aucun détournement du défilement natif).

- **Hero** (`components/home/Hero.tsx`) : la photo imprimée naît entre « À » et « VINCENNES. » et remplit l'écran,
  puis le tampon du jeudi tombe. Sur tous les écrans : si le contenu dépasse la fenêtre, il défile d'abord
  normalement (horaires et boutons lisibles), puis la scène s'épingle.
- **Encrage** (`FarmToShop`) : le propos s'imprime lettre à lettre, un trait à la main entoure « sans intermédiaire ».
- **Trajet** (`FarmToShop`) : compteur « 01 → 05 » en odomètre, étapes en relais, ligne de route qui se remplit.
- **Étiquettes** (`LabelArrival`) : les coups de cœur arrivent en désordre puis se posent (latéralement dans le carrousel mobile).
- Plus l'étiquette du jour qui « s'imprime » au chargement et les tampons qui tombent une fois.

Écartés exprès : défilement lissé, loader, traînée sous la souris, train de mots, rideau de lames.
Les animations tournent pour tous les visiteurs (choix du client), même si le système demande de les réduire ;
seule l'absence de JavaScript ramène la mise en page statique (drapeau `data-motion` posé dans `layout.tsx`).

## Choix techniques

- **Carte à la demande** : un plan du quartier dessiné en SVG ; Google Maps n'est chargé qu'au clic (performance + RGPD).
- **Statut « Ouvert / Fermé » et prochain arrivage** calculés à l'heure de Paris dans le navigateur, sans casser le rendu statique.
- **Textures générées par script** (`node scripts/generate-textures.mjs`), quelques Ko, aucune image externe.
- **Provenance des images** : `node scripts/embed-provenance.mjs` inscrit l'origine de chaque image dans le fichier
  (à relancer après tout remplacement de photo).
- **Commande en ligne (préparée)** : types `Product` avec `id`, `price`, `availability` ; accès aux données
  centralisé dans `src/lib/products.ts` (remplaçable par un CMS ou Shopify) ; drapeau `features.onlineOrdering`.

## Informations à confirmer avant mise en ligne

Voir les commentaires `⚠️` dans `src/data/*.ts` et les encadrés « À compléter » des pages légales.
Les photos sont temporaires : crédits dans `src/assets/images/CREDITS.md`.
