"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SITE } from "@/data/site";

/** Runtime error boundary (the static-export equivalent of a 500 page). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="on-dark flex min-h-[80svh] items-center bg-primary-ink text-white">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-40 sm:px-8 lg:px-12">
        <p className="eyebrow text-accent-soft">Something went wrong</p>
        <h1 className="display-lg mt-5 max-w-2xl text-white">We couldn’t load this part of the page.</h1>
        <p className="lede mt-5 max-w-xl text-on-dark-muted">Please try again. If the problem continues, contact us at {SITE.email}.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 cursor-pointer items-center rounded-md bg-white px-6 font-semibold text-primary-ink hover:bg-primary-tint">Try again</button>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-md px-6 font-semibold text-white ring-1 ring-inset ring-white/40 hover:ring-white">Go to home</Link>
        </div>
      </div>
    </section>
  );
}
