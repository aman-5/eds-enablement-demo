## Summary

Brings `main--eds-enablement-demo--aman-5` into visual and structural parity with the live WKND reference (`https://wknd.site/us/en.html`), rebuilt block-by-block against the structural-twin reference repo [`brijeshtewari/eds-capstone`](https://github.com/brijeshtewari/eds-capstone) (incl. its PR #20 direction) and verified in local preview at desktop + mobile.

## Preview

- Home: https://wknd-fidelity-header-carousel-footer-pages--eds-enablement-demo--aman-5.aem.page/us/en
- Magazine: https://wknd-fidelity-header-carousel-footer-pages--eds-enablement-demo--aman-5.aem.page/us/en/magazine
- Adventures: https://wknd-fidelity-header-carousel-footer-pages--eds-enablement-demo--aman-5.aem.page/us/en/adventures
- FAQs: https://wknd-fidelity-header-carousel-footer-pages--eds-enablement-demo--aman-5.aem.page/us/en/faqs
- About Us: https://wknd-fidelity-header-carousel-footer-pages--eds-enablement-demo--aman-5.aem.page/us/en/about-us

## What changed

### Header / navigation (`blocks/header`)
- Rebuilt to the WKND **two-row structure**: a **dark utility bar** (Sign In + US flag + `EN-US` locale toggle, right-aligned) above a **white nav bar** (WKND logo left; nav links + search right). Previously these were incorrectly merged into one row.
- **Language selector** dropdown: grouped country → locale panel (US, Canada, Switzerland, Germany, France, Spain, Italy); caret flips on open; closes on outside-click / Escape.
- **US flag** rendered via URL-encoded inline SVG (fixes a raw-attribute text leak).
- WKND **logo image** (SVG) for the brand; sticky/fixed header; yellow hover on desktop nav links; left-sliding hamburger drawer on mobile (3-line icon, no ✕ morph).

### Homepage carousel (`blocks/carousel-hero`)
- Matches wknd.site: fixed-height photo with a **white content box overlapping the photo's lower edge**, centered dot indicators, and dark chevron prev/next arrows in the bottom strip (previously text stacked below the image).

### Footer (`blocks/footer`)
- Structured into brand + nav / "Follow Us" social / legal on the dark WKND bar.
- Content regenerated via `import-footer` to include the full attribution copy with Core Components / Archetype / site-source / tutorial / Adobe Stock links.

### Magazine (`blocks/cards-article`, `blocks/columns-intro`)
- Adopted the WKND-extracted `cards-article` design (uppercase `#202020` titles, 260×200 images, truncated descriptions), replacing an incorrect variant carried over from another site.
- **Members Only** teasers now show a padlock badge + dark overlay on the image (targeted so the Featured Article is unaffected).

### Adventures (`tools/importer/import-adventures-listing`)
- Importer now drops the duplicate per-category tab card lists, so only the intro + single "Current Adventures" grid renders (removes the stray `<ul>` groupings previously dumped below the grid). Content regenerated.

### FAQs (`blocks/accordion-faq`)
- Adopted the WKND simple bordered-row accordion with a +/− affordance.

### Global styling (`styles/`, `head.html`, `fonts/`)
- **Self-hosted** Asar + Source Sans Pro (woff2); removed the render-blocking Google Fonts `<link>`; fonts load via deferred `loadFonts()` (Lighthouse improvement).
- Content column aligned to the reference: `--content-max-width: 1136px`, `--nav-height: 193px` (two-row header) — gives proper left/right side margins across all blocks.

## Verification
- CSS + JS lint pass; `scripts/aem.js` untouched.
- No hand-edited content HTML — footer and adventures content regenerated through the import scripts.
- Verified in local preview at desktop (1440) and mobile (600) widths against wknd.site.

## Notes
- Real WKND uses social **icon images** in the footer; our content currently uses text links (footer CSS already renders icon tiles if images are present) — a content-only follow-up.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
