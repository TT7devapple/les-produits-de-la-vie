import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCheckoutSession } from "@/lib/order";
import { formatPrice } from "@/lib/products";
import { Container } from "@/components/ui/Container";
import { ClearCart } from "@/components/shop/ClearCart";

export const metadata: Metadata = { title: "Merci pour votre commande", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Retour de Stripe après paiement : on vérifie le paiement auprès de Stripe avant de confirmer. */
export default async function ThanksPage({ searchParams }: PageProps<"/commander/merci">) {
  const { session_id } = await searchParams;
  const session = typeof session_id === "string" ? await getCheckoutSession(session_id) : null;
  const paid = session?.payment_status === "paid";

  return (
    <section className="flex min-h-[80svh] items-center pt-28 pb-20">
      <Container>
        {paid ? (
          <div className="label mx-auto max-w-2xl px-6 py-10 sm:px-10">
            <ClearCart />
            <span className="stamp is-stamped -rotate-3 text-subhead" data-stamp style={{ ["--stamp-rotate" as string]: "-3deg" }}>
              Payé
            </span>
            <h1 className="display mt-6 text-subhead">Merci, votre commande est réglée.</h1>
            <p className="mt-4 text-print-soft">
              Commande <strong className="font-mono text-print">{session!.client_reference_id}</strong> · {formatPrice(session!.amount_total / 100)}. Retrait prévu{" "}
              {session!.metadata?.retrait ?? "au jour choisi"}, au 45 avenue de Paris. Un reçu vous est envoyé par e-mail
              {session!.customer_details?.email ? ` (${session!.customer_details.email})` : ""}.
            </p>
            {session!.line_items?.data?.length ? (
              <ul className="mt-6 space-y-1 border-t border-dashed border-print/40 pt-4 font-mono text-data">
                {session!.line_items.data.map((l, i) => (
                  <li key={i} className="leader">
                    <span>
                      {l.quantity} × {l.description}
                    </span>
                    <span className="tabular-nums">{formatPrice(l.amount_total / 100)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href="/commander" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-ink px-5 font-bold tracking-[0.05em] text-kraft uppercase hover:bg-ink-deep">
              Retour à la boutique <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="label mx-auto max-w-2xl px-6 py-10 sm:px-10">
            <h1 className="display text-subhead">Paiement non confirmé.</h1>
            <p className="mt-4 text-print-soft">Nous n&apos;avons pas de confirmation de paiement pour cette commande. Votre panier est conservé.</p>
            <Link href="/commander/panier" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-ink px-5 font-bold tracking-[0.05em] text-kraft uppercase hover:bg-ink-deep">
              Revenir au panier <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
