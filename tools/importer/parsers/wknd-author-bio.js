/* eslint-disable */
/* global WebImporter */
/**
 * Parser for WKND article byline / author bio (.cmp-byline).
 * Source: https://wknd.site/us/en/magazine/*.html
 * Byline = image + h2.cmp-byline__name + p.cmp-byline__occupations, followed by
 * a `.cmp-buildingblock--btn-list` of social buttons (Facebook / Twitter / …).
 * Emits an `author-bio` block: 1 row = [avatar image, name(h3) + role + social].
 * Runs before cleanup.
 */
export default function parse(element, { document }) {
  const byline = element.querySelector('.cmp-byline');
  if (!byline) return;

  const img = byline.querySelector('img');
  const name = byline.querySelector('.cmp-byline__name');
  const role = byline.querySelector('.cmp-byline__occupations');

  const body = [];
  if (name) {
    const h = document.createElement('h3');
    h.textContent = name.textContent.trim();
    body.push(h);
  }
  if (role) {
    const p = document.createElement('p');
    p.textContent = role.textContent.trim();
    body.push(p);
  }

  // Social links live in a `.cmp-buildingblock--btn-list` near the byline,
  // usually a sibling column inside the same experience-fragment. Search that
  // XF scope (falling back to the byline container).
  const container = byline.closest('.byline') || byline.parentElement || element;
  const socialScope = byline.closest('.experiencefragment') || container;
  const anchors = Array.from(socialScope.querySelectorAll('.cmp-buildingblock--btn-list a.cmp-button, .cmp-button'))
    .filter((a) => a.tagName === 'A' && (a.getAttribute('aria-label') || a.querySelector('.cmp-button__icon')));
  if (anchors.length) {
    const p = document.createElement('p');
    anchors.forEach((a) => {
      const link = document.createElement('a');
      link.href = a.getAttribute('href') || '#';
      const label = (a.getAttribute('aria-label')
        || (a.querySelector('.cmp-button__text') || {}).textContent
        || 'Link').trim();
      link.textContent = label;
      p.append(link);
    });
    body.push(p);
  }

  if (!img && !body.length) return;

  const imageCell = img || document.createTextNode('');
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'author-bio',
    cells: [[imageCell, body.length ? body : document.createTextNode('')]],
  });

  // The byline lives inside a `.experiencefragment` that cleanup removes wholesale.
  // Insert the block just AFTER the outermost experience-fragment (or the body
  // end) so it survives cleanup, then let cleanup drop the original XF.
  const xf = byline.closest('.experiencefragment') || container;
  if (xf.parentNode) {
    xf.after(block);
  } else {
    element.appendChild(block);
  }
}
