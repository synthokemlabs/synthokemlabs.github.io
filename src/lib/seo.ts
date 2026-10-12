import type { Metadata } from "next";
import { SITE, LOCATIONS } from "@/data/site";

export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();

interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

/** Builds unique title, description, canonical, Open Graph and X metadata for a page. */
export function pageMetadata({ title, description, path, image = "/og-image.png", noindex, type = "website" }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: `${title} | ${SITE.name}`,
      description,
      siteName: SITE.legalName,
      locale: "en_IN",
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: `${SITE.name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [absoluteUrl(image)],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function organizationJsonLd() {
  const hq = LOCATIONS[0];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon.svg"),
    foundingDate: String(SITE.foundingYear),
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone.href.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${hq.lines[0]}, ${hq.lines[1]}`,
      addressLocality: "Patancheru, Sangareddy",
      postalCode: "502319",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", email: SITE.email, telephone: "+91-8455-224180", areaServed: "Worldwide", availableLanguage: ["English"] },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/products/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}
