/*
 * share — WKND "Share this Adventure" social share row. Authored as a heading
 * cell plus one row per share link. On the source the buttons are third-party
 * JS embeds (Facebook, Pinterest); we render accessible share links pointing at
 * the current page.
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  block.querySelectorAll(':scope > div').forEach((row) => row.remove());

  const list = document.createElement('div');
  list.className = 'share-links';
  links.forEach((a) => {
    a.classList.add('share-link');
    a.setAttribute('rel', 'noopener');
    a.setAttribute('target', '_blank');
    list.append(a);
  });
  block.append(list);
}
