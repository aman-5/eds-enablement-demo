import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  const imageRow = rows.find((row) => row.querySelector('picture'));
  const titleRow = rows.find((row) => row.querySelector('h1, h2, h3, h4, h5, h6'))
    || rows.find((row) => row !== imageRow);

  const banner = document.createElement('div');
  banner.className = 'banner-inner';

  if (imageRow) {
    const img = imageRow.querySelector('img');
    const figure = document.createElement('div');
    figure.className = 'banner-image';
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '900' }]);
      figure.append(optimized);
    } else {
      while (imageRow.firstElementChild) figure.append(imageRow.firstElementChild);
    }
    banner.append(figure);
  }

  if (titleRow) {
    const body = document.createElement('div');
    body.className = 'banner-body';
    let heading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) {
      const text = titleRow.textContent.trim();
      if (text) {
        heading = document.createElement('h2');
        heading.textContent = text;
      }
    }
    if (heading) body.append(heading);
    banner.append(body);
  }

  block.replaceChildren(banner);
}
