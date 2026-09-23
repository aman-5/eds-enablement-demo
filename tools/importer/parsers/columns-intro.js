/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-intro. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: one row, two columns [text column, image group].
 * Text column: heading + subheading + CTA buttons. Image column: group of images.
 */
export default function parse(element, { document }) {
  // Two direct column children: text column and image-group column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Image column is the one holding one or more images
  const imageCol = columns.find((c) => c.querySelector('img, picture'));
  const textCol = columns.find((c) => c !== imageCol);

  const textContent = textCol ? Array.from(textCol.children) : [];
  const textCell = textContent.length ? textContent : document.createTextNode('');

  let imageCell;
  if (imageCol) {
    const media = Array.from(imageCol.querySelectorAll(':scope > picture, :scope > img'));
    imageCell = media.length ? media : imageCol;
  } else {
    imageCell = document.createTextNode('');
  }

  if (!textCol && !imageCol) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell, imageCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
