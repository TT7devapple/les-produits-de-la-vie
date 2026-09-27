"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { images } from "@/data/images";
import { store } from "@/data/store";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PrintedImage } from "@/components/ui/PrintedImage";
import { Stamp } from "@/components/ui/Stamp";
import { ScaleLabel } from "@/components/store/ScaleLabel";
import { clamp, easeInOut, easeOut, mix, motionOn, registerScene, seg } from "@/lib/scenes";

/** Hauteur de défilement consacrée à la scène, en plus du contenu (× hauteur d'écran). */
const SCENE_SPAN = 1.7;

/**
 * Premier écran : le titre imprimé, l'étiquette du jour agrafée à côté.
 *
 * Au défilement, la scène s'épingle : le reste s'efface, « À … VINCENNES. » monte
 * au centre, la photo imprimée naît entre les deux mots jusqu'à remplir l'écran,
 * puis le tampon du jeudi tombe. Sur tous les écrans : quand le contenu est plus
 * haut que la fenêtre (mobile, écran peu haut), il défile d'abord normalement —
 * horaires et boutons restent lisibles — et la scène ne démarre qu'ensuite.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const word1 = useRef<HTMLSpanElement>(null);
  const word2 = useRef<HTMLSpanElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const overlayImg = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const stamp = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionOn()) return;
    const st = stage.current!;
    const section = root.current!;
    const fades = [...st.querySelectorAll<HTMLElement>("[data-fade]")];
    const captionWords = [...caption.current!.querySelectorAll<HTMLElement>("span")];
    // off : hauteur du contenu qui dépasse la fenêtre (0 sur un grand écran)
    let geo = { off: 0, vh: 1, x: 0, w: 0, h: 0, lineCenter: 0 };
    let lastQ = -1;

    const layout = () => {
      [line2, word1, word2].forEach((r) => (r.current!.style.transform = ""));
      st.style.top = "0px";
      const vh = window.innerHeight;
      const off = Math.max(0, st.offsetHeight - vh);
      // l'enfant sticky colle avec un haut négatif : le surplus défile avant l'épinglage
      st.style.top = `${-off}px`;
      section.style.height = `${st.offsetHeight + SCENE_SPAN * vh}px`;
      const sr = st.getBoundingClientRect();
      const r = slot.current!.getBoundingClientRect();
      geo = { off, vh, x: r.left - sr.left, w: r.width, h: r.height, lineCenter: r.top - sr.top + r.height / 2 };
      lastQ = -1;
    };
    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout);

    const render = (q: number) => {
      const { off, vh } = geo;
      const W = st.clientWidth;
      const center = off + vh / 2; // centre de la fenêtre, dans le repère de la scène

      // 1. Le chapeau, les actions, l'étiquette et la première ligne s'effacent
      const out = seg(q, 0, 0.12);
      fades.forEach((el) => {
        el.style.opacity = `${1 - out}`;
        el.style.visibility = out > 0.99 ? "hidden" : "";
      });
      line1.current!.style.opacity = `${1 - seg(q, 0.02, 0.14)}`;

      // 2. « À … VINCENNES. » monte seule au centre de l'écran
      const lift = seg(q, 0.06, 0.22, easeInOut) * (center - geo.lineCenter);

      // 3. La photo naît entre les deux mots et gagne toute la fenêtre
      const g = seg(q, 0.24, 0.6, easeInOut);
      const w = mix(geo.w, W, g);
      const h = mix(geo.h, vh, Math.pow(g, 1.35));
      const cx = mix(geo.x + geo.w / 2, W / 2, g);
      const cy = mix(geo.lineCenter + lift, center, g);
      const box = overlay.current!;
      box.style.left = `${cx - w / 2}px`;
      box.style.top = `${cy - h / 2}px`;
      box.style.width = `${w}px`;
      box.style.height = `${h}px`;
      box.style.opacity = "1";
      box.style.borderRadius = g > 0.98 ? "0" : "2px";
      overlayImg.current!.style.transform = `scale(${1 + seg(q, 0.6, 1) * 0.06})`;

      // les mots restent collés aux bords de l'image qui les repousse
      const dy = cy - (geo.lineCenter + lift);
      line2.current!.style.transform = `translateY(${lift}px)`;
      word1.current!.style.transform = `translate(${cx - w / 2 - geo.x}px, ${dy}px)`;
      word2.current!.style.transform = `translate(${cx + w / 2 - (geo.x + geo.w)}px, ${dy}px)`;
      slot.current!.style.visibility = "hidden";

      // 4. Sur l'image pleine : les rayons s'impriment mot à mot, puis le tampon tombe
      captionWords.forEach((el, i) => {
        const k = seg(q, 0.6 + i * 0.04, 0.7 + i * 0.04, easeOut);
        el.style.opacity = `${k}`;
        el.style.transform = `translateY(${(1 - k) * 16}px)`;
      });
      const s = seg(q, 0.78, 0.86, easeOut);
      stamp.current!.style.opacity = `${Math.min(1, s * 1.6)}`;
      stamp.current!.style.transform = `scale(${mix(1.4, 1, s)}) rotate(-6deg)`;
    };

    const unregister = registerScene(section, (p) => {
      // p couvre tout le défilement de la section ; la scène ne démarre qu'une fois le surplus lu
      const total = section.offsetHeight - geo.vh;
      const q = clamp((p * total - geo.off) / Math.max(1, total - geo.off));
      if (Math.abs(q - lastQ) < 0.0004) return;
      lastQ = q;
      render(q);
    });

    return () => {
      unregister();
      window.removeEventListener("resize", layout);
      [line1, line2, word1, word2, slot, overlay, overlayImg, stamp, stage, root].forEach((r) => r.current?.removeAttribute("style"));
      fades.forEach((el) => el.removeAttribute("style"));
      captionWords.forEach((el) => el.removeAttribute("style"));
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-titre" className="relative anim:min-h-[270svh]">
      <div ref={stage} className="relative pt-24 pb-10 sm:pt-28 lg:pt-32 anim:sticky anim:top-0 anim:min-h-svh anim:overflow-hidden">
        <Container>
          {/* Mobile : titre → étiquette du jour → actions. Desktop : l'étiquette occupe la colonne de droite. */}
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">
            <div className="lg:col-span-8">
              <h1 id="hero-titre" className="display text-display">
                <span ref={line1} className="block">
                  Le goût des bonnes choses,
                </span>
                <span ref={line2} className="inline-flex items-center whitespace-nowrap">
                  <span ref={word1} className="inline-block">
                    À
                  </span>
                  {/* Vignette imprimée entre les deux mots : c'est d'ici que la photo naît. */}
                  <span ref={slot} aria-hidden="true" className="printed relative mx-[0.14em] inline-block h-[0.74em] w-[1.25em] rounded-[2px]">
                    <Image src={images.hero.src} alt="" fill sizes="120px" className="object-cover" />
                  </span>
                  <span ref={word2} className="inline-block">
                    Vincennes.
                  </span>
                </span>
              </h1>
              <p data-fade className="mt-6 max-w-xl text-lead leading-snug">
                La boutique d&apos;une ferme bavaroise, au pied du métro {store.access[0].station}. Pain paysan, épicerie, douceurs&nbsp;: tout
                est végétal, et le réassort arrive chaque {store.restockDay}.
              </p>
            </div>

            <div data-fade className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:pt-3">
              <ScaleLabel className="mx-auto max-w-sm rotate-[1.2deg] sm:mx-0" />
            </div>

            <div data-fade className="flex flex-col gap-3 sm:flex-row lg:col-span-8 lg:row-start-2">
              <Button href="/contact#venir" icon={<ArrowRight className="h-4 w-4" />}>
                Nous trouver
              </Button>
              <Button href="/la-boutique" variant="outline">
                Découvrir la boutique
              </Button>
            </div>
          </div>
        </Container>

        {/* Calque de la scène : la photo imprimée qui grandit */}
        <div ref={overlay} aria-hidden="true" className="absolute top-0 left-0 z-10 hidden overflow-hidden opacity-0 anim:block">
          <div ref={overlayImg} className="absolute inset-0 will-change-transform">
            <PrintedImage image={images.hero} sizes="100vw" decorative className="absolute inset-0" />
          </div>
          <p ref={caption} className="display absolute bottom-[12%] left-[6vw] max-w-[88vw] text-subhead text-kraft sm:max-w-[55vw] sm:text-headline">
            {["Pain paysan,", "épicerie,", "douceurs."].map((w) => (
              <span key={w} className="mr-[0.25em] mb-[0.1em] inline-block bg-ink px-[0.15em] pt-[0.08em] opacity-0">
                {w}
              </span>
            ))}
          </p>
          <div ref={stamp} className="absolute top-[18%] right-[6vw] text-kraft opacity-0">
            <span className="stamp bg-ink text-subhead sm:text-headline">Arrivage le {store.restockDay}</span>
          </div>
        </div>
      </div>

      {/* Sans JavaScript : la photo suit simplement en bandeau */}
      <div className="relative mt-4 anim:hidden">
        <PrintedImage image={images.hero} sizes="100vw" className="aspect-[4/3] sm:aspect-[21/9]" />
        <div className="absolute right-4 bottom-4 text-kraft sm:right-8 sm:bottom-8">
          <Stamp rotate={-6} className="bg-ink text-2xl sm:text-4xl">
            Arrivage le {store.restockDay}
          </Stamp>
        </div>
      </div>
    </section>
  );
}
