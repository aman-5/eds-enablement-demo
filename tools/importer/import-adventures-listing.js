/* eslint-disable */
/* global WebImporter */
import columnsIntroParser from './parsers/wknd-columns-intro.js';
import cardsArticleParser from './parsers/wknd-cards-article.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = { 'columns-intro': columnsIntroParser, 'cards-article': cardsArticleParser };

const PAGE_TEMPLATE = {
  name: 'adventures-listing',
  urls: ['https://wknd.site/us/en/adventures.html'],
  blocks: [
    { name: 'columns-intro', instances: ['.teaser.cmp-teaser--featured', '.teaser.cmp-teaser--content'] },
    { name: 'cards-article', instances: ['ul.cmp-image-list'] },
  ],
  sections: [],
};

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((b) => b.instances.forEach((sel) => {
    let els = [...document.querySelectorAll(sel)];
    // The tab widget renders one card list per category tab (All + 5 categories),
    // all containing the same cards. Only keep the FIRST image-list ("All").
    if (b.name === 'cards-article') els = els.slice(0, 1);
    els.forEach((el) => pageBlocks.push({ name: b.name, selector: sel, element: el }));
  }));
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    const ep = { ...payload, template: PAGE_TEMPLATE };
    cleanupTransformer('beforeTransform', main, ep);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`parse ${block.name}`, e); } }
    });
    cleanupTransformer('afterTransform', main, ep);
    const hr = document.createElement('hr'); main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
