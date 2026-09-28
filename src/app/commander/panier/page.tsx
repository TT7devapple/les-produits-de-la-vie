import type { Metadata } from "next";
import { store } from "@/data/store";
import { orderDeliveryEnabled, stripeEnabled } from "@/lib/order";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Panier",
  robots: { index: false, follow: false },
};

// Les modes de paiement dépendent des variables d'environnement : page rendue à la demande.
export const dynamic = "force-dynamic";

export default async function CartPage({ searchParams }: PageProps<"/commander/panier">) {
  const { annule } = await searchParams;
  return (
    <>
      <PageHeader title="Votre panier">
        {annule && <p className="label mt-6 inline-block px-4 py-2">Paiement annulé : votre panier est intact, vous pouvez reprendre quand vous voulez.</p>}
      </PageHeader>
      <section className="pb-20 sm:pb-28">
        <Container>
          <CartView stripe={stripeEnabled()} delivery={orderDeliveryEnabled()} phone={store.phone ? { display: store.phone.display, href: store.phone.href } : null} />
        </Container>
      </section>
    </>
  );
}
