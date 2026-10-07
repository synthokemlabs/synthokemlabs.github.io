import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
import { Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/data/site";

/**
 * Template for legal pages. Content is a DRAFT STRUCTURE only and must be
 * replaced with wording approved by Synthokem's legal counsel before launch.
 */
export function LegalPage({ title, path, sections, intro }: { title: string; path: string; intro: ReactNode; sections: { h: string; body: ReactNode }[] }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} crumbs={[{ name: title, href: path }]} size="sm" />
      <section className="py-16 lg:py-24">
        <Container className="max-w-3xl">
          <div role="note" className="flex gap-3 rounded-lg bg-[#fbf1df] p-5 text-[0.92rem] text-warning ring-1 ring-warning/30">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
            <p><strong>Draft — pending legal review.</strong> This page outlines the intended structure only. Final wording must be approved by {SITE.legalName} before publication.</p>
          </div>
          <div className="mt-10 text-[1.02rem] leading-relaxed text-text">{intro}</div>
          {sections.map((s, i) => (
            <section key={s.h} className="mt-10 border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-primary-ink"><span className="mr-3 font-mono text-sm text-accent-strong">{String(i + 1).padStart(2, "0")}</span>{s.h}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted">{s.body}</div>
            </section>
          ))}
          <p className="mt-12 border-t border-border pt-8 text-sm text-muted">Questions about this page? Contact <a className="font-semibold text-primary underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </Container>
      </section>
    </>
  );
}
