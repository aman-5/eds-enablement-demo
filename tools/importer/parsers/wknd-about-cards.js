/* eslint-disable */
/* global WebImporter */
/**
 * Parser for about-us contributor / guide cards (WKND).
 * Source: https://wknd.site/us/en/about-us.html
 * Each .cmp-experience-fragment--contributor = image + name (h3) + role (h5).
 * Groups all consecutive cards after a heading into a single cards-article block.
 * Because the shared cleanup transformer strips .experiencefragment, this parser
 * MUST run in beforeTransform (it replaces the cards before cleanup sees them).
 */
export default function parse(element, { document }) {
  // element is a wrapper containing one or more contributor cards.
  const cards = Array.from(element.querySelectorAll('.cmp-experience-fragment--contributor'));
  if (!cards.length) return;

  const cells = [];
  cards.forEach((card) => {
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
    cells.push([imageCell, body.length ? body : document.createTextNode('')]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  // Insert the block where the first card was, then remove all cards.
  cards[0].before(block);
  cards.forEach((c) => c.remove());
}
