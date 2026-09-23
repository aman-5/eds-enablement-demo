# WKND Core Migration — Phase 2 Plan

## Alignment Confirmation
Your Phase 2 and mine are **on the same page**. This plan adopts your 10 steps and final-check list verbatim, layered onto the concrete state Phase 1 left behind. Two scope decisions you made are baked in:
- **Locale scope: `/us/en` only** — import the ~18 remaining `/us/en` pages. Other locales (`/ca/en`, `/de/de`, …) are structural duplicates and are **out of scope** for Phase 2.
- **DA publish + PR: skipped for now** — do all local work; mark **Document Authoring publish**, **da.live preview/publish**, **feature branch + PR**, and **final EDS URL** as **BLOCKED (deferred by user)**. Never fabricated.

## On your trailing-slash idea — agreed, adding it
You're right, and it's a good call. On EDS, `/us/en` is the canonical path and a stray trailing slash (`/us/en/`) 404s — that hurts both UX and SEO (duplicate/lost URLs). I'll add a small, safe **trailing-slash normalizer** early in `scripts.js` (never `aem.js`, which is vendored): if a non-root path ends in `/`, strip it and `location.replace()` to the clean URL so a mistyped/linked trailing slash silently lands on the right page. Guards: never touch the root `/`, preserve query string + hash, run before content loads, avoid redirect loops. Paired with a **canonical `<link>`** per page for the SEO side. Both are folded into the checklist below (Step 1 + Step 7).

> **Execution requires Execute mode.** All steps below are write/execution actions.

## Starting State (from Phase 1 — do NOT redo)
- **Migrated & rendering** under `/content/us/en`: homepage, magazine listing, article detail (arctic-surfing), adventures listing, adventure detail (climbing-new-zealand), faqs. Header/nav/footer are WKND.
- **Infra built:** blocks `carousel-hero` (+ reused columns-intro, cards-article, hero-overlay, accordion-faq); parsers `tools/importer/parsers/wknd-*.js`; transformer `wknd-cleanup.js`; per-template import scripts `tools/importer/import-<template>.js` (+ bundles).
- **Preview quirk:** `aem up` serves local content under the **`/content/`** prefix (`http://localhost:3000/content/us/en`).
- **Known carry-over defects to fix first (Phase 1 PARTIALs):**
  1. `about-us` imported at ~56% (contributor/guide cards not parsed).
  2. Homepage "Where do you want to go?" second adventure-card list renders **text-only** (images not attached).
  3. Article-detail has a duplicate H3 title + empty paragraphs from the content-fragment wrapper.

## Gaps / Deltas vs your list (all reconciled — nothing dropped)
- **Trailing-slash normalization + canonical URLs** — added per your idea (Step 1 + Step 7).
- **Lighthouse target:** your Phase 2 asks for **Perf 100 / A11y 100**. No Lighthouse CLI exists in this environment (confirmed in Phase 1). I'll install/attempt a real run against the local preview; if the CLI can't run, I mark Lighthouse **BLOCKED** with the exact reason and still fix every practical signal it scores (CLS aspect-ratios, alt text, LCP eager, no console errors, metadata, canonical) — I will **not** fabricate a score.
- **Block/Page Critique:** I'll use the `excat:excat-visual-critique` skill against the live WKND source; ~85%+ similarity is the target, findings applied. Real screenshots only.
- **DA/PR:** deferred per your choice (BLOCKED, not attempted).

## Checklist

### 1. Fix Phase 1 PARTIAL/FAIL items first (+ trailing-slash UX)
- [ ] Write an `about-us` parser (contributor + guide cards) → re-import → raise completeness toward ~90%+
- [ ] Fix homepage second adventure-cards list so images attach (parser/selector tweak) → re-import → verify in preview
- [ ] Clean article-detail duplicate H3 + empty paragraphs (parser/transformer) → re-import
- [ ] **Add trailing-slash normalizer in `scripts.js`**: strip a trailing `/` on non-root paths and `location.replace()` to the clean URL (preserve `?query`/`#hash`, skip root, no redirect loop); verify `/us/en/` → `/us/en` and a deep page e.g. `/us/en/magazine/` → `/us/en/magazine`
- [ ] Re-verify each fixed page renders correctly in preview

### 2. EMA Bulk Import (`/us/en` only)
- [ ] Validate a **small set first** (2–3 adventure + 2 magazine URLs) with the existing template bundles; fix any parser/transformer/template issues
- [ ] Bulk-import **all remaining `/us/en` pages**: 14 remaining adventure-detail + 4 remaining article-detail (via `run-bulk-import.js` + each template's URL list from Site Scope)
- [ ] Confirm every imported `content/us/en/**/*.plain.html` exists and reports success/completeness

### 3. Interconnection verification
- [ ] Header/nav links → migrated pages
- [ ] Magazine listing cards → article-detail pages (now all exist)
- [ ] Adventures listing cards → adventure-detail pages (now all exist)
- [ ] Homepage cards/CTAs, contextual links, footer → resolve (no orphans on core paths)
- [ ] Re-run the internal-link audit; every `/us/en/*` link resolves to a migrated page

### 4. Functional testing (looks-right ≠ works)
- [ ] Desktop nav links navigate; hero carousel prev/next/dots work
- [ ] Mobile hamburger opens/closes; menu links navigate
- [ ] FAQ accordion expands/collapses; buttons/CTAs click through
- [ ] Trailing-slash redirect actually fires in the browser (not just logic)
- [ ] Fix any broken interaction found

### 5. EMA Block + Page Critique (vs WKND source, ~85%+)
- [ ] Block critique on key blocks (carousel-hero, cards-article, columns-intro, hero-overlay, accordion-faq)
- [ ] Page critique: homepage, a representative template page, Magazine listing, article detail
- [ ] Apply fixes; record real similarity scores (no fabrication)

### 6. Responsive testing — mobile / tablet / desktop
- [ ] Test 375 / 768 / 1280 widths: overflow, spacing, typography, grids, images, header, footer
- [ ] Fix regressions at each breakpoint

### 7. Lighthouse + SEO (homepage + article detail)
- [ ] Add canonical `<link>` per page (SEO; complements the trailing-slash normalizer)
- [ ] Attempt real Lighthouse run against local preview; target Perf 100 / A11y 100, good LCP/CLS
- [ ] Fix practical issues (image dims/CLS, contrast, metadata, console errors, canonical)
- [ ] If CLI unavailable → mark **BLOCKED** with reason + list verified signals (never fabricate)

### 8. Document Authoring sync/publish — **BLOCKED (deferred by user)**
- [ ] (Deferred) POST content to `admin.da.live`, preview + publish, verify EDS URL — skipped this phase

### 9. Lint
- [ ] Run project lint (ESLint + stylelint); fix failures on touched blocks/scripts/CSS (incl. the `scripts.js` normalizer)
- [ ] Preserve GitHub CI/build/release compatibility (no vendored-file edits, `.hlxignore` respected)

### 10. Ship — **BLOCKED (deferred by user)**
- [ ] (Deferred) Feature branch → commits → GitHub PR (never commit to main) — skipped this phase

### 11. Final report
- [ ] Produce the exact `| Requirement | PASS/PARTIAL/FAIL/BLOCKED | Evidence |` table
- [ ] Provide: Pages discovered/migrated · Critique results · Lighthouse results · DA/EDS URL · Branch · PR · Unresolved items

## Execution Order
1. Fix Phase-1 PARTIALs + trailing-slash normalizer → clean base
2. Small-set import validation → fix infra → full `/us/en` bulk import
3. Interconnection + functional testing
4. Block/Page critique → apply fixes
5. Responsive (mobile/tablet/desktop) fixes
6. Lighthouse + SEO (canonical) — attempt real; else BLOCKED + practical fixes
7. Lint
8. Final report (DA publish + PR reported BLOCKED/deferred)

## Final Check (your list — status intent)
- [ ] all applicable `/us/en` pages imported
- [ ] index/home correct
- [ ] header/nav correct and functional
- [ ] footer correct and functional
- [ ] Magazine + article pages present
- [ ] pages correctly interlinked
- [ ] no important dead clicks
- [ ] trailing-slash URLs normalize to canonical (bonus UX/SEO, per your request)
- [ ] Block/Page Critique completed and fixes applied
- [ ] ~85%+ visual similarity targeted
- [ ] mobile/tablet/desktop verified
- [ ] Lighthouse tested (or BLOCKED with reason)
- [ ] content in Document Authoring — **BLOCKED (deferred)**
- [ ] da.live preview/publish verified — **BLOCKED (deferred)**
- [ ] lint passes
- [ ] feature branch + PR created — **BLOCKED (deferred)**
- [ ] final EDS URL works — **BLOCKED (deferred, depends on DA publish)**

## Risks / Watch-items
- **Trailing-slash redirect safety:** must skip root `/`, preserve query/hash, and avoid redirect loops; test on a deep path, not just `/us/en`. Note the local `/content/` prefix when verifying, but the rule targets production-style paths.
- **Locale scope fixed to `/us/en`** — other locales intentionally excluded.
- **No hand-written content** — all content changes go through import scripts + `run-bulk-import.js`; `content/` deletion is blocked by policy (regenerate instead).
- **Lighthouse CLI likely absent** — will attempt; BLOCKED-with-reason if it can't run, never faked.
- **DA + PR need credential opt-ins** — deferred by user; will not attempt this phase.
- **Don't regress Phase 1** — reuse working blocks/parsers; only touch what a fix requires. Respect the intentional lint-normalized CSS already in `styles.css` / `brand.css` / `carousel-hero.css`.

---

**No gaps between your Phase 2 and mine.** Differences are only the choices you made: `/us/en` only, DA-publish + PR deferred (reported BLOCKED), plus your trailing-slash normalization idea now folded in as a first-class task. On approval in Execute mode, I'll start by fixing the Phase-1 PARTIALs and adding the trailing-slash redirect, then validate a small import set before the full `/us/en` bulk import, and work down to the final PASS/PARTIAL/FAIL/BLOCKED table.
