/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq (WKND). Base: accordion.
 * Source: https://wknd.site/us/en/faqs.html (.cmp-accordion)
 * Convention: 2 columns, one row per item [question, answer].
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));
  const cells = [];

  items.forEach((item) => {
    const title = item.querySelector('.cmp-accordion__title, .cmp-accordion__header');
    const panel = item.querySelector('.cmp-accordion__panel');

    const q = document.createElement('div');
    q.textContent = title ? title.textContent.trim() : '';

    const a = document.createElement('div');
    if (panel) {
      // move panel content (strip the wrapper's hidden class)
      a.append(...panel.childNodes);
      // Source rich text leaves an empty heading (e.g. <h3 id=""></h3>) in some
      // answer panels — drop empties so they don't render as blank gaps.
      a.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        if (!h.textContent.trim() && !h.querySelector('img')) h.remove();
      });
    }

    cells.push([q, a]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
