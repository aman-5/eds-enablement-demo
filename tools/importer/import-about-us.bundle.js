/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/columns-intro.js
  function parse(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const imageCol = columns.find((c) => c.querySelector("img, picture"));
    const textCol = columns.find((c) => c !== imageCol);
    const textContent = textCol ? Array.from(textCol.children) : [];
    const textCell = textContent.length ? textContent : document2.createTextNode("");
    let imageCell;
    if (imageCol) {
      const media = Array.from(imageCol.querySelectorAll(":scope > picture, :scope > img"));
      imageCell = media.length ? media : imageCol;
    } else {
      imageCell = document2.createTextNode("");
    }
    if (!textCol && !imageCol) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const imageCol = columns.find((c) => c.querySelector("img, picture"));
    const textCol = columns.find((c) => c !== imageCol);
    const imageCell = imageCol && (imageCol.querySelector("picture") || imageCol.querySelector("img")) || document2.createTextNode("");
    const textContent = textCol ? Array.from(textCol.children) : [];
    const textCell = textContent.length ? textContent : document2.createTextNode("");
    if (!imageCol && !textCol) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    let tiles = Array.from(element.querySelectorAll(":scope > .utility-aspect-1x1, :scope > div"));
    tiles = tiles.filter((t) => t.querySelector("img, picture"));
    const cells = [];
    tiles.forEach((tile) => {
      const media = tile.querySelector("picture") || tile.querySelector("img") || tile;
      cells.push([media]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const panels = Array.from(element.querySelectorAll(".tabs-content > .tab-pane, .tab-pane"));
    const labels = Array.from(element.querySelectorAll(".tab-menu > button, .tab-menu-link"));
    const cells = [];
    panels.forEach((panel, i) => {
      const label = labels[i];
      const labelContent = label ? Array.from(label.childNodes) : [];
      const labelCell = labelContent.length ? labelContent : document2.createTextNode("");
      const panelInner = panel.querySelector(":scope > .grid-layout") || panel;
      const panelContent = Array.from(panelInner.children);
      const panelCell = panelContent.length ? panelContent : document2.createTextNode("");
      cells.push([labelCell, panelCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > .article-card, :scope > a.card-link"));
    const cells = [];
    cards.forEach((card) => {
      const imgWrapper = card.querySelector('.article-card-image, [class*="image"]');
      const img = card.querySelector("img");
      const imageCell = imgWrapper || img || document2.createTextNode("");
      const body = card.querySelector('.article-card-body, [class*="body"]');
      const bodyContent = [];
      if (body) {
        bodyContent.push(...Array.from(body.children));
      } else {
        const meta = card.querySelector(".article-card-meta");
        const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
        if (meta) bodyContent.push(meta);
        if (heading) bodyContent.push(heading);
      }
      const href = card.getAttribute("href");
      if (href) {
        const heading = bodyContent.find((el) => el.matches && el.matches("h1, h2, h3, h4, h5, h6"));
        if (heading) {
          const link = document2.createElement("a");
          link.href = href;
          link.append(...heading.childNodes);
          heading.append(link);
        }
      }
      cells.push([imageCell, bodyContent.length ? bodyContent : document2.createTextNode("")]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details, :scope > .faq-item"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let titleCell;
      if (summary) {
        const span = summary.querySelector("span");
        titleCell = span || document2.createTextNode(summary.textContent.trim());
      } else {
        titleCell = document2.createTextNode("");
      }
      const answer = item.querySelector(".faq-answer, :scope > div:last-child");
      const contentCell = answer || document2.createTextNode("");
      cells.push([titleCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector("img, picture");
    const contentContainer = element.querySelector('.card-body, [class*="text-on-overlay"]');
    const scope = contentContainer || element;
    const heading = scope.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = scope.querySelector('p, .subheading, [class*="subheading"]');
    const ctas = Array.from(scope.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    cells.push([bgImage || document2.createTextNode("")]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctas);
    if (!bgImage && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-about-us.js
  var parsers = {
    "columns-intro": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "About Us page",
    urls: [
      "https://wknd-trendsetters.site/about-us"
    ],
    blocks: [
      {
        name: "columns-intro",
        instances: ["#main-content > header.secondary-section .grid-layout.grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: [".grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["#main-content > section.inverse-section .utility-position-relative.utility-overflow-clip"]
      }
    ],
    sections: [
      { id: "rc1", name: "intro", selector: ["#main-content > header.section.secondary-section"], style: "secondary", blocks: ["columns-intro"], defaultContent: [] },
      { id: "rc2", name: "article-header", selector: ["#main-content > section.section:nth-of-type(1)"], style: null, blocks: ["columns-article"], defaultContent: [] },
      { id: "rc3", name: "snapshot-gallery", selector: ["#main-content > section.section.secondary-section:nth-of-type(2)"], style: "secondary", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center"] },
      { id: "rc4", name: "testimonials", selector: ["#main-content > section.section:nth-of-type(3)"], style: null, blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "rc5", name: "latest-articles", selector: ["#main-content > section.section.secondary-section:nth-of-type(4)"], style: "secondary", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center"] },
      { id: "rc6", name: "faq", selector: ["#main-content > section.section:nth-of-type(5)"], style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc7", name: "closing-hero", selector: ["#main-content > section.section.inverse-section"], style: null, blocks: ["hero-overlay"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_about_us_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_about_us_exports);
})();
