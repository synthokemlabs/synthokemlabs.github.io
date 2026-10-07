import Link from "next/link";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Page not found", robots: { index: false } };

const LINKS = [
  { href: "/products/", label: "Product catalogue" },
  { href: "/about/", label: "About Synthokem" },
  { href: "/quality/", label: "Quality systems" },
  { href: "/contact/", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="on-dark relative isolate flex min-h-[90svh] items-center overflow-hidden bg-primary-ink text-white">
      <div aria-hidden="true" className="grid-paper-dark absolute inset-0 -z-10" />
      <Container className="py-40">
        <p className="eyebrow text-accent-soft">Error 404</p>
        <h1 className="display-xl mt-5 max-w-3xl text-white">This page didn’t make it through synthesis.</h1>
        <p className="lede mt-6 max-w-xl text-on-dark-muted">The page you’re looking for may have moved as part of our new website. Try one of these instead, or search for a product.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="light">Back to home</ButtonLink>
          <ButtonLink href="/products/" variant="outline-light" icon="search">Search products</ButtonLink>
        </div>
        <ul className="mt-14 grid grid-cols-1 max-w-3xl gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2">
          {LINKS.map((l) => (
            <li key={l.href}><Link href={l.href} className="group flex min-h-14 items-center justify-between bg-primary-ink px-5 hover:bg-primary-dark">{l.label}<Icon name="arrowRight" size={16} className="arrow-nudge text-accent" /></Link></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
