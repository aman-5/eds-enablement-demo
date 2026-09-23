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

  // import-adventure-detail.js
  var import_adventure_detail_exports = {};
  __export(import_adventure_detail_exports, {
    default: () => import_adventure_detail_default
  });

  // parsers/wknd-carousel-hero.js
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

  // parsers/wknd-tabs.js
  function parse2(element, { document }) {
    const tabsRoots = Array.from(element.querySelectorAll(".cmp-tabs"));
    if (!tabsRoots.length) return;
    tabsRoots.forEach((root) => {
      const tabItems = Array.from(root.querySelectorAll(".cmp-tabs__tablist > .cmp-tabs__tab"));
      const panels = Array.from(root.querySelectorAll(".cmp-tabs__tabpanel"));
      if (!tabItems.length || !panels.length) return;
      const cells = [];
      tabItems.forEach((tab, i) => {
        const label = (tab.textContent || "").trim() || `Tab ${i + 1}`;
        const controls = tab.getAttribute("aria-controls");
        let panel = controls ? root.querySelector(`#${CSS.escape(controls)}`) : null;
        if (!panel) panel = panels[i];
        if (!panel) return;
        const labelDiv = document.createElement("div");
        labelDiv.textContent = label;
        const bodyDiv = document.createElement("div");
        while (panel.firstChild) bodyDiv.append(panel.firstChild);
        cells.push([labelDiv, bodyDiv]);
      });
      if (!cells.length) return;
      const block = WebImporter.Blocks.createBlock(document, { name: "tabs", cells });
      root.replaceWith(block);
    });
  }

  // parsers/wknd-trip-details.js
  function parse3(element, { document }) {
    const dls = Array.from(element.querySelectorAll("dl.cmp-contentfragment__elements"));
    if (!dls.length) return;
    const dl = dls[0];
    const items = Array.from(dl.querySelectorAll(".cmp-contentfragment__element"));
    if (!items.length) return;
    const cells = [];
    items.forEach((el) => {
      const dt = el.querySelector(".cmp-contentfragment__element-title, dt");
      const dd = el.querySelector(".cmp-contentfragment__element-value, dd");
      const label = dt ? dt.textContent.trim() : "";
      const value = dd ? dd.textContent.trim() : "";
      if (!label && !value) return;
      const l = document.createElement("div");
      l.textContent = label;
      const v = document.createElement("div");
      v.textContent = value;
      cells.push([l, v]);
    });
    if (!cells.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "trip-details", cells });
    const wrapper = dl.closest(".cmp-contentfragment") || dl;
    wrapper.replaceWith(block);
  }

  // parsers/wknd-share.js
  function parse4(element, { document, url, params }) {
    const sharing = element.querySelector(".sharing");
    if (!sharing) return;
    const originalURL = params && params.originalURL || url || "";
    let pagePath = "";
    try {
      pagePath = new URL(originalURL).pathname.replace(/\.html?$/, "");
    } catch (e) {
      pagePath = "";
    }
    const shareTarget = `https://wknd.site${pagePath}`;
    const enc = encodeURIComponent(shareTarget);
    const links = [
      { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
      { label: "Pinterest", href: `https://www.pinterest.com/pin/create/button/?url=${enc}` }
    ];
    const cells = links.map(({ label, href }) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      return [a];
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "share", cells });
    sharing.replaceWith(block);
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

  // import-adventure-detail.js
  var parsers = { "carousel-hero": parse };
  var PAGE_TEMPLATE = {
    name: "adventure-detail",
    urls: ["https://wknd.site/us/en/adventures/climbing-new-zealand.html"],
    blocks: [
      { name: "carousel-hero", instances: [".carousel.cmp-carousel--hero", ".carousel.cmp-carousel--mini", ".carousel.cmp-carousel"] }
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
      try {
        parse3(main, { document, url, params });
      } catch (e) {
        console.error("trip-details parser failed:", e);
      }
      try {
        parse4(main, { document, url, params });
      } catch (e) {
        console.error("share parser failed:", e);
      }
      try {
        parse2(main, { document, url, params });
      } catch (e) {
        console.error("tabs parser failed:", e);
      }
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
      try {
        const tables = Array.from(main.querySelectorAll("table"));
        const carouselTable = tables.find((t) => {
          const head = t.querySelector("tr");
          return head && /carousel[\s-]*hero/i.test(head.textContent || "");
        });
        if (carouselTable) {
          const hr2 = document.createElement("hr");
          carouselTable.after(hr2);
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: "two-column" }
          });
          hr2.after(metaBlock);
        }
      } catch (e) {
        console.error("section layout failed:", e);
      }
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
