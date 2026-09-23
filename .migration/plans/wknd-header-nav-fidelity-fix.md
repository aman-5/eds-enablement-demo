# WKND Fidelity Fix Plan — Reference-Driven Rebuild

**Agreed — dropping `sanjanaJat98/eds-site-wknd`.** It's the weaker reference (different block names, different DA content source, only design-portable). We'll focus on the three strong sources:
1. **`github.com/brijeshtewari/eds-capstone`** — primary. Structural twin of our repo (same block names: `carousel-hero`, `cards`, `cards-article`, `columns`, `accordion-faq`, `header`, `footer`, `hero`, `widget`, plus variants). Its block CSS/JS adapts into ours with minimal re-wiring.
2. **PR #20** on that repo — direction to follow: consolidate `cards-promo`/`columns-featured` into base blocks as **CSS class variants**; **self-host Asar + Source Sans Pro** and drop the render-blocking Google Fonts link (deferred `loadFonts()`). Helps fidelity *and* Lighthouse.
3. **`wknd.site/us/en.html`** — live visual ground truth.

**Honest answer restated:** a blind copy still won't "just work" (content source differs, some structures differ), but because `eds-capstone` mirrors our block names, porting block-by-block — their CSS/JS design, our content wiring — is low-risk, and I verify each in preview before moving on. I couldn't reliably read their raw block JS via web fetch (some 404s); in Execute mode I'll clone with `git`/`gh` and read the real files so every change is anchored to their actual code, not guesswork.

## Reference sources (priority order)
1. **Primary repo**: `github.com/brijeshtewari/eds-capstone` (structural twin).
2. **PR #20** on that repo (variant consolidation + self-hosted fonts).
3. **Live visual reference**: `https://wknd.site/us/en.html`.
4. **Our content** (unchanged): our DA source.

*(Removed: `sanjanaJat98/eds-site-wknd`.)*

## Method (per block)
1. Read the matching block's `.js`/`.css` + README in `eds-capstone`; cross-check PR #20 for the variant approach.
2. Compare to `wknd.site` for that section.
3. Port design/behavior into OUR matching block, keeping our content DOM wiring (decorate defensively for omitted/extra cells).
4. Verify in local preview (snapshot/evaluate) at desktop + mobile; screenshot only for final pixel check.
5. Lint; never edit `scripts/aem.js`; no hand-edited content HTML.

## Constraints
- Do not hand-edit content HTML; regenerate via the import script if content must change.
- Never edit `scripts/aem.js`. Scope CSS to the block class.
- Keep Lighthouse > 90; PR must include the `{branch}--{repo}--{owner}.aem.page/{path}` preview link.

## Checklist

### Phase 0 — Reference intake (do first)
- [ ] Clone `brijeshtewari/eds-capstone` locally (read-only scratch dir) for side-by-side reading.
- [ ] Read `eds-capstone` blocks: `header`, `carousel-hero`, `hero`, `cards`, `cards-article`, `columns`, `accordion-faq`, `tabs-*`, `footer` (`.js`/`.css` + READMEs).
- [ ] Review PR #20 diff (cards/columns variant consolidation + `fonts.css`/`head.html` self-hosted fonts).
- [ ] Map their blocks → our blocks; note any structural/row-cell differences.
- [ ] Diff their `styles/styles.css` + brand tokens vs ours; note font/color/spacing gaps.

### Phase 1a — Header (re-audit against eds-capstone)
- [ ] Compare our header.js/.css to their `blocks/header`; reconcile remaining gaps (Sign In, language dropdown, hamburger, sticky, hover, logo) to match their impl + wknd.site.
- [ ] Re-verify desktop + mobile.

### Phase 1b — Homepage carousel/hero
- [ ] Port their `carousel-hero` design/behavior into ours: image with **text overlay** (heading, description, CTA), prev/next arrows, slide dots/tabs — matching wknd.site.
- [ ] Verify transitions, controls, CTA styling.

### Phase 1c — Homepage sections
- [ ] Match Featured Article, Recent Articles cards, Next Adventures teaser, "Where do you want to go?" grid using their `cards`/`columns` (+ `cards-promo`/`columns-featured` variants per PR #20).

### Phase 1d — Footer
- [ ] Port their `footer` design into ours: WKND logo, footer nav, "Follow Us" social icon buttons, divider, full copyright/attribution paragraph.
- [ ] Update footer content via import script only if source text differs.
- [ ] Verify against reference.

### Phase 1e — Homepage validation
- [ ] Full homepage visual comparison vs wknd.site; log remaining diffs.

### Phase 2 — Magazine page
- [ ] Match article image sizes + card layout (their `cards`/`cards-article`).
- [ ] Add members-only lock badge/indicator on gated articles.
- [ ] Verify against reference.

### Phase 3 — Adventures page
- [ ] Replace tabs UI with the reference layout (reference has no tabs for current adventures); if a filter is needed, follow their `tabs-filter`.
- [ ] Match adventures carousel to their `carousel-hero`/`carousel-gallery`.
- [ ] Verify listing + detail layouts.

### Phase 4 — About Us page
- [ ] Rebuild sections/blocks to match reference (remove tabs not present in reference) using their `columns`/`hero`.
- [ ] Verify against reference.

### Phase 5 — FAQs page
- [ ] Match FAQ accordion to their `accordion-faq` design/structure.
- [ ] Verify against reference.

### Phase 6 — Global styling pass
- [ ] Adopt PR #20 approach: **self-host Asar + Source Sans Pro**, drop render-blocking Google Fonts link, load via deferred `loadFonts()`; update `fonts.css`/`head.html`.
- [ ] Reconcile brand colors (accent `#ffea00`), button styles, spacing with their `styles/`.
- [ ] Consolidate any duplicate blocks into class variants where their repo does (per PR #20), if it reduces divergence.
- [ ] Full-site visual comparison vs wknd.site; resolve remaining diffs.

### Phase 7 — Validation & delivery
- [ ] Lint (CSS/JS); confirm no `scripts/aem.js` edits; no hand-edited content HTML.
- [ ] Re-verify Lighthouse > 90 (self-hosted fonts should help).
- [ ] Prepare PR with the required `.aem.page` preview link.

---

**Execution note:** Reference set now narrowed to **`brijeshtewari/eds-capstone` + PR #20 + `wknd.site`** (sanjanaJat98 dropped). I'll start with **Phase 0** — clone `eds-capstone` read-only, read the real block files + PR #20 diff, and build the block-mapping + style/font diff — then re-audit the header and move to the carousel. Cloning and edits require **Execute mode** (plan mode is read-only). Approve / switch to Execute mode and I'll begin.
