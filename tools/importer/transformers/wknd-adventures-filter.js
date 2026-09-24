/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: replace the adventures-listing static cards grid with a single
 * index-driven `cards-article (dynamic)` block that also carries a `filters`
 * config. The block renders category filter buttons (All + the listed
 * activities) above the grid and filters client-side by the `activity`
 * query-index column. Reuses the existing cards-article block — no nesting, no
 * new block folder. Publishing a new adventure appears under All + its category
 * with no content edit.
 *
 * Runs in afterTransform (cards-article is a <table> at this point).
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const cardsTable = Array.from(element.querySelectorAll('table')).find((t) => {
    const head = t.querySelector('tr');
    const label = (head && head.textContent || '').trim();
    return /^cards[\s-]*article\b/i.test(label) && !/contributor|dynamic/i.test(label);
  });
  if (!cardsTable) return;

  const dyn = WebImporter.Blocks.createBlock(document, {
    name: 'Cards Article (dynamic)',
    cells: [
      ['source', '/us/en/adventures/'],
      ['limit', 'all'],
      ['filters', 'All, Climbing, Cycling, Skiing, Surfing, Travel'],
    ],
  });
  cardsTable.replaceWith(dyn);
}
