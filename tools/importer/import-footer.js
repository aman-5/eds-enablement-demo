/* eslint-disable */
/* global WebImporter */

/**
 * Import script for the WKND footer fragment (served at /footer).
 * Mirrors the WKND footer: brand, footer nav (Magazine/Adventures/FAQs/About Us),
 * Follow Us social links, and copyright/attribution text.
 */
export default {
  transform: (payload) => {
    const { document } = payload;
    const main = document.createElement('div');

    // Section 1: brand + nav columns + social
    const brandP = document.createElement('p');
    const brandLink = document.createElement('a');
    brandLink.href = '/us/en';
    brandLink.textContent = 'WKND';
    brandP.append(brandLink);
    main.append(brandP);

    const navUl = document.createElement('ul');
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
      navUl.append(li);
    });
    main.append(navUl);

    const followH = document.createElement('h4');
    followH.textContent = 'Follow Us';
    main.append(followH);
    const socialUl = document.createElement('ul');
    [
      ['Facebook', 'https://www.facebook.com/'],
      ['Twitter', 'https://twitter.com/'],
      ['Instagram', 'https://www.instagram.com/'],
    ].forEach(([label, href]) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.append(a);
      socialUl.append(li);
    });
    main.append(socialUl);

    main.append(document.createElement('hr'));

    // Section 2: legal / attribution
    const copy = document.createElement('p');
    copy.textContent = 'Ⓒ 2019, WKND Site.';
    main.append(copy);
    const attribution = document.createElement('p');
    attribution.textContent = 'WKND is a fictitious adventure and travel website created by Adobe to demonstrate how anyone can build a beautiful, feature-rich website with Adobe Experience Manager.';
    main.append(attribution);

    return [{
      element: main,
      path: '/footer',
      report: { title: 'WKND Footer', template: 'footer' },
    }];
  },
};
