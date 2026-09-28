"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { buildOrder, createCheckoutSession, deliverOrder, orderDeliveryEnabled, orderNumber, stripeEnabled, type Customer } from "@/lib/order";

export type CheckoutValues = { name: string; email: string; phone: string; pickup: string; comment: string; payment: string };

// `values` permet de réafficher la saisie : React réinitialise le formulaire après chaque envoi.
export type CheckoutState =
  | { status: "idle" }
  | { status: "success"; number: string; total: number }
  | { status: "error"; message: string; values: CheckoutValues; fieldErrors?: Partial<Record<"name" | "email" | "pickup" | "cart" | "terms", string>> }
  | { status: "not-configured"; values: CheckoutValues };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "");
}

export async function checkout(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  // Champ piège invisible : rempli uniquement par les robots.
  if (String(formData.get("website") ?? "").trim()) return { status: "idle" };

  const values: CheckoutValues = {
    name: String(formData.get("name") ?? "").trim().slice(0, 120),
    email: String(formData.get("email") ?? "").trim().slice(0, 160),
    phone: String(formData.get("phone") ?? "").trim().slice(0, 40),
    pickup: String(formData.get("pickup") ?? "").trim(),
    comment: String(formData.get("comment") ?? "").trim().slice(0, 1000),
    payment: String(formData.get("payment") ?? "carte"),
  };

  let lines: unknown = [];
  try {
    lines = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    lines = [];
  }
  const { items, total } = buildOrder(lines);

  const fieldErrors: Partial<Record<"name" | "email" | "pickup" | "cart" | "terms", string>> = {};
  if (!items.length) fieldErrors.cart = "Votre panier est vide.";
  if (values.name.length < 2) fieldErrors.name = "Indiquez votre nom.";
  if (!EMAIL_RE.test(values.email)) fieldErrors.email = "Indiquez une adresse e-mail valide.";
  if (!DATE_RE.test(values.pickup)) fieldErrors.pickup = "Choisissez un jour de retrait.";
  else {
    const day = new Date(`${values.pickup}T12:00:00Z`).getTime();
    const now = Date.now();
    if (day < now - 86_400_000 || day > now + 15 * 86_400_000) fieldErrors.pickup = "Choisissez un jour dans les deux prochaines semaines.";
  }
  if (formData.get("terms") !== "on") fieldErrors.terms = "Merci d'accepter les conditions de vente.";
  if (Object.keys(fieldErrors).length) return { status: "error", message: "Merci de vérifier les champs indiqués.", values, fieldErrors };

  const number = orderNumber();
  const pickupLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${values.pickup}T12:00:00Z`));
  const customer: Customer = { name: values.name, email: values.email, phone: values.phone, pickup: pickupLabel, comment: values.comment };

  // ——— Paiement en ligne (Stripe Checkout) ———
  if (values.payment === "carte" && stripeEnabled()) {
    let url: string;
    try {
      url = await createCheckoutSession({ number, customer, items, baseUrl: await baseUrl() });
    } catch (e) {
      console.error("[commande] Stripe :", e);
      return { status: "error", message: "Le paiement en ligne est momentanément indisponible. Réessayez, ou choisissez le paiement au retrait.", values };
    }
    redirect(url);
  }

  // ——— Paiement au retrait : la commande est transmise à la boutique ———
  if (!orderDeliveryEnabled()) return { status: "not-configured", values };
  try {
    await deliverOrder(number, customer, items, total);
  } catch (e) {
    console.error("[commande] envoi :", e);
    return { status: "error", message: "La commande n'a pas pu être transmise. Réessayez dans un instant, ou appelez la boutique.", values };
  }
  return { status: "success", number, total };
}
