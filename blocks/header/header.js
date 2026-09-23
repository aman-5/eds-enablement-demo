import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

// Inline US flag (SVG data URI) for the locale toggle — the nav fragment
// carries no flag asset, so provide one to match wknd.site. The SVG markup is
// URL-encoded so the unescaped angle brackets/quotes don't break the src attr.
const US_FLAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14">'
  + '<rect width="20" height="14" fill="#b22234"/>'
  + '<g fill="#fff">'
  + '<rect y="1.08" width="20" height="1.08"/><rect y="3.23" width="20" height="1.08"/>'
  + '<rect y="5.38" width="20" height="1.08"/><rect y="7.54" width="20" height="1.08"/>'
  + '<rect y="9.69" width="20" height="1.08"/><rect y="11.85" width="20" height="1.08"/>'
  + '</g>'
  + '<rect width="8" height="7.54" fill="#3c3b6e"/></svg>';
const US_FLAG = `data:image/svg+xml,${encodeURIComponent(US_FLAG_SVG)}`;

// Countries -> locales for the language dropdown (mirrors wknd.site).
const LOCALES = [
  { country: 'United States', items: [['en-US', '/us/en'], ['es-US', '/us/es']] },
  { country: 'Canada', items: [['en-CA', '/ca/en'], ['fr-CA', '/ca/fr']] },
  { country: 'Switzerland', items: [['de-CH', '/ch/de'], ['fr-CH', '/ch/fr'], ['it-CH', '/ch/it']] },
  { country: 'Germany', items: [['de-DE', '/de/de']] },
  { country: 'France', items: [['fr-FR', '/fr/fr']] },
  { country: 'Spain', items: [['es-ES', '/es/es']] },
  { country: 'Italy', items: [['it-IT', '/it/it']] },
];

/** Build the locale dropdown (flag + code toggle → grouped country list). */
function buildLocale() {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-locale';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-locale-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Toggle language United States en-US');
  toggle.innerHTML = `<img src="${US_FLAG}" alt="" width="20" height="14">
    <span class="nav-locale-code">en-US</span>`;

  const panel = document.createElement('div');
  panel.className = 'nav-locale-panel';
  const list = document.createElement('ul');
  LOCALES.forEach(({ country, items }) => {
    const li = document.createElement('li');
    li.append(document.createTextNode(country));
    const sub = document.createElement('ul');
    items.forEach(([code, href]) => {
      const subLi = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = code;
      subLi.append(a);
      sub.append(subLi);
    });
    li.append(sub);
    list.append(li);
  });
  panel.append(list);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    wrapper.classList.toggle('is-open', !open);
  });
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      toggle.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
    }
  });

  wrapper.append(toggle, panel);
  return wrapper;
}

/** Build the search form. Controls are created here, not in the fragment. */
function buildSearch() {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');
  form.action = '/us/en/magazine';
  form.method = 'get';
  form.innerHTML = `<span class="nav-search-icon" aria-hidden="true"></span>
    <input type="search" name="q" placeholder="Search" aria-label="Search" autocomplete="off">`;
  return form;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  let fragment;
  if (navMeta) {
    fragment = await loadFragment(new URL(navMeta, window.location).pathname);
  }
  if (!fragment) fragment = await loadFragment('/nav');
  if (!fragment) fragment = await loadFragment('/content/nav');

  block.textContent = '';
  if (!fragment) return;

  // Locate the pieces of the nav fragment by what they ARE (content-driven):
  // the brand link (wraps text/logo), and the primary nav <ul>.
  const scope = fragment;
  const logoLink = [...scope.querySelectorAll('p a, div a')].find((a) => /\/us\/en\/?$/.test(a.getAttribute('href') || ''))
    || scope.querySelector('a');
  const navList = scope.querySelector('ul');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // --- Utility bar (dark): Sign In + locale, right-aligned ---
  const utility = document.createElement('div');
  utility.className = 'nav-utility';
  const utilityInner = document.createElement('div');
  utilityInner.className = 'nav-utility-inner';
  const signIn = document.createElement('a');
  signIn.className = 'nav-signin';
  signIn.href = '/us/en';
  signIn.textContent = 'Sign In';
  utilityInner.append(signIn, buildLocale());
  utility.append(utilityInner);
  nav.append(utility);

  // --- Main header (white): logo + hamburger + nav links + search ---
  const main = document.createElement('div');
  main.className = 'nav-main';
  const inner = document.createElement('div');
  inner.className = 'nav-main-inner';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (logoLink) {
    const label = logoLink.textContent.trim() || 'WKND';
    const a = document.createElement('a');
    a.href = logoLink.getAttribute('href') || '/us/en';
    a.setAttribute('aria-label', label);
    a.innerHTML = `<img class="nav-logo" src="/icons/wknd-logo.svg" alt="${label}" width="120" height="45" loading="eager">`;
    brand.append(a);
  }

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';

  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  if (navList) sections.append(navList.cloneNode(true));
  sections.append(buildSearch());

  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    hamburger.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !open);
  });

  inner.append(brand, hamburger, sections);
  main.append(inner);
  nav.append(main);

  // Reset transient state when crossing the desktop/mobile breakpoint.
  isDesktop.addEventListener('change', () => {
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    nav.querySelectorAll('.nav-locale').forEach((l) => l.classList.remove('is-open'));
    nav.querySelectorAll('.nav-locale-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'));
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
