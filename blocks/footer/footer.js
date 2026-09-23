import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment.
  // metadata-independent dual-fetch: /content first (localhost aem up), then root (DA/EDS prod).
  const footerMeta = getMetadata('footer');
  let fragment;
  if (footerMeta) {
    fragment = await loadFragment(new URL(footerMeta, window.location).pathname);
  }
  // Root path first (production canonical + resolves locally via aem up),
  // then /content fallback — avoids a 404 on production.
  if (!fragment) fragment = await loadFragment('/footer');
  if (!fragment) fragment = await loadFragment('/content/footer');

  block.textContent = '';
  if (!fragment) return;

  // Content-driven: DA/EDS may collapse the source's section <div>s into a flat
  // sequence, so locate each piece by what it IS rather than by section index.
  const scope = fragment;
  const lists = [...scope.querySelectorAll('ul')];
  // Social list = the <ul> whose links point at social networks (icons or text).
  const socialList = lists.find((ul) => ul.querySelector(
    'a[href*="facebook"], a[href*="twitter"], a[href*="instagram"], a[href*="youtube"], a img, a picture',
  )) || null;
  // Nav list = a link list that isn't the social list.
  const navList = lists.find((ul) => ul !== socialList) || null;
  // Logo = the <p> link that wraps an image/picture, else the first link.
  const logoLink = [...scope.querySelectorAll('p a')].find((a) => a.querySelector('img, picture'))
    || [...scope.querySelectorAll('p a')].find((a) => /\/us\/en\/?$/.test(a.getAttribute('href') || ''));
  const heading = scope.querySelector('h1, h2, h3, h4, h5, h6');
  // Legal = text paragraphs that aren't the logo paragraph.
  const logoPara = logoLink ? logoLink.closest('p') : null;
  const legalParas = [...scope.querySelectorAll('p')]
    .filter((p) => p !== logoPara && !p.querySelector('img, picture') && p.textContent.trim());

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // --- Brand logo + footer nav ---
  if (logoLink || navList) {
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    if (logoLink) {
      const brandWrap = document.createElement('div');
      brandWrap.className = 'footer-logo';
      brandWrap.append(logoLink.cloneNode(true));
      brand.append(brandWrap);
    }
    if (navList) {
      const navWrap = document.createElement('nav');
      navWrap.setAttribute('aria-label', 'Footer navigation');
      navWrap.className = 'footer-nav';
      navWrap.append(navList.cloneNode(true));
      brand.append(navWrap);
    }
    footer.append(brand);
  }

  // --- Follow Us + social links ---
  if (heading || socialList) {
    const social = document.createElement('div');
    social.className = 'footer-social';
    if (heading) social.append(heading.cloneNode(true));
    if (socialList) {
      const iconList = socialList.cloneNode(true);
      iconList.classList.add('footer-social-list');
      social.append(iconList);
    }
    footer.append(social);
  }

  // --- Copyright + attribution ---
  if (legalParas.length) {
    const legal = document.createElement('div');
    legal.className = 'footer-legal';
    legalParas.forEach((p) => legal.append(p.cloneNode(true)));
    footer.append(legal);
  }

  block.append(footer);
}
