import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * cards-article — borderless article/adventure card grid (image on top, title +
 * short description below).
 *
 * Two modes:
 *  - Static (default): cards come from authored rows.
 *  - Dynamic: when the block carries the `dynamic` variant class, cards are
 *    built from the query index (/query-index.json), newest-first, so newly
 *    published content appears automatically as the first card. The block's
 *    config rows set the source and count:
 *        | source | /us/en/magazine/ |
 *        | limit  | 4                |
 *    `source` is a path prefix (only direct children are listed); `limit` caps
 *    the card count (default 4). The index is unavailable at author time, so a
 *    dynamic block with no index simply renders empty.
 */

/** Build one card <li> from image + linked title + description. */
function buildCard(document, {
  path, title, description, image,
}) {
  const li = document.createElement('li');

  const imgDiv = document.createElement('div');
  imgDiv.className = 'cards-article-card-image';
  if (image) {
    const optimized = createOptimizedPicture(image, title || '', false, [{ width: '750' }]);
    imgDiv.append(optimized);
  }

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'cards-article-card-body';
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = path;
  a.textContent = title || path;
  h3.append(a);
  bodyDiv.append(h3);
  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    bodyDiv.append(p);
  }

  li.append(imgDiv, bodyDiv);
  return li;
}

/** Read simple key/value config rows (2-cell rows) into an object, then clear them. */
function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key) config[key] = value;
    }
  });
  return config;
}

/** Wrap each card image in a link to the card destination (source behaviour). */
function linkCardImages(ul) {
  ul.querySelectorAll('li').forEach((li) => {
    const imageDiv = li.querySelector('.cards-article-card-image');
    const pic = imageDiv && imageDiv.querySelector('picture');
    const titleLink = li.querySelector('.cards-article-card-body h3 a[href]');
    if (pic && titleLink && !imageDiv.querySelector('a')) {
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.setAttribute('aria-hidden', 'true');
      a.setAttribute('tabindex', '-1');
      a.className = 'cards-article-card-image-link';
      pic.replaceWith(a);
      a.append(pic);
    }
  });
}

/** Render the <ul> of cards for the given activity filter into `ul`. */
function renderCards(ul, items, activity, limit) {
  const act = (activity || '').trim().toLowerCase();
  let list = items.filter((row) => !act || act === 'all'
    || (row.activity || '').trim().toLowerCase() === act);
  if (limit > 0) list = list.slice(0, limit);
  ul.textContent = '';
  list.forEach((row) => ul.append(buildCard(document, row)));
  linkCardImages(ul);
}

async function decorateDynamic(block) {
  const config = readConfig(block);
  const source = config.source || '/us/en/';
  // limit: a number caps the list; "all"/0/absent renders every match.
  const rawLimit = (config.limit || '').toLowerCase();
  const limit = rawLimit && rawLimit !== 'all' ? Number.parseInt(rawLimit, 10) : 0;
  const activity = (config.activity || '').trim().toLowerCase();
  const exclude = (config.exclude || '').replace(/\/$/, ''); // path to omit (e.g. current page)
  // filters: comma-separated activity categories -> render filter buttons.
  const filters = (config.filters || '').split(',').map((s) => s.trim()).filter(Boolean);
  const root = source.replace(/\/$/, '');
  const rootDepth = root.split('/').filter(Boolean).length;

  block.textContent = '';

  let data;
  try {
    const resp = await fetch('/query-index.json');
    if (!resp.ok) return;
    ({ data } = await resp.json());
  } catch (e) {
    return;
  }
  if (!Array.isArray(data)) return;

  const items = data
    // direct children of the source prefix (exclude the section landing page itself)
    .filter((row) => {
      const path = (row.path || '').replace(/\/$/, '');
      if (!path.startsWith(`${root}/`)) return false;
      return path.split('/').filter(Boolean).length === rootDepth + 1;
    })
    .filter((row) => !/noindex/i.test(row.robots || ''))
    // optional static activity filter (related rails)
    .filter((row) => !activity || (row.activity || '').trim().toLowerCase() === activity)
    // optional single-path exclusion (related rail excludes the current page)
    .filter((row) => !exclude || (row.path || '').replace(/\/$/, '') !== exclude)
    // newest first (numeric lastModified seconds); missing dates sort last
    .sort((a, b) => (Number(b.lastModified) || 0) - (Number(a.lastModified) || 0));

  const ul = document.createElement('ul');

  // Category filter bar (client-side): buttons re-render the grid by activity.
  if (filters.length) {
    const bar = document.createElement('div');
    bar.className = 'cards-article-filters';
    bar.setAttribute('role', 'tablist');
    filters.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cards-article-filter';
      btn.textContent = label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.cards-article-filter').forEach((b) => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');
        renderCards(ul, items, label, limit);
      });
      bar.append(btn);
    });
    block.append(bar);
    block.append(ul);
    renderCards(ul, items, filters[0], limit);
    return;
  }

  block.append(ul);
  renderCards(ul, items, '', limit);
}

function decorateStatic(block) {
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
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Source wraps each card photo in a link to the same destination as the
  // title. Mirror that (skip the contributors variant, whose cards aren't
  // linked).
  if (!block.classList.contains('contributors')) linkCardImages(ul);

  block.textContent = '';
  block.append(ul);
}

export default async function decorate(block) {
  if (block.classList.contains('dynamic')) {
    await decorateDynamic(block);
  } else {
    decorateStatic(block);
  }
}
