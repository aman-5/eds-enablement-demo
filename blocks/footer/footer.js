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
  if (!fragment) fragment = await loadFragment('/content/footer');
  if (!fragment) fragment = await loadFragment('/footer');

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
