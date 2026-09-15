import { getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  const title = getMetadata('og:title') || document.title;
  const segments = window.location.pathname.split('/').filter(Boolean);

  const trail = [{ text: 'Home', link: '/' }];
  let path = '';
  segments.forEach((seg, i) => {
    path += `/${seg}`;
    const isLast = i === segments.length - 1;
    trail.push({
      text: isLast ? title : seg.replace(/-/g, ' '),
      link: isLast ? undefined : path,
    });
  });

  const ul = document.createElement('ul');
  trail.forEach((step) => {
    const li = document.createElement('li');
    let wrap = li;
    if (step.link) {
      wrap = document.createElement('a');
      wrap.href = step.link;
      li.append(wrap);
    }
    const span = document.createElement('span');
    span.textContent = step.text;
    wrap.append(span);
    ul.append(li);
  });

  block.append(ul);
}
