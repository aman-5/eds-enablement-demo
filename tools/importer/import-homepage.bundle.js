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

  // import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // parsers/wknd-carousel-hero.js
  function parse(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    items.forEach((item) => {
      const teaser = item.querySelector(".cmp-teaser") || item;
      const img = teaser.querySelector("img");
      const title = teaser.querySelector(".cmp-teaser__title");
      const desc = teaser.querySelector(".cmp-teaser__description");
      const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-button");
      const cell = [];
      if (img) cell.push(img);
      if (title) {
        const h = document2.createElement("h2");
        h.textContent = title.textContent.trim();
        cell.push(h);
      }
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        cell.push(p);
      }
      if (cta) {
        const a = document2.createElement("a");
        a.href = cta.getAttribute("href") || "#";
        a.textContent = cta.textContent.trim();
        cell.push(a);
      }
      if (cell.length) cells.push([cell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // parsers/wknd-columns-intro.js
  function parse2(element, { document: document2 }) {
    const teaser = element.querySelector(".cmp-teaser") || element;
    const img = teaser.querySelector("img");
    const pretitle = teaser.querySelector(".cmp-teaser__pretitle");
    const title = teaser.querySelector(".cmp-teaser__title");
    const desc = teaser.querySelector(".cmp-teaser__description");
    const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-button");
    const textCell = [];
    if (pretitle) {
      const p = document2.createElement("p");
      p.innerHTML = `<strong>${pretitle.textContent.trim()}</strong>`;
      textCell.push(p);
    }
    if (title) {
      const h = document2.createElement("h2");
      h.textContent = title.textContent.trim();
      textCell.push(h);
    }
    if (desc) {
      const p = document2.createElement("p");
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    if (cta) {
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href") || "#";
      a.textContent = cta.textContent.trim();
      textCell.push(a);
    }
    const imageCell = img || document2.createTextNode("");
    if (!textCell.length && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell.length ? textCell : document2.createTextNode(""), imageCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // parsers/wknd-cards-article.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-image-list__item"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link, .cmp-image-list__item-title a, a.cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      const desc = item.querySelector(".cmp-image-list__item-description");
      const href = titleLink && titleLink.getAttribute("href") || item.querySelector("a") && item.querySelector("a").getAttribute("href") || "#";
      const imageCell = img || document2.createTextNode("");
      const body = [];
      const h = document2.createElement("h3");
      const a = document2.createElement("a");
      a.href = href;
      a.textContent = (titleText || titleLink || { textContent: "" }).textContent.trim();
      h.append(a);
      body.push(h);
      if (desc && desc.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        body.push(p);
      }
      cells.push([imageCell, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // parsers/wknd-hero-overlay.js
  function parse4(element, { document: document2 }) {
    const teaser = element.querySelector(".cmp-teaser") || element;
    const img = teaser.querySelector("img");
    const title = teaser.querySelector(".cmp-teaser__title");
    const desc = teaser.querySelector(".cmp-teaser__description");
    const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-button");
    const cells = [];
    cells.push([img || document2.createTextNode("")]);
    const content = [];
    if (title) {
      const h = document2.createElement("h2");
      h.textContent = title.textContent.trim();
      content.push(h);
    }
    if (desc) {
      const p = document2.createElement("p");
      p.textContent = desc.textContent.trim();
      content.push(p);
    }
    if (cta) {
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href") || "#";
      a.textContent = cta.textContent.trim();
      content.push(a);
    }
    if (!img && !content.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([content.length ? content : document2.createTextNode("")]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function rewriteLinks(element) {
    element.querySelectorAll("a[href]").forEach((a) => {
      let href = a.getAttribute("href");
      if (!href) return;
      href = href.replace(/^\/content\/wknd\//, "/");
      if (/^\//.test(href)) {
        href = href.replace(/\.html(#.*)?$/, "$1");
      }
      a.setAttribute("href", href);
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        ".header",
        "nav",
        ".navigation",
        ".cmp-navigation",
        ".languagenavigation",
        ".cmp-languagenavigation",
        ".cmp-breadcrumb",
        ".breadcrumb",
        ".skip-to-main-content",
        ".skip-link",
        "footer",
        ".footer",
        ".cmp-footer",
        ".experiencefragment",
        "style",
        "script",
        "noscript",
        // Adobe DX tracking / ID-sync iframes and pixels (non-content)
        'iframe[src*="demdex"]',
        'a[href*="demdex"]',
        '[id*="destination-publishing"]',
        // Article-detail chrome: related-articles sidebar and share widget
        ".cmp-layoutcontainer--sidebar",
        '[class*="sidebar"]',
        ".social",
        ".cmp-sharing",
        // Content-fragment internal title duplicates the page H1 — drop it
        ".cmp-contentfragment__title",
        // Carousel prev/next/indicator chrome leaks as "Previous Next" text
        ".cmp-carousel__actions",
        ".cmp-carousel__action",
        ".cmp-carousel__indicators",
        ".cmp-tabs__tablist",
        ".cmp-image-list__item-button"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      rewriteLinks(element);
    }
  }

  // transformers/wknd-trendsetters-sections.js
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

  // transformers/wknd-dynamic-listings.js
  function precedingHeadingText(table) {
    let el = table.previousElementSibling;
    let hops = 0;
    while (el && hops < 6) {
      if (/^H[1-6]$/.test(el.tagName)) return (el.textContent || "").trim();
      const h = el.querySelector && el.querySelector("h1,h2,h3,h4,h5,h6");
      if (h) return (h.textContent || "").trim();
      el = el.previousElementSibling;
      hops += 1;
    }
    return "";
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const rules = payload.template && payload.template.dynamicListings || [];
    if (!rules.length) return;
    const tables = Array.from(element.querySelectorAll("table")).filter((t) => {
      const head = t.querySelector("tr");
      const label = (head && head.textContent || "").trim();
      return /^cards[\s-]*article\b/i.test(label) && !/contributor/i.test(label);
    });
    let ruleIdx = 0;
    tables.forEach((table) => {
      const heading = precedingHeadingText(table);
      let rule = rules.find((r) => r.match && r.match.test(heading));
      if (!rule) {
        rule = rules[ruleIdx];
      }
      if (!rule) return;
      ruleIdx += 1;
      const cells = Object.entries(rule.config).map(([k, v]) => [k, String(v)]);
      const dyn = WebImporter.Blocks.createBlock(document, {
        name: rule.name || "Cards Article (dynamic)",
        cells
      });
      table.replaceWith(dyn);
    });
  }

  // import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "columns-intro": parse2,
    "cards-article": parse3,
    "hero-overlay": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND homepage",
    urls: ["https://wknd.site/us/en.html"],
    blocks: [
      { name: "carousel-hero", instances: [".carousel.cmp-carousel--hero"] },
      { name: "columns-intro", instances: [".teaser.cmp-teaser--featured"] },
      { name: "cards-article", instances: ["ul.cmp-image-list"] },
      { name: "hero-overlay", instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"] }
    ],
    sections: [
      { id: "rc1", name: "hero", selector: [".carousel.cmp-carousel--hero"], style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "rc2", name: "featured", selector: [".teaser.cmp-teaser--featured"], style: "light", blocks: ["columns-intro"], defaultContent: [] }
    ],
    // Convert the two static card rails into the dynamic (index-driven) variant.
    dynamicListings: [
      { match: /recent articles/i, name: "Cards Article (dynamic)", config: { source: "/us/en/magazine/", limit: "4" } },
      { match: /where do you want to go/i, name: "Cards Article (dynamic)", config: { source: "/us/en/adventures/", limit: "4" } }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
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
  return __toCommonJS(import_homepage_exports);
})();
