Let me analyze the reference site's Sign In / language behavior and the mobile hamburger, plus verify the desktop hover on my current build.Let me click the language toggle to see the language list and Sign In behavior on the reference.Now let me inspect my current build — the desktop hover on nav links, the hamburger close icon, and any logo overlap.Let me check my current build's desktop hover behavior and the hamburger/logo layout.# WKND Fidelity Fix Plan

Goal: bring `main--eds-enablement-demo--aman-5.aem.live/us/en` and its sub-pages into visual and structural parity with the reference site `wknd.site/us/en.html`. **Homepage-first**, then remaining pages. **Active task: Phase 1a-2 — Header refinements (Sign In + language selector + mobile hamburger).**

## Reference targets (confirmed from wknd.site)
- **Header top-right area**: a light **`en-US` language toggle** that, when clicked, opens a **country/locale dropdown** — United States (en-US, es-US), Canada (en-CA, fr-CA), Switzerland (de-CH, fr-CH, it-CH), Germany (de-DE), France (fr-FR), Spain (es-ES), Italy (it-IT) — plus a **"Sign In" link** shown beside the language toggle. This is a light element, **not** the old dark bar.
- **Header main bar**: WKND **logo** left; nav links (Magazine, Adventures, FAQs, About Us) + search grouped right; pinned/sticky on scroll.
- **Desktop nav hover**: nav links get the WKND **yellow background** on hover/focus.
- **Mobile hamburger**: opens a **dark left-sliding drawer**; the trigger icon should **stay as a hamburger (3 lines), not morph into an ✕**; logo/top-bar elements must **not overlap** the drawer or each other.
- **Footer**: WKND logo, footer nav, "Follow Us" social icon buttons, divider, full fictitious-site copyright paragraph with source-code links.
- **Homepage carousel**: text-overlay hero slides with prev/next arrows and slide tabs.
- **Magazine**: larger article imagery; members-only articles show a lock badge.
- **Adventures / About Us / FAQs**: layouts that match reference (no tabs where reference doesn't use them).

## Decisions (confirmed with user)
- **Header top bar** → No dark bar. Light header. Now also: restore a light **Sign In** link beside the language toggle, and add the **full multi-locale language dropdown** matching reference.
- **Priority** → Homepage first, header being fully finished before carousel.

## Evidence gathered (latest inspection)
- **Sign In missing**: reference shows a "Sign In" link beside the language toggle; my current build dropped it entirely when removing the dark bar. → restore as a light link.
- **Language support missing**: reference `en-US` toggle expands a grouped country→locale dropdown (7 countries, 11 locales); my build shows only static `en-US` text with no dropdown. → build the locale dropdown.
- **Mobile hamburger**: default EDS behavior morphs the hamburger into an ✕ and can overlap the logo when the dark drawer is open; reference keeps a hamburger-style trigger and no overlap. → keep 3-line icon (no cross), fix overlap/stacking.
- **Desktop hover**: nav links have no submenus (`numDropdowns: 0`); yellow-background hover rule is present — needs a live hover verification.
- **Logo/layout confirmed good**: logo left (x=120), links grouped right (first link x≈716), search far right — matches reference.

## Constraints
- Do not hand-edit content HTML under the content directory; regenerate via the import script if content changes are needed.
- Never edit `scripts/aem.js`. Scope CSS to `.header`/`.blockname`.
- Keep Lighthouse > 90; every PR must include the `{branch}--{repo}--{owner}.aem.page/{path}` preview link.
- Verify each fix in the preview (snapshot/evaluate) before moving on; screenshots only for final pixel checks.

## Checklist

### Phase 1a — Header / Navigation (DONE)
- [x] Remove the invented dark **"Sign In" utility bar** from `blocks/header/header.js`.
- [x] Add a light **`en-US` language toggle**.
- [x] Fix nav layout so logo is **left**, menu links + search grouped **right**.
- [x] Build the tools/search container unconditionally (search box now renders).
- [x] Make the header **sticky/fixed** on scroll (desktop + mobile).
- [x] Use the WKND **logo image** (SVG) for the brand instead of text "WKND".
- [x] Rebuild the **search box** as a light-grey filled pill with magnifier icon.
- [x] Rebuild the **mobile menu** as a dark left-sliding drawer.

### Phase 1a-2 — Header refinements ← START HERE
- [ ] **Restore "Sign In"** as a light link beside the language toggle (top-right), matching reference (not a dark bar).
- [ ] **Add the language selector dropdown**: `en-US` toggle expands a grouped country→locale list (US, Canada, Switzerland, Germany, France, Spain, Italy) with the reference locales/URLs; close on outside-click/escape; keyboard accessible.
- [ ] **Fix the mobile hamburger**: keep it a **3-line hamburger icon (no ✕/cross morph)** when the drawer opens; ensure the trigger toggles the drawer open/closed correctly (back-and-forth).
- [ ] **Fix mobile overlap**: ensure the WKND logo and top-bar controls don't overlap the drawer or each other when open (correct stacking / drawer offset).
- [ ] **Verify desktop hover**: confirm Magazine/Adventures/FAQs/About Us show the yellow-background hover/focus state on desktop; adjust if the hover target/padding is off.
- [ ] Re-verify header at mobile (<900px) and desktop (≥900px); lint JS/CSS.

### Phase 1b — Homepage carousel/hero
- [ ] Rework `carousel-hero` to match reference: image with **text overlay** (heading, description, CTA), prev/next arrows, and slide tabs styled per reference.
- [ ] Verify slide transitions, controls, and CTA button styling.

### Phase 1c — Homepage sections
- [ ] Match Featured Article, Recent Articles cards, Next Adventures teaser, and "Where do you want to go?" grid to reference (image sizes, spacing, CTA buttons, dividers).

### Phase 1d — Footer
- [ ] Match footer **layout, styling, and text** to reference: WKND logo, footer nav, "Follow Us" social icon buttons, divider, and full copyright/attribution paragraph with links.
- [ ] Update footer content via the import script if the source text differs (no hand-edited HTML).
- [ ] Verify footer against reference.

### Phase 1e — Homepage validation
- [ ] Full homepage visual comparison against wknd.site; log remaining diffs.

### Phase 2 — Magazine page
- [ ] Match article **image sizes** and card layout to reference.
- [ ] Add the **members-only lock badge/indicator** to gated articles.
- [ ] Verify against reference.

### Phase 3 — Adventures page
- [ ] Replace the **tabs** UI with the reference layout (reference does not use tabs for current adventures).
- [ ] Match the adventures **carousel** styling to reference.
- [ ] Verify listing and detail layouts against reference.

### Phase 4 — About Us page
- [ ] Rebuild sections/blocks to match reference layout and styling (remove any tabs not present in reference).
- [ ] Verify against reference.

### Phase 5 — FAQs page
- [ ] Match FAQ (accordion) styling and structure to reference.
- [ ] Verify against reference.

### Phase 6 — Global styling pass
- [ ] Confirm brand fonts (Asar headings, Source Sans Pro body), colors (yellow accent `#ffea00`), and button styles across all pages.
- [ ] Run a full-site visual comparison against wknd.site and resolve remaining diffs.

### Phase 7 — Validation & delivery
- [ ] Lint (CSS/JS) and confirm no `scripts/aem.js` edits.
- [ ] Re-verify Lighthouse > 90.
- [ ] Prepare PR with the required `.aem.page` preview link.

---

**Execution note:** Next I'll implement **Phase 1a-2** — restore the light **Sign In** link, add the **multi-locale language dropdown**, fix the **mobile hamburger** (keep 3 lines, no ✕, correct toggle) and its **overlap**, and confirm the **desktop yellow hover**. Applying these edits requires **Execute mode** (plan mode is read-only). Approve / switch to Execute mode and I'll proceed.
