/* eslint-disable */
/* global WebImporter */
import carouselHeroParser from './parsers/wknd-carousel-hero.js';
import tabsParser from './parsers/wknd-tabs.js';
import tripDetailsParser from './parsers/wknd-trip-details.js';
import shareParser from './parsers/wknd-share.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = { 'carousel-hero': carouselHeroParser };

const PAGE_TEMPLATE = {
  name: 'adventure-detail',
  urls: ['https://wknd.site/us/en/adventures/climbing-new-zealand.html'],
  blocks: [
    { name: 'carousel-hero', instances: ['.carousel.cmp-carousel--hero', '.carousel.cmp-carousel--mini', '.carousel.cmp-carousel'] },
  ],
  sections: [],
};

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((b) => b.instances.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => pageBlocks.push({ name: b.name, selector: sel, element: el }));
  }));
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// Map a trip's fine-grained Activity (from the content fragment) onto the
// coarse filter category used by the adventures listing tabs. Non-sport trips
// (Social, Camping, …) fall under "Travel", matching the source filter.
const ACTIVITY_CATEGORY = {
  'rock climbing': 'Climbing',
  climbing: 'Climbing',
  cycling: 'Cycling',
  skiing: 'Skiing',
  surfing: 'Surfing',
};
function deriveActivityCategory(document) {
  // Read the source content-fragment Activity value before it is transformed.
  const els = Array.from(document.querySelectorAll('.cmp-contentfragment__element'));
  const activityEl = els.find((el) => {
    const t = el.querySelector('.cmp-contentfragment__element-title, dt');
    return t && /^activity$/i.test((t.textContent || '').trim());
  });
  const raw = activityEl
    ? (activityEl.querySelector('.cmp-contentfragment__element-value, dd') || {}).textContent
    : '';
  const key = (raw || '').trim().toLowerCase();
  return ACTIVITY_CATEGORY[key] || 'Travel';
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    const ep = { ...payload, template: PAGE_TEMPLATE };

    // Derive the filter category (Climbing/Cycling/Skiing/Surfing/Travel) from
    // the source Activity BEFORE parsers/cleanup rewrite the content fragment,
    // and expose it as <meta name="activity"> so createMetadata emits an
    // Activity row (which feeds the query-index `activity` column).
    const activityCategory = deriveActivityCategory(document);
    if (activityCategory) {
      const m = document.createElement('meta');
      m.setAttribute('name', 'activity');
      m.setAttribute('content', activityCategory);
      (document.head || document.body).appendChild(m);
    }

    // Content-model parsers that must run BEFORE cleanup strips their source
    // markup (.cmp-tabs__tablist, .cmp-contentfragment, .sharing).
    try { tripDetailsParser(main, { document, url, params }); } catch (e) { console.error('trip-details parser failed:', e); }
    try { shareParser(main, { document, url, params }); } catch (e) { console.error('share parser failed:', e); }
    try { tabsParser(main, { document, url, params }); } catch (e) { console.error('tabs parser failed:', e); }

    cleanupTransformer('beforeTransform', main, ep);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`parse ${block.name}`, e); } }
    });
    cleanupTransformer('afterTransform', main, ep);

    // Section layout: carousel stays full-bleed in its own section; the rest
    // (title + trip-details + share + tabs) forms a two-column body section.
    // Blocks are still <table> elements at this stage (converted to divs on
    // render), so locate the carousel table by its header text, add an <hr>
    // break after it, and append a Section Metadata (Style: two-column) block
    // for the body section that follows.
    try {
      const tables = Array.from(main.querySelectorAll('table'));
      const carouselTable = tables.find((t) => {
        const head = t.querySelector('tr');
        return head && /carousel[\s-]*hero/i.test(head.textContent || '');
      });
      if (carouselTable) {
        // Break after the carousel so the body becomes its own section, then
        // anchor a Section Metadata (style: two-column) block to that break.
        const hr = document.createElement('hr');
        carouselTable.after(hr);
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: 'two-column' },
        });
        hr.after(metaBlock);
      }
    } catch (e) { console.error('section layout failed:', e); }

    // Related rail: a full-width section after the body with an index-driven
    // cards-article (dynamic) showing other adventures in the same activity,
    // excluding the current page. Reuses the existing cards-article block.
    try {
      const currentPath = new URL(params.originalURL).pathname.replace(/\.html?$/, '').replace(/\/$/, '');
      const relBreak = document.createElement('hr');
      main.appendChild(relBreak);
      const relHeading = document.createElement('h2');
      relHeading.textContent = 'More Adventures';
      main.appendChild(relHeading);
      const related = WebImporter.Blocks.createBlock(document, {
        name: 'Cards Article (dynamic)',
        cells: [
          ['source', '/us/en/adventures/'],
          ['activity', activityCategory],
          ['exclude', currentPath],
          ['limit', '3'],
        ],
      });
      main.appendChild(related);
    } catch (e) { console.error('related rail failed:', e); }

    const hr = document.createElement('hr'); main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    // Append an Activity row to the generated Metadata block table so it becomes
    // <meta name="activity"> at render time (feeds the query-index column).
    try {
      if (activityCategory) {
        const table = Array.from(main.querySelectorAll('table')).find((t) => {
          const h = t.querySelector('tr');
          return h && /^metadata$/i.test((h.textContent || '').trim());
        });
        if (table) {
          const tr = document.createElement('tr');
          const td1 = document.createElement('td'); td1.textContent = 'activity';
          const td2 = document.createElement('td'); td2.textContent = activityCategory;
          tr.append(td1, td2);
          (table.querySelector('tbody') || table).append(tr);
        } else {
          console.warn('[activity] metadata table not found');
        }
      }
    } catch (e) { console.error('activity row failed:', e); }
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
