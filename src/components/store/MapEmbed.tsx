"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { directionsUrl, fullAddress, mapEmbedUrl, store } from "@/data/store";
import { cn } from "@/lib/utils";

/**
 * Plan du quartier imprimé à l'encre, et vraie carte Google Maps chargée
 * seulement au clic (page plus rapide, aucun cookie tiers sans action : RGPD).
 * Le plan est schématique : avenue de Paris, métro Bérault, la boutique.
 * `ground` : couleur du fond, utilisée pour les réserves (lettre M, cœur du repère).
 */
export function MapEmbed({ className, ground = "var(--color-kraft)" }: { className?: string; ground?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden border-2 border-current", className)}>
      {loaded ? (
        <iframe
          src={mapEmbedUrl}
          title={`Carte : ${store.name}, ${fullAddress}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          {/* Plan dessiné pour rester lisible à toutes les tailles : la boutique et le métro sont dans un îlot sans rue,
              le nom de l'avenue est réservé dans la bande de l'avenue, rien d'important sous le bandeau de commandes. */}
          <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <g fill="none" stroke="currentColor" strokeLinecap="square">
              <g strokeWidth="1.2" opacity=".55">
                <path d="M60 -10 L85 310" />
                <path d="M170 -10 L182 310" />
                <path d="M292 -10 L284 310" />
                <path d="M365 -10 L377 310" />
                <path d="M-10 36 L410 22" />
                <path d="M-10 236 L410 222" />
              </g>
              <path d="M-10 128 L410 100" strokeWidth="16" />
            </g>
            <text x="96" y="124.5" fill={ground} fontSize="9" fontWeight="500" letterSpacing="2.4" transform="rotate(-3.81 96 124.5)" style={{ fontFamily: "var(--font-label)" }}>
              AVENUE DE PARIS
            </text>
            <g transform="translate(212 78)">
              <rect x="-11" y="-11" width="22" height="22" fill="currentColor" />
              <text y="4.5" textAnchor="middle" fontSize="13" fontWeight="700" fill={ground} style={{ fontFamily: "var(--font-archivo)" }}>
                M
              </text>
              <text x="16" y="4" fill="currentColor" fontSize="9" letterSpacing="1.5" style={{ fontFamily: "var(--font-label)" }}>
                BÉRAULT
              </text>
            </g>
            <g transform="translate(226 158)">
              <path d="M0 0 L-9 -22 A10 10 0 1 1 9 -22 Z" fill="currentColor" />
              <circle cy="-26" r="3.6" fill={ground} />
              <text x="14" y="-10" fill="currentColor" fontSize="10" fontWeight="700" letterSpacing="1.2" style={{ fontFamily: "var(--font-label)" }}>
                Nº 45
              </text>
            </g>
          </svg>          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-x-6 border-t-2 border-current px-4 py-1.5 sm:flex-row sm:items-center" style={{ background: ground }}>
            <button type="button" onClick={() => setLoaded(true)} className="min-h-11 text-left font-bold tracking-[0.06em] whitespace-nowrap uppercase underline decoration-2 underline-offset-4 hover:decoration-4">
              Afficher la carte
            </button>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center font-bold tracking-[0.06em] whitespace-nowrap uppercase underline decoration-2 underline-offset-4 hover:decoration-4">
              Itinéraire <ArrowUpRight aria-hidden="true" className="inline h-4 w-4 align-[-2px]" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
