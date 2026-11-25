
(() => {
  const root = document.querySelector('[data-am-racing]');
  if (!root) return;

  const featured = root.querySelector(
    '[data-am-racing-featured]'
  );

  const caption = root.querySelector(
    '[data-am-racing-caption]'
  );

  const thumbs = [
    ...root.querySelectorAll('[data-racing-image]')
  ];

  if (!featured || !thumbs.length) return;

  let current = 0;

  function selectImage(index) {
    current = (index + thumbs.length) % thumbs.length;

    const selected = thumbs[current];

    // Change ONLY the gallery image
    featured.src = selected.dataset.racingImage;
    featured.alt =
      selected.querySelector('img')?.alt ||
      'AXISPRO project image';

    if (caption) {
      caption.textContent =
        selected.dataset.racingLabel || '';
    }

    thumbs.forEach((thumb, i) => {
      const active = i === current;

      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-pressed', String(active));
    });
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      selectImage(index);
    });
  });

  root.querySelector('[data-am-racing-prev]')
    ?.addEventListener('click', () => {
      selectImage(current - 1);
    });

  root.querySelector('[data-am-racing-next]')
    ?.addEventListener('click', () => {
      selectImage(current + 1);
    });
})();
