/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: one row, two columns [feature image, text column].
 * Text column: breadcrumb + heading + byline + meta.
 */
export default function parse(element, { document }) {
  // Two direct column children: image column and text column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Identify the image column (holds a picture/img) vs the text column
  const imageCol = columns.find((c) => c.querySelector('img, picture'));
  const textCol = columns.find((c) => c !== imageCol);

  const imageCell = (imageCol && (imageCol.querySelector('picture') || imageCol.querySelector('img'))) || document.createTextNode('');
  const textContent = textCol ? Array.from(textCol.children) : [];
  const textCell = textContent.length ? textContent : document.createTextNode('');

  if (!imageCol && !textCol) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
