"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { easeOut, motionOn, registerView, seg } from "@/lib/scenes";

/**
 * Les étiquettes arrivent en désordre — décalées, inclinées — puis se posent
 * chacune à sa place au fil du défilement, comme posées à la main sur le kraft.
 * Enveloppe une liste (`<ul>`). Dans un carrousel horizontal (mobile), qui
 * rognerait un grand déplacement vertical, la trajectoire devient surtout latérale.
 */
export function LabelArrival({ className, children }: { className?: string; children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!motionOn()) return;
    const ul = list.current!;
    const items = [...ul.children] as HTMLElement[];
    let paths: { dx: number; dy: number; rot: number }[] = [];

    const compute = () => {
      // valeurs pseudo-aléatoires stables : chaque étiquette a sa propre trajectoire
      const scrolls = getComputedStyle(ul).overflowX !== "visible";
      paths = items.map((_, i) => {
        const seed = ((i * 137 + 41) % 89) / 89;
        return scrolls
          ? { dx: 90 + seed * 110, dy: 10 + seed * 14, rot: (i % 2 ? 1 : -1) * (6 + seed * 6) }
          : { dx: (i % 2 ? 1 : -1) * (40 + seed * 90), dy: 140 + seed * 160, rot: (i % 3 === 0 ? 1 : -1) * (5 + seed * 7) };
      });
    };
    compute();
    window.addEventListener("resize", compute);

    const off = registerView(ul, (p) => {
      items.forEach((el, i) => {
        const k = 1 - seg(p, 0.02 + i * 0.035, 0.3 + i * 0.035, easeOut);
        const a = paths[i];
        el.style.transform = `translate3d(${a.dx * k}px, ${a.dy * k}px, 0) rotate(${a.rot * k}deg)`;
      });
    });
    return () => {
      off();
      window.removeEventListener("resize", compute);
      items.forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return (
    <ul ref={list} className={className}>
      {children}
    </ul>
  );
}
