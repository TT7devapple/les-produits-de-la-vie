"use client";

import { useEffect } from "react";

/**
 * Fait « tomber » chaque tampon ([data-stamp]) une seule fois,
 * quand il entre à l'écran. Un seul IntersectionObserver pour tout le site ;
 * le MutationObserver prend le relais après une navigation.
 */
export function StampObserver() {
  useEffect(() => {
    const land = (el: Element) => el.classList.add("is-stamped");
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-stamp]").forEach(land);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          land(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const observe = (root: ParentNode) => root.querySelectorAll("[data-stamp]:not(.is-stamped)").forEach((el) => io.observe(el));
    observe(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-stamp]:not(.is-stamped)")) io.observe(node);
          observe(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
