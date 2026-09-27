import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-28 pb-20">
      <Container>
        <Stamp rotate={-5} className="text-2xl">
          Rayon vide
        </Stamp>
        <h1 className="display mt-8 max-w-4xl text-display">Cette page n&apos;est pas en rayon.</h1>
        <p className="mt-6 max-w-lg text-xl">Elle n&apos;existe pas, ou plus. Le reste de la boutique vous attend.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/" icon={<ArrowRight className="h-4 w-4" />}>
            Retour à l&apos;accueil
          </Button>
          <Button href="/nos-produits" variant="outline">
            Voir les produits
          </Button>
        </div>
      </Container>
    </section>
  );
}
