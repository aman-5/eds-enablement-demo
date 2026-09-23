/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay (WKND adventure hero). Base: hero.
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--hero on a full-bleed image)
 * Convention: 1 column, 2 rows. Row1: background image. Row2: heading + desc + CTA.
 */
export default function parse(element, { document }) {
  const teaser = element.querySelector('.cmp-teaser') || element;
  const img = teaser.querySelector('img');
  const title = teaser.querySelector('.cmp-teaser__title');
  const desc = teaser.querySelector('.cmp-teaser__description');
  const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-button');

  const cells = [];
  cells.push([img || document.createTextNode('')]);

  const content = [];
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title.textContent.trim();
    content.push(h);
  }
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    content.push(p);
  }
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '#';
    a.textContent = cta.textContent.trim();
    content.push(a);
  }

  if (!img && !content.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([content.length ? content : document.createTextNode('')]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
