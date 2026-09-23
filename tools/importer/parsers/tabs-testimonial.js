/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Convention: 2 columns, one row per tab [tab label, tab content].
 * Tab label: avatar image + name + role. Content: portrait image + name/role + quote.
 */
export default function parse(element, { document }) {
  // Source has two parallel groups: panels (.tabs-content .tab-pane) and labels (.tab-menu button)
  const panels = Array.from(element.querySelectorAll('.tabs-content > .tab-pane, .tab-pane'));
  const labels = Array.from(element.querySelectorAll('.tab-menu > button, .tab-menu-link'));

  const cells = [];
  panels.forEach((panel, i) => {
    // Tab label cell: avatar card (image + name + role). Unwrap the button element.
    const label = labels[i];
    const labelContent = label ? Array.from(label.childNodes) : [];
    const labelCell = labelContent.length ? labelContent : document.createTextNode('');

    // Tab content cell: portrait image + name/role + quote
    const panelInner = panel.querySelector(':scope > .grid-layout') || panel;
    const panelContent = Array.from(panelInner.children);
    const panelCell = panelContent.length ? panelContent : document.createTextNode('');

    cells.push([labelCell, panelCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
