/**
 * True when this teaser sits in the "Members Only" area — i.e. a preceding
 * section on the page carries a "Members Only" heading. WKND locks these
 * teasers with an overlaid padlock badge on the image.
 */
function isMembersOnly(block) {
  const scope = block.closest('.section') || document;
  // Any "Members Only" heading that appears before this teaser in document
  // order means this teaser is in the locked area.
  const headings = [...scope.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const membersHeading = headings.find((h) => /members only/i.test(h.textContent));
  if (!membersHeading) return false;
  // true when the Members Only heading precedes this block in the document
  // eslint-disable-next-line no-bitwise
  return !!(block.compareDocumentPosition(membersHeading)
    & Node.DOCUMENT_POSITION_PRECEDING);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.querySelectorAll('picture').length >= 1) {
          // column holds one or more images (image group)
          picWrapper.classList.add('columns-intro-img-col');
          // Members Only teasers get a padlock badge over the image.
          if (isMembersOnly(block)) {
            block.classList.add('columns-intro-locked');
            if (!picWrapper.querySelector('.columns-intro-lock')) {
              const lock = document.createElement('span');
              lock.className = 'columns-intro-lock';
              lock.setAttribute('aria-hidden', 'true');
              picWrapper.append(lock);
            }
          }
        }
      }
    });
  });
}
