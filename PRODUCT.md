# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: residents of Vincennes who pass along avenue de Paris or come out of Métro 1 Bérault and discover a shop that opened in February 2026. Most are not vegan; they are curious locals deciding whether this shop is worth a visit for their daily bread and weekly groceries. They mostly browse on their phone, often on the street or at home planning an errand.

## Product Purpose

Website of the Vincennes shop of Les Produits de la Vie. It exists to turn a curious local into an in-store visitor: understand what the shop is in seconds, see real products, know when it is open and how to get there, then come in. Secondary: technically prepare a future online ordering feature.

## Positioning

This is not a generic "épicerie fine": it is the shop of a farm brand. The products come from a group of 8 ecological farms in Bavaria that grow, process (own mill, bakery, biscuit workshop) and sell directly, "du champ au client, sans intermédiaire", since 1983. Everything in the shop is 100 % plant-based. Stock arrives every Thursday. A neighboring shop cannot truthfully claim this supply chain.

## Operating Context

- Shop: 45 avenue de Paris, 94300 Vincennes. Métro 1 Bérault is directly in front; RER A Vincennes about 500 m.
- Hours (verified): Monday–Saturday 9:30–19:30, Sunday 10:30–14:30.
- Weekly restock on Thursday (bread, vegetables, fresh products).
- Range: farm bread sold by the quarter loaf, spreads (iBi range), pestos, pasta, sauces, seasoning (Sapori), biscuits, jams, juices, herbal teas, coffee, seasonal fruit and vegetables.

## Capabilities and Constraints

- Next.js 16 static site; content lives in `src/data/*` (store, products, categories, images, site).
- Catalogue with category filters and search; product pages; contact form wired to an env endpoint (not yet configured).
- Product names and formats are the brand's real range; in-store availability and prices are not confirmed, so prices are not shown.
- Brand vocabulary used by the brand itself: « agriculture pacifique », « du champ au client ».
- Future: online ordering / click & collect (flag `features.onlineOrdering`).

## Brand Commitments

- Name: « Les Produits de la Vie ». No official logo supplied; the current mark is provisional.
- Palette of the first brief (cream, deep green, terracotta) is explicitly NOT binding (confirmed by the user, 2026-09-27).
- Tone: human, warm, simple, never corporate, never pushy.

## Evidence on Hand

- Verified facts listed above (sources noted in `src/data/store.ts`).
- Phone 09 83 43 30 10 comes only from the HappyCow directory: to confirm.
- No official photos: current images are temporary CC0 stock (`src/assets/images/CREDITS.md`).
- No customer reviews, press, prices or founding story for the Vincennes shop: must not be invented.

## Product Principles

1. Get the visitor through the door: address, today's hours and directions are never more than one tap away.
2. Show the farm truth, not marketing: origin, Thursday arrivals and real product names do the persuading.
3. Speak to a curious neighbor, not a convinced vegan: plant-based is a fact, not a sermon.
4. Never invent: unknown facts stay neutral and editable.

## Accessibility & Inclusion

WCAG AA contrast, keyboard navigation, `prefers-reduced-motion` respected, large touch targets (mobile first, 390–430 px).
