export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.querySelectorAll('picture').length >= 1) {
          // column holds one or more images (image group)
          picWrapper.classList.add('columns-intro-img-col');
        }
      }
    });
  });
}
