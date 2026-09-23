/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Convention: 2 columns, one row per accordion item [title cell, content cell].
 */
export default function parse(element, { document }) {
  // Each FAQ item: <details class="faq-item"> with a question summary and answer body
  const items = Array.from(element.querySelectorAll(':scope > details, :scope > .faq-item'));

  const cells = [];
  items.forEach((item) => {
    // Title cell: text inside the summary (drop the plus/expand icon image)
    const summary = item.querySelector('summary, .faq-question');
    let titleCell;
    if (summary) {
      const span = summary.querySelector('span');
      titleCell = span || document.createTextNode(summary.textContent.trim());
    } else {
      titleCell = document.createTextNode('');
    }

    // Content cell: the answer body container
    const answer = item.querySelector('.faq-answer, :scope > div:last-child');
    const contentCell = answer || document.createTextNode('');

    cells.push([titleCell, contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
