# WKND Core Migration — Phase 1 Plan

## Source & Target
- **Source:** `https://wknd.site/us/en.html` (classic WKND — adventure/travel magazine site)
- **Target:** Current EDS project (EMA + Document Authoring, `projectType: da`)
- **Note:** Existing repo assets (`columns-intro`, `columns-article`, `cards-gallery`, `tabs-testimonial`, `cards-article`, `accordion-faq`, `hero-overlay`, plus `about-us` content and the `wknd-trendsetters` importer) were built for a *different* WKND variant. They are treated as **inspect → reuse-or-replace** material, not authoritative.

> **This plan is written for Execute mode.** All steps below are write/execution actions and require switching out of Plan mode to run.

## Preservation Rules (per user)
- **NEVER delete** `index`, `footer`, `nav`. These are **updated in place** to represent WKND — their content is rewritten, but the files remain.
- **`header` is no longer protected** — it may be modified, replaced, or deleted freely like any other file.
- All **other** pages (`t-c`, `about-us`, trendsetters demo content, etc.) may be freely modified, replaced, or deleted.
- **Lighthouse target: every core/representative page must score > 90** (Performance, Accessibility, Best Practices, SEO). Design and block work must actively protect this — no regressions.
- Do **not** delete anything required by EDS, DA, CI, or the build (`scripts/aem.js`, `head.html`, block boilerplate, config).

## Lighthouse > 90 — Guardrails (applied throughout)
- **Performance:** properly sized/responsive images with `width`+`height` (no CLS), lazy-load below-the-fold, eager-load only the LCP hero image, keep `styles.css` lean, defer non-critical work to `delayed.js`, no render-blocking third-party scripts.
- **Accessibility:** real `alt` text on all images, sufficient colour contrast for WKND palette, labelled nav/landmarks, logical heading order, focus-visible states on links/buttons.
- **Best Practices / SEO:** valid metadata (title/description) per page, no console errors, HTTPS asset URLs, canonical + `lang` correct.
- **Verification:** run a Lighthouse/PSI check on homepage + each representative page in preview; treat < 90 as a blocker to fix before marking that item done.

## Scope Boundaries
- Discover and build **representative** pages only — one per template. **No bulk import** in Phase 1.
- Obsolete demo/starter pages (`t-c`, unrelated trendsetters demo content) may be replaced/removed once WKND equivalents exist — but never `index`, `footer`, `nav`.

## Checklist

### 1. Site Scope / Site Catalog (EMA)
- [ ] Run `excat:excat-site-scope` on `https://wknd.site/us/en.html`
- [ ] Discover URLs (sitemap/crawl) and inventory pages, templates, block variants, nav, header, footer, page relationships
- [ ] Generate the Site Scope catalog report (verify report file is written)
- [ ] Identify **every meaningful page template** (expected: Home, Magazine/Article-listing, Article-detail, Adventure/Product-detail, Landing/Generic, plus About/Faqs)

### 2. Design Migration (EMA)
- [ ] Run `excat:excat-complete-design-expert` (site design) against WKND
- [ ] Update `styles/styles.css` + `styles/brand.css` with WKND colours, typography, spacing, backgrounds, container widths, responsive breakpoints
- [ ] Update `styles/fonts.css` for WKND fonts (use `font-display: swap`, subset/preload key fonts to protect LCP)
- [ ] Verify design against rendered preview **and** confirm no Lighthouse Performance/Accessibility regression from styling

### 3. Update Core Site Chrome (explicit — must visibly change)
- [ ] **Update `index` content** to represent WKND home (rewrite content; file preserved — never deleted)
- [ ] **Rebuild `header`** block + content (WKND logo + nav) — header file may be replaced/regenerated freely
- [ ] **Update `nav`** so top-level items point to real migrated pages (Magazine, Adventures, FAQs, About) — file preserved
- [ ] **Update `footer`** block + content with WKND footer links — file preserved
- [ ] Confirm all core chrome is visibly WKND (not boilerplate/trendsetters) in preview

### 4. Handle Existing / Obsolete Content
- [ ] Inventory current content: `index`, `nav`, `footer`, `t-c`, `about-us` + trendsetters blocks/importer
- [ ] Reuse blocks that map cleanly to WKND (adapt CSS/parsers); rename/retire trendsetters-specific ones
- [ ] Remove/replace `t-c` and unrelated demo pages if not part of WKND (`index`, `footer`, `nav` excluded from deletion)
- [ ] Keep anything required by EDS/DA/CI/build

### 5. Representative Page per Template (EMA Page Migration)
- [ ] For **each** discovered template, run `excat:excat-site-migration` on one representative URL
- [ ] Create/fix required **blocks**, **templates**, **parsers**, **transformers** per template
- [ ] Validate each representative page renders (preview) with correct blocks **and passes Lighthouse > 90**

### 6. Magazine + Article Detail
- [ ] Migrate a **Magazine / article-listing** representative page
- [ ] Migrate an **article-detail** representative page
- [ ] Ensure listing cards link to the migrated article-detail page

### 7. Page Structure & Interlinking
- [ ] Create the required page/folder structure for representatives
- [ ] Wire navigation, cards, CTAs, and internal links to **actual migrated pages** (no orphan links)

### 8. Cross-Device, Link & Lighthouse Verification
- [ ] Preview desktop + mobile: header, navigation (menu/megamenu), buttons, links, footer
- [ ] Confirm no important dead clicks or placeholder `#` links on core paths
- [ ] Run Lighthouse/PSI on homepage + each representative page; confirm **all four categories > 90**; fix any that fall short

### 9. Final Verification & Report
- [ ] Verify each Phase-1 completion criterion via **rendered preview** (not file existence)
- [ ] Record Lighthouse scores as evidence
- [ ] Produce PASS / PARTIAL / FAIL / BLOCKED table with evidence
- [ ] List what Phase 2 still needs (bulk import, remaining pages, DA publish, PR link)

## Execution Order (dependency-aware)
1. Site Scope → produces the catalog that drives everything else
2. Design Migration → global styles before page rendering looks right (Lighthouse-safe)
3. Core chrome (`header` rebuilt; `nav`/`footer` updated in place) + `index` → shared across all pages
4. Representative pages per template (incl. Magazine listing + article detail) → blocks/parsers/transformers
5. Interlinking → point nav/cards/CTAs at real pages
6. Cross-device + link + Lighthouse testing → rendered previews
7. Final PASS/PARTIAL/FAIL/BLOCKED report with scores

## Phase 1 Definition of Done (verified via preview)
- [ ] Site Scope report exists
- [ ] Design Migration completed
- [ ] `index`/homepage visibly migrated (file preserved)
- [ ] `header` visibly migrated
- [ ] navigation works (`nav` file preserved)
- [ ] `footer` visibly migrated (file preserved)
- [ ] representative page for every discovered template works
- [ ] Magazine listing + article detail work
- [ ] required blocks/parsers/templates exist
- [ ] representative pages are interconnected
- [ ] obsolete starter content handled appropriately
- [ ] homepage + every representative page score **> 90** on Lighthouse (all four categories)

## Risks / Watch-items
- **Source mismatch:** existing repo is `wknd-trendsetters`; source specified is classic `wknd.site`. Plan migrates classic WKND and retires trendsetters leftovers.
- **Preserved files:** only `index`, `footer`, `nav` are protected from deletion (edited in place). `header` may be freely rebuilt/replaced.
- **Lighthouse discipline:** image sizing, lazy/eager loading, font loading, and console cleanliness must be handled during build, not retrofitted — retrofitting late risks blocking Done.
- Bot-protection on source → use `excat:excat-scrape-webpage` (Bright Data fallback).
- Do not bulk-import (Phase 2). Keep representatives only.
- All content edits go through the bundled import script + `run-bulk-import.js`, never hand-written HTML into the content dir.

---

**Execution requires Execute mode.** On approval I'll start with the Site Scope run on `wknd.site/us/en.html`, then work down the checklist — preserving (never deleting) `index`, `footer`, `nav`, rebuilding `header` freely, and verifying both rendering and Lighthouse > 90 in the live preview before marking each item done.
