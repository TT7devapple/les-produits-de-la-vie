"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";
import { CartButton } from "@/components/shop/CartButton";
import { cn } from "@/lib/utils";

// Pages avec une barre collante sous l'en-tête : l'en-tête y reste toujours visible.
const PINNED_ROUTES = ["/nos-produits"];

/**
 * Bandeau du haut du sac : kraft, filet d'encre.
 * Se retire quand on descend, revient dès qu'on remonte (attribut data-hidden,
 * sans re-rendu React).
 */
export function Header() {
  const pathname = usePathname();
  const pinned = PINNED_ROUTES.includes(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (pinned || y < 160 || up) header.dataset.hidden = "false";
      else if (down && y > 480) header.dataset.hidden = "true";
      if (down || up) lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pinned]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        ref={headerRef}
        data-hidden="false"
        data-menu={menuOpen ? "open" : "closed"}
        className={cn(
          "on-ink bag-mouth fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-[var(--ease-out)]",
          "data-[hidden=true]:-translate-y-full data-[menu=open]:translate-y-0",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 pb-1.5 sm:px-8 lg:h-[4.5rem]">
          <Link href="/" aria-label="Les Produits de la Vie — accueil" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="py-2 text-ui font-bold tracking-[0.06em] uppercase decoration-2 underline-offset-[6px] hover:underline aria-[current=page]:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <CartButton onNavigate={() => setMenuOpen(false)} />
            <Link
              href="/contact#venir"
              className="hidden h-11 items-center bg-kraft px-5 text-sm font-bold tracking-[0.06em] text-ink uppercase transition-colors hover:bg-label sm:inline-flex"
            >
              Nous trouver
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="-mr-2 flex h-12 min-w-12 items-center justify-center gap-2 px-2 text-sm font-bold tracking-[0.06em] uppercase lg:hidden"
            >
              <span aria-hidden="true" className="hidden sm:inline">
                {menuOpen ? "Fermer" : "Menu"}
              </span>
              {menuOpen ? <X className="h-6 w-6" strokeWidth={2} aria-hidden="true" /> : <Menu className="h-6 w-6" strokeWidth={2} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} onNavigate={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}
