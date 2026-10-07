# Synthokem Labs — website

Redesign of synthokemlabs.com as a static Next.js 16 + TypeScript + Tailwind CSS v4 site.
All content was taken from the previous website and the company's *Product List 2026* PDF. No claims, numbers or certifications were invented.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out (upload to any static host)
```

## 1. Audit of the previous site (summary)

| Area | Finding |
|---|---|
| Pages | 5 pages (`index`, `about`, `our_products`, `our_assurance`, `social_responsibility`, `contact`); everything else was an anchor on those pages. "Our Products" in the nav linked straight to a PDF. |
| SEO | **`robots.txt` was `Disallow: /`, which blocked all search engines.** Page titles were generic ("Home"), there were no meta descriptions, no sitemap, no structured data, and stale WordPress generator tags. |
| Content | Lorem-ipsum text was still live on the products page. The "Awards & Accolades" section was empty, and the careers vacancy table had headings but no rows. |
| Products | The website table listed 13 APIs and 3 intermediates. The *Product List 2026* PDF has 40 products in 7 lists. Neither source had search, filters or product pages. |
| Data in images | Manufacturing specs and certificate logos existed only as images. Chemical structures were images with no alt text. |
| Copyright | The footer read "© 2019". |
| UX/a11y | There was no skip link and many images had empty `alt`. The page used a 0% preloader, carousel-heavy layouts and a template-style WPBakery structure. |

## 2. Information architecture

```
/                                   Home
/about/                             Overview · Philosophy · Vision & mission · Leadership teaser
/about/chairperson/                 Chairperson's message (verbatim)
/about/journey/                     Filterable timeline (27 dated milestones)
/about/global-presence/             Interactive map, 40 countries / 4 regions
/products/                          Searchable catalogue (name, CAS, therapy, API used in)
/products/{category}/               apis · intermediates · fine-chemicals · excipients · metal-scavengers
/products/{category}/{slug}/        46 product pages (spec sheet, structure, docs, related)
/capabilities/                      Pillars · Areas of specialisation · Development
/capabilities/manufacturing/        Process story · Units I–III · Gallery · Safety
/quality/                           QC · QA · Commitment · Approvals · Documents
/quality/regulatory-affairs/        Approvals · Regulatory status by product · Filing history
/sustainability/                    Environment · Community
/insights/                          Resources + news (data-driven, currently empty)
/careers/                           Life at Synthokem · Areas · Openings · Resume form
/contact/                           Intent-based enquiry · addresses · click-to-load map
/enquiry/                           RFQ / product enquiry (prefills from ?product=&topic=)
/privacy/ /terms/ /cookies/ /disclaimer/   DRAFT — legal review required (noindex)
/sitemap/  /sitemap.xml  /robots.txt  404
```

Legacy URLs (`about.html`, `our_products.html`, …) redirect via `public/_redirects` (Netlify/Cloudflare format) and HTML refresh stubs.

## 3. Content model — edit these files, not the components

| File | Contains |
|---|---|
| `src/data/products.ts` | Categories and every product (CAS, grades, therapy, used-in, regulatory status, structure image). Adding an entry creates its page, search entry, filters, sitemap URL and enquiry option. |
| `src/data/company.ts` | Journey milestones, approvals, facilities, specialisations, countries, editorial copy, `NEWS[]`, `OPENINGS[]` |
| `src/data/site.ts` | Contact details, addresses, map embed, hours |
| `src/data/navigation.ts` | Mega-menu and footer structure |

## 4. Enquiry forms — integration point

Forms work without a backend. With no endpoint set, they **do not pretend to send anything**: they prepare a pre-filled email to info@synthokemlabs.com and say so. To deliver submissions directly, set an endpoint at build time:

```bash
NEXT_PUBLIC_ENQUIRY_ENDPOINT=https://your-crm-or-function/enquiries npm run build
```

The endpoint receives `multipart/form-data`, including any attachment. See `src/lib/enquiry.ts`.

## 5. Items for the company to review before launch

1. **Timolol Maleate:** the PDF gives CAS `68890-66-4`, which belongs to a different substance. The CAS is withheld on the site until it is confirmed.
2. **Epoxirane (Oxirane):** CAS `75-21-8` is ethylene oxide. Confirm the intended Ranolazine intermediate and its CAS.
3. **Calcium Glycerophosphate** and **Tetrahydro-1-(2-furoyl) piperazine** appear on the old website but not in the 2026 list. Confirm they are still available.
4. **Calcium Polycarbophil / Maropitant Citrate:** the listed CAS numbers match the parent compounds. Confirm the salt forms.
5. **Unit I address:** it wasn't published on the old site, so the page currently says "available on request".
6. **Chairperson portrait:** none was available, so a monogram is used for now.
7. **Name spellings standardised:** Bisbentamin → Bisbentiamine, Pivolyl → Pivaloyl, Veratrol (kept), Frideral Crafts → Friedel–Crafts, Drazens → Darzens. The original spellings are kept as search synonyms.
8. **Legal pages** are structured drafts and need approved wording.
9. **Photography:** the facility aerial and several lab photos are low-resolution originals. Replace them with new professional shoots when available. `lab-precision` and `csr-environment` look like stock images.
10. **Regulator logos** (USFDA, WHO, EDQM, KFDA) are deliberately **not** used. Agencies restrict use of their marks, so approvals are shown as typography instead.

## 6. Chemical structures

Synthokem's old site had structure images for 16 products, as low-resolution rasters. The new site shows structures for **38 of 46 products**:

- **34 crisp SVG structures** rendered with RDKit from PubChem records. Each record was matched by the **CAS number in Product List 2026**, or by product name where the CAS lookup failed (Potassium Guaiacol Sulphonate, Drotaverine/Prazosin/Terazosin HCl, Mebeverine HCl 3D model).
- **4 original company drawings** are kept where no reliable record exists: Calcium Polycarbophil, Silica Thiol, Calcium Glycerophosphate and Tetrahydro-1-(2-furoyl) piperazine.
- Products with a `reviewNote` (uncertain CAS) and silica-supported scavengers are deliberately excluded. The cyclodextrins have no reliable record, and a few large or salt records have no 3D model.
- **Formula, molecular weight and IUPAC name** are shown only for CAS-matched records, each with a link to its PubChem CID. Name-matched records show the structure only, with waters of hydration removed.
- **3D models** are PubChem 3D conformers, rendered by a dependency-free canvas viewer (`Molecule3D`). For salts, the parent molecule is shown and labelled as such.

To regenerate after adding products:

```bash
node scripts/fetch-structures.mjs        # PubChem lookups by CAS → src/data/structures.json
node scripts/fetch-structures-extra.mjs  # name-based fallbacks
node scripts/render-structures.mjs       # RDKit → public/structures/svg/*.svg + structure-index.ts
```

**Company review:** please confirm that every structure matches the material you supply, especially salt and hydrate forms.

## 7. Design system

- **Palette (v3, "Synthokem Blue"):** a tonal system built from the logo blue `#3FA8EE`: deep navy `--primary #0D3B66`, darkest navy `--primary-ink #071B30`, `--accent-strong #0F69B4` for blue text on white (5.7:1), teal `--secondary #0A7682`, and a navy→blue→teal brand gradient. Neutrals are cool blue-greys. Every text pair meets WCAG AA. Dark sections are limited to the hero, the value chain and the footer; everything else is light.
- **Type:** Manrope for display, Inter for body text and labels; JetBrains Mono only for CAS numbers and data.
- **Diagrams** (`src/components/diagrams/`):
  - Portfolio map (hub → five categories; connectors draw in once)
  - Value chain (scroll-driven, with a pinned circular diagram)
  - Quality layers (concentric system)
  - Values (three spheres)
  - Facilities network (hub and spoke)
  - Visual site structure (`/sitemap/`)
  - "Start here" numbered quick links
- **Chemistry graphics:**
  - Line-drawn rotating 3D molecules in the home and product heroes; drag-to-rotate and a 2D/3D toggle on product pages
  - 2D structures that draw themselves bond by bond
  - Pinned horizontal gallery of commercial molecules on the home page (a swipe rail on phones and short screens)
  - Structure thumbnails in the catalogue, search results and regulatory table
- **Motion (v5):** restrained and purposeful. No glows, light fields, shimmering text, beams, pulsing rings, marquees, cursor spotlights or tilt.
  - **Page transitions:** React `<ViewTransition>` (in `app/template.tsx`) over the browser View Transitions API. The old page fades up and away and the new one rises in; the header stays fixed. Product names morph from a catalogue, gallery or related card into the product page title.
  - **Figures:** odometer-style digits roll into place (`Counter`).
  - **Statement:** the home-page statement lights up word by word as it scrolls past (`ScrollStatement`).
  - **"Start here":** a framed photo previews the hovered or focused row and drifts slightly with the pointer.
  - **Catalogue:** cards glide to their new slots when filters, search or sort change (FLIP, Web Animations API).
  - **Micro-interactions:** button labels roll on hover; a soft pill slides between header items; section rules draw in from the left; photos open with a curtain reveal; link underlines draw in.
  - **Scroll-linked:** Lenis inertial scrolling on desktop, the pinned molecule gallery, the value-chain ring, clamped image parallax, and the hero molecule leaning gently toward the pointer.
  - **Feedback:** a thin route progress bar at the top of the window while a page loads.

  Everything respects `prefers-reduced-motion` (figures show final values, the statement is fully lit, transitions are instant), and no content waits on an animation that might not run.
- **Usability:**
  - Product pages show a sticky bar with the product name, CAS number and a product-specific enquiry button once the hero scrolls away.
  - The phone "Enquire" button pre-selects the product being viewed.
  - Press "/" to jump to catalogue search, or Ctrl/⌘ + K for site search.
  - Header menus work with the keyboard, and Escape closes menus.
  - "On this page" links land below the sticky bars.
  - Form errors clear as they are fixed.
- **Navigation:** three compact dropdowns (About, Products, Capabilities) plus Sustainability, Careers and Contact. Long pages have a sticky "On this page" bar that highlights the current section.
