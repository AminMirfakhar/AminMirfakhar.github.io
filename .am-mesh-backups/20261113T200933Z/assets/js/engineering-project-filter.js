/* Progressive enhancement: server-rendered project cards remain visible without JS. */
(() => {
  const root = document.querySelector('.am-catalog');
  if (!root) return;
  const cards = [...root.querySelectorAll('[data-project-card]')];
  const buttons = [...root.querySelectorAll('[data-category-toggle]')];
  const typeButtons = [...root.querySelectorAll('[data-type-toggle]')];
  const searchInput = root.querySelector('#am-project-search');
  const count = root.querySelector('#am-result-count');
  const empty = root.querySelector('#am-no-results');
  const selected = new Set();
  const selectedTypes = new Set();
  const known = new Set(buttons.map(b => b.dataset.categoryToggle));
  const params = new URLSearchParams(location.search);
  (params.get('category') || '').split(',').filter(x => known.has(x)).forEach(x => selected.add(x));
  const knownTypes = new Set(typeButtons.map(b => b.dataset.typeToggle));
  (params.get('type') || '').split(',').filter(x => knownTypes.has(x)).forEach(x => selectedTypes.add(x));
  function update() {
    const text = (searchInput.value || '').trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const tags = (card.dataset.categories || '').split(/\s+/);
      const categoryMatch = selected.size === 0 || tags.some(t => selected.has(t));
      const textMatch = !text || (card.dataset.search || '').toLocaleLowerCase().includes(text);
      const typeMatch = selectedTypes.size === 0 || selectedTypes.has(card.dataset.projectType);
      const visible = categoryMatch && typeMatch && textMatch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    buttons.forEach(button => {
      const active = selected.has(button.dataset.categoryToggle);
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-selected', active);
    });
    typeButtons.forEach(button => {
      const active = selectedTypes.has(button.dataset.typeToggle);
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-selected', active);
    });
    count.textContent = `${shown} of ${cards.length} unique projects shown`;
    empty.hidden = shown > 0;
    const next = new URL(location.href);
    if (selected.size) next.searchParams.set('category', [...selected].join(','));
    else next.searchParams.delete('category');
    if (selectedTypes.size) next.searchParams.set('type', [...selectedTypes].join(','));
    else next.searchParams.delete('type');
    history.replaceState(null, '', next.pathname + next.search + next.hash);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.categoryToggle;
    selected.has(id) ? selected.delete(id) : selected.add(id);
    update();
  }));
  typeButtons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.typeToggle;
    selectedTypes.has(id) ? selectedTypes.delete(id) : selectedTypes.add(id);
    update();
  }));
  searchInput.addEventListener('input', update);
  function clear() { selected.clear(); selectedTypes.clear(); searchInput.value = ''; update(); }
  root.querySelector('#am-clear-filters').addEventListener('click', clear);
  root.querySelector('#am-reset-empty').addEventListener('click', clear);
  update();
})();
