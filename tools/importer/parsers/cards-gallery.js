/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Image-only gallery variant (per block metadata): one row per tile, single image cell.
 */
export default function parse(element, { document }) {
  // Each tile is a wrapper div holding a single image
  let tiles = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1, :scope > div'));
  // Keep only tiles that contain an image
  tiles = tiles.filter((t) => t.querySelector('img, picture'));

  const cells = [];
  tiles.forEach((tile) => {
    const media = tile.querySelector('picture') || tile.querySelector('img') || tile;
    cells.push([media]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
