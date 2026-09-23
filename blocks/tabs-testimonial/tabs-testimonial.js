// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent) || `tab-${i}`;

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-testimonial-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button (avatar-card label): [avatar] [name / role stacked]
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    const parts = [...tab.children];
    const avatarPart = parts.find((c) => c.querySelector('picture, img'));
    const textParts = parts.filter((c) => c !== avatarPart);
    if (avatarPart) {
      avatarPart.classList.add('tabs-testimonial-tab-avatar');
      button.append(avatarPart);
    }
    const tabText = document.createElement('div');
    tabText.className = 'tabs-testimonial-tab-text';
    textParts.forEach((c) => tabText.append(c));
    button.append(tabText);

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();

    // restructure the panel cell into image + text for a two-column layout
    const cell = tabpanel.firstElementChild;
    if (cell) {
      cell.classList.add('tabs-testimonial-pane-grid');
      const imgP = [...cell.children].find((c) => c.querySelector('picture, img'));
      const textWrap = document.createElement('div');
      textWrap.className = 'tabs-testimonial-quote';
      [...cell.children].forEach((c) => {
        if (c !== imgP) textWrap.append(c);
      });
      if (imgP) imgP.classList.add('tabs-testimonial-pane-image');
      cell.append(textWrap);
    }
  });

  block.prepend(tablist);
}
