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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    const ep = { ...payload, template: PAGE_TEMPLATE };

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

    const hr = document.createElement('hr'); main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
