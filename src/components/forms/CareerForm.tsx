"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CAREER_AREAS } from "@/data/company";
import { SITE } from "@/data/site";
import { EMAIL_RE, submitEnquiry, type SubmitResult } from "@/lib/enquiry";
import { Icon } from "@/components/ui/Icon";
import { ErrorSummary, Field, FileField, Input, Select, Textarea } from "./fields";

const LABELS: Record<string, string> = { name: "Full name", email: "Email", phone: "Phone", area: "Area of interest", experience: "Experience", message: "Cover note", attachment: "Resume", consent: "Consent" };

export function CareerForm() {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (result) doneRef.current?.focus(); }, [result]);

  // Clear a field's error as soon as the user edits it
  const clearError = (e: { target: EventTarget }) => {
    const n = (e.target as HTMLInputElement).name;
    if (n && errors[n]) setErrors(({ [n]: _, ...rest }) => rest);
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    if (!file) fd.delete("attachment");
    fd.set("type", "Careers — resume submission");
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const e: Record<string, string> = {};
    if (!v("name")) e.name = "Enter your full name";
    if (!v("email")) e.email = "Enter your email";
    else if (!EMAIL_RE.test(v("email"))) e.email = "Enter a valid email, like name@example.com";
    if (!v("phone")) e.phone = "Enter a phone number";
    if (!v("area")) e.area = "Choose an area of interest";
    if (file && file.size > 10 * 1024 * 1024) e.attachment = "File must be 10 MB or smaller";
    if (!fd.get("consent")) e.consent = "Please confirm so we can review your application";
    setErrors(e);
    if (Object.keys(e).length) { requestAnimationFrame(() => document.getElementById("error-summary")?.focus()); return; }
    setState("submitting");
    try {
      setResult(await submitEnquiry(fd, `[Careers] ${v("area")} — ${v("name")}`));
      setState("idle");
    } catch { setState("error"); }
  }

  if (result) {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-lg bg-white p-8 outline-none ring-1 ring-border sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white"><Icon name="check" size={22} /></span>
        {result.mode === "sent" ? (
          <h3 className="display-md mt-6 text-primary-ink">Thank you — we’ve received your details.</h3>
        ) : (
          <>
            <h3 className="display-md mt-6 text-primary-ink">Your application email is ready.</h3>
            <p className="mt-4 text-muted">Open it in your email app, <strong className="text-primary-ink">attach your resume</strong>, and send it to {SITE.email}.</p>
            <a href={result.mailto} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-5 font-semibold text-white hover:bg-primary-dark"><Icon name="mail" size={18} /> Open in email app</a>
          </>
        )}
        <button type="button" onClick={() => { setResult(null); setFile(null); }} className="mt-8 block min-h-10 cursor-pointer text-sm font-semibold text-primary underline-offset-4 hover:underline">Submit another application</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onChange={clearError} noValidate className="space-y-6 rounded-lg bg-white p-6 ring-1 ring-border sm:p-10">
      <ErrorSummary errors={errors} labels={LABELS} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name}><Input id="name" autoComplete="name" error={errors.name} /></Field>
        <Field id="email" label="Email" required error={errors.email}><Input id="email" type="email" autoComplete="email" error={errors.email} /></Field>
        <Field id="phone" label="Phone" required error={errors.phone}><Input id="phone" type="tel" autoComplete="tel" error={errors.phone} /></Field>
        <Field id="area" label="Area of interest" required error={errors.area}>
          <Select id="area" defaultValue="" error={errors.area}>
            <option value="" disabled>Select an area</option>
            {CAREER_AREAS.map((a) => <option key={a}>{a}</option>)}
            <option>Other</option>
          </Select>
        </Field>
        <Field id="experience" label="Experience" className="sm:col-span-2"><Input id="experience" placeholder="e.g. 4 years in API process chemistry" /></Field>
      </div>
      <Field id="message" label="Cover note"><Textarea id="message" placeholder="Qualifications, current role and what you’d like to work on" /></Field>
      <Field id="attachment" label="Resume" error={errors.attachment}><FileField id="attachment" error={errors.attachment} onChange={setFile} fileName={file?.name} /></Field>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.92rem]">
          <input id="consent" type="checkbox" name="consent" value="yes" className="mt-1 h-[18px] w-[18px] shrink-0 accent-[var(--primary)]" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} />
          <span>I agree that Synthokem Labs may store and use my details to assess my application, as described in the <Link href="/privacy/" className="font-semibold text-primary underline underline-offset-2">privacy policy</Link>. <span className="text-error" aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <p id="consent-error" className="mt-1.5 text-[0.85rem] font-medium text-error">{errors.consent}</p>}
      </div>
      {state === "error" && <p role="alert" className="rounded-lg bg-[#fdf0ee] p-4 text-sm text-error">Something went wrong. Please try again or email {SITE.email}.</p>}
      <button type="submit" disabled={state === "submitting"} className="group inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-7 font-semibold text-white hover:bg-primary-dark disabled:opacity-70 sm:w-auto">
        {state === "submitting" ? "Sending…" : <>Submit application <Icon name="arrowRight" size={17} className="arrow-nudge" /></>}
      </button>
    </form>
  );
}
