/**
 * Corporate content: journey, facilities, approvals, global presence,
 * specialisations and editorial copy. All entries are taken from the previous
 * synthokemlabs.com pages (About, Our Assurance, Social Responsibility, Contact).
 */

/* ------------------------------ Journey ------------------------------ */
export type MilestoneType = "company" | "facility" | "filing" | "certification" | "inspection";
export interface Milestone {
  year: number;
  title: string;
  detail: string;
  type: MilestoneType;
  unit?: "Unit I" | "Unit II";
}

export const MILESTONE_LABEL: Record<MilestoneType, string> = {
  company: "Company",
  facility: "Facilities",
  filing: "Regulatory filings",
  certification: "Certifications",
  inspection: "Inspections & approvals",
};

export const JOURNEY: Milestone[] = [
  { year: 1978, type: "company", title: "Incorporated", detail: "Synthokem Labs is incorporated for the manufacture of APIs — beginning as a single unit with 10 employees." },
  { year: 1979, type: "company", title: "First full year of operations", detail: "Sales of Rs. 1.5 million in the first full year of operations (1978–79)." },
  { year: 1993, type: "filing", title: "First USFDA filings", detail: "Successfully filed DMFs for Methocarbamol and Guaifenesin with the USFDA." },
  { year: 2000, type: "certification", title: "ISO 9001 QMS", detail: "Certified for ISO-9001:2000 QMS by DNV GL, continuing to date with successful renewals." },
  { year: 2001, type: "certification", title: "CEP for Guaifenesin", detail: "Obtained the Certificate of Suitability (CoS) for Guaifenesin (Ph. Eur.) from the European Directorate for the Quality of Medicines." },
  { year: 2002, type: "certification", title: "WHO-GMP certificate", detail: "Achieved the WHO-GMP certificate, continuing to date with successful renewals." },
  { year: 2004, type: "facility", title: "Second manufacturing site", detail: "Synthokem acquires a second manufacturing site at Pashamylaram, Hyderabad." },
  { year: 2005, type: "inspection", unit: "Unit I", title: "USFDA facility approval", detail: "Unit I inspected and approved by the USFDA, continuing successfully with regular inspections and approvals." },
  { year: 2008, type: "filing", title: "Health Canada filing", detail: "Successfully filed the Methocarbamol DMF with Health Canada." },
  { year: 2009, type: "filing", title: "Germany and UK filings", detail: "Successfully filed the Methocarbamol DMF with BfArM (Germany) and MHRA (UK)." },
  { year: 2010, type: "filing", title: "France filing", detail: "Successfully filed the Methocarbamol DMF with AFSSAPS (France)." },
  { year: 2010, type: "certification", unit: "Unit I", title: "Kosher certification", detail: "Achieved Kosher certification for Guaifenesin from Unit I, continuing with renewals." },
  { year: 2010, type: "facility", unit: "Unit II", title: "Unit II begins operations", detail: "The Pashamylaram site, Unit II, comes into operation." },
  { year: 2011, type: "filing", unit: "Unit I", title: "Guaifenesin DMF, Health Canada", detail: "Successfully filed the Guaifenesin DMF with Health Canada from Unit I." },
  { year: 2012, type: "inspection", unit: "Unit I", title: "Korean FDA certificate", detail: "Unit I inspected by the Korean FDA, achieving a certificate for Methocarbamol." },
  { year: 2012, type: "certification", title: "GMP certificate", detail: "Achieved the GMP certificate, continuing to date with successful renewals." },
  { year: 2013, type: "certification", unit: "Unit I", title: "EU Written Confirmation", detail: "Unit I achieves EU Written Confirmation for APIs imported into the EU for medicinal products for human use, per Art. 46b(2)(b) of 2001/83/EC — continuing with renewals." },
  { year: 2013, type: "certification", unit: "Unit II", title: "ISO 9001 QMS", detail: "Unit II certified for ISO-9001 QMS by DNV GL, continuing with renewals." },
  { year: 2015, type: "inspection", unit: "Unit I", title: "COFEPRIS inspection", detail: "Unit I inspected by COFEPRIS, the Mexican health authority, for Methocarbamol and Guaifenesin, with subsequent approval in 2016." },
  { year: 2015, type: "certification", unit: "Unit II", title: "ISO 14001 EMS", detail: "Unit II certified for ISO-14001:2004 EMS by DNV GL, continuing with renewals." },
  { year: 2015, type: "certification", unit: "Unit II", title: "OHSAS 18001", detail: "Unit II certified for OHSAS 18001 by DNV GL, continuing with renewals." },
  { year: 2016, type: "certification", unit: "Unit II", title: "WHO-GMP certificate", detail: "Unit II achieves the WHO-GMP certificate, continuing with renewals." },
  { year: 2016, type: "certification", unit: "Unit II", title: "EU Written Confirmation", detail: "Unit II achieves EU Written Confirmation for APIs imported into the EU, continuing with renewals." },
  { year: 2017, type: "filing", unit: "Unit I", title: "Ireland filing", detail: "Successfully filed the Methocarbamol DMF with Ireland from Unit I." },
  { year: 2018, type: "inspection", unit: "Unit II", title: "USFDA inspection", detail: "Unit II successfully completes a USFDA inspection." },
  { year: 2018, type: "filing", unit: "Unit II", title: "USDMF for Guaifenesin USP", detail: "Submitted the USDMF for Guaifenesin USP from Unit II." },
  { year: 2019, type: "certification", unit: "Unit II", title: "CEP for Guaifenesin", detail: "Certificate of Suitability for Guaifenesin (Ph. Eur.) from EDQM for Unit II." },
];

/* ------------------------------ Approvals ------------------------------ */
export interface Approval {
  authority: string;
  short: string;
  scope: string;
  since: string;
}
export const APPROVALS: Approval[] = [
  { short: "USFDA", authority: "US Food & Drug Administration", scope: "Unit I facility approval with regular inspections; Unit II inspection completed in 2018. DMFs filed since 1993.", since: "2005" },
  { short: "CEP", authority: "EDQM — Certificate of Suitability", scope: "Guaifenesin (Ph. Eur.) — Unit I in 2001, Unit II in 2019.", since: "2001" },
  { short: "WHO-GMP", authority: "World Health Organization GMP", scope: "Certified since 2002; Unit II certified in 2016. Renewed to date.", since: "2002" },
  { short: "EU WC", authority: "EU Written Confirmation", scope: "Unit I (2013) and Unit II (2016), per Art. 46b(2)(b) of 2001/83/EC.", since: "2013" },
  { short: "KFDA", authority: "Korean FDA", scope: "Unit I inspected; certificate achieved for Methocarbamol.", since: "2012" },
  { short: "COFEPRIS", authority: "Mexican Health Authority", scope: "Unit I inspected for Methocarbamol and Guaifenesin; approved in 2016.", since: "2016" },
  { short: "ISO 9001", authority: "Quality Management System — DNV GL", scope: "Certified since 2000; Unit II since 2013. Renewed to date.", since: "2000" },
  { short: "ISO 14001", authority: "Environmental Management System — DNV GL", scope: "Unit II, renewed to date.", since: "2015" },
  { short: "OHSAS 18001", authority: "Occupational Health & Safety — DNV GL", scope: "Unit II, renewed to date.", since: "2015" },
  { short: "Kosher", authority: "Kosher certification", scope: "Guaifenesin, Unit I. Renewed to date.", since: "2010" },
];

/* ------------------------------ Facilities ------------------------------ */
export interface Facility {
  id: string;
  name: string;
  location: string;
  summary: string;
  highlights: string[];
}
export const FACILITIES: Facility[] = [
  {
    id: "unit-i",
    name: "Unit I",
    location: "Location details available on request",
    summary: "Synthokem's first manufacturing unit and the home of its longest-standing regulatory record.",
    highlights: ["USFDA facility approval since 2005", "Korean FDA certificate for Methocarbamol (2012)", "EU Written Confirmation (2013)", "COFEPRIS approval (2016)", "Kosher certification for Guaifenesin"],
  },
  {
    id: "unit-ii",
    name: "Unit II",
    location: "IDA Pashamylaram, Sangareddy, Telangana",
    summary: "Acquired in 2004 and in operation since 2010, co-located with the corporate office.",
    highlights: ["USFDA inspection completed (2018)", "WHO-GMP & EU Written Confirmation (2016)", "CEP for Guaifenesin (2019)", "ISO 9001, ISO 14001 and OHSAS 18001 by DNV GL"],
  },
  {
    id: "unit-iii",
    name: "Unit III",
    location: "JN Pharmacity, Parawada, Andhra Pradesh",
    summary: "Synthokem's manufacturing presence in Andhra Pradesh, within JN Pharmacity.",
    highlights: ["Plot No. 75, JN Pharmacity, Thanam", "Parawada, Anakapalli – 531019"],
  },
];

/* ------------------------------ Specialisation ------------------------------ */
export const SPECIALISATIONS: { name: string }[] = [
  { name: "Chloromethylation" },
  { name: "Halogenation" },
  { name: "Hydrogenation" },
  { name: "High-vacuum distillation" },
  { name: "Racemisation" },
  { name: "Williamson synthesis" },
  { name: "Friedel–Crafts acylation" },
  { name: "Esterification" },
  { name: "Aldol reaction" },
  { name: "Radical bromination" },
  { name: "Darzens reaction" },
];

/* ------------------------------ Global presence ------------------------------ */
export type Region = "Europe" | "Asia-Pacific" | "Middle East & Africa" | "Americas";
export interface Country { name: string; region: Region; lat: number; lon: number }

export const HUB = { name: "Hyderabad, India", lat: 17.4, lon: 78.5 };

export const COUNTRIES: Country[] = [
  { name: "India", region: "Asia-Pacific", lat: 20.6, lon: 78.9 },
  { name: "China", region: "Asia-Pacific", lat: 39.9, lon: 116.4 },
  { name: "South Korea", region: "Asia-Pacific", lat: 37.6, lon: 127.0 },
  { name: "Vietnam", region: "Asia-Pacific", lat: 21.0, lon: 105.8 },
  { name: "Bangladesh", region: "Asia-Pacific", lat: 23.8, lon: 90.4 },
  { name: "Malaysia", region: "Asia-Pacific", lat: 3.1, lon: 101.7 },
  { name: "Philippines", region: "Asia-Pacific", lat: 14.6, lon: 121.0 },
  { name: "Indonesia", region: "Asia-Pacific", lat: -6.2, lon: 106.8 },
  { name: "Singapore", region: "Asia-Pacific", lat: 1.35, lon: 103.8 },
  { name: "Germany", region: "Europe", lat: 52.5, lon: 13.4 },
  { name: "United Kingdom", region: "Europe", lat: 51.5, lon: -0.1 },
  { name: "Czech Republic", region: "Europe", lat: 50.1, lon: 14.4 },
  { name: "Spain", region: "Europe", lat: 40.4, lon: -3.7 },
  { name: "France", region: "Europe", lat: 48.9, lon: 2.35 },
  { name: "Belgium", region: "Europe", lat: 50.85, lon: 4.35 },
  { name: "Cyprus", region: "Europe", lat: 35.2, lon: 33.4 },
  { name: "Portugal", region: "Europe", lat: 38.7, lon: -9.1 },
  { name: "Turkey", region: "Europe", lat: 39.9, lon: 32.9 },
  { name: "Hungary", region: "Europe", lat: 47.5, lon: 19.0 },
  { name: "Poland", region: "Europe", lat: 52.2, lon: 21.0 },
  { name: "Switzerland", region: "Europe", lat: 46.9, lon: 7.4 },
  { name: "Croatia", region: "Europe", lat: 45.8, lon: 16.0 },
  { name: "Ireland", region: "Europe", lat: 53.3, lon: -6.3 },
  { name: "Italy", region: "Europe", lat: 41.9, lon: 12.5 },
  { name: "Netherlands", region: "Europe", lat: 52.4, lon: 4.9 },
  { name: "Libya", region: "Middle East & Africa", lat: 32.9, lon: 13.2 },
  { name: "Tanzania", region: "Middle East & Africa", lat: -6.8, lon: 39.3 },
  { name: "Egypt", region: "Middle East & Africa", lat: 30.0, lon: 31.2 },
  { name: "Algeria", region: "Middle East & Africa", lat: 36.8, lon: 3.1 },
  { name: "Israel", region: "Middle East & Africa", lat: 31.8, lon: 35.2 },
  { name: "Iran", region: "Middle East & Africa", lat: 35.7, lon: 51.4 },
  { name: "Tunisia", region: "Middle East & Africa", lat: 36.8, lon: 10.2 },
  { name: "Oman", region: "Middle East & Africa", lat: 23.6, lon: 58.4 },
  { name: "Jordan", region: "Middle East & Africa", lat: 31.9, lon: 35.9 },
  { name: "UAE", region: "Middle East & Africa", lat: 24.5, lon: 54.4 },
  { name: "Iraq", region: "Middle East & Africa", lat: 33.3, lon: 44.4 },
  { name: "USA", region: "Americas", lat: 38.9, lon: -77.0 },
  { name: "Mexico", region: "Americas", lat: 19.4, lon: -99.1 },
  { name: "Canada", region: "Americas", lat: 45.4, lon: -75.7 },
  { name: "Colombia", region: "Americas", lat: 4.7, lon: -74.1 },
];
export const REGIONS: Region[] = ["Europe", "Asia-Pacific", "Middle East & Africa", "Americas"];

/* ------------------------------ Editorial copy ------------------------------ */
export const OVERVIEW = [
  "Synthokem Labs Pvt Ltd is a privately held company that came into existence in 1978. It manufactures Active Pharmaceutical Ingredients and drug intermediates at facilities located in two states — Telangana and Andhra Pradesh — in India.",
  "The company is recognised for its strengths in manufacturing and distribution of a wide range of products and capabilities in R&D, with an aim to provide accessible and affordable pharmaceutical products to people in need.",
  "Over the decades, Synthokem Labs has leveraged its core expertise in evolving process chemistry, advanced capabilities, backward integration and stringent quality standards to build a portfolio of products across the value chain and enhance its competitiveness.",
  "Having been successfully audited and recognised by global regulatory authorities, Synthokem Labs is an integral part of the Indian pharmaceutical industry, delivering differentiated, high-quality products consistently.",
  "Our strength lies in our people — over 300 skilled and unskilled individuals across three manufacturing facilities and the corporate office. Founded and managed by an experienced team of professionals with technical expertise and decades of industry experience, we foster a culture of sustainable growth through education, inclusion, empowerment and innovation.",
];

export const PHILOSOPHY = [
  { title: "Quality", body: "Maintaining the highest quality and regulatory standards in all our products and processes." },
  { title: "Manufacturing", body: "Aiding the translation of fundamental science into pharmaceutical solutions, persistently." },
  { title: "Integrity", body: "Being consistent with our values, means and actions in our business and as part of the society." },
];

export const COMMITMENTS = [
  { title: "We assure quality", body: "Made possible by sustained effort and total dedication — from gram level up to multi-ton supplies." },
  { title: "We innovate & ideate", body: "Producing cutting-edge intermediates for new and off-patent APIs within the requisite time frame." },
  { title: "We aim for the best", body: "The secret of our success is complete customer satisfaction. Customers are our lifeline and guideline." },
];

export const VISION =
  "To optimize our manufacturing capabilities through a quality-driven approach and emerge as a leading API manufacturer with a diversified portfolio in the global pharmaceutical industry.";
export const MISSION =
  "We aim to be a responsible corporate entity serving the community at large through business, social and environmental actions that contribute to a better future.";

export const CHAIRPERSON = {
  name: "Jayant Tagore Madireddy",
  title: "Chairperson",
  quote: "It was my keenness to ensure good health for all that drove me to set up Synthokem Labs.",
  message: [
    "The major focus areas of our organization are Research and Development, Manufacturing, Supply Chain, Quality Assessment, and Regulatory.",
    "Our growth and success are credited to the cooperation and teamwork of all our employees who have always been a tremendous strength to me.",
    "The constant support and trust from our valued customers are vital to us in delivering quality products that will help people to live happier and healthier lives.",
    "I take this opportunity to thank all of our stakeholders whose continued patronage and confidence inspire us and I hope we continue to have mutually beneficial relationships that bring about sustainable growth in the society we live in.",
  ],
};

export const PILLARS = [
  { title: "Scalable facilities", body: "World-class equipment, technologies and operational frameworks across all manufacturing units." },
  { title: "Skilled workforce", body: "Highly skilled pharmaceutical scientists, regulatory affairs specialists, quality analysts and more." },
  { title: "Advanced products", body: "A portfolio of growth-oriented, stable APIs and intermediates in the global marketplace." },
];

/* ------------------------------ News / insights ------------------------------ */
export interface NewsItem { slug: string; date: string; category: string; title: string; summary: string; body: string[] }
/** No news has been published by the company yet. Add items here to populate /insights and the homepage. */
export const NEWS: NewsItem[] = [];

/* ------------------------------ Careers ------------------------------ */
export interface Opening { id: string; title: string; department: string; location: string; qualification: string; experience: string; description: string }
/** No current vacancies are published. Add openings here to list them on /careers. */
export const OPENINGS: Opening[] = [];

export const CAREER_AREAS = [
  "Research & Development",
  "Manufacturing",
  "Quality Control & Assurance",
  "Regulatory Affairs",
  "Supply Chain",
  "Export Marketing",
  "Domestic Marketing",
  "Purchase",
];
