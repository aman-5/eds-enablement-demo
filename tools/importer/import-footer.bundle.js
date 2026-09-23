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
      const linkOf = (label, href) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        return a;
      };
      const attribution = document.createElement("p");
      attribution.append(
        document.createTextNode("WKND is a fictitious adventure and travel website created by Adobe to demonstrate how anyone can use Adobe Experience Manager to build a beautiful, feature-rich website over a single weekend. This site is built entirely with Adobe Experience Manager "),
        linkOf("Core Components", "https://docs.adobe.com/content/help/en/experience-manager-core-components/using/introduction.html"),
        document.createTextNode(" and "),
        linkOf("Archetype", "https://github.com/adobe/aem-project-archetype"),
        document.createTextNode(" that are available as open source code to the public. The entire "),
        linkOf("site source code", "https://github.com/adobe/aem-guides-wknd/"),
        document.createTextNode(" is available as open source as well and is accompanied with a "),
        linkOf("detailed tutorial", "https://docs.adobe.com/content/help/en/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html"),
        document.createTextNode(" on how to recreate the site.")
      );
      main.append(attribution);
      const stock = document.createElement("p");
      stock.append(
        document.createTextNode("Many of the beautiful images in the WKND site are available for purchase via "),
        linkOf("Adobe Stock", "https://stock.adobe.com/"),
        document.createTextNode(".")
      );
      main.append(stock);
      return [{
        element: main,
        path: "/footer",
        report: { title: "WKND Footer", template: "footer" }
      }];
    }
  };
  return __toCommonJS(import_footer_exports);
})();
