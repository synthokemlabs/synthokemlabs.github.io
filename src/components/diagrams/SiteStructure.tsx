import Link from "next/link";
import { CATEGORIES } from "@/data/products";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";

const TREE: { label: string; href: string; icon: IconName; children: { label: string; href: string }[] }[] = [
  { label: "About", href: "/about/", icon: "factory", children: [
    { label: "Company overview", href: "/about/" }, { label: "Chairperson’s message", href: "/about/chairperson/" },
    { label: "Our journey", href: "/about/journey/" }, { label: "Global presence", href: "/about/global-presence/" },
  ] },
  { label: "Products", href: "/products/", icon: "flask", children: [
    { label: "Search all products", href: "/products/" },
    ...CATEGORIES.map((c) => ({ label: c.shortName, href: `/products/${c.slug}/` })),
  ] },
  { label: "Capabilities", href: "/capabilities/", icon: "factory", children: [
    { label: "Specialisation & R&D", href: "/capabilities/" }, { label: "Manufacturing units", href: "/capabilities/manufacturing/" },
  ] },
  { label: "Quality", href: "/quality/", icon: "shield", children: [
    { label: "Quality systems", href: "/quality/" }, { label: "Regulatory affairs", href: "/quality/regulatory-affairs/" },
  ] },
  { label: "Responsibility", href: "/sustainability/", icon: "leaf", children: [
    { label: "Environment", href: "/sustainability/#environment" }, { label: "Community", href: "/sustainability/#community" },
  ] },
  { label: "Work with us", href: "/contact/", icon: "message", children: [
    { label: "Contact", href: "/contact/" }, { label: "Request a quote", href: "/enquiry/" },
    { label: "Careers", href: "/careers/" }, { label: "Resources", href: "/insights/" },
  ] },
];

/** Visual site map: Home → six sections → their pages, with connector lines. */
export function SiteStructure() {
  return (
    <div>
      <Reveal className="flex justify-center">
        <Link href="/" className="lift inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 font-semibold text-white">
          <Icon name="factory" size={18} /> Home
        </Link>
      </Reveal>
      {/* connector from home to branches (desktop) */}
      <div aria-hidden="true" className="mx-auto hidden h-8 w-[2px] bg-border-strong lg:block" />
      <div aria-hidden="true" className="mx-auto hidden h-[2px] bg-border-strong lg:block" style={{ width: "calc(100% - 100% / 6)" }} />
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-0 lg:grid-cols-6 lg:gap-4">
        {TREE.map((b, i) => (
          <Reveal as="li" key={b.label} delay={i * 80} className="relative">
            <span aria-hidden="true" className="mx-auto hidden h-8 w-[2px] bg-border-strong lg:block" />
            <Link href={b.href} className="lift flex items-center justify-center gap-2 rounded-lg bg-primary-tint px-3 py-3 text-center font-semibold text-primary ring-1 ring-primary/15 hover:ring-primary">
              <Icon name={b.icon} size={16} /> {b.label}
            </Link>
            <ul className="ml-4 mt-3 space-y-2 border-l-2 border-border pl-4 lg:ml-0 lg:border-l-0 lg:pl-0">
              {b.children.map((c) => (
                <li key={c.href + c.label} className="relative">
                  <span aria-hidden="true" className="absolute -left-4 top-1/2 h-[2px] w-4 bg-border lg:hidden" />
                  <Link href={c.href} className="flex min-h-10 items-center rounded-lg bg-white px-3 text-[0.88rem] text-text ring-1 ring-border transition-colors hover:text-primary hover:ring-primary lg:justify-center lg:text-center">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
