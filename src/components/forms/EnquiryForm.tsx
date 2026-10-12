"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CATEGORIES, PRODUCTS, getCategory } from "@/data/products";
import { SITE } from "@/data/site";
import { EMAIL_RE, submitEnquiry, type SubmitResult } from "@/lib/enquiry";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/ui/client";
import { ErrorSummary, Field, FileField, Input, Select, Textarea } from "./fields";

export type EnquiryType = "sales" | "technical" | "partner" | "general";
export const ENQUIRY_TYPES: { id: EnquiryType; label: string; description: string }[] = [
  { id: "sales", label: "Sales & quotation", description: "Pricing, quantities and supply" },
  { id: "technical", label: "Technical / product information", description: "Specifications and documentation" },
  { id: "partner", label: "Partnership", description: "Collaboration and development" },
  { id: "general", label: "General enquiry", description: "Anything else" },
];

const LABELS: Record<string, string> = {
  name: "Full name", company: "Company", designation: "Designation", email: "Business email", phone: "Phone",
  country: "Country", product: "Product", quantity: "Quantity / requirement", message: "Message", attachment: "Attachment", consent: "Consent",
};

/**
 * B2B enquiry / RFQ form. Prefills from the URL:
 *   ?product=<slug>  ?topic=documentation  ?message=<text>  ?type=<EnquiryType>
 */
export function EnquiryForm({ initialType = "sales", type: controlledType, onTypeChange, showTypePicker = true }: {
  initialType?: EnquiryType; type?: EnquiryType; onTypeChange?: (t: EnquiryType) => void; showTypePicker?: boolean;
}) {
  const [localType, setLocalType] = useState<EnquiryType>(initialType);
  const type = controlledType ?? localType;
  const setType = (t: EnquiryType) => { setLocalType(t); onTypeChange?.(t); };
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get("product");
    const prod = slug ? PRODUCTS.find((x) => x.slug === slug) : undefined;
    if (prod) setProduct(prod.slug);
    const t = p.get("type") as EnquiryType | null;
    if (t && ENQUIRY_TYPES.some((x) => x.id === t)) setType(t);
    if (p.get("topic") === "documentation" && prod) {
      setType("technical");
      setMessage(`Please share the available technical documentation (specification, CoA and regulatory documents) for ${prod.name}${prod.cas ? ` (CAS ${prod.cas})` : ""}.`);
    } else if (p.get("message")) setMessage(p.get("message")!.slice(0, 500));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (result) successRef.current?.focus(); }, [result]);

  // Clear a field's error as soon as the user edits it
  const clearError = (e: { target: EventTarget }) => {
    const n = (e.target as HTMLInputElement).name;
    if (n && errors[n]) setErrors(({ [n]: _, ...rest }) => rest);
  };

  function validate(fd: FormData) {
    const e: Record<string, string> = {};
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    if (!v("name")) e.name = "Enter your full name";
    if (!v("company")) e.company = "Enter your company name";
    if (!v("email")) e.email = "Enter your business email";
    else if (!EMAIL_RE.test(v("email"))) e.email = "Enter a valid email, like name@company.com";
    if (v("phone") && !/^[+()\d\s-]{6,20}$/.test(v("phone"))) e.phone = "Use digits, spaces and + only";
    if (!v("country")) e.country = "Enter your country";
    if (!v("message") || v("message").length < 10) e.message = "Tell us a little more (at least 10 characters)";
    if (file && file.size > 10 * 1024 * 1024) e.attachment = "File must be 10 MB or smaller";
    if (!fd.get("consent")) e.consent = "Please confirm so we can respond to your enquiry";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    fd.set("type", ENQUIRY_TYPES.find((t) => t.id === type)!.label);
    if (product) {
      const p = PRODUCTS.find((x) => x.slug === product);
      fd.set("product", p ? `${p.name}${p.cas ? ` (CAS ${p.cas})` : ""}` : product);
    }
    if (!file) fd.delete("attachment");
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
      return;
    }
    setState("submitting");
    try {
      const subject = `[Website] ${ENQUIRY_TYPES.find((t) => t.id === type)!.label} — ${fd.get("company")}`;
      setResult(await submitEnquiry(fd, subject));
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (result) {
    return (
      <div ref={successRef} tabIndex={-1} className="rounded-lg bg-surface p-8 outline-none sm:p-10" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white"><Icon name="check" size={22} /></span>
        {result.mode === "sent" ? (
          <>
            <h2 className="display-md mt-6 text-primary-ink">Thank you — your enquiry has been received.</h2>
            <p className="mt-4 max-w-xl text-muted">{SITE.responseTime} A copy of your details has been recorded for our sales and technical teams.</p>
          </>
        ) : (
          <>
            <h2 className="display-md mt-6 text-primary-ink">Your enquiry is ready to send.</h2>
            <p className="mt-4 max-w-xl text-muted">
              We’ve prepared your enquiry as an email to <strong className="text-primary-ink">{SITE.email}</strong>. Open it in your email app and press send — {SITE.responseTime.charAt(0).toLowerCase() + SITE.responseTime.slice(1)}
              {file && " Please attach your file to the email before sending."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={result.mailto} className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-5 font-semibold text-white hover:bg-primary-dark">
                <Icon name="mail" size={18} /> Open in email app
              </a>
              <CopyButton text={`To: ${SITE.email}\n\n${result.summary}`} label="Enquiry text" className="ring-1 ring-inset ring-border-strong" />
            </div>
            <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-4 font-mono text-xs text-muted ring-1 ring-border">{result.summary}</pre>
          </>
        )}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm">
          <button type="button" onClick={() => { setResult(null); setFile(null); }} className="inline-flex min-h-10 cursor-pointer items-center font-semibold text-primary underline-offset-4 hover:underline">Send another enquiry</button>
          <Link href="/products/" className="inline-flex min-h-10 items-center font-semibold text-primary underline-offset-4 hover:underline">Browse products</Link>
        </div>
      </div>
    );
  }

  const showProduct = type === "sales" || type === "technical";

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={clearError} noValidate className="space-y-7" aria-describedby="form-note">
      <ErrorSummary errors={errors} labels={LABELS} />

      {showTypePicker && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-primary-ink">What can we help with?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ENQUIRY_TYPES.map((t) => (
              <label key={t.id} className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-lg p-4 ring-1 ring-inset transition-colors ${type === t.id ? "bg-primary-tint ring-2 ring-primary" : "ring-border-strong hover:ring-primary"}`}>
                <input type="radio" name="enquiryType" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                <span>
                  <span className="block font-semibold text-primary-ink">{t.label}</span>
                  <span className="block text-[0.85rem] text-muted">{t.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name}><Input id="name" autoComplete="name" error={errors.name} /></Field>
        <Field id="company" label="Company" required error={errors.company}><Input id="company" autoComplete="organization" error={errors.company} /></Field>
        <Field id="designation" label="Designation" error={errors.designation}><Input id="designation" autoComplete="organization-title" /></Field>
        <Field id="email" label="Business email" required error={errors.email}><Input id="email" type="email" autoComplete="email" inputMode="email" error={errors.email} /></Field>
        <Field id="phone" label="Phone" error={errors.phone} hint="Include your country code"><Input id="phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} hint="Include your country code" /></Field>
        <Field id="country" label="Country" required error={errors.country}><Input id="country" autoComplete="country-name" error={errors.country} /></Field>
      </div>

      {showProduct && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="product" label="Product">
            <Select id="product" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="">Select a product (or leave blank)</option>
              {CATEGORIES.map((c) => (
                <optgroup key={c.slug} label={c.name}>
                  {PRODUCTS.filter((p) => p.category === c.slug).map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}{p.cas ? ` — ${p.cas}` : ""}</option>
                  ))}
                </optgroup>
              ))}
              <option value="Other / not listed">Other / not listed</option>
            </Select>
          </Field>
          <Field id="quantity" label="Quantity / requirement" hint="e.g. 500 kg per quarter, sample quantity">
            <Input id="quantity" hint="e.g. 500 kg per quarter, sample quantity" />
          </Field>
        </div>
      )}
      {showProduct && PRODUCTS.some((p) => p.slug === product) && (
        <p className="-mt-3 text-sm text-muted">
          Selected: <strong className="text-primary-ink">{PRODUCTS.find((p) => p.slug === product)?.name}</strong>
          {" · "}{getCategory(PRODUCTS.find((p) => p.slug === product)?.category ?? "")?.shortName}
        </p>
      )}

      <Field id="message" label="Message" required error={errors.message}>
        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} placeholder="Grade, target market, documentation needed, timelines…" />
      </Field>

      <Field id="attachment" label="Attachment" error={errors.attachment}>
        <FileField id="attachment" error={errors.attachment} onChange={setFile} fileName={file?.name} />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.92rem] text-text">
          <input type="checkbox" name="consent" value="yes" className="mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--primary)]" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} id="consent" />
          <span>I agree that Synthokem Labs may use these details to respond to my enquiry, as described in the <Link href="/privacy/" className="font-semibold text-primary underline underline-offset-2">privacy policy</Link>. <span className="text-error" aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <p id="consent-error" className="mt-1.5 flex items-center gap-1.5 text-[0.85rem] font-medium text-error"><Icon name="alert" size={14} /> {errors.consent}</p>}
      </div>

      {state === "error" && (
        <p role="alert" className="rounded-lg bg-[#fdf0ee] p-4 text-sm text-error">
          We couldn’t send your enquiry due to a network problem. Please try again, or email us directly at <a className="font-semibold underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="text-[0.85rem] text-muted"><span className="text-error">*</span> Required fields. {SITE.responseTime}</p>
        <button type="submit" disabled={state === "submitting"} className="group inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70">
          {state === "submitting" ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Sending…</>) : (<>Send enquiry <Icon name="arrowRight" size={17} className="arrow-nudge" /></>)}
        </button>
      </div>
    </form>
  );
}
