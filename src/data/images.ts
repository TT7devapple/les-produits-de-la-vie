/**
 * ============================================================
 *  PHOTOS DU SITE
 * ============================================================
 * Toutes les photos actuelles sont des images TEMPORAIRES, libres
 * de droits (domaine public / CC0, via Openverse) — voir
 * src/assets/images/CREDITS.md.
 *
 * Pour les remplacer par les vraies photos de la boutique :
 *  1. déposer la nouvelle photo dans src/assets/images/
 *     (JPEG, ~2000 px de large suffit : Next.js génère les tailles
 *     et formats AVIF/WebP automatiquement) ;
 *  2. changer l'import correspondant ci-dessous ;
 *  3. mettre à jour le texte alternatif (alt).
 */
import heroPainOlives from "@/assets/images/hero-pain-olives.jpg";
import champBle from "@/assets/images/champ-ble.jpg";
import moulinMeule from "@/assets/images/moulin-meule.jpg";
import legumesPoireauxCarottes from "@/assets/images/legumes-poireaux-carottes.jpg";
import etalLegumes from "@/assets/images/etal-legumes.jpg";
import tartinablesBols from "@/assets/images/tartinables-bols.jpg";
import tartinableAil from "@/assets/images/tartinable-ail.jpg";
import painTrancheGraines from "@/assets/images/pain-tranche-graines.jpg";
import painPaysanRomarin from "@/assets/images/pain-paysan-romarin.jpg";
import michePlanche from "@/assets/images/miche-planche.jpg";
import croissant from "@/assets/images/croissant.jpg";
import pestoBocal from "@/assets/images/pesto-bocal.jpg";
import epicesAssaisonnement from "@/assets/images/epices-assaisonnement.jpg";
import herbesMortier from "@/assets/images/herbes-mortier.jpg";
import spaghettis from "@/assets/images/spaghettis.jpg";
import potimarron from "@/assets/images/potimarron.jpg";
import lentilles from "@/assets/images/lentilles.jpg";
import biscuitsConfiture from "@/assets/images/biscuits-confiture.jpg";
import biscuitsAmandes from "@/assets/images/biscuits-amandes.jpg";
import biscuitsChocolat from "@/assets/images/biscuits-chocolat.jpg";
import confiturePrunes from "@/assets/images/confiture-prunes.jpg";
import pommesPanier from "@/assets/images/pommes-panier.jpg";
import grainesCourge from "@/assets/images/graines-courge.jpg";
import jusCarotteVerres from "@/assets/images/jus-carotte-verres.jpg";
import jusCarotte from "@/assets/images/jus-carotte.jpg";
import jusBetterave from "@/assets/images/jus-betterave.jpg";
import fleursSureau from "@/assets/images/fleurs-sureau.jpg";
import tisaneMenthe from "@/assets/images/tisane-menthe.jpg";
import tisaneOrtie from "@/assets/images/tisane-ortie.jpg";
import cafeGrains from "@/assets/images/cafe-grains.jpg";
import painOlives from "@/assets/images/pain-olives.jpg";
import tisaneVerres from "@/assets/images/tisane-verres.jpg";
import betteraves from "@/assets/images/betteraves.jpg";

export const images = {
  hero: { src: heroPainOlives, alt: "Pain paysan à la croûte farinée posé sur un linge, à côté de bols d'olives" },
  wheatField: { src: champBle, alt: "Champ de céréales dorées en fin d'été" },
  stoneMill: { src: moulinMeule, alt: "Ancienne meule de pierre et roue en bois dans la pénombre d'un moulin" },
  leeksCarrots: { src: legumesPoireauxCarottes, alt: "Poireaux et carottes fraîchement arrivés sur un étal en bois" },
  vegetableStall: { src: etalLegumes, alt: "Étal de légumes de saison, artichauts et courgettes en cagettes" },
  spreadsBowls: { src: tartinablesBols, alt: "Petits bols de tartinables végétaux sur une table en bois" },
  spreadGarlic: { src: tartinableAil, alt: "Tartinable crémeux nappé d'un filet d'huile et d'une feuille de basilic" },
  slicedSeedBread: { src: painTrancheGraines, alt: "Tranches de pain aux graines sur une planche" },
  rusticLoaf: { src: painPaysanRomarin, alt: "Miche de pain paysan ronde avec du romarin et de l'ail sur un linge bleu" },
  loafBoard: { src: michePlanche, alt: "Pain rond à la croûte dorée posé sur une planche en bois clair" },
  croissant: { src: croissant, alt: "Croissant doré posé sur une assiette blanche" },
  pestoJar: { src: pestoBocal, alt: "Bocal en verre rempli de pesto aux herbes, tomates en arrière-plan" },
  seasoning: { src: epicesAssaisonnement, alt: "Herbes aromatiques, ail et épices disposés sur une planche" },
  herbsMortar: { src: herbesMortier, alt: "Herbes fraîches, mortier en pierre et coupelles d'épices sur une table" },
  spaghetti: { src: spaghettis, alt: "Spaghettis crus disposés en éventail" },
  pumpkin: { src: potimarron, alt: "Courge fraîchement râpée dans un bol orange, sur une table en bois" },
  lentils: { src: lentilles, alt: "Lentilles blondes, corail et noires alignées" },
  jamCookies: { src: biscuitsConfiture, alt: "Petits biscuits dorés garnis d'une touche de confiture" },
  almondCookies: { src: biscuitsAmandes, alt: "Biscuits croquants dorés empilés" },
  chocolateCookies: { src: biscuitsChocolat, alt: "Biscuits au chocolat sur une assiette" },
  plumJam: { src: confiturePrunes, alt: "Bocal de confiture de prunes entouré de prunes et d'anis étoilé" },
  appleBasket: { src: pommesPanier, alt: "Panier en osier rempli de pommes" },
  pumpkinSeeds: { src: grainesCourge, alt: "Graines de courge dans des coupelles en métal" },
  carrotJuiceGlasses: { src: jusCarotteVerres, alt: "Deux verres de jus de carotte entourés de carottes fanes" },
  carrotJuice: { src: jusCarotte, alt: "Verres de jus de carotte et carottes fraîches" },
  beetJuice: { src: jusBetterave, alt: "Bol de betterave mixée rose vif, entouré de betteraves fanes et de lentilles corail" },
  elderflower: { src: fleursSureau, alt: "Ombelles de fleurs de sureau blanches" },
  mintTea: { src: tisaneMenthe, alt: "Tasse de tisane ambrée et feuilles de menthe sur un set en toile de jute" },
  nettleTea: { src: tisaneOrtie, alt: "Tasse de tisane sous une feuille d'ortie" },
  coffeeBeans: { src: cafeGrains, alt: "Grains de café torréfiés renversés sur un torchon à carreaux" },
  oliveBread: { src: painOlives, alt: "Pain paysan tranché, olives vertes et noires" },
  teaGlasses: { src: tisaneVerres, alt: "Verres de tisane aux herbes fraîches" },
  beets: { src: betteraves, alt: "Betteraves rouges et blanches en vrac" },
} as const;
