import { SITE } from "@/data/site";

/**
 * ENQUIRY INTEGRATION POINT
 * -------------------------
 * The site is a static export, so forms need an external endpoint to deliver
 * submissions (e.g. a CRM web-to-lead URL, Formspree, a serverless function or
 * an internal API). Set NEXT_PUBLIC_ENQUIRY_ENDPOINT at build time:
 *
 *   NEXT_PUBLIC_ENQUIRY_ENDPOINT=https://api.example.com/enquiries npm run build
 *
 * The endpoint receives a multipart/form-data POST with every field (and the
 * optional attachment) and should return 2xx on success.
 *
 * Until an endpoint is configured, the form does NOT pretend to send anything:
 * it prepares a pre-filled email to info@synthokemlabs.com and tells the user so.
 */
export const ENQUIRY_ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "";

export type SubmitResult = { mode: "sent" } | { mode: "email"; mailto: string; summary: string };

const LABELS: Record<string, string> = {
  type: "Enquiry type",
  name: "Name",
  company: "Company",
  designation: "Designation",
  email: "Email",
  phone: "Phone",
  country: "Country",
  product: "Product",
  quantity: "Quantity / requirement",
  area: "Area of interest",
  experience: "Experience",
  message: "Message",
};

export function summarise(fd: FormData): string {
  const lines: string[] = [];
  for (const [k, label] of Object.entries(LABELS)) {
    const v = fd.get(k);
    if (typeof v === "string" && v.trim()) lines.push(`${label}: ${v.trim()}`);
  }
  const file = fd.get("attachment");
  if (file instanceof File && file.size > 0) lines.push(`Attachment: ${file.name} (please attach manually)`);
  return lines.join("\n");
}

export async function submitEnquiry(fd: FormData, subject: string): Promise<SubmitResult> {
  if (ENQUIRY_ENDPOINT) {
    const res = await fetch(ENQUIRY_ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Submission failed (${res.status})`);
    return { mode: "sent" };
  }
  const summary = summarise(fd);
  const body = summary.length > 1600 ? `${summary.slice(0, 1600)}…` : summary;
  return {
    mode: "email",
    summary,
    mailto: `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
