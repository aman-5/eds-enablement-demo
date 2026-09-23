/* eslint-disable */
/* global WebImporter */

// Article-detail is default-content heavy (title, byline, prose, blockquote, H2s).
// No block parsers needed — cleanup strips chrome + related-articles sidebar,
// and the article body flows as default content.

import cleanupTransformer from './transformers/wknd-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'article-detail',
  description: 'WKND long-form magazine article',
  urls: ['https://wknd.site/us/en/magazine/arctic-surfing.html'],
  blocks: [],
  sections: [],
};

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    cleanupTransformer('beforeTransform', main, { ...payload, template: PAGE_TEMPLATE });
    cleanupTransformer('afterTransform', main, { ...payload, template: PAGE_TEMPLATE });

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
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: [] },
    }];
  },
};
