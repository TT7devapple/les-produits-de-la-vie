"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useMemo } from "react";
import { ArrowRight, Loader2, Minus, Plus, X } from "lucide-react";
import { checkout, type CheckoutState } from "@/app/commander/actions";
import { cart, MAX_QTY, useCart } from "@/lib/cart";
import { describeCart } from "@/lib/cart-view";
import { formatPrice } from "@/lib/products";
import { useNow } from "@/lib/useNow";
import { cn } from "@/lib/utils";

const initial: CheckoutState = { status: "idle" };
const labelClass = "mb-1.5 flex items-baseline justify-between text-ui font-bold tracking-[0.06em] uppercase";
const fieldClass = "w-full border-2 border-ink bg-label px-4 text-base text-print focus:outline-[2.5px] focus:outline-offset-2 focus:outline-ink focus:outline-solid";

/** Les 10 prochains jours de retrait (la boutique ouvre 7 jours sur 7), à l'heure de Paris. */
function pickupDays(now: Date) {
  const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" });
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });
  return Array.from({ length: 10 }, (_, i) => {
    const d = new Date(now.getTime() + (i + 1) * 86_400_000);
    const label = fmt.format(d);
    return { value: iso.format(d), label: label.charAt(0).toUpperCase() + label.slice(1), thursday: label.startsWith("jeudi") };
  });
}

export function CartView({ stripe, delivery, phone }: { stripe: boolean; delivery: boolean; phone: { display: string; href: string } | null }) {
  const lines = useCart();
  const { items, count, total, unknown } = useMemo(() => describeCart(lines), [lines]);
  const [state, action, pending] = useActionState(checkout, initial);
  const now = useNow();
  const days = useMemo(() => (now ? pickupDays(now) : []), [now]);
  const values = "values" in state ? state.values : undefined;
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const canOrder = stripe || delivery;

  // commande transmise : le panier est vidé
  useEffect(() => {
    if (state.status === "success") {
      cart.clear();
      document.getElementById("commande-recue")?.scrollIntoView({ block: "center" });
    }
    if (state.status === "error") {
      const invalid = document.querySelector<HTMLElement>('#commande [aria-invalid="true"]');
      (invalid ?? document.querySelector<HTMLElement>('#commande [role="alert"]'))?.focus({ preventScroll: false });
    }
  }, [state]);

  // références retirées du catalogue depuis leur ajout : on les enlève (et du compteur de l'en-tête)
  useEffect(() => {
    unknown.forEach((sku) => cart.remove(sku));
  }, [unknown]);

  if (state.status === "success") {
    return (
      <div id="commande-recue" role="status" className="label mx-auto max-w-2xl scroll-mt-24 px-6 py-10 sm:px-10">
        <span className="stamp is-stamped -rotate-3 text-subhead" data-stamp style={{ ["--stamp-rotate" as string]: "-3deg" }}>
          Commande reçue
        </span>
        <p className="display mt-6 text-subhead">Merci, c&apos;est noté.</p>
        <p className="mt-4 text-print-soft">
          Votre commande <strong className="font-mono text-print">{state.number}</strong> ({formatPrice(state.total)}) est transmise à la boutique. Vous recevez un
          récapitulatif par e-mail ; la boutique vous confirme la préparation, et vous réglez au retrait.
        </p>
        <Link href="/commander" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-ink px-5 font-bold tracking-[0.05em] text-kraft uppercase hover:bg-ink-deep">
          Continuer mes achats <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="label mx-auto max-w-xl px-6 py-10 sm:px-10">
        <p className="display text-subhead">Le panier est vide.</p>
        <p className="mt-4 text-print-soft">Parcourez la gamme et ajoutez ce qui vous fait envie : vous le retirez ensuite en boutique.</p>
        <Link href="/commander" className="mt-6 inline-flex min-h-12 items-center gap-2 bg-ink px-5 font-bold tracking-[0.05em] text-kraft uppercase hover:bg-ink-deep">
          Voir les produits <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      {/* Lignes du panier */}
      <section aria-labelledby="panier-titre" className="lg:col-span-7">
        <h2 id="panier-titre" className="sr-only">
          Articles
        </h2>
        <ul className="border-t-2 border-ink">
          {items.map((i) => (
            <li key={i.sku} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 gap-y-3 border-b-2 border-ink py-4 sm:grid-cols-[5.5rem_1fr_auto_auto]">
              <div className="label relative aspect-square overflow-hidden p-1">
                {i.image && <Image src={i.image} alt="" fill sizes="88px" className="object-contain p-1" />}
              </div>
              <div className="min-w-0">
                <Link href={`/commander/${i.slug}`} className="font-bold leading-tight hover:underline">
                  {i.name}
                </Link>
                <p className="font-mono text-data">
                  {i.label} · {formatPrice(i.price)}
                </p>
              </div>
              <div className="col-span-2 col-start-2 flex items-center gap-3 sm:col-span-1 sm:col-start-3">
                <div role="group" aria-label={`Quantité de ${i.name}`} className="inline-flex h-11 items-stretch border-2 border-ink">
                  <button type="button" onClick={() => cart.setQty(i.sku, i.qty - 1)} className="w-10 hover:bg-ink hover:text-kraft">
                    <Minus className="mx-auto h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Retirer un</span>
                  </button>
                  <output className="flex w-10 items-center justify-center border-x-2 border-ink font-mono tabular-nums">{i.qty}</output>
                  <button type="button" disabled={i.qty >= MAX_QTY} onClick={() => cart.setQty(i.sku, i.qty + 1)} className="w-10 hover:bg-ink hover:text-kraft disabled:opacity-40">
                    <Plus className="mx-auto h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Ajouter un</span>
                  </button>
                </div>
                <button type="button" onClick={() => cart.remove(i.sku)} className="inline-flex min-h-11 items-center gap-1 px-1 text-data underline decoration-1 underline-offset-4 hover:decoration-2">
                  <X className="h-4 w-4" aria-hidden="true" /> Retirer
                </button>
              </div>
              <p className="col-start-3 row-start-1 text-right font-mono text-lg font-medium tabular-nums sm:col-start-4">{formatPrice(i.total)}</p>
            </li>
          ))}
        </ul>
        <div className="label mt-8 rotate-[0.4deg] px-5 py-4 font-mono">
          <div className="leader text-data">
            <span>
              {count} article{count > 1 ? "s" : ""}
            </span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          <div className="leader mt-2 border-t border-dashed border-print/40 pt-2 text-lg font-medium">
            <span>Total TTC</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-data-sm text-print-soft">Retrait en boutique, sans frais de livraison. Prix de la boutique en ligne de la marque.</p>
        </div>
      </section>

      {/* Commande */}
      <section aria-labelledby="commande-titre" className="lg:col-span-5">
        <h2 id="commande-titre" className="display text-subhead">
          Retrait en boutique
        </h2>
        <p className="mt-3">45 avenue de Paris, Vincennes — métro Bérault. Les produits frais arrivent le jeudi.</p>

        {!canOrder ? (
          <div role="status" className="label mt-6 p-5 leading-relaxed">
            <p className="font-bold">La commande en ligne n&apos;est pas encore activée.</p>
            <p className="mt-1 text-print-soft">
              Préparez votre panier : {phone ? <>appelez la boutique au <a href={phone.href} className="font-mono text-print underline decoration-2 underline-offset-4">{phone.display}</a> et </> : null}
              on vous le met de côté.
            </p>
          </div>
        ) : (
          <form id="commande" action={action} noValidate className="mt-6 space-y-5">
            <input type="hidden" name="cart" value={JSON.stringify(lines)} />
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Ne pas remplir
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Field id="co-name" name="name" label="Nom" autoComplete="name" required error={errors.name} defaultValue={values?.name} />
            <Field id="co-email" name="email" type="email" label="E-mail" autoComplete="email" required error={errors.email} defaultValue={values?.email} />
            <Field id="co-phone" name="phone" type="tel" label="Téléphone" hint="facultatif" autoComplete="tel" defaultValue={values?.phone} />

            <div>
              <label htmlFor="co-pickup" className={labelClass}>
                <span>Jour de retrait *</span>
              </label>
              <select
                id="co-pickup"
                name="pickup"
                key={days.length}
                defaultValue={values?.pickup ?? ""}
                aria-invalid={errors.pickup ? true : undefined}
                aria-describedby={errors.pickup ? "co-pickup-err" : undefined}
                className={cn(fieldClass, "h-13 appearance-none", errors.pickup && "border-[3.5px]")}
              >
                <option value="" disabled>
                  Choisir un jour
                </option>
                {days.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                    {d.thursday ? " — jour d'arrivage" : ""}
                  </option>
                ))}
              </select>
              {errors.pickup && <ErrorText id="co-pickup-err">{errors.pickup}</ErrorText>}
            </div>

            <div>
              <label htmlFor="co-comment" className={labelClass}>
                <span>Message</span>
                <span className="font-mono text-xs font-normal tracking-normal normal-case">facultatif</span>
              </label>
              <textarea id="co-comment" name="comment" rows={3} defaultValue={values?.comment} className={cn(fieldClass, "resize-y py-3")} />
            </div>

            <fieldset>
              <legend className={labelClass}>Paiement</legend>
              <div className="space-y-2">
                {stripe && (
                  <PayOption value="carte" defaultChecked={(values?.payment ?? "carte") === "carte"} title="Payer maintenant en ligne" text="Carte bancaire, Apple Pay ou Google Pay, sur la page sécurisée de Stripe." />
                )}
                {delivery && (
                  <PayOption value="retrait" defaultChecked={!stripe || values?.payment === "retrait"} title="Payer au retrait" text="Vous réglez en boutique au moment de récupérer votre commande." />
                )}
              </div>
            </fieldset>

            <label className="flex items-start gap-3">
              <input type="checkbox" name="terms" className="mt-1 h-5 w-5 accent-[var(--color-ink)]" aria-invalid={errors.terms ? true : undefined} />
              <span>
                J&apos;accepte les{" "}
                <Link href="/conditions-de-vente" className="underline decoration-2 underline-offset-4">
                  conditions de vente
                </Link>
                .
              </span>
            </label>
            {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
            {errors.cart && <ErrorText>{errors.cart}</ErrorText>}

            {state.status === "error" && !Object.keys(errors).length && (
              <p role="alert" tabIndex={-1} className="border-2 border-ink p-4 font-bold">
                {state.message}
              </p>
            )}
            {state.status === "not-configured" && (
              <p role="status" className="label p-4">
                Le paiement au retrait n&apos;est pas encore activé. {phone && <>Appelez la boutique au <a href={phone.href} className="font-mono underline">{phone.display}</a>.</>}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="group inline-flex min-h-14 w-full items-center justify-center gap-3 bg-ink px-7 text-lg font-bold tracking-[0.06em] text-kraft uppercase transition-colors hover:bg-ink-deep active:translate-y-px disabled:cursor-progress disabled:opacity-80"
            >
              {pending ? "Un instant…" : `Commander · ${formatPrice(total)}`}
              {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function PayOption({ value, defaultChecked, title, text }: { value: string; defaultChecked: boolean; title: string; text: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border-2 border-ink p-4 has-[:checked]:bg-ink has-[:checked]:text-kraft has-[:focus-visible]:outline-[2.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink has-[:focus-visible]:outline-solid">
      <input type="radio" name="payment" value={value} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-[var(--color-kraft)]" />
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-sm">{text}</span>
      </span>
    </label>
  );
}

function ErrorText({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5">
      <strong>À corriger :</strong> {children}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  hint,
  error,
  autoComplete,
  defaultValue,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        <span>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
        {hint && <span className="font-mono text-xs font-normal tracking-normal normal-case">{hint}</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(fieldClass, "h-13", error && "border-[3.5px]")}
      />
      {error && <ErrorText id={`${id}-err`}>{error}</ErrorText>}
    </div>
  );
}
