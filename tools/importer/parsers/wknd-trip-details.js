/* eslint-disable */
/* global WebImporter */
/**
 * Parser for WKND adventure trip-details (dl.cmp-contentfragment__elements).
 * Source: https://wknd.site/us/en/adventures/*.html
 * Each `.cmp-contentfragment__element` = dt (label) + dd (value).
 * Emits a `trip-details` block: one row per fact = [label, value].
 *
 * Runs before cleanup. Only the adventure fact-list content fragment carries
 * these element classes, so it won't collide with article content fragments.
 */
export default function parse(element, { document }) {
  const dls = Array.from(element.querySelectorAll('dl.cmp-contentfragment__elements'));
  if (!dls.length) return;

  // Use the first fact-list only (the adventure detail fragment).
  const dl = dls[0];
  const items = Array.from(dl.querySelectorAll('.cmp-contentfragment__element'));
  if (!items.length) return;

  const cells = [];
  items.forEach((el) => {
    const dt = el.querySelector('.cmp-contentfragment__element-title, dt');
    const dd = el.querySelector('.cmp-contentfragment__element-value, dd');
    const label = dt ? dt.textContent.trim() : '';
    const value = dd ? dd.textContent.trim() : '';
    if (!label && !value) return;
    const l = document.createElement('div');
    l.textContent = label;
    const v = document.createElement('div');
    v.textContent = value;
    cells.push([l, v]);
  });

  if (!cells.length) return;
  const block = WebImporter.Blocks.createBlock(document, { name: 'trip-details', cells });
  // Replace the whole content-fragment wrapper if present, else just the dl.
  const wrapper = dl.closest('.cmp-contentfragment') || dl;
  wrapper.replaceWith(block);
}
