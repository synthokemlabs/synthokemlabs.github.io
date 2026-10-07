import { PRODUCTS, CATEGORIES, productHref, type Product } from "@/data/products";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/β/g, "beta").replace(/[^a-z0-9]+/g, " ").trim();

function haystack(p: Product) {
  const cat = CATEGORIES.find((c) => c.slug === p.category)!;
  return norm(
    [p.name, ...(p.synonyms ?? []), p.cas ?? "", (p.cas ?? "").replace(/-/g, ""), p.therapeuticCategory ?? "", ...(p.usedIn ?? []), ...(p.applications ?? []), cat.name, cat.shortName, p.use ?? "", ...(p.grades ?? [])].join(" "),
  );
}
const INDEX = new Map(PRODUCTS.map((p) => [p.slug + p.category, haystack(p)]));

/** Fast client-side ranking: exact CAS > name prefix > name contains > all tokens anywhere. */
export function scoreProduct(p: Product, query: string): number {
  const q = norm(query);
  if (!q) return 1;
  const name = norm(p.name);
  const hay = INDEX.get(p.slug + p.category)!;
  const raw = query.trim().replace(/[\[\]\s]/g, "");
  if (p.cas && (p.cas === raw || p.cas.replace(/-/g, "") === raw.replace(/-/g, ""))) return 100;
  if (name.startsWith(q)) return 80;
  if ((p.synonyms ?? []).some((s) => norm(s).startsWith(q))) return 70;
  if (name.includes(q)) return 60;
  const tokens = q.split(" ");
  if (tokens.every((t) => hay.includes(t))) return 30 + (tokens.some((t) => name.includes(t)) ? 10 : 0);
  return 0;
}

export function searchProducts(query: string, list: Product[] = PRODUCTS): Product[] {
  if (!query.trim()) return list;
  return list
    .map((p) => [p, scoreProduct(p, query)] as const)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || a[0].name.localeCompare(b[0].name))
    .map(([p]) => p);
}

export interface PageEntry { title: string; href: string; section: string; keywords: string }
export const PAGES: PageEntry[] = [
  { title: "About Synthokem", href: "/about/", section: "Company", keywords: "company overview history people 1978 hyderabad" },
  { title: "Philosophy, vision & mission", href: "/about/#philosophy", section: "Company", keywords: "quality manufacturing integrity values vision mission" },
  { title: "Chairperson's message", href: "/about/chairperson/", section: "Company", keywords: "leadership chairperson jayant tagore madireddy" },
  { title: "Our journey", href: "/about/journey/", section: "Company", keywords: "timeline milestones history usfda dmf cep" },
  { title: "Global presence", href: "/about/global-presence/", section: "Company", keywords: "countries markets export world map" },
  { title: "All products", href: "/products/", section: "Products", keywords: "catalogue search api intermediates" },
  ...CATEGORIES.map((c) => ({ title: c.name, href: `/products/${c.slug}/`, section: "Products", keywords: `${c.shortName} ${c.summary}` })),
  { title: "Capabilities & specialisation", href: "/capabilities/", section: "Capabilities", keywords: "reaction chemistry hydrogenation halogenation process development r&d" },
  { title: "Manufacturing", href: "/capabilities/manufacturing/", section: "Capabilities", keywords: "facilities units plant reactor equipment" },
  { title: "Quality systems", href: "/quality/", section: "Quality", keywords: "quality control assurance analytical laboratory gmp" },
  { title: "Regulatory affairs", href: "/quality/regulatory-affairs/", section: "Quality", keywords: "usfda cep who-gmp dmf certificates approvals iso" },
  { title: "Sustainability", href: "/sustainability/", section: "Responsibility", keywords: "csr environment solar wastewater recycling community education" },
  { title: "Careers", href: "/careers/", section: "Work with us", keywords: "jobs vacancies resume apply work" },
  { title: "Contact", href: "/contact/", section: "Work with us", keywords: "address phone email location map sales support" },
  { title: "Product enquiry / request a quote", href: "/enquiry/", section: "Work with us", keywords: "rfq quote quotation sample price enquiry" },
  { title: "Insights & resources", href: "/insights/", section: "Resources", keywords: "news updates downloads product list pdf" },
];

export function searchPages(query: string): PageEntry[] {
  const q = norm(query);
  if (!q) return [];
  const tokens = q.split(" ");
  return PAGES.filter((p) => {
    const hay = norm(`${p.title} ${p.section} ${p.keywords}`);
    return tokens.every((t) => hay.includes(t));
  });
}

export { productHref };
