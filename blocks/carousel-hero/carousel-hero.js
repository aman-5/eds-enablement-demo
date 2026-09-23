import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * WKND hero carousel.
 * Expected authored structure: one row per slide, each row a single cell
 * containing an image (picture) followed by a heading, description and an
 * optional CTA link. Slides rotate with prev/next controls and indicator dots.
 */
export default function decorate(block) {
  const slides = [...block.children];
  const container = document.createElement('div');
  container.className = 'carousel-hero-slides';

  slides.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-hero-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
    if (i !== 0) slide.setAttribute('aria-hidden', 'true');

    const cell = row.firstElementChild || row;

    // media
    const img = cell.querySelector('img');
    const media = document.createElement('div');
    media.className = 'carousel-hero-media';
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt, i === 0, [{ width: '2000' }]);
      media.append(pic);
    }

    // text content: everything that is not the picture
    const content = document.createElement('div');
    content.className = 'carousel-hero-content';
    [...cell.children].forEach((el) => {
      if (el.querySelector && el.querySelector('picture, img')) return;
      if (el.tagName === 'PICTURE') return;
      content.append(el);
    });

    slide.append(media, content);
    container.append(slide);
  });

  block.textContent = '';
  block.append(container);

  if (slides.length <= 1) return;

  // controls
  const nav = document.createElement('div');
  nav.className = 'carousel-hero-nav';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-hero-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-hero-next';
  next.setAttribute('aria-label', 'Next slide');
  nav.append(prev, next);
  block.append(nav);

  // indicator dots
  const dots = document.createElement('div');
  dots.className = 'carousel-hero-dots';
  dots.setAttribute('role', 'tablist');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-hero-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    if (i === 0) dot.setAttribute('aria-selected', 'true');
    dots.append(dot);
  });
  block.append(dots);

  const slideEls = [...container.children];
  let current = 0;
  const show = (idx) => {
    current = (idx + slideEls.length) % slideEls.length;
    slideEls.forEach((s, i) => {
      const hidden = i !== current;
      s.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      // Keep focusable descendants out of the tab order on hidden slides so
      // aria-hidden never traps focus (Lighthouse aria-hidden-focus).
      s.querySelectorAll('a, button').forEach((el) => {
        if (hidden) el.setAttribute('tabindex', '-1');
        else el.removeAttribute('tabindex');
      });
    });
    [...dots.children].forEach((d, i) => {
      if (i === current) d.setAttribute('aria-selected', 'true');
      else d.removeAttribute('aria-selected');
    });
    container.style.transform = `translateX(-${current * 100}%)`;
  };

  // Autoplay: advance every 10s. Pause on hover/focus and when the tab is
  // hidden; respect prefers-reduced-motion (no autoplay).
  const AUTOPLAY_MS = 10000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => {
    if (reduceMotion || timer) return;
    timer = setInterval(() => show(current + 1), AUTOPLAY_MS);
  };
  const restart = () => { stop(); start(); };

  prev.addEventListener('click', () => { show(current - 1); restart(); });
  next.addEventListener('click', () => { show(current + 1); restart(); });
  [...dots.children].forEach((d, i) => d.addEventListener('click', () => { show(i); restart(); }));

  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  show(0);
  start();
}
