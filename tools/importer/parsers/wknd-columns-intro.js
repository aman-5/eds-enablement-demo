/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-intro (WKND featured teaser). Base: columns.
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--featured)
 * Structure: one row, two columns [text column (eyebrow, heading, desc, CTA), image].
 */
export default function parse(element, { document }) {
  const teaser = element.querySelector('.cmp-teaser') || element;
  const img = teaser.querySelector('img');
  const pretitle = teaser.querySelector('.cmp-teaser__pretitle');
  const title = teaser.querySelector('.cmp-teaser__title');
  const desc = teaser.querySelector('.cmp-teaser__description');
  const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-button');

  const textCell = [];
  if (pretitle) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${pretitle.textContent.trim()}</strong>`;
    textCell.push(p);
  }
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title.textContent.trim();
    textCell.push(h);
  }
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    textCell.push(p);
  }
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '#';
    a.textContent = cta.textContent.trim();
    textCell.push(a);
  }

  const imageCell = img || document.createTextNode('');

  if (!textCell.length && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell.length ? textCell : document.createTextNode(''), imageCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
