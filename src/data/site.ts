import { asset } from "@/lib/asset";

/**
 * Company facts. Every value here is taken from the existing synthokemlabs.com
 * website or the company's current "Product List" PDF. Do not add claims that the
 * company has not approved.
 */
export const SITE = {
  name: "Synthokem Labs",
  legalName: "Synthokem Labs Private Limited",
  url: "https://www.synthokemlabs.com",
  foundingYear: 1978,
  tagline: "Performance and perfection, driven by chemistry.",
  /** Company promise from the closing slide of "for website.pptx". */
  promise: "We deliver what we promise.",
  description:
    "Synthokem Labs is a manufacturer of Active Pharmaceutical Ingredients (APIs) and drug intermediates headquartered in Hyderabad, India, operating since 1978.",
  email: "info@synthokemlabs.com",
  /** Career applications and the careers page go here; everything else uses `email`. */
  careersEmail: "hr@synthokemlabs.com",
  phone: { display: "+91 8455 224180", href: "tel:+918455224180" },
  hours: "Monday to Saturday, 9:00 am – 5:30 pm",
  responseTime: "Our team will contact you within 3 business days.",
  people: "300+",
  /** Manufacturing units listed on the current Product List cover (Unit II, Unit III). */
  facilitiesCount: 2,
  productListPdf: asset("/documents/synthokem-product-list.pdf"),
  productListName: "Synthokem Product List",
  productListSize: "250 KB",
  productListLabel: "Synthokem Product List (PDF, 250 KB)",
  /** The QR printed on the Product List cover, extracted unchanged from the PDF. Its destination is managed by the company on qrfy.io. */
  productListQr: asset("/images/product-list-qr.png"),
  productListQrLink: "https://qrfy.io/9E6LCQkppJ",
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
    name: "Corporate Office, R&D Unit & Unit II",
    role: "Corporate office, R&D and manufacturing",
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
