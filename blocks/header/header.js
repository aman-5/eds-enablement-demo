import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment.
  // metadata-independent dual-fetch: /content first (localhost aem up), then root (DA/EDS prod).
  const navMeta = getMetadata('nav');
  let fragment;
  if (navMeta) {
    fragment = await loadFragment(new URL(navMeta, window.location).pathname);
  }
  // Root path first (production canonical + resolves locally via aem up),
  // then /content fallback. Root-first avoids a 404 on production where
  // content is served at the site root, not under /content.
  if (!fragment) fragment = await loadFragment('/nav');
  if (!fragment) fragment = await loadFragment('/content/nav');

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }
  // Swap the brand text for the WKND logo (SVG), keeping the text as the
  // accessible label / img alt.
  const brandAnchor = navBrand.querySelector('a');
  if (brandAnchor) {
    const label = brandAnchor.textContent.trim() || 'WKND';
    brandAnchor.setAttribute('aria-label', label);
    brandAnchor.innerHTML = `<img class="nav-logo" src="/icons/wknd-logo.svg" alt="${label}" width="120" height="45" loading="eager">`;
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // Build the tools section (right side of the nav): a locale toggle + search
  // box. The nav fragment's third cell is empty and gets dropped by
  // loadFragment, so create nav-tools if it isn't present.
  let navTools = nav.querySelector('.nav-tools');
  if (!navTools) {
    navTools = document.createElement('div');
    navTools.classList.add('nav-tools');
    nav.append(navTools);
  }

  // Sign In + language selector (WKND top-right controls). The language
  // toggle opens a grouped country -> locale dropdown, mirroring wknd.site.
  if (!navTools.querySelector('.nav-account')) {
    const account = document.createElement('div');
    account.className = 'nav-account';
    account.innerHTML = `<a class="nav-signin" href="/us/en">Sign In</a>
      <div class="nav-lang">
        <button type="button" class="nav-lang-toggle" aria-expanded="false" aria-haspopup="true">en-US</button>
        <div class="nav-lang-menu" hidden>
          <ul>
            <li class="nav-lang-country">United States<ul>
              <li><a href="/us/en">en-US</a></li>
              <li><a href="/us/es">es-US</a></li>
            </ul></li>
            <li class="nav-lang-country">Canada<ul>
              <li><a href="/ca/en">en-CA</a></li>
              <li><a href="/ca/fr">fr-CA</a></li>
            </ul></li>
            <li class="nav-lang-country">Switzerland<ul>
              <li><a href="/ch/de">de-CH</a></li>
              <li><a href="/ch/fr">fr-CH</a></li>
              <li><a href="/ch/it">it-CH</a></li>
            </ul></li>
            <li class="nav-lang-country">Germany<ul>
              <li><a href="/de/de">de-DE</a></li>
            </ul></li>
            <li class="nav-lang-country">France<ul>
              <li><a href="/fr/fr">fr-FR</a></li>
            </ul></li>
            <li class="nav-lang-country">Spain<ul>
              <li><a href="/es/es">es-ES</a></li>
            </ul></li>
            <li class="nav-lang-country">Italy<ul>
              <li><a href="/it/it">it-IT</a></li>
            </ul></li>
          </ul>
        </div>
      </div>`;
    navTools.append(account);

    const langToggle = account.querySelector('.nav-lang-toggle');
    const langMenu = account.querySelector('.nav-lang-menu');
    const closeLang = () => {
      langToggle.setAttribute('aria-expanded', 'false');
      langMenu.hidden = true;
    };
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = langToggle.getAttribute('aria-expanded') === 'true';
      langToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      langMenu.hidden = open;
    });
    document.addEventListener('click', (e) => {
      if (!account.contains(e.target)) closeLang();
    });
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') closeLang();
    });
  }

  const search = document.createElement('div');
  search.className = 'nav-search';
  search.innerHTML = `<form role="search" class="nav-search-form" action="/us/en/magazine">
      <span class="nav-search-icon" aria-hidden="true"></span>
      <label class="nav-search-label" for="nav-search-input">Search</label>
      <input id="nav-search-input" name="q" type="search" placeholder="Search" autocomplete="off">
    </form>`;
  navTools.append(search);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
