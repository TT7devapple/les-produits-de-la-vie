import type { Metadata, Viewport } from "next";
import { Archivo, Red_Hat_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { store } from "@/data/store";
import { storeJsonLd } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { StampObserver } from "@/components/ui/StampObserver";
import { JsonLd } from "@/components/seo/JsonLd";

// Une seule famille, deux voix : Archivo condensée (axe wdth) pour les capitales
// imprimées du sac, Archivo normale pour le texte.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

// Réservée aux données des étiquettes de balance (poids, formats, horaires).
const labelMono = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--font-label",
  weight: ["400", "500"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${store.name}, Vincennes`,
  },
  description: site.description,
  applicationName: store.name,
  keywords: [
    "épicerie Vincennes",
    "épicerie fine Vincennes",
    "épicerie vegan Vincennes",
    "épicerie végétale",
    "produits artisanaux Vincennes",
    "pain paysan Vincennes",
    "avenue de Paris Vincennes",
    "Les Produits de la Vie",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: store.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#c7a06f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${labelMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Animations pour tous les visiteurs dès que JavaScript est disponible (choix du client,
            y compris si le système demande de réduire les animations). Sans JS, mise en page statique. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');d.dataset.motion='on'",
          }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:px-5 focus:py-3 focus:font-semibold focus:text-kraft"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <MobileActionBar />
        <StampObserver />
        <JsonLd data={storeJsonLd()} />
      </body>
    </html>
  );
}
