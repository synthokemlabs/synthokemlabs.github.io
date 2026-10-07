import type { IconName } from "@/components/ui/Icon";
import { CATEGORIES, productsIn } from "./products";
import { SITE } from "./site";

export interface NavLink { label: string; href: string; description?: string; icon?: IconName; external?: boolean }
export interface NavItem {
  label: string;
  href: string;
  /** Dropdown entries — omit for a direct link */
  items?: NavLink[];
  footer?: NavLink;
}

/** Deliberately small: three dropdowns, two direct links, one Contact button. */
export const MAIN_NAV: NavItem[] = [
  {
    label: "About",
    href: "/about/",
    items: [
      { label: "Company overview", href: "/about/", description: "Who we are, since 1978", icon: "factory" },
      { label: "Chairperson’s message", href: "/about/chairperson/", description: "A word from our leadership", icon: "message" },
      { label: "Our journey", href: "/about/journey/", description: "Milestones, 1978 to today", icon: "history" },
      { label: "Global presence", href: "/about/global-presence/", description: "40 countries, four regions", icon: "globe" },
    ],
  },
  {
    label: "Products",
    href: "/products/",
    items: [
      ...CATEGORIES.map((c) => ({
        label: c.shortName,
        href: `/products/${c.slug}/`,
        description: `${productsIn(c.slug).length} products`,
        icon: "flask" as IconName,
      })),
      { label: "Search all products", href: "/products/", description: "By name or CAS number", icon: "search" },
    ],
    footer: { label: "Download Product List 2026 (PDF)", href: SITE.productListPdf, external: true },
  },
  {
    label: "Capabilities",
    href: "/capabilities/",
    items: [
      { label: "Manufacturing", href: "/capabilities/manufacturing/", description: "Three integrated units", icon: "factory" },
      { label: "Specialisation", href: "/capabilities/", description: "Reaction chemistries & R&D", icon: "flask" },
      { label: "Quality systems", href: "/quality/", description: "QC, QA and commitment", icon: "shield" },
      { label: "Regulatory affairs", href: "/quality/regulatory-affairs/", description: "DMFs, CEPs and approvals", icon: "file" },
    ],
  },
  { label: "Sustainability", href: "/sustainability/" },
  { label: "Careers", href: "/careers/" },
];

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About Synthokem", href: "/about/" },
      { label: "Chairperson’s message", href: "/about/chairperson/" },
      { label: "Our journey", href: "/about/journey/" },
      { label: "Global presence", href: "/about/global-presence/" },
      { label: "Sustainability", href: "/sustainability/" },
    ],
  },
  {
    heading: "What we do",
    links: [
      { label: "All products", href: "/products/" },
      { label: "APIs", href: "/products/apis/" },
      { label: "Intermediates", href: "/products/intermediates/" },
      { label: "Manufacturing", href: "/capabilities/manufacturing/" },
      { label: "Quality & regulatory", href: "/quality/" },
    ],
  },
  {
    heading: "Work with us",
    links: [
      { label: "Contact", href: "/contact/" },
      { label: "Request a quote", href: "/enquiry/" },
      { label: "Careers", href: "/careers/" },
      { label: "Resources", href: "/insights/" },
      { label: "Site map", href: "/sitemap/" },
    ],
  },
];

export const LEGAL_NAV: NavLink[] = [
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms of use", href: "/terms/" },
  { label: "Cookies", href: "/cookies/" },
  { label: "Disclaimer", href: "/disclaimer/" },
];
