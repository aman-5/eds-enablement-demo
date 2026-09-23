/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Convention: 1 column, 3 rows. Row 2: background image. Row 3: title + subheading + CTA.
 */
export default function parse(element, { document }) {
  // Background image (full-bleed, rendered as overlay)
  const bgImage = element.querySelector('img, picture');

  // Overlay content: heading, subheading, CTA button group
  const contentContainer = element.querySelector('.card-body, [class*="text-on-overlay"]');
  const scope = contentContainer || element;
  const heading = scope.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = scope.querySelector('p, .subheading, [class*="subheading"]');
  const ctas = Array.from(scope.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 2: background image (single cell)
  cells.push([bgImage || document.createTextNode('')]);

  // Row 3: overlay content in a single cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);

  if (!bgImage && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
