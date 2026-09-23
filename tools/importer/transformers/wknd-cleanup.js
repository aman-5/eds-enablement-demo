/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable AEM Core Components chrome (header, language nav,
 * footer, breadcrumbs, skip links) and rewrites internal links from
 * /content/wknd/us/en/*.html and /us/en/*.html to clean root-relative /us/en/*.
 * Selectors verified against the live WKND markup / migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function rewriteLinks(element) {
  element.querySelectorAll('a[href]').forEach((a) => {
    let href = a.getAttribute('href');
    if (!href) return;
    // /content/wknd/us/en/... -> /us/en/...
    href = href.replace(/^\/content\/wknd\//, '/');
    // strip .html from internal links
    if (/^\//.test(href)) {
      href = href.replace(/\.html(#.*)?$/, '$1');
    }
    a.setAttribute('href', href);
  });
  // Also rewrite <img>/<source> that reference coreimg rendition domains left as-is;
  // adjustImageUrls in the import script handles absolute source URLs.
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove global chrome BEFORE block parsing so it never lands in cells.
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.header',
      'nav',
      '.navigation',
      '.cmp-navigation',
      '.languagenavigation',
      '.cmp-languagenavigation',
      '.cmp-breadcrumb',
      '.breadcrumb',
      '.skip-to-main-content',
      '.skip-link',
      'footer',
      '.footer',
      '.cmp-footer',
      '.experiencefragment',
      'style',
      'script',
      'noscript',
      // Adobe DX tracking / ID-sync iframes and pixels (non-content)
      'iframe[src*="demdex"]',
      'a[href*="demdex"]',
      '[id*="destination-publishing"]',
      // Article-detail chrome: related-articles sidebar and share widget
      '.cmp-layoutcontainer--sidebar',
      '[class*="sidebar"]',
      '.social',
      '.cmp-sharing',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    rewriteLinks(element);
  }
}
