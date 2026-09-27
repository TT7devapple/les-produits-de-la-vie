import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "./PageHeader";

/** Mise en page sobre pour les textes juridiques. */
export function LegalPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <>
      <PageHeader title={title} intro={intro} />
      <Container className="pb-24">
        <div className="max-w-[68ch] space-y-10 border-t-2 border-ink pt-10 [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[0.05em] [&_h2]:uppercase [&_p]:leading-relaxed [&_p+p]:mt-3 [&_strong]:font-bold [&_ul]:mt-3 [&_ul]:list-['–__'] [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </>
  );
}

/** Champ à compléter par le propriétaire — visible pour ne pas être oublié. */
export function ToFill({ children }: { children: ReactNode }) {
  return <mark className="bg-label px-1.5 py-0.5 font-mono text-[0.9em] text-print">[À compléter : {children}]</mark>;
}
