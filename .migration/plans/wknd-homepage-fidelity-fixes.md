# WKND Homepage Fidelity Fixes — Full Plan

## Source of truth
- **Replicate:** `https://wknd.site/us/en.html`
- **Live (yours):** `https://main--eds-enablement-demo--aman-5.aem.live/us/en`
- **Local preview:** `http://localhost:3000/content/us/en`
- All prior code is on branch `aem-20260923-1430`. **Execution requires Execute mode.** Content via import scripts only; styling/behavior via block CSS/JS.

## Complete difference list (measured from both live DOMs)

### A. Header / Navigation
| # | Element | Source (wknd.site) | Live (yours) | Fix |
|---|---------|--------------------|--------------|-----|
| A1 | Header rows | **Two rows**: dark utility bar (`#202020`) with SIGN IN + EN-US, then white main bar | Single white row only | Add dark utility top bar |
| A2 | Nav link size | **14px** | 16px | Set 14px |
| A3 | Nav link case | **UPPERCASE** | mixed-case ("Magazine") | `text-transform: uppercase` |
| A4 | Nav link weight | 400 | 500 | Set 400 |
| A5 | Nav link box | padded `15px 17px`, 48px tall | 0 padding, 20px tall | Add padding, full-height hit area |
| A6 | **Nav hover** | **whole item bg → yellow `#ffea00`** | no hover style | Add yellow-bg hover/focus on nav links |
| A7 | Search box | present (placeholder "Search") | **missing** | Add search in header (built in header.js) |
| A8 | Logo | "WKND" wordmark image, 128×48 | text "WKND" | Acceptable as text, but size/weight to match |

### B. Hero carousel
| # | Element | Source | Live | Fix |
|---|---------|--------|------|-----|
| B1 | Layout | image **on top**, white content **bar below** (relative), left-aligned | translucent box **overlaid, centered** on image | Rebuild to image-top + bar-below |
| B2 | Autoplay | auto-advances (`data-cmp-delay`) | none | Add autoplay **10s** (your instruction), pause on hover/focus, respect reduced-motion |
| B3 | Content bg | white bar | translucent white overlay | Solid bar, left-aligned |
| B4 | Heading | Asar 36px `#202020` | verify | Match |

### C. Buttons / CTAs (biggest "button size & color" issue)
| # | Element | Source | Live | Fix |
|---|---------|--------|------|-----|
| C1 | Primary button border | **none** (`0px`), height **49px** | **2px solid** border → height **54px** (too tall/chunky) | Remove border (or make transparent), match 49px |
| C2 | Button weight | 600 | 600 ✓ | OK |
| C3 | Button padding | `14px 35px` ✓ | `14px 35px` ✓ | OK (border adds the 5px) |
| C4 | **"All Articles" / "All Trips"** | **yellow button** (146px, weight 600, uppercase, padded) | **plain text link** (70px, weight 400, mixed-case) | Style these as buttons (they lost button treatment) |
| C5 | Button hover | (verify) darken | `#ffd400` | Confirm matches source hover |

### D. Cards (Recent Articles / adventures)
| # | Element | Source | Live | Fix |
|---|---------|--------|------|-----|
| D1 | Card title color | **blue `#0045ff`** link | dark `#202020` | Match blue link color |
| D2 | Card title case | none (normal) | **UPPERCASE** | Remove uppercase |
| D3 | Card title weight | 400 | 700 | Set 400 |
| D4 | Card CTA hover | CTA → yellow on card hover | (verify) | Add card-hover state |

### E. Featured article
| # | Element | Source | Live | Fix |
|---|---------|--------|------|-----|
| E1 | Layout | image **LEFT** / text **RIGHT** | **mirrored** (image right) | Un-mirror (featured context only) |
| E2 | Content bg | grey `#ebebeb` | verify | Match grey |

### F. Footer / other
| # | Element | Source | Live | Fix |
|---|---------|--------|------|-----|
| F1 | Footer | dark, footer nav underline-on-hover | dark ✓ (fixed earlier) | Verify hover states |
| F2 | Live 404 | a resource 404s in console on live | — | Investigate + fix console error |

## Checklist

### 1. Buttons / CTAs (styles/styles.css)
- [ ] Remove the 2px border on default/primary buttons so height = 49px (not 54px); keep yellow `#ffea00`, weight 600, uppercase, `14px 35px`, square
- [ ] Confirm hover matches source (darken to `#ffd400` or source's actual hover)
- [ ] Restore button treatment for "All Articles" / "All Trips" / "See more" (currently plain text links) — yellow button, 600, uppercase

### 2. Navigation states (blocks/header/header.css)
- [ ] Nav links: 14px, uppercase, weight 400, padded (`~15px 17px`), full-height
- [ ] **Hover/focus → yellow `#ffea00` background** on the nav item (the behavior you flagged)
- [ ] Verify mobile nav hover/active parity

### 3. Header two-row + search (blocks/header/)
- [ ] Add dark utility bar (`#202020`) with SIGN IN + EN-US region, light text, right-aligned
- [ ] Main white bar: logo left, nav, search right
- [ ] Add search box (placeholder "Search") built in header.js; basic working submit
- [ ] Keep mobile hamburger + `/content/`→`/nav` dual-fetch working

### 4. Hero carousel rebuild + autoplay (blocks/carousel-hero/)
- [ ] Layout: full-bleed image on top, white content bar below, left-aligned heading/desc/CTA
- [ ] Autoplay every **10s**; pause on hover/focus; respect `prefers-reduced-motion`; manual controls reset timer
- [ ] Arrows bottom-right, dots bottom-center; no CLS

### 5. Cards typography (blocks/cards-article/cards-article.css)
- [ ] Card title: blue `#0045ff`, weight 400, normal case (remove uppercase/700)
- [ ] Card-hover → CTA/link yellow (match source)

### 6. Featured article un-mirror (columns-intro featured context)
- [ ] Image LEFT / text RIGHT; grey `#ebebeb` content bg — featured context only (don't flip magazine/adventures intros)

### 7. Full-page re-scan + live console 404
- [ ] Diff remaining areas (spacing, section rules/dividers, "Next Adventures" hero, image crops)
- [ ] Trace and fix the resource 404 seen in the live console
- [ ] Fix any additional concrete deltas found

### 8. Verify + gates + report
- [ ] Verify all fixes at `http://localhost:3000/content/us/en` vs source (screenshots)
- [ ] Desktop/tablet/mobile; carousel autoplay+pause; nav hover; buttons — all functional
- [ ] Lighthouse homepage ≥ 90 Perf/A11y (no regression); `lint:js` + `lint:css` pass
- [ ] Report every item above Fixed/Partial with before→after evidence

## Decisions baked in
- **Autoplay = 10s** (your instruction; source is faster — I follow your ask).
- **Card title blue `#0045ff`** to match source exactly (even though it's an unusual link color).
- Scope = homepage + shared chrome/blocks; shared-block changes (buttons, cards, nav) will also improve inner pages — intended.

## Risks / watch-items
- Button border removal + "All Articles" re-buttoning are **global** (styles.css) — will affect every page's buttons/links; that's correct (matches source) but I'll spot-check inner pages.
- `columns-intro` is shared — un-mirror must be scoped to the featured/homepage context.
- Search + utility bar are net-new header markup — must not break hamburger or dual-fetch.
- Autoplay timers must not leak on re-decorate.

---

**Execution requires Execute mode.** These are all the differences I found across header, nav (incl. hover), buttons (size/border/color + missing button treatment), hero carousel (layout + autoplay), cards (color/case/weight), and the featured article. On approval I'll fix them in that order and verify each against the source with before→after evidence, plus run Lighthouse and lint.
