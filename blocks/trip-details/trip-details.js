/*
 * trip-details — WKND adventure fact list (Activity, Adventure Type, Trip
 * Length, Group Size, Difficulty, Price). Authored as a 2-column table: each
 * row = [label, value]. Rendered as a definition list.
 */
export default function decorate(block) {
  const dl = document.createElement('dl');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const dt = document.createElement('dt');
    dt.textContent = (cells[0].textContent || '').trim();
    const dd = document.createElement('dd');
    dd.textContent = (cells[1].textContent || '').trim();
    dl.append(dt, dd);
  });
  block.textContent = '';
  block.append(dl);
}
