"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";

const base =
  "w-full rounded-lg bg-white px-4 text-base text-text ring-1 ring-inset ring-border-strong transition-shadow placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error";

export function Field({
  id, label, required, error, hint, children, className = "",
}: { id: string; label: string; required?: boolean; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary-ink">
        {label} {required ? <span className="text-error" aria-hidden="true">*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-[0.82rem] text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-[0.85rem] font-medium text-error">
          <Icon name="alert" size={14} /> {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string; hint?: string };
export function Input({ id, error, hint, ...rest }: InputProps) {
  return (
    <input
      id={id}
      name={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      className={`${base} min-h-12`}
      {...rest}
    />
  );
}

export function Textarea({ id, error, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; error?: string }) {
  return (
    <textarea
      id={id}
      name={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${base} min-h-36 py-3`}
      {...rest}
    />
  );
}

export function Select({ id, error, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { id: string; error?: string }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${base} min-h-12 cursor-pointer appearance-none pr-10`}
        {...rest}
      >
        {children}
      </select>
      <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function ErrorSummary({ errors, labels }: { errors: Record<string, string>; labels: Record<string, string> }) {
  const keys = Object.keys(errors);
  if (keys.length === 0) return null;
  return (
    <div role="alert" tabIndex={-1} id="error-summary" className="rounded-lg bg-[#fdf0ee] p-5 ring-1 ring-error/30">
      <p className="flex items-center gap-2 font-semibold text-error"><Icon name="alert" size={18} /> Please correct {keys.length === 1 ? "1 field" : `${keys.length} fields`} before sending</p>
      <ul className="mt-2 list-inside list-disc text-sm text-error">
        {keys.map((k) => (
          <li key={k}>
            <a
              href={`#${k}`}
              onClick={(e) => {
                const el = document.getElementById(k);
                if (!el) return;
                e.preventDefault();
                // Hidden file inputs: focus their visible label instead
                const target = el.classList.contains("sr-only") ? document.querySelector<HTMLElement>(`label[for="${k}"]`) ?? el : el;
                target.scrollIntoView({ block: "center", behavior: "smooth" });
                el.focus({ preventScroll: true });
              }}
              className="underline underline-offset-2"
            >
              {labels[k] ?? k}: {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FileField({ id, error, onChange, fileName }: { id: string; error?: string; onChange: (f: File | null) => void; fileName?: string }) {
  return (
    <div>
      <label htmlFor={id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm transition-colors hover:border-primary hover:bg-surface ${error ? "border-error" : "border-border-strong"}`}>
        <Icon name="upload" size={18} className="shrink-0 text-accent-strong" />
        <span className={`min-w-0 flex-1 text-text ${fileName ? "truncate" : ""}`}>{fileName || "Attach a file — PDF, DOC, XLS or image, up to 10 MB"}</span>
        <span className="font-semibold text-primary">Browse</span>
      </label>
      <input
        id={id}
        name={id}
        type="file"
        className="sr-only"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
