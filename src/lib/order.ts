import { getShopProducts } from "@/data/shop";
import { formatPrice } from "@/lib/products";

/**
 * Logique de commande côté serveur. Les prix viennent TOUJOURS du catalogue
 * synchronisé, jamais du navigateur : un visiteur ne peut pas modifier un montant.
 */
export interface OrderItem {
  sku: string;
  name: string;
  label: string;
  unitPrice: number;
  qty: number;
  total: number;
}

const catalog = new Map(getShopProducts().flatMap((p) => p.variants.map((v) => [v.sku, { p, v }] as const)));

/** Reconstruit la commande à partir des références envoyées ; ignore toute référence inconnue ou épuisée. */
export function buildOrder(raw: unknown): { items: OrderItem[]; total: number } {
  const lines = Array.isArray(raw) ? raw : [];
  const items: OrderItem[] = [];
  for (const l of lines) {
    const hit = catalog.get(String(l?.sku ?? ""));
    const qty = Math.floor(Number(l?.qty));
    if (!hit || !hit.v.available || !Number.isFinite(qty) || qty < 1 || qty > 99) continue;
    items.push({
      sku: hit.v.sku,
      name: hit.p.name,
      label: hit.v.label,
      unitPrice: hit.v.price,
      qty,
      total: Math.round(hit.v.price * qty * 100) / 100,
    });
  }
  return { items, total: Math.round(items.reduce((s, i) => s + i.total, 0) * 100) / 100 };
}

export function orderNumber(): string {
  return `LPV-${Date.now().toString(36).toUpperCase()}`;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  comment: string;
}

/** Récapitulatif texte (e-mail, webhook). */
export function orderText(number: string, c: Customer, items: OrderItem[], total: number, payment: string): string {
  return [
    `Commande ${number} — ${payment}`,
    "",
    `Client : ${c.name}`,
    `E-mail : ${c.email}`,
    c.phone ? `Téléphone : ${c.phone}` : null,
    `Retrait souhaité : ${c.pickup}`,
    c.comment ? `Message : ${c.comment}` : null,
    "",
    ...items.map((i) => `${i.qty} × ${i.name} (${i.label}) — ${formatPrice(i.unitPrice)} = ${formatPrice(i.total)}`),
    "",
    `Total TTC : ${formatPrice(total)}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/** Paiement en ligne configuré ? */
export const stripeEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY?.trim());

/** Envoi des commandes « paiement au retrait » configuré ? */
export const orderDeliveryEnabled = () =>
  Boolean(process.env.ORDER_WEBHOOK_URL?.trim() || (process.env.RESEND_API_KEY?.trim() && process.env.ORDER_EMAIL_TO?.trim()));

/** Crée une session Stripe Checkout (API REST, sans dépendance) et renvoie son URL. */
export async function createCheckoutSession(opts: {
  number: string;
  customer: Customer;
  items: OrderItem[];
  baseUrl: string;
}): Promise<string> {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("locale", "fr");
  p.set("customer_email", opts.customer.email);
  p.set("client_reference_id", opts.number);
  p.set("success_url", `${opts.baseUrl}/commander/merci?session_id={CHECKOUT_SESSION_ID}`);
  p.set("cancel_url", `${opts.baseUrl}/commander/panier?annule=1`);
  p.set("payment_intent_data[description]", `Commande ${opts.number} — retrait en boutique`);
  const meta: Record<string, string> = {
    commande: opts.number,
    client: opts.customer.name,
    telephone: opts.customer.phone || "—",
    retrait: opts.customer.pickup,
    message: opts.customer.comment.slice(0, 450) || "—",
  };
  for (const [k, v] of Object.entries(meta)) {
    p.set(`metadata[${k}]`, v);
    p.set(`payment_intent_data[metadata][${k}]`, v);
  }
  opts.items.forEach((it, i) => {
    p.set(`line_items[${i}][quantity]`, String(it.qty));
    p.set(`line_items[${i}][price_data][currency]`, "eur");
    p.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(it.unitPrice * 100)));
    p.set(`line_items[${i}][price_data][product_data][name]`, `${it.name} — ${it.label}`);
    p.set(`line_items[${i}][price_data][product_data][metadata][sku]`, it.sku);
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY!.trim()}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: p,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.url) throw new Error(json?.error?.message ?? `Stripe ${res.status}`);
  return json.url as string;
}

/** Lit une session Stripe après paiement (page de confirmation). */
export async function getCheckoutSession(id: string) {
  if (!stripeEnabled() || !/^cs_[A-Za-z0-9_]+$/.test(id)) return null;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}?expand[]=line_items`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY!.trim()}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    payment_status: string;
    amount_total: number;
    client_reference_id: string | null;
    customer_details?: { email?: string; name?: string };
    metadata?: Record<string, string>;
    line_items?: { data: { description: string; quantity: number; amount_total: number }[] };
  };
}

/** Transmet une commande « paiement au retrait » à la boutique (webhook et/ou e-mail Resend). */
export async function deliverOrder(number: string, c: Customer, items: OrderItem[], total: number): Promise<void> {
  const text = orderText(number, c, items, total, "paiement au retrait en boutique");
  const tasks: Promise<void>[] = [];

  const webhook = process.env.ORDER_WEBHOOK_URL?.trim();
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, customer: c, items, total, payment: "retrait", text }),
        cache: "no-store",
      }).then((r) => {
        if (!r.ok) throw new Error(`webhook ${r.status}`);
      }),
    );
  }

  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ORDER_EMAIL_TO?.trim();
  if (key && to) {
    const from = process.env.ORDER_EMAIL_FROM?.trim() || "Les Produits de la Vie <onboarding@resend.dev>";
    const send = (payload: object) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, ...payload }),
        cache: "no-store",
      }).then((r) => {
        if (!r.ok) throw new Error(`resend ${r.status}`);
      });
    // à la boutique
    tasks.push(send({ to: to.split(",").map((s) => s.trim()), reply_to: c.email, subject: `Nouvelle commande ${number} — ${formatPrice(total)}`, text }));
    // accusé de réception au client (non bloquant s'il échoue)
    tasks.push(
      send({
        to: [c.email],
        subject: `Votre commande ${number} — Les Produits de la Vie`,
        text: `Bonjour ${c.name},\n\nMerci ! Nous avons bien reçu votre commande. La boutique vous confirme la préparation ; vous réglez au retrait.\n\n${text}\n\nLes Produits de la Vie — 45 avenue de Paris, 94300 Vincennes`,
      }).catch(() => undefined),
    );
  }

  await Promise.all(tasks);
}
