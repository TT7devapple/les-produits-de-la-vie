import type { ReactNode } from "react";
import type { SiteImage } from "@/types";
import { Container } from "@/components/ui/Container";
import { PrintedImage } from "@/components/ui/PrintedImage";

/**
 * En-tête des pages intérieures : le titre imprimé en grand sur le kraft.
 * Avec image : la photo est imprimée à l'encre à côté du titre.
 */
export function PageHeader({ title, intro, image, children }: { title: ReactNode; intro?: ReactNode; image?: SiteImage; children?: ReactNode }) {
  return (
    <header className="pt-28 pb-12 sm:pt-32 lg:pt-40 lg:pb-16">
      <Container>
        <div className={image ? "grid items-end gap-10 lg:grid-cols-12" : undefined}>
          <div className={image ? "lg:col-span-7" : undefined}>
            <h1 className="display max-w-5xl text-display">{title}</h1>
            {intro && <div className="mt-6 max-w-2xl text-lg leading-snug sm:text-xl">{intro}</div>}
            {children}
          </div>
          {image && <PrintedImage image={image} preload sizes="(min-width: 1024px) 38vw, 100vw" className="aspect-[4/3] lg:col-span-5" />}
        </div>
      </Container>
    </header>
  );
}
