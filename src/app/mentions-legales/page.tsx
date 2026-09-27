import { fullAddress, store } from "@/data/store";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, ToFill } from "@/components/sections/LegalPage";

export const metadata = {
  ...pageMetadata({
    title: "Mentions légales",
    description: "Mentions légales du site de l'épicerie Les Produits de la Vie à Vincennes.",
    path: "/mentions-legales",
  }),
  robots: { index: false, follow: true },
};

/**
 * ⚠️ Les informations juridiques de l'exploitant (raison sociale, SIRET,
 * responsable de publication, hébergeur) ne sont pas connues : elles sont
 * signalées par des encadrés « À compléter » à remplir avant la mise en ligne.
 */
export default function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>{store.name}</strong> — boutique de Vincennes
          <br />
          {fullAddress}
        </p>
        <p>
          Raison sociale et forme juridique : <ToFill>raison sociale, forme juridique, capital</ToFill>
          <br />
          SIRET : <ToFill>numéro SIRET</ToFill>
          <br />
          N° de TVA intracommunautaire : <ToFill>numéro de TVA</ToFill>
          <br />
          Responsable de la publication : <ToFill>nom du responsable</ToFill>
          <br />
          {store.phone ? <>Téléphone : {store.phone.display}</> : <>Téléphone : <ToFill>téléphone</ToFill></>}
          <br />
          {store.email ? <>E-mail : {store.email}</> : <>E-mail : <ToFill>adresse e-mail</ToFill></>}
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          <ToFill>nom, adresse et téléphone de l&apos;hébergeur (par exemple Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis)</ToFill>
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus de ce site (textes, mise en page, logotype) est protégé. Toute reproduction sans autorisation préalable est
          interdite. Les noms de produits cités appartiennent à leurs titulaires respectifs.
        </p>
        <p>
          Certaines photographies sont des images d&apos;illustration libres de droits et ne représentent pas nécessairement les produits vendus en
          boutique.
        </p>
      </section>

      <section>
        <h2>Informations produits</h2>
        <p>
          Les produits présentés sur ce site le sont à titre indicatif. La disponibilité en boutique peut varier selon les arrivages. Pour toute
          question sur la composition d&apos;un produit ou les allergènes, référez-vous à l&apos;étiquette ou demandez-nous en boutique.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Voir notre <a href="/confidentialite">politique de confidentialité</a>.
        </p>
        <p className="text-sm">Site : {site.url.replace(/^https?:\/\//, "")}</p>
      </section>
    </LegalPage>
  );
}
