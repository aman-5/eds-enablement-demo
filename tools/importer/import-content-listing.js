/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsIntroParser from './parsers/wknd-columns-intro.js';
import cardsArticleParser from './parsers/wknd-cards-article.js';
import aboutCardsParser from './parsers/wknd-about-cards.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';
import dynamicListingsTransformer from './transformers/wknd-dynamic-listings.js';

const parsers = {
  'columns-intro': columnsIntroParser,
  'cards-article': cardsArticleParser,
};

// content-listing template covers magazine.html (article listing) and about-us.html.
const PAGE_TEMPLATE = {
  name: 'content-listing',
  description: 'WKND content listing (magazine / about-us)',
  urls: ['https://wknd.site/us/en/magazine.html'],
  blocks: [
    { name: 'columns-intro', instances: ['.teaser.cmp-teaser--featured', '.teaser.cmp-teaser--list'] },
    { name: 'cards-article', instances: ['ul.cmp-image-list'] },
  ],
  sections: [],
  // Magazine "All Articles" grid → dynamic (index-driven). About-us contributor
  // grids never match (contributors variant is excluded by the transformer).
  dynamicListings: [
    { match: /all articles/i, name: 'Cards Article (dynamic)', config: { source: '/us/en/magazine/', limit: 'all' } },
  ],
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dynamicListingsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // about-us: convert contributor/guide experience-fragment cards into a
    // cards-article block BEFORE cleanup strips .experiencefragment.
    try { aboutCardsParser(main, { document, url, params }); } catch (e) { console.error('about-cards parser failed:', e); }

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
