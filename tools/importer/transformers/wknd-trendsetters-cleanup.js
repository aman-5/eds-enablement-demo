/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html.
 *
 * NOTE: The intro section is authored markup expressed as
 * <header class="section secondary-section"> INSIDE #main-content
 * (block: columns-intro). Never remove a bare `header` — that would delete
 * authorable content. Only the specific chrome selectors below are removed.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumb navigation lives inside the article section grid
    // (#main-content > section.section:nth-of-type(1) ... .breadcrumbs).
    // It is non-authorable nav; remove before parsing so it never lands in
    // the columns-article block cells. Verified: cleaned.html <div class="breadcrumbs">.
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome. Verified in cleaned.html:
    //   .skip-link  -> "Skip to main content" link (body top)
    //   .navbar     -> top navigation / mega-menu container
    //   footer.footer -> site footer
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
