/**
 * Corporate content: journey, facilities, approvals, global presence,
 * specialisations and editorial copy. Entries come from the previous
 * synthokemlabs.com pages (About, Our Assurance, Social Responsibility, Contact)
 * and the company presentation "for website.pptx" (Oct 2026), noted per block as "PPT slide N".
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
  since?: string;
  /** Logo from the "Accolades" slide (PPT slide 4), in /public/images/logos. Entries without one get a designed seal. */
  logo?: { src: string; width: number; height: number };
}
const logo = (name: string, width: number, height: number) => ({ src: `/images/logos/${name}.png`, width, height });

/**
 * PPT slide 4 ("Accolades") supplies the logos and the current standards: ISO 9001:2015, ISO 14001:2015,
 * ISO 45001:2018 (which replaced OHSAS 18001) and MSME ZED Gold. The slide's "FDA APPROVED" stamp is not
 * used: the USFDA inspects API facilities rather than approving them (the company's own wording, slide 2,
 * is "USFDA inspected"), so USFDA keeps a designed seal.
 */
export const APPROVALS: Approval[] = [
  { short: "USFDA", authority: "US Food & Drug Administration", scope: "Unit I facility approval with regular inspections; Unit II inspection completed in 2018. DMFs filed since 1993.", since: "2005" },
  { short: "CEP", authority: "EDQM — Certificate of Suitability", scope: "Guaifenesin (Ph. Eur.) — Unit I in 2001, Unit II in 2019.", since: "2001", logo: logo("edqm", 450, 239) },
  { short: "WHO-GMP", authority: "World Health Organization GMP", scope: "Certified since 2002; Unit II certified in 2016. Renewed to date.", since: "2002", logo: logo("who-gmp", 158, 176) },
  { short: "KFDA", authority: "Korean FDA", scope: "Unit I inspected; certificate achieved for Methocarbamol.", since: "2012", logo: logo("kfda", 198, 77) },
  { short: "EU WC", authority: "EU Written Confirmation", scope: "Unit I (2013) and Unit II (2016), per Art. 46b(2)(b) of 2001/83/EC.", since: "2013" },
  { short: "COFEPRIS", authority: "Mexican Health Authority", scope: "Unit I inspected for Methocarbamol and Guaifenesin; approved in 2016.", since: "2016" },
  { short: "ISO 9001:2015", authority: "Quality Management System — DNV GL", scope: "Certified since 2000; Unit II since 2013. Renewed to date.", since: "2000", logo: logo("iso-9001", 172, 172) },
  { short: "ISO 14001:2015", authority: "Environmental Management System — DNV GL", scope: "Unit II, certified since 2015 and renewed to date.", since: "2015", logo: logo("iso-14001", 220, 223) },
  { short: "ISO 45001:2018", authority: "Occupational Health & Safety Management", scope: "Unit II — certified for occupational health & safety since 2015 (OHSAS 18001, now ISO 45001:2018).", since: "2015", logo: logo("iso-45001", 383, 346) },
  { short: "ZED Gold", authority: "MSME — Zero Defect Zero Effect", scope: "Gold-level certification under the Government of India's MSME ZED scheme.", logo: logo("msme-zed-gold", 200, 200) },
  { short: "Kosher", authority: "Kosher certification", scope: "Guaifenesin, Unit I. Renewed to date.", since: "2010" },
];

/* ------------------------------ Facilities ------------------------------ */
export interface Facility {
  id: string;
  name: string;
  state: string;
  location: string;
  address: string;
  summary: string;
  highlights: string[];
  /** Reactor capacity in kilolitres (PPT slide 20). */
  capacityKL: number;
  coords: { lat: number; lon: number; dms: string };
  /** Approximate distances, as given by the company (PPT slides 13 and 16). */
  logistics: { kind: "airport" | "seaport"; name: string; km: number }[];
  /** Site photographs (Img names), first one leads. */
  photos: { name: string; caption: string }[];
}
export const FACILITIES: Facility[] = [
  {
    id: "unit-ii",
    name: "Unit II",
    state: "Telangana",
    location: "IDA Pashamylaram, Patancheru, Sanga Reddy, Telangana",
    address: "Plot No. 222–224 & 235–237, Phase-II, IDA Pashamylaram, Patancheru – 502319, Sanga Reddy, Telangana, India",
    summary: "Acquired in 2004 and in operation since 2010, on the same site as the corporate office and R&D unit.",
    highlights: ["USFDA inspection completed (2018)", "WHO-GMP & EU Written Confirmation (2016)", "CEP for Guaifenesin (2019)", "ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018"],
    capacityKL: 250,
    coords: { lat: 17.536135, lon: 78.178622, dms: "17° 32′ 10.1″ N, 78° 10′ 43.0″ E" },
    logistics: [
      { kind: "airport", name: "Rajiv Gandhi International Airport, Hyderabad", km: 40 },
      { kind: "seaport", name: "Chennai Port", km: 634 },
      { kind: "seaport", name: "Mumbai Port", km: 743 },
    ],
    photos: [
      { name: "facility-aerial", caption: "Unit II from the air" },
      { name: "unit2-campus", caption: "Unit II campus" },
      { name: "unit2-qc-lab", caption: "Laboratory" },
      { name: "reactor-hall", caption: "Reactors" },
      { name: "warehouse-drums", caption: "Warehouse" },
    ],
  },
  {
    id: "unit-iii",
    name: "Unit III",
    state: "Andhra Pradesh",
    location: "JN Pharmacity, Parawada, Anakapalli, Andhra Pradesh",
    address: "Plot No. 75, JN Pharmacity, Thanam, Parawada – 531019, Anakapalli, Andhra Pradesh, India",
    summary: "A WHO- and EU-compliant manufacturing facility within JN Pharmacity, near Visakhapatnam.",
    highlights: ["WHO- and EU-compliant facility", "ISO 9001:2015 & GMP facility", "Close to Visakhapatnam airport and seaport"],
    capacityKL: 125,
    // The slide repeated Unit II's degrees-minutes-seconds; these are converted from Unit III's own decimal coordinates
    coords: { lat: 17.65302, lon: 83.0731, dms: "17° 39′ 10.9″ N, 83° 04′ 23.2″ E" },
    logistics: [
      { kind: "airport", name: "Visakhapatnam Airport (VTZ)", km: 31 },
      { kind: "seaport", name: "Visakhapatnam Port", km: 36 },
      { kind: "airport", name: "Alluri Sitarama Raju International Airport, Bhogapuram", km: 62 },
      { kind: "airport", name: "Rajiv Gandhi International Airport, Hyderabad", km: 750 },
    ],
    photos: [
      { name: "unit3-block", caption: "Unit III, JN Pharmacity" },
      { name: "unit3-production", caption: "Reactor hall" },
      { name: "unit3-lab", caption: "Laboratory" },
    ],
  },
];

export const TOTAL_CAPACITY_KL = FACILITIES.reduce((sum, f) => sum + f.capacityKL, 0);

/** PPT slides 18–19: equipment common to all units. */
export const COMMON_EQUIPMENT = {
  process: [
    "Class 100,000 clean area for the finished product, from crystallisation onwards",
    "Leaf filters and sparkler filters for in-process filtration",
    "Centrifuges / ANFDs and fluid-bed dryers for separating and drying wet product",
    "Multimill / pulveriser for homogenisation",
    "Sifters for sieving the finished product",
  ],
  utilities: [
    "PSA nitrogen system for inertisation",
    "Air compressors for dry instrument air",
    "Cooling towers for cooling water",
    "Chillers for process and heat-exchanger cooling",
    "Hot-oil boilers for high-vacuum distillation",
    "Steam ejectors for vacuum and a boiler for steam",
    "EDI water purification and supply system",
    "DG sets for complete power back-up, and a fire-fighting system",
  ],
};

/* ------------------------------ Specialisation ------------------------------ */
/** PPT slide 7 ("Synthetic chemistry — capabilities") plus cross-coupling (slide 6), alphabetised; names spelled per IUPAC usage. */
export const SPECIALISATIONS: { name: string }[] = [
  { name: "Aldol reaction" },
  { name: "Alkylation" },
  { name: "Bischler–Napieralski reaction" },
  { name: "Chloromethylation" },
  { name: "Condensation" },
  { name: "Cross-coupling reactions" },
  { name: "Cyanation" },
  { name: "Cyclisation" },
  { name: "Darzens (glycidic ester) reaction" },
  { name: "Dealkylation" },
  { name: "Esterification" },
  { name: "Friedel–Crafts acylation" },
  { name: "Halogenation" },
  { name: "High-vacuum distillation" },
  { name: "Hydrogenation" },
  { name: "Nitration" },
  { name: "Oxidation" },
  { name: "Peptide amidation" },
  { name: "Polymerisation" },
  { name: "Racemisation" },
  { name: "Radical bromination" },
  { name: "Sulfonation" },
  { name: "Williamson synthesis" },
];

/* ------------------------------ R&D and CDMO ------------------------------ */
/** PPT slide 6. The slide's "USFDA approved facility" is corrected to "USFDA-inspected" (see APPROVALS). */
export const CDMO = {
  lead: "Established Good Manufacturing Practices, a strong R&D team, systematic product development, a proven record of customer satisfaction, uncompromising ethics and flexible customer relationships — the approach behind Synthokem's growth over four decades.",
  points: [
    { t: "Two locations", d: "A USFDA-inspected facility in Hyderabad and a WHO- and EU-compliant facility near Visakhapatnam.", icon: "factory" as const },
    { t: "Demanding chemistry", d: "Process and support equipment for most kinds of reactions, including high-pressure reactions and hydrogenation.", icon: "flask" as const },
    { t: "About 375 KL capacity", d: "Across both locations — batches from small volumes to high-volume output, with scope to expand for future projects.", icon: "grid" as const },
    { t: "Shared expertise", d: "Our R&D team is open to co-development and CDMO partnerships, and happy to share its expertise.", icon: "users" as const },
  ],
};

/** PPT slide 8. */
export const ANALYTICAL_DEVELOPMENT = [
  "Analytical method development",
  "Method validation and verification",
  "Method transfer to quality control laboratories",
  "Characterisation studies for structure elucidation",
  "Genotoxic impurity studies and reporting",
  "Responses to regulatory queries",
  "GLP and regulatory compliance",
];

/** PPT slide 9. */
export const RND_LABS = [
  {
    t: "Synthesis laboratory",
    d: "Reactions from milligram to kilogram scale.",
    items: ["10 fume hoods", "High-vacuum distillation systems", "Rotary evaporators", "Dedicated solvent and chemical storage area"],
  },
  {
    t: "Analytical R&D laboratory",
    d: "Supports the synthesis lab, with 21 CFR Part 11 compliant data handling.",
    items: ["HPLC (Agilent) with UV / PDA detector", "GC (Agilent) with FID and headspace", "Chromatography data system (CDS 2.2)", "Digital melting point apparatus", "Karl Fischer titrator and pH meter", "UV and IR spectrophotometers"],
  },
];

/** PPT slide 10. */
export const RND_TEAM = {
  stats: [
    { v: 15, suffix: "+", l: "Master's-level chemists" },
    { v: 10, suffix: "+ yrs", l: "Average R&D experience" },
  ],
  note: "PhD and Master's degrees from reputed institutions across India.",
  literature: [
    "SciFinder and Reaxys",
    "Central government institute libraries in Hyderabad — Chemical Abstracts and journals",
    "Online patent databases",
    "Online ACS and Elsevier journals",
  ],
};

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
/** PPT slide 2, condensed. */
export const OVERVIEW =
  "Synthokem Labs began in 1978 in Hyderabad as a manufacturer of high-quality Active Pharmaceutical Ingredients and drug intermediates. Today we manufacture at two facilities in Telangana and Andhra Pradesh — USFDA-inspected, run to current Good Manufacturing Practices and backed by a strong research team.";
/** PPT slide 2: "a preferred business partner to the leading consumer brands" for these two APIs. */
export const PARTNER_PRODUCTS = [
  { slug: "guaifenesin", use: "Expectorant" },
  { slug: "methocarbamol", use: "Muscle relaxant" },
];

export const PHILOSOPHY = [
  { title: "Quality", body: "Maintaining the highest quality and regulatory standards in all our products and processes." },
  { title: "Manufacturing", body: "Aiding the translation of fundamental science into pharmaceutical solutions, persistently." },
  { title: "Integrity", body: "Being consistent with our values, means and actions in our business and as part of the society." },
];

/** PPT slide 3 (replaces the previous website's vision and mission). */
export const VISION = "To be a global service provider offering quality products that meet global standards.";
export const MISSION = "Manufacturing and marketing APIs and intermediates that meet global standards, at affordable prices.";
export const VALUES = ["Innovation", "Integrity", "Respect", "Excellence", "Customer delight"];
/** From the previous website's mission; kept as the sustainability commitment, where it fits. */
export const RESPONSIBILITY =
  "We aim to be a responsible corporate entity serving the community at large through business, social and environmental actions that contribute to a better future.";

/** PPT slide 2. */
export const LEADERSHIP = [
  { name: "Mr. Jayant Tagore Madireddy", role: "Chairperson" },
  { name: "Mrs. Aishwarya", role: "Managing Director" },
  { name: "Mr. Aryaman", role: "Director" },
  { name: "Dr. Srinivas Kolupula", role: "Chief Scientific Officer" },
];

/** PPT slide 5 ("Corporate"), condensed to one line each; shown on the Careers page. Its functions list is merged into CAREER_AREAS. */
export const CORPORATE = [
  { t: "Streamlined organisation", d: "A clear hierarchy and well-defined roles across functions and units, for fast decisions." },
  { t: "Cross-functional teams", d: "Integrated workflows between departments, and shared KPIs that drive unified goals." },
  { t: "Standardised processes", d: "Company-wide SOPs and continuous improvement driven by ISO guidelines and lean practices." },
  { t: "High-performance culture", d: "Talent development programmes and recognition systems that reinforce excellence." },
];

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

/* ------------------------------ Quality (PPT slides 21–23) ------------------------------ */
/** Slide 22, with the slide's "SYNYHOKEM" typo and grammar corrected. */
export const QUALITY_POLICY =
  "Synthokem Labs is committed to meeting customer requirements by manufacturing high-quality pharmaceutical ingredients and delivering them to agreed schedules — implementing current Good Manufacturing Practices and continually improving the effectiveness of the Quality Management System.";

/** Slide 23. */
export const QUALITY_UNIT = [
  "The Quality Unit is an independent department that reports directly to the Managing Director.",
  "QA and QC departments are clearly defined and monitor the quality system.",
  "Responsibilities and authorities of everyone working in the Quality Unit are prescribed and followed.",
];
export const QA_RESPONSIBILITIES = [
  "Quality management system", "Document control", "Change control", "Deviation control", "Rejects & recalls",
  "Product quality review", "Complaint handling", "Training", "Internal audits", "Batch release for commercial distribution",
];

/* ------------------------------ Environment, health & safety (PPT slides 24–29) ------------------------------ */
export const EHS = {
  // Slide 24 spells the name "Jayanth tagore"; slide 2 and the Chairperson page use "Jayant Tagore"
  quote: { text: "My people are my real assets.", by: "Jayant Tagore Madireddy, Chairperson" },
  intro: [
    "With this belief, employee safety is always the top priority at Synthokem Labs.",
    "Making APIs and intermediates means our people handle almost every major chemical and unit process in pharmaceutical chemistry. So we have built a stringent, risk-assessment-based health and safety process for a better and safer workplace, and run an active Occupational Health and Safety Management Programme.",
  ],
  /** Slide 24 flowchart: leadership & commitment drives six safeguards. */
  safeguards: [
    { t: "Separate solvent yard", icon: "drum" as const },
    { t: "Fire hydrant system", icon: "flame" as const },
    { t: "Emergency exits", icon: "exit" as const },
    { t: "Green practices", icon: "leaf" as const },
    { t: "ZLD facility", icon: "droplet" as const },
    { t: "PPEs", icon: "hardHat" as const },
  ],
  /** Slide 25: the signed SHE Policy, transcribed (signature not reproduced). */
  shePolicy: {
    intro: "Synthokem Labs Private Limited is committed to protecting the environment, its employees and public health by:",
    points: [
      "Complying with all regulatory requirements, and taking any additional measures considered necessary.",
      "Preventing pollution, maximising recycling, and reducing waste, discharges and emissions.",
      "Training all employees, including contract labour, in safety, health and environment so operations are handled safely — and working on engineering controls to prevent injuries.",
      "Defining objectives and monitoring their achievement and effectiveness against set target dates.",
      "Continuing to look for new ways to conserve the natural resources used in our processes.",
      "Following a systematic approach to environmental management to achieve continual performance improvement.",
      "Periodically reviewing and redefining this policy in line with regulatory requirements.",
    ],
    signedBy: "Managing Director",
  },
  /** Slide 26. */
  health: [
    "Annual health check-ups for all employees, with records maintained.",
    "Employees with ailments or diseases are identified and isolated from operations.",
    "Written procedures for personal and work-area hygiene, with compliance ensured.",
    "Employee welfare: canteen, provident fund, medical cards and free transport.",
    "Insurance cover for all employees, supported by the company.",
  ],
  /** Slide 27. */
  standards: [
    { t: "Health & Safety Standards", d: "To uphold our commitment to the health and safety of our employees, contract workers and neighbours, Synthokem has established a set of Health & Safety Standards. They are the foundation of our health and safety management system across process safety, employee health, safety and emergency response." },
    { t: "Process Safety Management", d: "Our Process Safety Management Standards ensure every Synthokem facility is designed, operated and maintained responsibly, complying with or exceeding regulatory requirements. They set out the principles and requirements for process safety management and effective emergency response, aligned with industry practice." },
  ],
};

/** Slides 28–29. The slides' "Kw/hr" is a power rating, so it is shown as kW. */
export const RENEWABLES = [
  { unit: "Unit II", pvKW: 200, items: ["200 kW of solar PV panels for in-house power, generating 600–700 units a day", "Solar water heaters (15–20 KLD) pre-heating utilities — boilers and the hot-water system", "5 solar concentrators pre-heating the hot-oil system"] },
  { unit: "Unit III", pvKW: 276, items: ["276 kW of solar PV panels for in-house power"] },
];

/* ------------------------------ CSR (PPT slide 30) ------------------------------ */
export const CSR = {
  policy: "Synthokem Labs' CSR policy sets out how the company undertakes CSR projects, programmes and activities under Schedule VII of the Companies Act, 2013 and the Companies (Corporate Social Responsibility Policy) Rules, 2014.",
  support: "The company provides financial assistance, as donations, to education, nutrition, disease-control and social-welfare activities run by NGOs.",
  supported: ["Akshaya Patra Foundation", "Teach for Change", "Orphanages", "Shanthiniketan", "Sri Prasanna Gajanana Sevaka Samajam", "PM CARES Fund", "Chief Minister's Relief Fund"],
};

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
  // Further functions listed on PPT slide 5
  "Finance, Accounts & Costing",
  "IT & ERP",
  "Projects & Engineering",
  "Human Resources & Learning",
];
