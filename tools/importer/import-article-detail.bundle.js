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

  // tools/importer/import-article-detail.js
  var import_article_detail_exports = {};
  __export(import_article_detail_exports, {
    default: () => import_article_detail_default
  });

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
        ".cmp-contentfragment__title"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      rewriteLinks(element);
    }
  }

  // tools/importer/import-article-detail.js
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
      transform("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      transform("afterTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
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
