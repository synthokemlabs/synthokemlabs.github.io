import type { IconName } from "@/components/ui/Icon";

/** Employee Life — the benefits every Synthokem employee enjoys, grouped by how often they're felt. */

export interface Cover {
  id: string;
  code: string;
  name: string;
  icon: IconName;
  tagline: string;
  summary: string;
  points: string[];
}

/** Three layers of insurance protection (outer to inner on the shield graphic). */
export const COVERS: Cover[] = [
  {
    id: "gmc",
    code: "GMC",
    name: "Group Medical Claim",
    icon: "medical",
    tagline: "For your health",
    summary: "Group health insurance that helps meet hospitalisation expenses — so a medical emergency never turns into a financial one.",
    points: [
      "Hospitalisation expenses covered under the group medical policy",
      "Our HR team guides you through every step of a claim",
      "Focus on getting better, not on the bills",
    ],
  },
  {
    id: "gtli",
    code: "GTLI",
    name: "Group Term Life Insurance",
    icon: "umbrella",
    tagline: "For your family",
    summary: "Life cover that gives your family financial support in the unfortunate event of your death while in service.",
    points: [
      "A lump-sum benefit paid to your nominee",
      "Financial security for the people who depend on you",
      "Protection that stays in place throughout your service",
    ],
  },
  {
    id: "gpa",
    code: "GPA",
    name: "Group Personal Accident Policy",
    icon: "bandage",
    tagline: "For the unexpected",
    summary: "Accident insurance that compensates for accidental injury, disability or death — support when life takes an unexpected turn.",
    points: [
      "Cover for accidental death and permanent or partial disability",
      "Helps replace lost income while you recover",
      "An extra safety net on top of medical and life cover",
    ],
  },
];

export interface Perk { id: string; title: string; icon: IconName; text: string }

/** Felt every working day. */
export const DAILY: Perk[] = [
  { id: "bus", title: "Free bus facility", icon: "bus", text: "Company buses bring you to work and take you home again — free of charge. No commute costs, no parking stress, just a safe and reliable ride to our units." },
  { id: "food", title: "50% discount on food", icon: "utensils", text: "Freshly prepared meals in the canteen at half the price, so a good lunch is never a second thought." },
  { id: "dress", title: "Free dresses", icon: "shirt", text: "Work dresses are provided free by the company — clean, comfortable and ready for the lab and the plant floor." },
];

/** Recognising the people who keep operations running. */
export const SHIFT = {
  title: "Shift allowances",
  text: "Our plants run around the clock. Employees in important departments that work in shifts receive an additional shift allowance — recognition for keeping production, quality and utilities running day and night.",
};

/** Felt once a year, remembered all year. */
export const YEARLY: Perk[] = [
  { id: "checkup", title: "Yearly free medical check-up", icon: "heartPulse", text: "A full health check-up every year, free of cost. Prevention is the best medicine — and we want every one of our people to stay well." },
  { id: "trip", title: "Yearly trips for refreshing", icon: "plane", text: "Every year we step away from the reactors and the paperwork for a company trip — time to unwind, recharge and get to know colleagues beyond the job." },
];

/** Every benefit, for the hero orbit, the marquee and the at-a-glance list. */
export const ALL_BENEFITS: { label: string; icon: IconName; href: string }[] = [
  ...COVERS.map((c) => ({ label: `${c.code} — ${c.name}`, icon: c.icon, href: "#protection" })),
  ...DAILY.map((p) => ({ label: p.title, icon: p.icon, href: "#everyday" })),
  { label: SHIFT.title, icon: "moon" as IconName, href: "#shifts" },
  ...YEARLY.map((p) => ({ label: p.title, icon: p.icon, href: "#yearly" })),
];
