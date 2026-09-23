/* eslint-disable */
/* global WebImporter */

/**
 * Import script for the WKND nav fragment (served at /nav).
 * Builds the 3-section structure the EDS header block expects
 * (nav-brand / nav-sections / nav-tools) directly, then saves to /nav.
 */
export default {
  transform: (payload) => {
    const { document } = payload;
    const main = document.createElement('div');

    // Sections in an EDS document are separated by <hr>. The header block reads
    // the nav fragment's top-level sections in order as brand / sections / tools.

    // Section 1: brand (logo -> /us/en)
    const brandP = document.createElement('p');
    const brandLink = document.createElement('a');
    brandLink.href = '/us/en';
    brandLink.textContent = 'WKND';
    brandP.append(brandLink);
    main.append(brandP);

    main.append(document.createElement('hr'));

    // Section 2: sections (nav menu)
    const ul = document.createElement('ul');
    [
      ['Magazine', '/us/en/magazine'],
      ['Adventures', '/us/en/adventures'],
      ['FAQs', '/us/en/faqs'],
      ['About Us', '/us/en/about-us'],
    ].forEach(([label, href]) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.append(a);
      ul.append(li);
    });
    main.append(ul);

    main.append(document.createElement('hr'));

    // Section 3: tools. Search is injected by header.js (form controls are not
    // authored in the fragment). Sign In lives in the dark utility bar, also
    // built in header.js. Keep a placeholder so the 3-section structure holds.
    const toolsP = document.createElement('p');
    toolsP.textContent = ' ';
    main.append(toolsP);

    return [{
      element: main,
      path: '/nav',
      report: { title: 'WKND Nav', template: 'nav' },
    }];
  },
};
