// Synchronise l'onglet « Commander » avec la boutique en ligne de la marque (produits-de-la-vie.com).
//   npm run sync:shop
// Lit le Store API public de leur boutique (Shopware), exactement comme leur propre site :
// produits affichés dans leurs rayons, toutes les variantes et leurs prix, fiches détaillées
// (description, ingrédients, valeurs nutritionnelles), et télécharge les images en local.
// Écrit src/data/shop-catalog.json et public/shop/*.jpg.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const API = "https://backend.produits-de-la-vie.com/store-api";
// Clé publique du canal de vente : leur site l'envoie à chaque visiteur.
const headers = { "sw-access-key": "SWSCBNC1DVNLRLHMNDM0TTFXZQ", Accept: "application/json", "Content-Type": "application/json" };
const OUT_JSON = "src/data/shop-catalog.json";
const IMG_DIR = "public/shop";
const IMG_SIZE = 640;

const t = (x, k = "name") => x?.translated?.[k] ?? x?.[k] ?? null;
const slugify = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const stripHtml = (html) =>
  (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h\d|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
const num = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

async function post(endpoint, body) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${API}/${endpoint}`, { method: "POST", headers, body: JSON.stringify(body) });
    if (res.ok) return res.json();
    if (attempt === 2) throw new Error(`${endpoint} → ${res.status}`);
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
}

// 1. Rayons de la boutique
const nav = await post("navigation/main-navigation/main-navigation", { depth: 3, buildTree: true, includes: { category: ["id", "name", "translated", "children"] } });
const categories = [];
(function walk(nodes, trail) {
  for (const n of nodes) {
    const tr = [...trail, t(n)];
    categories.push({ id: n.id, trail: tr });
    if (n.children?.length) walk(n.children, tr);
  }
})(nav, []);

// 2. Produits réellement affichés dans ces rayons
const shown = new Map(); // parentId → chemins de rayon
for (const c of categories) {
  for (let page = 1; ; page++) {
    const r = await post(`product-listing/${c.id}`, { limit: 100, p: page, page, includes: { product: ["id", "parentId"] } });
    for (const p of r.elements) {
      const pid = p.parentId ?? p.id;
      shown.set(pid, [...(shown.get(pid) ?? []), c.trail]);
    }
    if (r.elements.length < 100) break;
  }
}
console.log(`rayons: ${categories.length} · produits affichés: ${shown.size}`);

// 3. Toutes les fiches (parents + variantes) avec prix
const productIncludes = {
  product: ["id", "parentId", "productNumber", "name", "translated", "available", "active", "calculatedPrice", "calculatedPrices", "packUnit", "cover", "options"],
  product_media: ["media"],
  media: ["url", "thumbnails"],
  media_thumbnail: ["url", "width"],
  calculated_price: ["unitPrice", "quantity", "referencePrice"],
  cart_price_reference: ["price", "referenceUnit", "unitName"],
  // `translated` n'est rempli par Shopware que si `name` est aussi demandé
  property_group_option: ["name", "translated", "group"],
  property_group: ["name", "translated"],
};
const all = [];
for (let page = 1; ; page++) {
  const r = await post("product", { limit: 100, page, "total-count-mode": "exact", associations: { cover: { associations: { media: {} } }, options: { associations: { group: {} } } }, includes: productIncludes });
  all.push(...r.elements);
  if (all.length >= r.total || !r.elements.length) break;
}
const byId = new Map(all.map((p) => [p.id, p]));
const kidsOf = new Map();
for (const p of all) if (p.parentId) kidsOf.set(p.parentId, [...(kidsOf.get(p.parentId) ?? []), p]);

const imageUrl = (media) => {
  if (!media?.url) return null;
  const th = (media.thumbnails ?? []).filter((x) => x.width >= 600).sort((a, b) => a.width - b.width)[0];
  return th?.url ?? media.url;
};

await fs.mkdir(IMG_DIR, { recursive: true });
async function downloadImage(url, slug) {
  const file = `${slug}.jpg`;
  const target = path.join(IMG_DIR, file);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    // Photos détourées sur fond blanc : on aplatit la transparence sur le blanc de l'étiquette
    await sharp(buf).flatten({ background: "#ffffff" }).resize(IMG_SIZE, IMG_SIZE, { fit: "contain", background: "#ffffff" }).jpeg({ quality: 82, mozjpeg: true }).toFile(target);
    return `/shop/${file}`;
  } catch (e) {
    console.log("image KO", slug, e.message);
    return null;
  }
}

// 4. Fiche détaillée + assemblage
// Lignes qui ne sont pas des produits (dons, compléments de paiement)
const NOT_PRODUCTS = /paiement compl[ée]mentaire|^don\b/i;
const products = [];
const used = new Map();
for (const [pid, trails] of shown) {
  const parent = byId.get(pid);
  if (!parent || NOT_PRODUCTS.test(t(parent) ?? "")) continue;
  const units = (kidsOf.get(pid) ?? []).filter((k) => k.active !== false);
  const variants = (units.length ? units : [parent])
    .map((v) => {
      // Prix effectif : la règle de prix appliquée à tout visiteur (calculatedPrices, par palier de
      // quantité) prime sur le prix de base, exactement comme sur leur site et dans leur panier.
      const tiers = (v.calculatedPrices ?? []).filter((p) => typeof p.unitPrice === "number").sort((a, b) => (a.quantity ?? 1) - (b.quantity ?? 1));
      const base = tiers[0] ?? v.calculatedPrice;
      const ref = base?.referencePrice ?? v.calculatedPrice?.referencePrice;
      return {
        sku: v.productNumber,
        label: (v.options ?? []).map((o) => t(o)).filter(Boolean).join(" · ") || v.packUnit || "Unité",
        price: base?.unitPrice,
        tiers: tiers.length > 1 ? tiers.map((p) => ({ from: p.quantity ?? 1, price: p.unitPrice })) : undefined,
        referencePrice: ref ? { price: ref.price, unit: `${ref.referenceUnit === 1 ? "" : `${ref.referenceUnit} `}${ref.unitName}` } : null,
        available: !!v.available,
      };
    })
    .filter((v) => typeof v.price === "number" && v.price > 0.05)
    .sort((a, b) => a.price - b.price);
  if (!variants.length) continue;

  const detail = (await post(`product/${pid}`, {})).product;
  const cf = detail?.translated?.customFields ?? {};
  const name = t(parent).trim();
  let slug = slugify(name);
  const n = used.get(slug) ?? 0;
  used.set(slug, n + 1);
  if (n) slug = `${slug}-${n + 1}`;
  const trail = trails.sort((a, b) => b.length - a.length)[0];
  const img = imageUrl(parent.cover?.media) ?? imageUrl(units.find((u) => u.cover?.media)?.cover?.media);

  products.push({
    id: parent.productNumber,
    slug,
    name,
    category: trail[0].trim(),
    subcategory: trail[1]?.trim() ?? null,
    description: stripHtml(t(detail, "description")),
    ingredients: stripHtml(cf.ingredients) || null,
    traces: stripHtml(cf.ingredients_traces_of) || null,
    organic: cf.is_eco === true,
    organicControl: cf.eco_control_number || null,
    fresh: cf.is_fresh_product === true,
    nutrition:
      num(cf.caloric_value_kcal) !== null
        ? {
            per: cf.reference_quantity || "100g",
            kj: num(cf.caloric_value_kj),
            kcal: num(cf.caloric_value_kcal),
            fat: num(cf.fat),
            saturated: num(cf.fatty_acids),
            carbs: num(cf.carbohydrates),
            sugar: num(cf.sugar),
            protein: num(cf.protein),
            salt: num(cf.salt),
          }
        : null,
    image: img ? await downloadImage(img, slug) : null,
    variants,
  });
  process.stdout.write(".");
}
products.sort((a, b) => a.category.localeCompare(b.category, "fr") || (a.subcategory ?? "").localeCompare(b.subcategory ?? "", "fr") || a.name.localeCompare(b.name, "fr"));

const catalog = {
  source: "https://www.produits-de-la-vie.com",
  syncedAt: new Date().toISOString(),
  categories: [...new Set(products.map((p) => p.category))],
  products,
};
await fs.writeFile(OUT_JSON, JSON.stringify(catalog, null, 1) + "\n");
// Index léger pour le panier (chargé côté navigateur) : référence → nom, format, prix, image
const index = Object.fromEntries(products.flatMap((p) => p.variants.map((v) => [v.sku, { slug: p.slug, name: p.name, label: v.label, price: v.price, image: p.image }])));
await fs.writeFile("src/data/shop-index.json", JSON.stringify(index) + "\n");
console.log(`\n${products.length} produits · ${products.reduce((s, p) => s + p.variants.length, 0)} variantes → ${OUT_JSON}`);
