"use server";

export type ContactValues = { name: string; email: string; phone: string; subject: string; message: string };

// `values` permet de réafficher la saisie : React réinitialise le formulaire après chaque envoi.
export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; values: ContactValues; fieldErrors?: Partial<Record<"name" | "email" | "message", string>> }
  | { status: "not-configured"; values: ContactValues };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Envoi du formulaire de contact.
 *
 * ⚠️ À CONFIGURER : aucune adresse e-mail de la boutique n'est connue.
 * Définir la variable d'environnement CONTACT_FORM_ENDPOINT avec l'URL
 * d'un service qui accepte un POST JSON (Formspree, Make, Zapier,
 * webhook maison…). Tant qu'elle est absente, le visiteur est invité
 * à appeler ou à passer en boutique.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Champ piège invisible : rempli uniquement par les robots.
  if (String(formData.get("website") ?? "").trim()) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const values: ContactValues = { name, email, phone, subject, message };

  const fieldErrors: Partial<Record<"name" | "email" | "message", string>> = {};
  if (name.length < 2) fieldErrors.name = "Indiquez votre nom.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Indiquez une adresse e-mail valide.";
  if (message.length < 10) fieldErrors.message = "Votre message est un peu court.";
  if (message.length > 3000) fieldErrors.message = "Votre message est trop long (3 000 caractères maximum).";

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Merci de vérifier les champs indiqués.", values, fieldErrors };
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  if (!endpoint) return { status: "not-configured", values };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, phone, subject, message, source: "Site Les Produits de la Vie" }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: "success" };
  } catch (error) {
    console.error("[contact] Échec de l'envoi :", error);
    return { status: "error", message: "L'envoi n'a pas abouti. Réessayez dans un instant, ou appelez-nous directement.", values };
  }
}
