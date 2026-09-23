/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Convention: 2 columns, one row per card [image cell, text cell].
 * Text cell holds tag label, meta date, and title (card is a link).
 */
export default function parse(element, { document }) {
  // Each card is an anchor with an image sub-div and a body sub-div
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > .article-card, :scope > a.card-link'));

  const cells = [];
  cards.forEach((card) => {
    // Image cell
    const imgWrapper = card.querySelector('.article-card-image, [class*="image"]');
    const img = card.querySelector('img');
    const imageCell = imgWrapper || img || document.createTextNode('');

    // Text cell: tag/meta + title. Preserve the card link on the title heading.
    const body = card.querySelector('.article-card-body, [class*="body"]');
    const bodyContent = [];
    if (body) {
      bodyContent.push(...Array.from(body.children));
    } else {
      const meta = card.querySelector('.article-card-meta');
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (meta) bodyContent.push(meta);
      if (heading) bodyContent.push(heading);
    }

    // Wrap the title heading text in the card link so the destination is preserved
    const href = card.getAttribute('href');
    if (href) {
      const heading = bodyContent.find((el) => el.matches && el.matches('h1, h2, h3, h4, h5, h6'));
      if (heading) {
        const link = document.createElement('a');
        link.href = href;
        link.append(...heading.childNodes);
        heading.append(link);
      }
    }

    cells.push([imageCell, bodyContent.length ? bodyContent : document.createTextNode('')]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
