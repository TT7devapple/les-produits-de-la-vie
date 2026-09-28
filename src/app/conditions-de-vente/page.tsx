import { fullAddress, store } from "@/data/store";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, ToFill } from "@/components/sections/LegalPage";

export const metadata = {
  ...pageMetadata({
    title: "Conditions de vente",
    description: "Conditions générales de vente des commandes en ligne à retirer chez Les Produits de la Vie, Vincennes.",
    path: "/conditions-de-vente",
  }),
  robots: { index: false, follow: true },
};

/**
 * ⚠️ Base à faire valider par le commerçant (et idéalement un professionnel du droit)
 * avant d'accepter des commandes réelles. Les champs « À compléter » sont visibles.
 */
export default function TermsPage() {
  return (
    <LegalPage title="Conditions de vente" intro="Commandes passées sur ce site et retirées en boutique.">
      <section>
        <h2>Vendeur</h2>
        <p>
          {store.name}, {fullAddress}. Raison sociale : <ToFill>raison sociale, forme juridique</ToFill> · SIRET : <ToFill>numéro SIRET</ToFill>.
        </p>
      </section>

      <section>
        <h2>Produits et prix</h2>
        <p>
          Les produits proposés sont ceux de la gamme Les Produits de la Vie. Les prix sont indiqués en euros, toutes taxes comprises, et sont ceux en
          vigueur au moment de la commande. Les photos sont non contractuelles.
        </p>
        <p>
          En cas d&apos;indisponibilité d&apos;un produit après la commande, la boutique vous prévient et vous propose un remplacement ou le
          remboursement de l&apos;article concerné.
        </p>
      </section>

      <section>
        <h2>Commande et retrait</h2>
        <p>
          La commande est passée en ligne en choisissant un jour de retrait. Elle est à retirer au {fullAddress}, aux horaires d&apos;ouverture. Aucune
          livraison n&apos;est proposée. Délai de conservation d&apos;une commande non retirée : <ToFill>nombre de jours</ToFill>.
        </p>
      </section>

      <section>
        <h2>Paiement</h2>
        <ul>
          <li>En ligne, par carte bancaire, via la plateforme sécurisée Stripe : le site n&apos;a jamais accès à vos coordonnées bancaires.</li>
          <li>Ou au retrait en boutique, selon les moyens de paiement acceptés par la boutique.</li>
        </ul>
      </section>

      <section>
        <h2>Droit de rétractation</h2>
        <p>
          Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux denrées susceptibles de se
          détériorer ou de se périmer rapidement, ni aux produits descellés après la livraison qui ne peuvent être renvoyés pour des raisons
          d&apos;hygiène. Pour les autres produits : <ToFill>modalités de rétractation et de remboursement retenues par la boutique</ToFill>.
        </p>
      </section>

      <section>
        <h2>Réclamations et médiation</h2>
        <p>
          Pour toute question sur une commande : en boutique{store.phone ? `, ou au ${store.phone.display}` : ""}. Médiateur de la consommation :{" "}
          <ToFill>nom et coordonnées du médiateur</ToFill>.
        </p>
      </section>
    </LegalPage>
  );
}
