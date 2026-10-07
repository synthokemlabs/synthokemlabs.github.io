import { CATEGORIES, PRODUCTS, productHref } from "@/data/products";

/** Every public route, used by sitemap.xml and the HTML sitemap. */
export const STATIC_ROUTES: { path: string; title: string; group: string; priority: number }[] = [
  { path: "/", title: "Home", group: "Company", priority: 1 },
  { path: "/about/", title: "About Synthokem", group: "Company", priority: 0.8 },
  { path: "/about/chairperson/", title: "Chairperson's message", group: "Company", priority: 0.5 },
  { path: "/about/journey/", title: "Our journey", group: "Company", priority: 0.6 },
  { path: "/about/global-presence/", title: "Global presence", group: "Company", priority: 0.6 },
  { path: "/products/", title: "Product catalogue", group: "Products", priority: 0.9 },
  ...CATEGORIES.map((c) => ({ path: `/products/${c.slug}/`, title: c.name, group: "Products", priority: 0.8 })),
  { path: "/capabilities/", title: "Capabilities", group: "Capabilities", priority: 0.7 },
  { path: "/capabilities/manufacturing/", title: "Manufacturing", group: "Capabilities", priority: 0.7 },
  { path: "/quality/", title: "Quality systems", group: "Quality", priority: 0.7 },
  { path: "/quality/regulatory-affairs/", title: "Regulatory affairs", group: "Quality", priority: 0.7 },
  { path: "/sustainability/", title: "Sustainability", group: "Responsibility", priority: 0.5 },
  { path: "/careers/", title: "Careers", group: "Work with us", priority: 0.6 },
  { path: "/contact/", title: "Contact", group: "Work with us", priority: 0.7 },
  { path: "/enquiry/", title: "Product enquiry", group: "Work with us", priority: 0.7 },
  { path: "/insights/", title: "Insights & resources", group: "Resources", priority: 0.4 },
  { path: "/sitemap/", title: "Sitemap", group: "Resources", priority: 0.2 },
];

export const PRODUCT_ROUTES = PRODUCTS.map((p) => ({ path: productHref(p), title: p.name, group: "Product detail", priority: 0.6 }));
