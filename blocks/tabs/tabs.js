// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/*
 * tabs — generic tabbed panels.
 * Authored structure: one row per tab. Row cell 1 = tab label, cell 2 = panel
 * content. Adapted from the AEM Block Collection tabs block; used for WKND
 * adventure detail (Overview / Itinerary / What to Bring) and the adventures
 * listing category filter.
 */
export default function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children];
  const buttons = [];

  tabs.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const bodyCell = cells[1] || cells[0];
    const label = (labelCell.textContent || '').trim() || `Tab ${i + 1}`;
    const id = toClassName(label) || `tab-${i}`;

    // panel = the row itself, holding only the body cell content
    const panel = row;
    panel.className = 'tabs-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('role', 'tabpanel');
    if (i > 0) panel.setAttribute('hidden', '');
    // drop the label cell; keep the body cell's children as panel content
    if (cells.length > 1) labelCell.remove();
    // unwrap the body cell so panel content sits directly in the panel
    while (bodyCell.firstChild) panel.append(bodyCell.firstChild);
    if (bodyCell.parentElement === panel) bodyCell.remove();

    // tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.setAttribute('role', 'tab');
    button.tabIndex = i === 0 ? 0 : -1;
    button.addEventListener('click', () => {
      block.querySelectorAll('[role="tabpanel"]').forEach((p) => {
        p.setAttribute('aria-hidden', 'true');
        p.setAttribute('hidden', '');
      });
      buttons.forEach((b) => {
        b.setAttribute('aria-selected', 'false');
        b.tabIndex = -1;
      });
      panel.setAttribute('aria-hidden', 'false');
      panel.removeAttribute('hidden');
      button.setAttribute('aria-selected', 'true');
      button.tabIndex = 0;
      button.focus();
    });
    buttons.push(button);
    tablist.append(button);
  });

  // keyboard navigation (left/right arrows)
  tablist.addEventListener('keydown', (e) => {
    const idx = buttons.indexOf(document.activeElement);
    if (idx < 0) return;
    let next = null;
    if (e.key === 'ArrowRight') next = buttons[(idx + 1) % buttons.length];
    else if (e.key === 'ArrowLeft') next = buttons[(idx - 1 + buttons.length) % buttons.length];
    if (next) { e.preventDefault(); next.click(); }
  });

  block.prepend(tablist);
}
