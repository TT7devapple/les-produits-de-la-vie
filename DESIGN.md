---
name: Les Produits de la Vie — Vincennes
description: La boutique d'une ferme, imprimée comme le sac kraft qu'on emporte.
colors:
  kraft: "#c7a06f"
  ink: "#172870"
  ink-deep: "#0e1a52"
  label-paper: "#f4f4f0"
  label-print: "#141414"
  label-print-soft: "#4b4b47"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 1.9rem + 5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.7rem + 3.4vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    fontVariation: "'wdth' 62"
  subhead:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.6rem + 1.2vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    fontVariation: "'wdth' 62"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.05rem + 0.6vw, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1rem + 0.25vw, 1.2rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  data:
    fontFamily: "Red Hat Mono, ui-monospace, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.55
  data-sm:
    fontFamily: "Red Hat Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0px"
  label: "3px"
spacing:
  section: "80px"
  section-lg: "112px"
  block: "40px"
  gap: "12px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.kraft}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.ink-deep}"
  button-outline:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-knockout:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "52px"
  button-knockout-hover:
    backgroundColor: "{colors.label-paper}"
  scale-label:
    backgroundColor: "{colors.label-paper}"
    textColor: "{colors.label-print}"
    rounded: "{rounded.label}"
    typography: "{typography.data}"
  input:
    backgroundColor: "{colors.label-paper}"
    textColor: "{colors.label-print}"
    rounded: "{rounded.none}"
    height: "52px"
---

# Design System: Les Produits de la Vie — Vincennes

## Overview

**Creative North Star: "Le sac kraft et l'étiquette de balance"**

Le site est traité comme le sac qu'on emporte de la boutique. Le fond est du papier kraft brut, avec ses fibres. Tout ce qui est imprimé dessus l'est d'une seule encre, un bleu flexo profond : les titres en capitales condensées, les filets, les tampons, et les photos d'ambiance tirées en bichromie. Là où l'encre couvre une région entière, le kraft « réservé » réapparaît en clair. Les données vivantes et les produits sont portés par un second objet du même monde : l'étiquette thermique de la balance de boulangerie, blanche, imprimée en noir, en chiffres mono.

La densité est celle d'un imprimé de commerce : de grands titres qui occupent la largeur, des listes à filets épais plutôt que des cartes, des lignes de données « intitulé … valeur ». Il n'y a ni dégradé, ni flou décoratif, ni arrondi hors des étiquettes. La page s'ouvre comme la bouche du sac, avec un bord dentelé sous le bandeau d'encre, et ce même bord revient partout où le kraft rencontre un aplat.

Rejet confirmé : le trio « fond crème, serif à fort contraste avec italiques, accent terracotta » de l'épicerie fine générique (palette du premier brief déclarée non contraignante par le client).

**Key Characteristics:**
- Un fond (kraft), une encre (bleu flexo), un support de données (étiquette thermique).
- Capitales condensées massives pour toute la hiérarchie haute ; texte courant en grotesque normale.
- L'état d'un élément est une marque imprimée (tampon, mot en capitales, filet épaissi), jamais une couleur d'alerte.
- Bords dentelés aux jonctions kraft / encre ; angles droits partout ailleurs.
- Le mouvement est de l'impression, piloté par le défilement : une photo qui naît entre deux mots, un texte qui s'encre, un compteur de balance qui roule, des étiquettes qu'on pose. Jamais de défilement détourné, de loader ni d'effet de curseur, pour tous les visiteurs.

## Colors

Deux couleurs de surface qui se partagent la page par régions entières, plus le blanc des étiquettes.

### Primary
- **Bleu flexo** (#172870) : l'unique encre. Tout le texte sur kraft, les filets, les boutons pleins, les tampons, les aplats de section (provenance, adresse, bandeau du haut, menu mobile, barre d'actions mobile) et le ton sombre des photos imprimées. Contraste 5,5:1 sur kraft.
- **Bleu flexo foncé** (#0e1a52) : uniquement le survol des boutons pleins.

### Neutral
- **Kraft brut** (#c7a06f) : le fond de page (avec la tuile de fibres `public/textures/kraft.png`), le texte et les boutons « réservés » sur les aplats d'encre, le ton clair des photos imprimées.
- **Papier d'étiquette** (#f4f4f0) : étiquettes de balance, cartes produits, champs de formulaire, zones à compléter des pages légales.
- **Impression thermique** (#141414) et **impression atténuée** (#4b4b47) : texte sur étiquette uniquement.

### Named Rules
**The One Ink Rule.** Tout ce qui est imprimé sur le sac l'est en bleu flexo. Aucune seconde couleur d'accent, aucun vert « ouvert » ni rouge « erreur ».

**The Knockout Rule.** Sur un aplat d'encre, le clair est le kraft lui-même (#c7a06f), jamais une crème plus pâle : c'est le papier qui apparaît, pas une nouvelle couleur.

**The Product-In-Colour Exception.** Les photos de produits restent en couleur, et seulement à l'intérieur d'une étiquette blanche : le produit est l'objet dans le sac, pas un imprimé du sac. Raison : le visiteur principal est un riverain non vegan, que l'appétit fait venir (PRODUCT.md, « Users »). Les photos d'ambiance, elles, sont toujours imprimées en bichromie (`.printed`).

## Typography

**Display Font:** Archivo, axe de largeur à 62 (avec Arial Narrow)
**Body Font:** Archivo, largeur normale (avec system-ui)
**Label/Mono Font:** Red Hat Mono, réservée aux données des étiquettes

**Character:** Une seule famille à deux voix : les capitales serrées et grasses d'un imprimé de commerce, et une grotesque sobre pour lire. La mono n'apparaît que là où une balance imprimerait des chiffres.

### Hierarchy
Huit paliers, déclarés une seule fois dans `globals.css` (`--text-*`) et utilisés par leur nom (`text-display`, `text-headline`…). Aucune taille littérale dans les composants.
- **Display** (800, fluide 3,1 → 6 rem, interlignage 0,9, capitales) : titres de page, titre du premier écran, rubriques du menu mobile. Jamais au-delà de 6 rem.
- **Headline** (800, fluide 2,5 → 4,5 rem, capitales) : titres de section, citation de la marque.
- **Subhead** (800, fluide 1,9 → 2,6 rem, capitales) : noms des rayons, étapes du trajet, principes, adresse, état tamponné.
- **Lead** (400, fluide 1,2 → 1,6 rem) : chapeau du premier écran, paragraphe d'entrée de la boutique.
- **Title** (700, fluide 1,05 → 1,2 rem) : noms de produits sur étiquette.
- **Body** (400, 1,0625 rem, interlignage 1,55) : texte courant, mesure limitée à 52–68 caractères.
- **Label** (700, 0,9 rem, espacement 0,06 em, capitales) : boutons, navigation, onglets, intitulés de champs.
- **Data / Data-sm** (Red Hat Mono, 0,85 rem / 0,72 rem) : lignes d'étiquette, horaires, formats, compteurs, fil d'Ariane.

### Named Rules
**The Mono-Means-Measured Rule.** La mono n'imprime que des données (heures, dates, formats, compteurs). Jamais un titre, jamais un texte d'ambiance.

**The No-Kicker Rule.** Aucun surtitre au-dessus d'un titre : le titre imprimé porte seul son poids.

## Layout

Conteneur de 80 rem (max-w-7xl) avec des marges de 20 px sur mobile et 32 px au-delà. Grille de 12 colonnes à partir de 1024 px : titre du premier écran sur 8 colonnes, étiquette du jour sur 4, colonnes d'information 7 + 5. Les sections alternent kraft et aplat d'encre, et c'est ce rythme qui les sépare, pas des cartes. Espacement vertical des sections : 80 px sur mobile, 112 px sur desktop. Les listes (rayons, principes, horaires) sont des lignes à filets de 2 px, pas des grilles de tuiles.

Mobile d'abord (390 px) : le titre, puis l'étiquette du jour, puis les actions. Les coups de cœur défilent horizontalement, avec un arrêt à chaque étiquette. Une barre d'actions fixe « Itinéraire / Appeler » occupe le bas de l'écran ; le pied de page réserve sa hauteur.

## Elevation & Depth

Le monde est plat, comme un sac imprimé : aucune ombre sur le kraft ni sur les aplats. Seul le papier posé dessus prend de la profondeur. Les étiquettes portent une ombre de papier réelle (décalage et flou) et une légère inclinaison, comme agrafées ou posées à la main.

### Shadow Vocabulary
- **Étiquette posée** (`0 1px 1px rgb(60 40 15 / .18), 0 10px 22px -12px rgb(60 40 15 / .55)`) : toutes les étiquettes au repos.
- **Étiquette soulevée** (`0 2px 2px rgb(60 40 15 / .18), 0 22px 32px -14px rgb(60 40 15 / .6)`) : survol d'une étiquette produit, accompagné d'une montée de 4 px et d'une rotation de −0,6°.

### Named Rules
**The Paper-Only Depth Rule.** Seul un objet en papier posé sur le kraft (une étiquette) a une ombre. Les boutons, blocs et images sont imprimés, donc plats.

## Shapes

Angles droits partout : boutons, champs, onglets, images imprimées, carte. Seules les étiquettes thermiques ont un rayon de 3 px, celui d'une étiquette prédécoupée. Les jonctions kraft / encre sont dentelées : dents de 14 × 10 px, en encre qui monte dans le kraft ou en kraft qui mord dans l'encre, dont la bouche du sac sous le bandeau du haut. Les filets sont épais (2 px), en tirets sur les étiquettes, en pointillés pour les lignes « intitulé … valeur ».

## Components

### Buttons
Des blocs d'encre rectangulaires, en capitales espacées.
- **Shape:** angles droits (0 px), hauteur minimale de 52 px.
- **Primary:** aplat bleu flexo, texte kraft, flèche qui avance de 4 px au survol ; enfoncement de 1 px à l'appui.
- **Outline:** filet d'encre de 2 px sur kraft ; au survol, il se remplit d'encre.
- **Knockout / Outline-light:** les mêmes, inversés sur les aplats d'encre (kraft plein, ou filet kraft).
- **Focus:** contour de 2,5 px dans la couleur du texte, décalé de 3 px.

### Étiquette de balance (signature)
Le support de toute donnée vivante : papier blanc, rayon de 3 px, ombre de papier, en-tête « LES PRODUITS DE LA VIE … date » sur filet en tirets, puis lignes « intitulé … valeur » reliées par des pointillés. Sur le premier écran, l'état du jour est **tamponné** (OUVERT / FERMÉ), l'étiquette est agrafée et « s'imprime » ligne par ligne une fois au chargement (9 pas, 1,1 s). Les cartes produits sont des étiquettes : photo couleur, rayon en mono, mention Bio encadrée, nom, ligne Format.

### Tampon
Un cadre de 2,5 px en capitales condensées, masqué par la texture d'encre usée (`public/textures/ink.png`), incliné de −6° à +4°. Il marque un état ou un fait (« Arrivage le jeudi », « Sans intermédiaire », état du jour) et tombe une fois quand il entre à l'écran.

### Liste de rayons
Des lignes pleine largeur à filets de 2 px : nom en capitales, accroche, compteur en mono, flèche. Au survol ou au focus, la ligne entière passe en aplat d'encre (kraft réservé).

### Inputs / Fields
- **Style:** papier d'étiquette, filet d'encre de 2 px, angles droits, hauteur de 52 px ; intitulés en capitales au-dessus.
- **Focus:** contour d'encre de 2,5 px décalé de 2 px.
- **Error:** filet épaissi à 3,5 px et message préfixé « À corriger : » en gras. Aucune couleur d'alerte.

### Navigation
Bandeau d'encre fixe avec le logo-tampon (le nom dans un cadre), les rubriques en capitales soulignées au survol et sur la page active, et le bouton kraft « Nous trouver ». Il se retire quand on descend et revient quand on remonte (il reste fixe sur le catalogue, dont la barre de filtres colle dessous). Sur mobile : un menu plein écran en aplat d'encre, rubriques en capitales de 3,2 rem, statut du jour et actions en bas.

### Filtres du catalogue
Des onglets rectangulaires à filet d'encre ; l'onglet actif est rempli d'encre. La recherche est un champ en papier d'étiquette.

## Do's and Don'ts

### Do:
- **Do** imprimer chaque nouvelle photo d'ambiance avec `PrintedImage` (bichromie encre / kraft).
- **Do** placer toute donnée vivante ou chiffrée (horaires, dates, formats, prix futurs) sur une étiquette, en mono.
- **Do** marquer un état par un tampon, un mot en capitales ou un filet épaissi.
- **Do** séparer les sections en alternant kraft et aplat d'encre, avec le bord dentelé à la jonction.
- **Do** garder une seule action pleine par groupe, les autres en filet ou en lien souligné.

### Don't:
- **Don't** introduire une seconde couleur d'accent, ni une crème plus pâle que le kraft sur les aplats (The Knockout Rule).
- **Don't** mettre de surtitre au-dessus d'un titre, ni de numéros de section hors d'une vraie séquence (le trajet du champ à la boutique en est une).
- **Don't** construire une section en grille de cartes « icône + titre + texte », ni en rangée de gros chiffres.
- **Don't** arrondir, dégrader, flouter ou ombrer ce qui est imprimé : seules les étiquettes ont un rayon et une ombre.
- **Don't** utiliser la mono pour autre chose que des données.
- **Don't** terminer chaque page par un bandeau d'appel à l'action : la dernière invitation vit dans le bloc adresse ou en une ligne.
