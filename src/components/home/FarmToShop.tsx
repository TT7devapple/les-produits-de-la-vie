"use client";

import { Fragment, useEffect, useRef, type ReactNode, type Ref } from "react";
import { images } from "@/data/images";
import { store } from "@/data/store";
import { Container } from "@/components/ui/Container";
import { PrintedImage } from "@/components/ui/PrintedImage";
import { clamp, easeInOut, motionOn, prepareDraw, registerScene, seg } from "@/lib/scenes";

/**
 * « Du champ au client » : le trajet réel d'un produit, en cinq étapes.
 * Faits repris du site de la marque (agriculture pacifique, meule de pierre,
 * ateliers propres) et de la boutique (arrivage du jeudi).
 */
const route = [
  { place: "Les champs", text: "Huit fermes écologiques en Bavière, cultivées sans élevage, ni fumier, ni pesticides." },
  { place: "Le moulin", text: "Le grain est moulu en douceur sur une meule de pierre." },
  { place: "Les ateliers", text: "La boulangerie et la biscuiterie de la ferme transforment sur place." },
  { place: `Le ${store.restockDay}`, text: "La livraison arrive à Vincennes, sans intermédiaire." },
  { place: "La boutique", text: `${store.address.street}. Tout ce qui est en rayon est végétal.` },
];

/** Découpe un texte en lettres encrables ; les mots restent insécables. */
function InkText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) ? (
          <Fragment key={i}> </Fragment>
        ) : (
          <span key={i} className="whitespace-nowrap">
            {[...part].map((c, j) => (
              <span key={j} className="ink-char">
                {c}
              </span>
            ))}
          </span>
        ),
      )}
    </>
  );
}

/** Mots entourés d'un trait à la main (tracé dessiné au défilement). */
function HandCircled({ children, pathRef }: { children: ReactNode; pathRef: Ref<SVGPathElement> }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="hand-oval pointer-events-none absolute -top-[0.28em] -left-[0.35em] h-[calc(100%+0.56em)] w-[calc(100%+0.7em)] overflow-visible"
      >
        <path ref={pathRef} d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z" />
      </svg>
    </span>
  );
}

export function FarmToShop() {
  const inkScene = useRef<HTMLDivElement>(null);
  const inkText = useRef<HTMLParagraphElement>(null);
  const ovalPath = useRef<SVGPathElement>(null);
  const routeScene = useRef<HTMLDivElement>(null);
  const roll = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLOListElement>(null);
  const track = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!motionOn()) return;

    // ——— Encrage caractère par caractère ———
    const chars = [...inkText.current!.querySelectorAll<HTMLElement>(".ink-char")];
    const circled = ovalPath.current!.closest("svg")!.parentElement!;
    const ovalStart = chars.findIndex((c) => circled.contains(c));
    const draw = prepareDraw(ovalPath.current!);
    let lastIdx = 0;
    const offInk = registerScene(inkScene.current!, (p) => {
      const idx = Math.round(seg(p, 0.08, 0.7) * chars.length);
      if (idx !== lastIdx) {
        const lo = Math.min(idx, lastIdx);
        const hi = Math.max(idx, lastIdx);
        for (let i = lo; i < hi; i++) chars[i].classList.toggle("on", i < idx);
        lastIdx = idx;
      }
      // l'ovale ne se trace qu'une fois l'encre arrivée sur les mots qu'il entoure
      const reached = ovalStart >= 0 && idx > ovalStart;
      draw(reached ? 1 - seg(p, 0.66, 0.84) : 1);
    });

    // ——— Trajet : compteur odomètre et relais des étapes ———
    const items = [...steps.current!.querySelectorAll<HTMLElement>("li")];
    const offRoute = registerScene(routeScene.current!, (p) => {
      const gate = seg(p, 0, 0.08);
      const cont = seg(p, 0.1, 0.9, easeInOut) * (items.length - 1);
      counter.current!.style.opacity = `${gate}`;
      roll.current!.style.transform = `translateY(${-cont}em)`;
      track.current!.style.transform = `scaleX(${cont / (items.length - 1)})`;
      items.forEach((el, i) => {
        const d = cont - i;
        // relais asymétrique : l'étape en cours s'efface vite, la suivante entre tôt,
        // jamais deux textes pleins à la fois, jamais d'écran vide
        const vis = d >= 0 ? clamp(1 - d / 0.35) : clamp((d + 0.75) / 0.4);
        el.style.opacity = `${vis * gate}`;
        el.style.transform = `translateY(${-d * 60}px)`;
      });
    });

    return () => {
      offInk();
      offRoute();
      chars.forEach((c) => c.classList.remove("on"));
      items.forEach((el) => el.removeAttribute("style"));
    };
  }, []);

  return (
    <section aria-labelledby="ferme-titre" className="on-ink serrated-top">
      {/* 1. Le propos, qui s'encre lettre à lettre */}
      <div ref={inkScene} className="anim:h-[230svh]">
        <div className="py-20 sm:py-28 anim:sticky anim:top-0 anim:flex anim:h-svh anim:items-center anim:py-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 id="ferme-titre" className="display text-headline">
                  Une épicerie pas comme les autres
                </h2>
                <p ref={inkText} className="mt-8 text-lead font-bold sm:text-subhead sm:leading-[1.12] xl:text-headline xl:leading-[1.02] [font-variation-settings:'wdth'_82]">
                  <InkText text="Tout ce qui est en rayon vient d'un même groupement de huit fermes de Bavière, qui cultive, transforme et vend lui-même depuis 1983. Du champ au client," />{" "}
                  <HandCircled pathRef={ovalPath}>
                    <InkText text="sans intermédiaire." />
                  </HandCircled>
                </p>
              </div>
              <div className="hidden lg:col-span-4 lg:block">
                <PrintedImage image={images.wheatField} sizes="(min-width: 1024px) 30vw, 1px" className="aspect-[3/4]" />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* 2. Le trajet, étape par étape */}
      <div ref={routeScene} className="anim:h-[380svh]">
        <div className="pb-20 sm:pb-28 anim:sticky anim:top-0 anim:flex anim:h-svh anim:items-center anim:overflow-hidden anim:pb-0">
          <Container>
            <div className="anim:grid anim:items-center anim:gap-6 lg:anim:grid-cols-12 lg:anim:gap-10">
              {/* Compteur façon afficheur de balance : 01 → 05 */}
              <div
                ref={counter}
                aria-hidden="true"
                className="display hidden text-[clamp(7rem,26vh,17rem)] leading-none tabular-nums opacity-0 anim:flex lg:anim:col-span-5"
              >
                <span>0</span>
                <span className="inline-block h-[1em] overflow-hidden">
                  <span ref={roll} className="flex flex-col will-change-transform">
                    {route.map((_, i) => (
                      <span key={i} className="block h-[1em]">
                        {i + 1}
                      </span>
                    ))}
                  </span>
                </span>
              </div>

              <ol ref={steps} className="grid lg:grid-cols-5 anim:relative anim:block anim:min-h-[15rem] lg:anim:col-span-7">
                {route.map((step, i) => (
                  <li
                    key={step.place}
                    className="group relative grid grid-cols-[2.25rem_1fr] gap-x-4 pb-8 lg:block lg:pr-6 lg:pb-0 anim:absolute anim:inset-x-0 anim:top-0 anim:block anim:pr-0 anim:pb-0 anim:opacity-0"
                  >
                    {/* Tracé statique : vertical sur mobile, horizontal sur grand écran */}
                    <span
                      aria-hidden="true"
                      className="absolute top-3 bottom-0 left-[0.95rem] w-0.5 bg-kraft/50 group-last:hidden lg:top-[0.95rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-auto anim:hidden"
                    />
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center bg-kraft font-mono text-sm font-medium text-ink anim:hidden">
                      {i + 1}
                    </span>
                    <div className="lg:mt-5 anim:mt-0">
                      <h3 className="display text-subhead anim:text-headline">{step.place}</h3>
                      <p className="mt-2 max-w-[26ch] leading-snug anim:mt-4 anim:max-w-[34ch] anim:text-lead">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Ligne de route qui se remplit, avec ses cinq arrêts */}
            <div aria-hidden="true" className="relative mt-12 hidden h-1 bg-kraft/25 anim:block">
              <span ref={track} className="absolute inset-0 origin-left scale-x-0 bg-kraft" />
              {route.map((step, i) => (
                <span
                  key={step.place}
                  className="absolute -top-[6px] h-4 w-4 -translate-x-1/2 bg-kraft"
                  style={{ left: `${(i / (route.length - 1)) * 100}%` }}
                />
              ))}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
