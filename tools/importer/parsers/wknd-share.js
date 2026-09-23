/* eslint-disable */
/* global WebImporter */
/**
 * Parser for WKND "Share this Adventure" widget.
 * Source: https://wknd.site/us/en/adventures/*.html — an <h5>Share this
 * Adventure</h5> title followed by a `.sharing` div with third-party embeds
 * (Facebook button + Pinterest link). Those embeds carry no durable content,
 * so we emit real share links (Facebook + Pinterest) that point at the page.
 * Emits a `share` block. Runs before cleanup (which would strip `.sharing`).
 */
export default function parse(element, { document, url, params }) {
  const sharing = element.querySelector('.sharing');
  if (!sharing) return;

  // Resolve the canonical page path -> clean /us/en/... URL.
  const originalURL = (params && params.originalURL) || url || '';
  let pagePath = '';
  try {
    pagePath = new URL(originalURL).pathname.replace(/\.html?$/, '');
  } catch (e) {
    pagePath = '';
  }
  const shareTarget = `https://wknd.site${pagePath}`;
  const enc = encodeURIComponent(shareTarget);

  const links = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { label: 'Pinterest', href: `https://www.pinterest.com/pin/create/button/?url=${enc}` },
  ];

  const cells = links.map(({ label, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    return [a];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'share', cells });

  // Keep the "Share this Adventure" heading (h5) just before the block; replace
  // the .sharing widget with the block.
  sharing.replaceWith(block);
}
