/* eslint-disable */
/* global WebImporter */
/**
 * Parser for about-us contributor / guide cards (WKND).
 * Source: https://wknd.site/us/en/about-us.html
 *
 * Each person is a `.cmp-experience-fragment--contributor` fragment:
 *   image + name (h3.cmp-title__text) + role (h5.cmp-title__text)
 *   + three social buttons (a.cmp-button with span.cmp-button__icon--{facebook|twitter|instagram}).
 *
 * The page has TWO groups separated by an <h2>WKND Guides</h2> heading:
 *   - "Our Contributors" (the cards before that heading)
 *   - "WKND Guides"      (the cards after it)
 * Each group becomes its own `cards-article (contributors)` variant block so the
 * grouping headings keep their cards, and per-person social links are preserved.
 *
 * Because the shared cleanup transformer strips .experiencefragment, this parser
 * MUST run before cleanup (it replaces the cards first).
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.cmp-experience-fragment--contributor'));
  if (!cards.length) return;

  // Boundary heading between contributors and guides ("WKND Guides").
  const guidesHeading = Array.from(element.querySelectorAll('h2'))
    .find((h) => /wknd\s+guides/i.test(h.textContent || ''));

  const isAfter = (node, ref) => ref
    && (node.compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_PRECEDING);

  const contributors = [];
  const guides = [];
  cards.forEach((card) => {
    (guidesHeading && isAfter(card, guidesHeading) ? guides : contributors).push(card);
  });

  const PLATFORMS = ['facebook', 'twitter', 'instagram'];

  const buildCell = (card) => {
    const img = card.querySelector('img');
    const name = card.querySelector('h3');
    const role = card.querySelector('h5');

    const imageCell = img || document.createTextNode('');
    const body = [];
    if (name) {
      const h = document.createElement('h3');
      h.textContent = name.textContent.trim();
      body.push(h);
    }
    if (role) {
      const p = document.createElement('p');
      p.textContent = role.textContent.trim();
      body.push(p);
    }

    // Social links: one <a> per platform, preserving the source href.
    const socialLinks = [];
    PLATFORMS.forEach((platform) => {
      const btn = card.querySelector(`.cmp-button__icon--${platform}`);
      const anchor = btn && btn.closest('a');
      if (!anchor) return;
      const a = document.createElement('a');
      a.href = anchor.getAttribute('href') || '#';
      a.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
      a.setAttribute('data-social', platform);
      socialLinks.push(a);
    });
    if (socialLinks.length) {
      const p = document.createElement('p');
      p.className = 'cards-article-social';
      socialLinks.forEach((a) => p.append(a));
      body.push(p);
    }

    return [imageCell, body.length ? body : document.createTextNode('')];
  };

  const insertBlock = (group) => {
    if (!group.length) return;
    const cells = group.map(buildCell);
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-article (contributors)',
      cells,
    });
    group[0].before(block);
    group.forEach((c) => c.remove());
  };

  insertBlock(contributors);
  insertBlock(guides);
}
