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

  // tools/importer/import-adventures-listing.js
  var import_adventures_listing_exports = {};
  __export(import_adventures_listing_exports, {
    default: () => import_adventures_listing_default
  });

  // tools/importer/parsers/wknd-columns-intro.js
  function parse(element, { document }) {
    const teaser = element.querySelector(".cmp-teaser") || element;
    const img = teaser.querySelector("img");
    const pretitle = teaser.querySelector(".cmp-teaser__pretitle");
    const title = teaser.querySelector(".cmp-teaser__title");
    const desc = teaser.querySelector(".cmp-teaser__description");
    const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-button");
    const textCell = [];
    if (pretitle) {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${pretitle.textContent.trim()}</strong>`;
      textCell.push(p);
    }
    if (title) {
      const h = document.createElement("h2");
      h.textContent = title.textContent.trim();
      textCell.push(h);
    }
    if (desc) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    if (cta) {
      const a = document.createElement("a");
      a.href = cta.getAttribute("href") || "#";
      a.textContent = cta.textContent.trim();
      textCell.push(a);
    }
    const imageCell = img || document.createTextNode("");
    if (!textCell.length && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell.length ? textCell : document.createTextNode(""), imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/wknd-cards-article.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-image-list__item"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link, .cmp-image-list__item-title a, a.cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      const desc = item.querySelector(".cmp-image-list__item-description");
      const href = titleLink && titleLink.getAttribute("href") || item.querySelector("a") && item.querySelector("a").getAttribute("href") || "#";
      const imageCell = img || document.createTextNode("");
      const body = [];
      const h = document.createElement("h3");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = (titleText || titleLink || { textContent: "" }).textContent.trim();
      h.append(a);
      body.push(h);
      if (desc && desc.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        body.push(p);
      }
      cells.push([imageCell, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
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

  // tools/importer/import-adventures-listing.js
  var parsers = { "columns-intro": parse, "cards-article": parse2 };
  var PAGE_TEMPLATE = {
    name: "adventures-listing",
    urls: ["https://wknd.site/us/en/adventures.html"],
    blocks: [
      { name: "columns-intro", instances: [".teaser.cmp-teaser--featured", ".teaser.cmp-teaser--content"] },
      { name: "cards-article", instances: ["ul.cmp-image-list"] }
    ],
    sections: []
  };
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((b) => b.instances.forEach((sel) => {
      let els = [...document.querySelectorAll(sel)];
      if (b.name === "cards-article") els = els.slice(0, 1);
      els.forEach((el) => pageBlocks.push({ name: b.name, selector: sel, element: el }));
    }));
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventures_listing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      const ep = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
      transform("beforeTransform", main, ep);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`parse ${block.name}`, e);
          }
        }
      });
      transform("afterTransform", main, ep);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_adventures_listing_exports);
})();
