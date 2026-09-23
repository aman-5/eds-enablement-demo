/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article (WKND image-list). Base: cards.
 * Source: https://wknd.site/us/en.html (ul.cmp-image-list)
 * Convention: 2 columns, one row per card [image cell, text cell(title link + description)].
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-image-list__item'));
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link, .cmp-image-list__item-title a, a.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    const desc = item.querySelector('.cmp-image-list__item-description');
    const href = (titleLink && titleLink.getAttribute('href'))
      || (item.querySelector('a') && item.querySelector('a').getAttribute('href'))
      || '#';

    const imageCell = img || document.createTextNode('');

    const body = [];
    const h = document.createElement('h3');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = (titleText || titleLink || { textContent: '' }).textContent.trim();
    h.append(a);
    body.push(h);
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      body.push(p);
    }

    cells.push([imageCell, body]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
