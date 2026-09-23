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

  // tools/importer/import-nav.js
  var import_nav_exports = {};
  __export(import_nav_exports, {
    default: () => import_nav_default
  });
  var import_nav_default = {
    transform: (payload) => {
      const { document } = payload;
      const main = document.createElement("div");
      const brandP = document.createElement("p");
      const brandLink = document.createElement("a");
      brandLink.href = "/us/en";
      brandLink.textContent = "WKND";
      brandP.append(brandLink);
      main.append(brandP);
      main.append(document.createElement("hr"));
      const ul = document.createElement("ul");
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
        ul.append(li);
      });
      main.append(ul);
      main.append(document.createElement("hr"));
      const toolsP = document.createElement("p");
      const signIn = document.createElement("a");
      signIn.href = "/us/en";
      signIn.textContent = "Sign In";
      toolsP.append(signIn);
      main.append(toolsP);
      return [{
        element: main,
        path: "/nav",
        report: { title: "WKND Nav", template: "nav" }
      }];
    }
  };
  return __toCommonJS(import_nav_exports);
})();
