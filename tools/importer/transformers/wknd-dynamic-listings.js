/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: convert static cards-article block tables into the DYNAMIC
 * variant (empty block + source/limit/activity config rows) so the listing
 * reads from /query-index.json instead of hardcoded rows. Publishing a new
 * detail page then reaches the listing/rail with no content edit.
 *
 * Runs in afterTransform (blocks are <table> elements). Each cards-article
 * table is matched to a source by the nearest preceding heading text.
 *
 * payload.template.dynamicListings = [
 *   { match: /recent articles/i, name: 'Cards Article (dynamic)', config: { source, limit } },
 *   ...
 * ]  — first matching rule (by preceding heading) wins; order is a fallback.
 */
function precedingHeadingText(table) {
  let el = table.previousElementSibling;
  let hops = 0;
  while (el && hops < 6) {
    if (/^H[1-6]$/.test(el.tagName)) return (el.textContent || '').trim();
    const h = el.querySelector && el.querySelector('h1,h2,h3,h4,h5,h6');
    if (h) return (h.textContent || '').trim();
    el = el.previousElementSibling;
    hops += 1;
  }
  return '';
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const rules = (payload.template && payload.template.dynamicListings) || [];
  if (!rules.length) return;

  const tables = Array.from(element.querySelectorAll('table')).filter((t) => {
    const head = t.querySelector('tr');
    const label = (head && head.textContent || '').trim();
    // Base cards-article only — never the contributors/people variant.
    return /^cards[\s-]*article\b/i.test(label) && !/contributor/i.test(label);
  });

  let ruleIdx = 0;
  tables.forEach((table) => {
    const heading = precedingHeadingText(table);
    let rule = rules.find((r) => r.match && r.match.test(heading));
    if (!rule) { rule = rules[ruleIdx]; } // positional fallback
    if (!rule) return;
    ruleIdx += 1;

    const cells = Object.entries(rule.config).map(([k, v]) => [k, String(v)]);
    const dyn = WebImporter.Blocks.createBlock(document, {
      name: rule.name || 'Cards Article (dynamic)',
      cells,
    });
    table.replaceWith(dyn);
  });
}
