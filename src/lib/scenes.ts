/**
 * Moteur de scènes pilotées au défilement (adapté du template « Site Immersif »,
 * sans détournement du scroll natif).
 *
 * - « pin » : une section haute (ex. 250svh) dont l'enfant est `position: sticky`.
 *   p ∈ [0, 1] va du moment où la section touche le haut de l'écran au moment
 *   où elle le quitte.
 * - « view » : un élément ordinaire. p va de 0 (son haut entre par le bas de
 *   l'écran) à 1 (son bas sort par le haut).
 *
 * Une seule boucle rAF, déclenchée par le scroll, écrit les styles directement
 * (aucun re-rendu React).
 */
type Kind = "pin" | "view";
type Scene = { el: HTMLElement; kind: Kind; update: (p: number) => void; start: number; len: number; last: number };

const scenes = new Set<Scene>();
let frame = 0;
let listening = false;

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Progression locale d'un segment [a, b] de p, avec courbe facultative. */
export const seg = (p: number, a: number, b: number, ease?: (t: number) => number) => {
  const t = clamp((p - a) / (b - a));
  return ease ? ease(t) : t;
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Vrai quand les animations sont autorisées (drapeau posé par le script inline du layout). */
export function motionOn(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === "on";
}

function measure(s: Scene) {
  const vh = window.innerHeight;
  const top = s.el.getBoundingClientRect().top + window.scrollY;
  if (s.kind === "pin") {
    s.start = top;
    s.len = Math.max(1, s.el.offsetHeight - vh);
  } else {
    s.start = top - vh;
    s.len = Math.max(1, s.el.offsetHeight + vh);
  }
  s.last = -1;
}

function render() {
  frame = 0;
  const y = window.scrollY;
  for (const s of scenes) {
    const p = clamp((y - s.start) / s.len);
    if (Math.abs(p - s.last) < 0.0004) continue;
    s.last = p;
    s.update(p);
  }
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(render);
};
const remeasure = () => {
  scenes.forEach(measure);
  schedule();
};

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  document.fonts?.ready.then(remeasure);
  // Toute variation de hauteur de page (images, polices, filtres) décale les scènes.
  new ResizeObserver(remeasure).observe(document.body);
}

function register(el: HTMLElement, kind: Kind, update: (p: number) => void): () => void {
  const s: Scene = { el, kind, update, start: 0, len: 1, last: -1 };
  scenes.add(s);
  listen();
  measure(s);
  schedule();
  return () => {
    scenes.delete(s);
  };
}

/** Scène épinglée (section haute + enfant sticky). Renvoie la désinscription. */
export const registerScene = (el: HTMLElement, update: (p: number) => void) => register(el, "pin", update);
/** Élément non épinglé, suivi pendant sa traversée de l'écran. */
export const registerView = (el: HTMLElement, update: (p: number) => void) => register(el, "view", update);

/**
 * Trait « dessiné à la main » (SVG en `vector-effect: non-scaling-stroke` dans un
 * viewBox étiré) : Chromium évalue alors les tirets en pixels écran, d'où la
 * longueur mise à l'échelle et recalculée à chaque redimensionnement.
 * Renvoie `draw(v)` : v = 1 invisible, v = 0 entièrement tracé.
 */
export function prepareDraw(path: SVGPathElement): (v: number) => void {
  let len = 1;
  let lastV = 1;
  const apply = (v: number) => {
    lastV = clamp(v);
    path.style.strokeDashoffset = `${len * lastV}`;
    path.style.opacity = lastV >= 0.999 ? "0" : "1";
  };
  const calc = () => {
    const svg = path.ownerSVGElement;
    const vb = svg?.viewBox.baseVal;
    const sx = (svg?.clientWidth || 100) / (vb?.width || 100);
    const sy = (svg?.clientHeight || 100) / (vb?.height || 100);
    len = path.getTotalLength() * Math.max(sx, sy, 1) * 1.25;
    path.style.strokeDasharray = `${len}`;
    apply(lastV);
  };
  calc();
  window.addEventListener("resize", calc);
  document.fonts?.ready.then(calc);
  return apply;
}
