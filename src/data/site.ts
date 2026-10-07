/**
 * Company facts. Every value here is taken from the existing synthokemlabs.com
 * website or the company's "Product List 2026" PDF. Do not add claims that the
 * company has not approved.
 */
export const SITE = {
  name: "Synthokem Labs",
  legalName: "Synthokem Labs Private Limited",
  url: "https://www.synthokemlabs.com",
  foundingYear: 1978,
  tagline: "Performance and perfection, driven by chemistry.",
  description:
    "Synthokem Labs is a manufacturer of Active Pharmaceutical Ingredients (APIs) and drug intermediates headquartered in Hyderabad, India, operating since 1978.",
  email: "info@synthokemlabs.com",
  phone: { display: "+91 8455 224180", href: "tel:+918455224180" },
  hours: "Monday to Saturday, 9:00 am – 5:30 pm",
  responseTime: "Our team will contact you within 3 business days.",
  people: "300+",
  facilitiesCount: 3,
  productListPdf: "/documents/synthokem-product-list-2026.pdf",
  productListLabel: "Product List 2026 (PDF, 210 KB)",
} as const;

export type Location = {
  id: string;
  name: string;
  role: string;
  lines: string[];
  phone?: { display: string; href: string };
  directions: string;
  mapEmbed?: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "corporate-office",
    name: "Corporate Office & Unit II",
    role: "Registered office and manufacturing",
    lines: [
      "Plot No. 222–224 & 235–237, Phase-II",
      "IDA Pashamylaram, Patancheru (Mandal)",
      "Sangareddy District – 502319",
      "Telangana, India",
    ],
    phone: { display: "+91 8455 224180", href: "tel:+918455224180" },
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Synthokem+Labs+Private+Limited+Pashamylaram+Telangana",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15217.600860485594!2d78.1786118!3d17.5361222!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbf1bd660d33bd%3A0x22a0b23428cbbee5!2sSynthokem%20Labs%20Private%20Limited!5e0!3m2!1sen!2sin!4v1694750721476!5m2!1sen!2sin",
  },
  {
    id: "unit-iii",
    name: "Unit III",
    role: "Manufacturing",
    lines: ["Plot No. 75, JN Pharmacity, Thanam", "Parawada, Anakapalli – 531019", "Andhra Pradesh, India"],
    phone: { display: "+91 8924 236555", href: "tel:+918924236555" },
    directions: "https://www.google.com/maps/dir/?api=1&destination=JN+Pharmacity+Parawada+Andhra+Pradesh",
  },
];
