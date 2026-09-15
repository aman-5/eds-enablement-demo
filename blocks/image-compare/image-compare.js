export default function decorate(block) {
  const [right, left] = block.querySelectorAll(':scope > div');
  right.className = 'image-compare-right';
  left.className = 'image-compare-left';

  // keep the overlay image at the same rendered width as the base image,
  // regardless of how narrow the clipping window (left) currently is
  const inner = document.createElement('div');
  inner.className = 'image-compare-left-inner';
  while (left.firstChild) inner.append(left.firstChild);
  left.append(inner);

  const resizeObserver = new ResizeObserver(() => {
    inner.style.width = `${block.getBoundingClientRect().width}px`;
  });
  resizeObserver.observe(block);

  const afterLabel = document.createElement('span');
  afterLabel.className = 'image-compare-label';
  afterLabel.textContent = 'After';
  right.append(afterLabel);

  const beforeLabel = document.createElement('span');
  beforeLabel.className = 'image-compare-label';
  beforeLabel.textContent = 'Before';
  left.append(beforeLabel);

  const slider = document.createElement('div');
  slider.className = 'image-compare-slider';

  const range = document.createElement('input');
  range.type = 'range';
  range.min = 0;
  range.max = 100;
  range.value = 50;
  range.setAttribute('aria-label', 'Compare images');

  range.addEventListener('input', (e) => {
    left.style.width = `${e.target.value}%`;
  });

  slider.append(range);
  left.after(slider);
}
