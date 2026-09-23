/* eslint-disable */
/* global WebImporter */
/**
 * Parser for WKND adventure-detail tabs (.cmp-tabs).
 * Source: https://wknd.site/us/en/adventures/*.html
 * Tab labels live in `.cmp-tabs__tablist > li.cmp-tabs__tab`; each panel is a
 * sibling `.cmp-tabs__tabpanel` (matched by aria-controls / order).
 * Emits a `tabs` block: one row per tab = [label, panel content].
 *
 * MUST run before the shared cleanup transformer, which strips
 * `.cmp-tabs__tablist` (otherwise the labels would be lost).
 */
export default function parse(element, { document }) {
  const tabsRoots = Array.from(element.querySelectorAll('.cmp-tabs'));
  if (!tabsRoots.length) return;

  tabsRoots.forEach((root) => {
    const tabItems = Array.from(root.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab'));
    const panels = Array.from(root.querySelectorAll('.cmp-tabs__tabpanel'));
    if (!tabItems.length || !panels.length) return;

    const cells = [];
    tabItems.forEach((tab, i) => {
      const label = (tab.textContent || '').trim() || `Tab ${i + 1}`;
      // Match panel by aria-controls, fall back to positional index.
      const controls = tab.getAttribute('aria-controls');
      let panel = controls ? root.querySelector(`#${CSS.escape(controls)}`) : null;
      if (!panel) panel = panels[i];
      if (!panel) return;

      const labelDiv = document.createElement('div');
      labelDiv.textContent = label;

      const bodyDiv = document.createElement('div');
      // Move panel children into the block cell.
      while (panel.firstChild) bodyDiv.append(panel.firstChild);

      cells.push([labelDiv, bodyDiv]);
    });

    if (!cells.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
    root.replaceWith(block);
  });
}
