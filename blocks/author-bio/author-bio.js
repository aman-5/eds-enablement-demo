/*
 * author-bio — WKND magazine article byline. Authored as a 2-cell row:
 * [avatar image] [name (h3) + role + social links]. Rendered as a horizontal
 * card with a leading rule above it.
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  const imageCell = cells[0];
  const bodyCell = cells[1] || cells[0];

  if (imageCell) imageCell.classList.add('author-bio-avatar');
  if (bodyCell) bodyCell.classList.add('author-bio-body');

  // mark the social-links paragraph (the one holding anchors)
  const socialP = [...(bodyCell ? bodyCell.querySelectorAll('p') : [])]
    .find((p) => p.querySelector('a'));
  if (socialP) socialP.classList.add('author-bio-social');
}
