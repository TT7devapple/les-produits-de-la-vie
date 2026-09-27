"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { directionsUrl, fullAddress, store } from "@/data/store";
import { OpenStatus } from "@/components/store/OpenStatus";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  isActive: (href: string) => boolean;
}

/** Menu plein écran (mobile, tablette) : un aplat d'encre, les rubriques en grandes capitales. */
export function MobileMenu({ open, onClose, onNavigate, isActive }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Léger délai : le panneau doit être rendu visible avant de recevoir le focus.
    const focusTimer = window.setTimeout(() => panel?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // Garde le focus dans le menu (et sur le bouton de fermeture de l'en-tête)
      if (e.key === "Tab" && panel) {
        const toggle = document.querySelector<HTMLElement>('[aria-controls="menu-mobile"]');
        const focusables = [toggle, ...panel.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="menu-mobile"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={cn(
        "on-ink fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto px-5 pt-6 pb-8 lg:hidden",
        // Visible tout de suite à l'ouverture (pour recevoir le focus), masqué après le glissement à la fermeture.
        open
          ? "visible translate-y-0 [transition:transform_.35s_var(--ease-out)]"
          : "invisible -translate-y-3 opacity-0 [transition:transform_.2s,opacity_.2s,visibility_0s_linear_.2s]",
      )}
    >
      <nav aria-label="Navigation mobile">
        <ul>
          {site.nav.map((item) => (
            <li key={item.href} className="border-b-2 border-kraft/25">
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="display flex items-center justify-between py-4 text-display aria-[current=page]:underline aria-[current=page]:decoration-4 aria-[current=page]:underline-offset-8"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-4 pt-10">
        <OpenStatus />
        <p>{fullAddress}</p>
        <div className="grid grid-cols-2 gap-2">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-13 items-center justify-center bg-kraft font-bold tracking-[0.06em] text-ink uppercase">
            Itinéraire
          </a>
          {store.phone ? (
            <a href={store.phone.href} className="flex min-h-13 items-center justify-center border-2 border-kraft font-bold tracking-[0.06em] uppercase">
              Appeler
            </a>
          ) : (
            <Link href="/contact" onClick={onNavigate} className="flex min-h-13 items-center justify-center border-2 border-kraft font-bold tracking-[0.06em] uppercase">
              Contact
            </Link>
          )}
        </div>
        {store.socials.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline decoration-2 underline-offset-4">
            {s.label} {s.handle}
          </a>
        ))}
      </div>
    </div>
  );
}
