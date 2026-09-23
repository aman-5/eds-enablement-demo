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

  // tools/importer/import-adventure-detail.js
  var import_adventure_detail_exports = {};
  __export(import_adventure_detail_exports, {
    default: () => import_adventure_detail_default
  });

  // tools/importer/parsers/wknd-carousel-hero.js
  function parse(element, { document }) {
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
        const h = document.createElement("h2");
        h.textContent = title.textContent.trim();
        cell.push(h);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        cell.push(p);
      }
      if (cta) {
        const a = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
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

  // tools/importer/import-adventure-detail.js
  var parsers = { "carousel-hero": parse };
  var PAGE_TEMPLATE = {
    name: "adventure-detail",
    urls: ["https://wknd.site/us/en/adventures/climbing-new-zealand.html"],
    blocks: [
      { name: "carousel-hero", instances: [".carousel.cmp-carousel"] }
    ],
    sections: []
  };
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((b) => b.instances.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => pageBlocks.push({ name: b.name, selector: sel, element: el }));
    }));
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventure_detail_default = {
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
  return __toCommonJS(import_adventure_detail_exports);
})();
