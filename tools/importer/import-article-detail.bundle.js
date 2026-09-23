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

  // import-article-detail.js
  var import_article_detail_exports = {};
  __export(import_article_detail_exports, {
    default: () => import_article_detail_default
  });

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

  // parsers/wknd-author-bio.js
  function parse(element, { document }) {
    const byline = element.querySelector(".cmp-byline");
    if (!byline) return;
    const img = byline.querySelector("img");
    const name = byline.querySelector(".cmp-byline__name");
    const role = byline.querySelector(".cmp-byline__occupations");
    const body = [];
    if (name) {
      const h = document.createElement("h3");
      h.textContent = name.textContent.trim();
      body.push(h);
    }
    if (role) {
      const p = document.createElement("p");
      p.textContent = role.textContent.trim();
      body.push(p);
    }
    const container = byline.closest(".byline") || byline.parentElement || element;
    const socialScope = byline.closest(".experiencefragment") || container;
    const anchors = Array.from(socialScope.querySelectorAll(".cmp-buildingblock--btn-list a.cmp-button, .cmp-button")).filter((a) => a.tagName === "A" && (a.getAttribute("aria-label") || a.querySelector(".cmp-button__icon")));
    if (anchors.length) {
      const p = document.createElement("p");
      anchors.forEach((a) => {
        const link = document.createElement("a");
        link.href = a.getAttribute("href") || "#";
        const label = (a.getAttribute("aria-label") || (a.querySelector(".cmp-button__text") || {}).textContent || "Link").trim();
        link.textContent = label;
        p.append(link);
      });
      body.push(p);
    }
    if (!img && !body.length) return;
    const imageCell = img || document.createTextNode("");
    const block = WebImporter.Blocks.createBlock(document, {
      name: "author-bio",
      cells: [[imageCell, body.length ? body : document.createTextNode("")]]
    });
    const xf = byline.closest(".experiencefragment") || container;
    if (xf.parentNode) {
      xf.after(block);
    } else {
      element.appendChild(block);
    }
  }

  // import-article-detail.js
  var PAGE_TEMPLATE = {
    name: "article-detail",
    description: "WKND long-form magazine article",
    urls: ["https://wknd.site/us/en/magazine/arctic-surfing.html"],
    blocks: [],
    sections: []
  };
  var import_article_detail_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      try {
        parse(main, { document, url, params });
      } catch (e) {
        console.error("author-bio parser failed:", e);
      }
      transform("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      transform("afterTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      try {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: "article" }
        });
        main.appendChild(meta);
      } catch (e) {
        console.error("article section meta failed:", e);
      }
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: [] }
      }];
    }
  };
  return __toCommonJS(import_article_detail_exports);
})();
