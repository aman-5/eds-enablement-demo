import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
const DATE_RE = new RegExp(`\\s+((?:${MONTHS})\\.?\\s+\\d{1,2}(?:,\\s*\\d{4})?)\\s*$`, 'i');

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });
    ul.append(li);
  });

  // Split the meta paragraph ("Casual Cool May 12") into a tag pill + date.
  ul.querySelectorAll('.cards-article-card-body > p:first-child').forEach((p) => {
    const raw = p.textContent.trim();
    const match = raw.match(DATE_RE);
    const meta = document.createElement('div');
    meta.className = 'cards-article-card-meta';
    const tag = document.createElement('span');
    tag.className = 'cards-article-card-tag';
    if (match) {
      tag.textContent = raw.slice(0, match.index).trim();
      const date = document.createElement('span');
      date.className = 'cards-article-card-date';
      date.textContent = match[1].trim();
      meta.append(tag, date);
    } else {
      tag.textContent = raw;
      meta.append(tag);
    }
    p.replaceWith(meta);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
