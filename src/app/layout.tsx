import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollFX } from "@/components/layout/ScrollFX";
import { BackToTop } from "@/components/layout/BackToTop";
import { RouteProgress } from "@/components/layout/RouteProgress";
import { JsonLd } from "@/components/ui/primitives";
import { SITE } from "@/data/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

// Self-hosted variable fonts (Latin subset) — no third-party font requests.
const manrope = localFont({ src: "../fonts/manrope-latin-wght-normal.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });
const inter = localFont({ src: "../fonts/inter-latin-wght-normal.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });
const mono = localFont({ src: "../fonts/jetbrains-mono-latin-wght-normal.woff2", variable: "--font-mono-face", display: "swap", weight: "100 800", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — API & Pharmaceutical Intermediates Manufacturer, India`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }], apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0d3b66",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`no-js ${manrope.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js');setTimeout(function(){document.documentElement.classList.add('anim-settled')},2600)" }} />

      </head>
      <body>
        <a href="#main" className="sr-only z-[100] rounded-lg bg-primary px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <SmoothScroll />
        <ScrollFX />
        <BackToTop />
        <RouteProgress />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
