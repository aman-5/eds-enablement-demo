/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-footer.js
  var import_footer_exports = {};
  __export(import_footer_exports, {
    default: () => import_footer_default
  });
  var import_footer_default = {
    transform: (payload) => {
      const { document } = payload;
      const main = document.createElement("div");
      const brandP = document.createElement("p");
      const brandLink = document.createElement("a");
      brandLink.href = "/us/en";
      brandLink.textContent = "WKND";
      brandP.append(brandLink);
      main.append(brandP);
      const navUl = document.createElement("ul");
      [
        ["Magazine", "/us/en/magazine"],
        ["Adventures", "/us/en/adventures"],
        ["FAQs", "/us/en/faqs"],
        ["About Us", "/us/en/about-us"]
      ].forEach(([label, href]) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        li.append(a);
        navUl.append(li);
      });
      main.append(navUl);
      const followH = document.createElement("h4");
      followH.textContent = "Follow Us";
      main.append(followH);
      const socialUl = document.createElement("ul");
      [
        ["Facebook", "https://www.facebook.com/"],
        ["Twitter", "https://twitter.com/"],
        ["Instagram", "https://www.instagram.com/"]
      ].forEach(([label, href]) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        li.append(a);
        socialUl.append(li);
      });
      main.append(socialUl);
      main.append(document.createElement("hr"));
      const copy = document.createElement("p");
      copy.textContent = "\u24B8 2019, WKND Site.";
      main.append(copy);
      const attribution = document.createElement("p");
      attribution.textContent = "WKND is a fictitious adventure and travel website created by Adobe to demonstrate how anyone can build a beautiful, feature-rich website with Adobe Experience Manager.";
      main.append(attribution);
      return [{
        element: main,
        path: "/footer",
        report: { title: "WKND Footer", template: "footer" }
      }];
    }
  };
  return __toCommonJS(import_footer_exports);
})();
