"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { EnquiryForm, type EnquiryType } from "./EnquiryForm";

type Intent = "customer" | "product" | "partner" | "career" | "general";
const INTENTS: { id: Intent; label: string; icon: IconName; type?: EnquiryType; href?: string }[] = [
  { id: "customer", label: "I am a customer", icon: "users", type: "sales" },
  { id: "product", label: "I want product information", icon: "flask", type: "technical" },
  { id: "partner", label: "I want to partner", icon: "globe", type: "partner" },
  { id: "career", label: "I am looking for a career", icon: "file", href: "/careers/#apply" },
  { id: "general", label: "General enquiry", icon: "message", type: "general" },
];

/** Intent-first contact: the visitor states who they are, the form adapts. Supports ?intent=. */
export function ContactExperience() {
  const [intent, setIntent] = useState<Intent>("customer");
  const type = INTENTS.find((i) => i.id === intent)?.type ?? "sales";

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("intent") as Intent | null;
    if (p && INTENTS.some((i) => i.id === p && i.type)) setIntent(p);
  }, []);

  return (
    <div>
      <p id="intent-label" className="mb-3 text-sm font-semibold text-primary-ink">What brings you here?</p>
      <div role="group" aria-labelledby="intent-label" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {INTENTS.map((i) => {
          const on = i.id === intent;
          const cls = `flex min-h-24 flex-col justify-between gap-3 rounded-lg p-4 text-left text-[0.92rem] font-semibold transition-colors ${on ? "bg-primary text-white" : "bg-white text-primary-ink ring-1 ring-inset ring-border-strong hover:ring-primary"}`;
          return i.href ? (
            <Link key={i.id} href={i.href} className={cls}>
              <Icon name={i.icon} size={20} className="text-accent-strong" />
              <span className="flex items-center justify-between gap-2">{i.label}<Icon name="arrowUpRight" size={15} /></span>
            </Link>
          ) : (
            <button key={i.id} type="button" aria-pressed={on} onClick={() => setIntent(i.id)} className={`${cls} cursor-pointer`}>
              <Icon name={i.icon} size={20} className={on ? "text-accent" : "text-accent-strong"} />
              {i.label}
            </button>
          );
        })}
      </div>
      <div className="mt-10">
        {/* The tiles above already set the enquiry type, so the form does not ask again */}
        <EnquiryForm type={type} showTypePicker={false} />
      </div>
    </div>
  );
}
