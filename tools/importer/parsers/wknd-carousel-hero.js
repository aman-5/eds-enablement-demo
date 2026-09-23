/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero (WKND). Base: carousel/hero.
 * Source: https://wknd.site/us/en.html (AEM Core Components .cmp-carousel)
 * Convention: one row per slide, single cell = [image, heading, description, CTA].
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  items.forEach((item) => {
    const teaser = item.querySelector('.cmp-teaser') || item;
    const img = teaser.querySelector('img');
    const title = teaser.querySelector('.cmp-teaser__title');
    const desc = teaser.querySelector('.cmp-teaser__description');
    const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-button');

    const cell = [];
    if (img) cell.push(img);
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      cell.push(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      cell.push(p);
    }
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.getAttribute('href') || '#';
      a.textContent = cta.textContent.trim();
      cell.push(a);
    }
    if (cell.length) cells.push([cell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
