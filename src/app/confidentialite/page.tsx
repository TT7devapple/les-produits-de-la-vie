import { fullAddress, store } from "@/data/store";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, ToFill } from "@/components/sections/LegalPage";

export const metadata = {
  ...pageMetadata({
    title: "Politique de confidentialité",
    description: "Comment le site de l'épicerie Les Produits de la Vie traite vos données personnelles.",
    path: "/confidentialite",
  }),
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité" intro="Ce que nous faisons (et ne faisons pas) de vos données.">
      <section>
        <h2>En bref</h2>
        <ul>
          <li>Ce site ne dépose aucun cookie publicitaire ni de mesure d&apos;audience.</li>
          <li>La carte Google Maps n&apos;est chargée que si vous cliquez sur « Afficher la carte ».</li>
          <li>Les informations du formulaire de contact servent uniquement à vous répondre.</li>
        </ul>
      </section>

      <section>
        <h2>Responsable du traitement</h2>
        <p>
          {store.name}, {fullAddress}. Représenté par <ToFill>nom du responsable</ToFill>.
        </p>
      </section>

      <section>
        <h2>Formulaire de contact</h2>
        <p>
          Lorsque vous nous écrivez, nous recevons votre nom, votre adresse e-mail, votre message et, si vous le souhaitez, votre numéro de
          téléphone. Ces données sont utilisées uniquement pour répondre à votre demande (base légale : votre consentement et notre intérêt à vous
          répondre). Elles sont conservées le temps nécessaire au traitement de votre demande, puis au maximum 12 mois.
        </p>
        <p>
          Prestataire d&apos;envoi du formulaire : <ToFill>nom du service utilisé (ex. Formspree) et lien vers sa politique</ToFill>
        </p>
      </section>

      <section>
        <h2>Services tiers</h2>
        <p>
          <strong>Google Maps</strong> : si vous choisissez d&apos;afficher la carte, Google peut déposer des cookies et collecter des données de
          navigation, selon sa propre{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            politique de confidentialité
          </a>
          . Le lien « Itinéraire » vous redirige vers Google Maps.
        </p>
        <p>
          <strong>Polices de caractères</strong> : elles sont hébergées avec le site, aucune requête n&apos;est faite vers Google Fonts lors de votre
          visite.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez accéder à vos données, les faire rectifier ou supprimer, et vous opposer à leur traitement. Pour cela, contactez-nous en
          boutique
          {store.phone ? `, au ${store.phone.display}` : ""}
          {store.email ? ` ou à ${store.email}` : ""}. Vous pouvez également introduire une réclamation auprès de la{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            CNIL
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
