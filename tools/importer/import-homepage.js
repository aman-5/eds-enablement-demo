/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/wknd-carousel-hero.js';
import columnsIntroParser from './parsers/wknd-columns-intro.js';
import cardsArticleParser from './parsers/wknd-cards-article.js';
import heroOverlayParser from './parsers/wknd-hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';
import dynamicListingsTransformer from './transformers/wknd-dynamic-listings.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-intro': columnsIntroParser,
  'cards-article': cardsArticleParser,
  'hero-overlay': heroOverlayParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND homepage',
  urls: ['https://wknd.site/us/en.html'],
  blocks: [
    { name: 'carousel-hero', instances: ['.carousel.cmp-carousel--hero'] },
    { name: 'columns-intro', instances: ['.teaser.cmp-teaser--featured'] },
    { name: 'cards-article', instances: ['ul.cmp-image-list'] },
    { name: 'hero-overlay', instances: ['.teaser.cmp-teaser--hero.cmp-teaser--imagebottom'] },
  ],
  sections: [
    { id: 'rc1', name: 'hero', selector: ['.carousel.cmp-carousel--hero'], style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'rc2', name: 'featured', selector: ['.teaser.cmp-teaser--featured'], style: 'light', blocks: ['columns-intro'], defaultContent: [] },
  ],
  // Convert the two static card rails into the dynamic (index-driven) variant.
  dynamicListings: [
    { match: /recent articles/i, name: 'Cards Article (dynamic)', config: { source: '/us/en/magazine/', limit: '4' } },
    { match: /where do you want to go/i, name: 'Cards Article (dynamic)', config: { source: '/us/en/adventures/', limit: '4' } },
  ],
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dynamicListingsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
