/**
 * Product catalogue.
 *
 * Source of truth: Synthokem "Product List 2026" PDF (public/documents) and the
 * product table on the previous synthokemlabs.com/our_products.html page.
 * To add a product, append an entry below — every listing, filter, search,
 * category page, detail page, sitemap entry and enquiry dropdown updates
 * automatically. Leave a field out rather than guessing a value.
 */

export type CategorySlug = "apis" | "intermediates" | "fine-chemicals" | "excipients" | "metal-scavengers";
export type ProductStatus = "commercial" | "under-development";
export type ProductSource = "product-list-2026" | "website-product-table";

export interface Product {
  slug: string;
  name: string;
  synonyms?: string[];
  category: CategorySlug;
  /** Only for APIs */
  use?: "human" | "veterinary";
  status?: ProductStatus;
  cas?: string;
  grades?: string[];
  therapeuticCategory?: string;
  /** For intermediates: the API(s) / applications the company lists */
  usedIn?: string[];
  applications?: string[];
  regulatoryStatus?: string[];
  structureImage?: string;
  source: ProductSource;
  /** Internal content-review note. Never rendered publicly. */
  reviewNote?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  singular: string;
  summary: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "apis",
    name: "Active Pharmaceutical Ingredients",
    shortName: "APIs",
    singular: "API",
    summary: "A focused API portfolio that includes generics and complex APIs, for human and veterinary use.",
    intro:
      "Synthokem Labs has over three decades of experience in developing APIs across diverse therapeutic areas. Over the decades we have become trusted partners for many leading generic and innovator companies within India and internationally. Our team ensures that all APIs and processes developed for various markets comply with applicable regulatory requirements.",
    seoTitle: "API Manufacturer in India — Active Pharmaceutical Ingredients",
    seoDescription:
      "Active Pharmaceutical Ingredients manufactured by Synthokem Labs, Hyderabad — including Guaifenesin, Methocarbamol, Mebeverine HCl, Prazosin HCl and more, with pharmacopoeial grades and regulatory status.",
  },
  {
    slug: "intermediates",
    name: "Pharmaceutical Intermediates",
    shortName: "Intermediates",
    singular: "Intermediate",
    summary: "Affordable pharmaceutical intermediates of global quality standards, for new and off-patent APIs.",
    intro:
      "Offering a range of intermediates to the pharmaceutical market, Synthokem Labs has created a name for itself through unwavering quality and consistency of products. Our inherent strength lies in producing cutting-edge intermediates for new as well as off-patent APIs within the requisite time frame stipulated by our customers.",
    seoTitle: "Pharmaceutical Intermediates Manufacturer — API Intermediates",
    seoDescription:
      "Pharmaceutical and API intermediates from Synthokem Labs, including Tetrahydro-2-furoic acid, Veratrol, Guethol and Ranolazine intermediates, with CAS numbers and API applications.",
  },
  {
    slug: "fine-chemicals",
    name: "Fine Chemicals",
    shortName: "Fine Chemicals",
    singular: "Fine Chemical",
    summary: "Commercial fine chemicals including isophthalic acid derivatives.",
    intro:
      "Synthokem's commercial fine chemicals portfolio includes 5-hydrazinoisophthalic and 5-aminoisophthalic acid derivatives, manufactured under the same quality systems as our APIs and intermediates.",
    seoTitle: "Fine Chemicals — Isophthalic Acid Derivatives",
    seoDescription:
      "Fine chemicals from Synthokem Labs: 5-Hydrazinoisophthalic acid, 5-HIP-HCl, 5-Aminoisophthalic acid and its hydrate, with CAS numbers.",
  },
  {
    slug: "excipients",
    name: "Excipients",
    shortName: "Excipients",
    singular: "Excipient",
    summary: "High-purity and injectable-grade excipients, currently under development.",
    intro:
      "Synthokem is developing a range of excipients, including injectable-grade, high-purity and low-endotoxin materials such as cyclodextrins, trehalose and D-galactose. All listed excipients are currently under development.",
    seoTitle: "Pharmaceutical Excipients — Injectable Grade (Under Development)",
    seoDescription:
      "Excipients under development at Synthokem Labs: Trehalose Dihydrate, SBE-β-cyclodextrin sodium, HPBCD, Sodium Stearyl Fumarate and D-Galactose.",
  },
  {
    slug: "metal-scavengers",
    name: "Metal Scavengers",
    shortName: "Metal Scavengers",
    singular: "Metal Scavenger",
    summary: "Functionalised silica metal scavengers, currently under development.",
    intro:
      "Synthokem is developing functionalised silica metal scavengers — thiol, TMT, DMT, thiourea and amine variants. All listed metal scavengers are currently under development.",
    seoTitle: "Silica Metal Scavengers (Under Development)",
    seoDescription:
      "Silica-based metal scavengers under development at Synthokem Labs: Silica Thiol, Silica TMT, Silica DMT, Silica Thiourea and Silica Amine.",
  },
];

const ISO_SET = ["TDS", "GMP", "ISO-QMS", "ISO-OHSAS", "ISO-EMS"];
const s = (slug: string) => `/structures/${slug}.webp`;

export const PRODUCTS: Product[] = [
  // ---- APIs for human use — commercial (Product List 2026, p.1–2) ----
  {
    slug: "guaifenesin", name: "Guaifenesin", category: "apis", use: "human", status: "commercial",
    cas: "93-14-1", grades: ["USP", "BP", "Ph. Eur.", "IP", "JP", "KP"], therapeuticCategory: "Expectorant",
    regulatoryStatus: ["USDMF", "CEP", "Health Canada", "China", "South Korea", "Russia", "EUWC", "WHO-GMP"],
    structureImage: s("guaifenesin"), source: "product-list-2026",
  },
  {
    slug: "potassium-guaiacol-sulphonate", name: "Potassium Guaiacol Sulphonate", synonyms: ["Potassium guaiacolsulfonate"],
    category: "apis", use: "human", status: "commercial", cas: "78247-49-1", grades: ["USP"],
    therapeuticCategory: "Expectorant", regulatoryStatus: ["DMF", "EUWC", "WHO-GMP"],
    structureImage: s("potassium-guaiacol-sulphonate"), source: "product-list-2026",
  },
  {
    slug: "methocarbamol", name: "Methocarbamol", category: "apis", use: "human", status: "commercial",
    cas: "532-03-6", grades: ["USP", "IP", "IH"], therapeuticCategory: "Skeletal muscle relaxant",
    regulatoryStatus: ["USDMF", "EU", "UK", "South Africa", "Switzerland", "Health Canada", "China", "South Korea", "EUWC", "WHO-GMP"],
    structureImage: s("methocarbamol"), source: "product-list-2026",
  },
  {
    slug: "mephenesin", name: "Mephenesin", category: "apis", use: "human", status: "commercial",
    cas: "59-47-2", grades: ["BPC-1973", "IP-1985", "IH"], therapeuticCategory: "Skeletal muscle relaxant",
    regulatoryStatus: ["EU", "South Africa", "EUWC", "WHO-GMP"], structureImage: s("mephenesin"), source: "product-list-2026",
  },
  {
    slug: "chlorphenesin-carbamate", name: "Chlorphenesin Carbamate", category: "apis", use: "human", status: "commercial",
    cas: "886-74-8", grades: ["JP"], therapeuticCategory: "Skeletal muscle relaxant",
    regulatoryStatus: ["South Korea", "Japan", "Vietnam", "WHO-GMP"], structureImage: s("chlorphenesin-carbamate"), source: "product-list-2026",
  },
  {
    slug: "mebeverine-hydrochloride", name: "Mebeverine Hydrochloride", synonyms: ["Mebeverine HCl"], category: "apis", use: "human",
    status: "commercial", cas: "2753-45-9", grades: ["BP", "Ph. Eur.", "IP"], therapeuticCategory: "Anti-spasmodic",
    regulatoryStatus: ["CEP", "TDMF", "EUWC", "WHO-GMP"], structureImage: s("mebeverine-hydrochloride"), source: "product-list-2026",
  },
  {
    slug: "drotaverine-hydrochloride", name: "Drotaverine Hydrochloride", synonyms: ["Drotaverine HCl"], category: "apis", use: "human",
    status: "commercial", cas: "985-12-6", grades: ["IH", "IP"], therapeuticCategory: "Anti-spasmodic",
    regulatoryStatus: ["Russia", "EUWC", "WHO-GMP"], structureImage: s("drotaverine-hydrochloride"), source: "product-list-2026",
  },
  {
    slug: "prazosin-hydrochloride", name: "Prazosin Hydrochloride", synonyms: ["Prazosin HCl"], category: "apis", use: "human",
    status: "commercial", cas: "19237-84-4", grades: ["USP", "Ph. Eur.", "BP", "IP"], therapeuticCategory: "Anti-hypertensive",
    regulatoryStatus: ["USDMF", "WHO-GMP", "EUWC"], structureImage: s("prazosin-hydrochloride"), source: "product-list-2026",
  },
  {
    slug: "terazosin-hydrochloride", name: "Terazosin Hydrochloride", synonyms: ["Terazosin HCl"], category: "apis", use: "human",
    status: "commercial", cas: "63590-64-7", grades: ["USP", "IP"], therapeuticCategory: "Anti-hypertensive",
    regulatoryStatus: ["DMF", "GMP"], structureImage: s("terazosin-hydrochloride"), source: "product-list-2026",
  },
  {
    slug: "ranolazine", name: "Ranolazine", category: "apis", use: "human", status: "commercial",
    cas: "95635-55-5", grades: ["IH"], therapeuticCategory: "Anti-anginal",
    regulatoryStatus: ["EUDMF", "EUWC", "WHO-GMP"], source: "product-list-2026",
  },
  {
    slug: "benfotiamine", name: "Benfotiamine", category: "apis", use: "human", status: "commercial",
    cas: "22457-89-2", grades: ["IH"], therapeuticCategory: "Diabetic neuropathy",
    regulatoryStatus: ["DMF", "GMP"], source: "product-list-2026",
  },
  {
    slug: "chlorphenesin", name: "Chlorphenesin", category: "apis", use: "human", status: "commercial",
    cas: "104-29-0", grades: ["BP-1973", "IP-1985", "IH"], therapeuticCategory: "Anti-fungal",
    regulatoryStatus: ["EU REACH"], structureImage: s("chlorphenesin"), source: "product-list-2026",
  },
  // ---- APIs for human use — under development (p.7) ----
  {
    slug: "calcium-polycarbophil", name: "Calcium Polycarbophil", category: "apis", use: "human", status: "under-development",
    cas: "9003-97-8", grades: ["USP"], therapeuticCategory: "Laxative",
    applications: ["Constipation management"], regulatoryStatus: ISO_SET, structureImage: s("calcium-polycarbophil"), source: "product-list-2026",
  },
  {
    slug: "bisbentiamine", name: "Bisbentiamine", synonyms: ["Bisbentamin"], category: "apis", use: "human", status: "under-development",
    cas: "2667-89-2", grades: ["KP", "IH"], therapeuticCategory: "Vitamins & nutritional supplements",
    regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "fursultiamine", name: "Fursultiamine", category: "apis", use: "human", status: "under-development",
    cas: "804-30-8", grades: ["JP"], therapeuticCategory: "Vitamins & nutritional supplements",
    regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "timolol-maleate", name: "Timolol Maleate", category: "apis", use: "human", status: "under-development",
    grades: ["USP", "EP", "JP", "KP"], therapeuticCategory: "Ophthalmic", regulatoryStatus: ISO_SET, source: "product-list-2026",
    reviewNote:
      "Product List 2026 gives CAS [68890-66-4], which belongs to a different substance (Timolol maleate is commonly 26921-17-5). CAS withheld until the company confirms.",
  },
  // ---- APIs for veterinary use — under development (p.6) ----
  {
    slug: "firocoxib", name: "Firocoxib", category: "apis", use: "veterinary", status: "under-development",
    cas: "189954-96-9", grades: ["IH"], therapeuticCategory: "NSAID", regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "carprofen", name: "Carprofen", category: "apis", use: "veterinary", status: "under-development",
    cas: "53716-49-7", grades: ["USP", "EP"], therapeuticCategory: "NSAID", regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "ketoprofen", name: "Ketoprofen", category: "apis", use: "veterinary", status: "under-development",
    cas: "22071-15-4", grades: ["USP", "BP", "EP", "JP", "KP"], therapeuticCategory: "NSAID", regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "imidocarb-dipropionate", name: "Imidocarb Dipropionate", category: "apis", use: "veterinary", status: "under-development",
    cas: "55750-06-6", grades: ["IH"], therapeuticCategory: "Antiprotozoal", regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "maropitant-citrate", name: "Maropitant Citrate", category: "apis", use: "veterinary", status: "under-development",
    cas: "147116-67-4", grades: ["IH"], therapeuticCategory: "NK-1 receptor antagonist", regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "robenacoxib", name: "Robenacoxib", category: "apis", use: "veterinary", status: "under-development",
    cas: "220991-32-2", grades: ["IH"], therapeuticCategory: "NSAID", regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  // ---- Listed on previous website product table only ----
  {
    slug: "calcium-glycerophosphate", name: "Calcium Glycerophosphate", category: "apis", use: "human",
    cas: "27214-00-2", grades: ["USP", "EP", "BP"], therapeuticCategory: "Dietary supplements (minerals & electrolytes)",
    structureImage: s("calcium-glycerophosphate"), source: "website-product-table",
    reviewNote: "Listed on the previous website but not in Product List 2026 — confirm availability.",
  },

  // ---- Intermediates for human API — commercial (p.3) ----
  {
    slug: "epoxirane-oxirane", name: "Epoxirane (Oxirane)", category: "intermediates", status: "commercial",
    cas: "75-21-8", usedIn: ["Ranolazine"], regulatoryStatus: ISO_SET, source: "product-list-2026",
    reviewNote: "CAS 75-21-8 is ethylene oxide; confirm the intended Ranolazine epoxide intermediate and CAS.",
  },
  {
    slug: "tetrahydro-2-furoic-acid", name: "Tetrahydro-2-furoic acid", category: "intermediates", status: "commercial",
    cas: "16874-33-2", usedIn: ["Terazosin HCl", "Alfuzosin HCl", "Faropenem", "Baloxavir Marboxil"],
    applications: ["Agro and other fine chemicals"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "tetrahydro-methyl-2-furoate", name: "Tetrahydro methyl 2-furoate", synonyms: ["Methyl tetrahydro-2-furoate", "Tetrahydro-2-methylfuroate"],
    category: "intermediates", status: "commercial", cas: "37443-42-8", usedIn: ["Terazosin HCl", "Alfuzosin HCl"],
    applications: ["Advanced intermediates for agro", "Fragrances"], regulatoryStatus: ISO_SET,
    structureImage: s("tetrahydro-methyl-2-furoate"), source: "product-list-2026",
  },
  {
    slug: "veratrol", name: "Veratrol", synonyms: ["Veratrole", "1,2-Dimethoxybenzene"], category: "intermediates", status: "commercial",
    cas: "91-16-7", usedIn: ["Verapamil"], applications: ["Perfumery"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "pivaloyl-acetonitrile", name: "Pivaloyl Acetonitrile", synonyms: ["Pivolyl Acetonitrile", "Pivaloylacetonitrile"],
    category: "intermediates", status: "commercial", cas: "59997-51-2",
    applications: ["Ingredient for pharmaceuticals", "Agrochemicals"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "2-ethoxymethylene-malononitrile", name: "2-(Ethoxymethylene)malononitrile", category: "intermediates", status: "commercial",
    cas: "123-06-8", usedIn: ["Milrinone", "Milnacipran"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "n-2-6-dimethylphenyl-1-piperazine-acetamide", name: "N-(2,6-Dimethylphenyl)-1-piperazine acetamide",
    category: "intermediates", status: "commercial", cas: "5294-61-1", usedIn: ["Ranolazine"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "guethol", name: "Guethol", synonyms: ["2-Ethoxyphenol"], category: "intermediates", status: "commercial",
    cas: "94-71-3", applications: ["Aroma chemicals", "Flavours", "APIs"], regulatoryStatus: ISO_SET,
    structureImage: s("guethol"), source: "product-list-2026",
  },
  {
    slug: "tetrahydro-1-2-furoyl-piperazine", name: "Tetrahydro-1-(2-furoyl) piperazine", category: "intermediates",
    structureImage: s("tetrahydro-1-2-furoyl-piperazine"), source: "website-product-table",
    reviewNote: "Listed on the previous website but not in Product List 2026 — confirm availability and CAS.",
  },

  // ---- Fine chemicals — commercial (p.4) ----
  {
    slug: "5-hydrazinoisophthalic-acid", name: "5-Hydrazinoisophthalic acid", category: "fine-chemicals", status: "commercial",
    cas: "121385-69-1", applications: ["Fine chemical"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "5-hydrazinoisophthalic-acid-hcl", name: "5-Hydrazinoisophthalic acid HCl", synonyms: ["5-HIP-HCl"], category: "fine-chemicals",
    status: "commercial", cas: "873773-66-1", applications: ["Fine chemical"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "5-aminoisophthalic-acid", name: "5-Aminoisophthalic acid", category: "fine-chemicals", status: "commercial",
    cas: "99-31-0", applications: ["Fine chemical"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "5-aminoisophthalic-acid-hydrate", name: "5-Aminoisophthalic acid hydrate", category: "fine-chemicals", status: "commercial",
    cas: "1889779-77-4", applications: ["Fine chemical"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },

  // ---- Excipients — under development (p.8) ----
  {
    slug: "trehalose-dihydrate", name: "Trehalose Dihydrate", category: "excipients", status: "under-development",
    cas: "6138-23-4", grades: ["NF", "EP", "BP"], applications: ["Injectable, high purity, low endotoxin excipient"],
    regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "sulfobutylether-beta-cyclodextrin-sodium", name: "Sulfobutylether β-cyclodextrin sodium", synonyms: ["SBE-β-CD", "SBECD"],
    category: "excipients", status: "under-development", cas: "182410-00-0",
    applications: ["Injectable grade, pyrogen-free excipient"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "sodium-stearyl-fumarate", name: "Sodium Stearyl Fumarate", category: "excipients", status: "under-development",
    cas: "4070-80-8", grades: ["USP", "EP"], applications: ["Excipient / lubricant"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "d-galactose", name: "D-Galactose", category: "excipients", status: "under-development",
    cas: "59-23-4", grades: ["NF", "EP"], applications: ["Injectable, high purity, low endotoxin excipient"],
    regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "hydroxypropyl-beta-cyclodextrin", name: "Hydroxypropyl β-cyclodextrin", synonyms: ["HPBCD", "HP-β-CD"],
    category: "excipients", status: "under-development", cas: "128446-35-5", grades: ["USP-NF", "EP"],
    applications: ["Injectable grade, pyrogen-free excipient"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },

  // ---- Metal scavengers — under development (p.5) ----
  {
    slug: "silica-thiol", name: "Silica Thiol", category: "metal-scavengers", status: "under-development",
    cas: "1189056-65-2", applications: ["Metal scavenger"], regulatoryStatus: ISO_SET, structureImage: s("silica-thiol"), source: "product-list-2026",
  },
  {
    slug: "silica-tmt", name: "Silica TMT", category: "metal-scavengers", status: "under-development",
    cas: "1226494-16-1", applications: ["Metal scavenger"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "silica-dmt", name: "Silica DMT", category: "metal-scavengers", status: "under-development",
    cas: "2222422-83-3", applications: ["Metal scavenger"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "silica-thiourea", name: "Silica Thiourea", category: "metal-scavengers", status: "under-development",
    applications: ["Metal scavenger"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
  {
    slug: "silica-amine", name: "Silica Amine", category: "metal-scavengers", status: "under-development",
    cas: "126850-14-4", applications: ["Metal scavenger"], regulatoryStatus: ISO_SET, source: "product-list-2026",
  },
];

/* ---------------------------- helpers ---------------------------- */

export const STATUS_LABEL: Record<ProductStatus, string> = {
  commercial: "Commercial",
  "under-development": "Under development",
};

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getProduct = (category: string, slug: string) =>
  PRODUCTS.find((p) => p.category === category && p.slug === slug);
export const productsIn = (category: CategorySlug) => PRODUCTS.filter((p) => p.category === category);
export const productHref = (p: Pick<Product, "category" | "slug">) => `/products/${p.category}/${p.slug}/`;

export function productDescription(p: Product): string {
  const cat = getCategory(p.category)!;
  const parts = [`${p.name}${p.cas ? ` (CAS ${p.cas})` : ""} — ${cat.singular.toLowerCase()}${p.use === "veterinary" ? " for veterinary use" : ""} manufactured by Synthokem Labs, Hyderabad, India.`];
  if (p.therapeuticCategory) parts.push(`Therapeutic category: ${p.therapeuticCategory}.`);
  if (p.usedIn?.length) parts.push(`Used in: ${p.usedIn.join(", ")}.`);
  if (p.grades?.length) parts.push(`Grades: ${p.grades.join(", ")}.`);
  return parts.join(" ");
}

export function relatedProducts(p: Product, limit = 4): Product[] {
  const score = (o: Product) =>
    (o.therapeuticCategory && o.therapeuticCategory === p.therapeuticCategory ? 3 : 0) +
    (o.usedIn && p.usedIn && o.usedIn.some((u) => p.usedIn!.includes(u)) ? 2 : 0) +
    (o.status === p.status ? 1 : 0);
  return PRODUCTS.filter((o) => o.category === p.category && o.slug !== p.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

/** Glossary for widely understood regulatory abbreviations. Unknown terms are shown as-is. */
export const REGULATORY_GLOSSARY: Record<string, string> = {
  USDMF: "US Drug Master File filed with the USFDA",
  DMF: "Drug Master File",
  EUDMF: "European Drug Master File",
  CEP: "Certificate of Suitability to the Ph. Eur., issued by EDQM",
  EUWC: "EU Written Confirmation for APIs imported into the EU",
  "WHO-GMP": "World Health Organization Good Manufacturing Practice",
  GMP: "Good Manufacturing Practice",
  "ISO-QMS": "ISO 9001 Quality Management System",
  "ISO-EMS": "ISO 14001 Environmental Management System",
  "ISO-OHSAS": "OHSAS 18001 Occupational Health & Safety",
  "EU REACH": "EU Registration, Evaluation, Authorisation and Restriction of Chemicals",
};

export const GRADE_GLOSSARY: Record<string, string> = {
  USP: "United States Pharmacopeia",
  BP: "British Pharmacopoeia",
  "Ph. Eur.": "European Pharmacopoeia",
  EP: "European Pharmacopoeia",
  IP: "Indian Pharmacopoeia",
  JP: "Japanese Pharmacopoeia",
  KP: "Korean Pharmacopoeia",
  NF: "National Formulary (USP–NF)",
  "USP-NF": "United States Pharmacopeia – National Formulary",
  IH: "In-house specification",
  BPC: "British Pharmaceutical Codex",
};

/* ---------------------------- structures ---------------------------- */
import { STRUCTURE_INDEX } from "./structure-index";

/** Best available 2D structure: rendered SVG (PubChem-matched by CAS) → company drawing → none. */
export function structureSrc(p: Pick<Product, "slug" | "structureImage">): string | undefined {
  return STRUCTURE_INDEX[p.slug] ? `/structures/svg/${p.slug}.svg` : p.structureImage;
}
/** Molecular formula / weight (only for records matched to the company's CAS number). */
export function structureMeta(slug: string) {
  return STRUCTURE_INDEX[slug] ?? {};
}
