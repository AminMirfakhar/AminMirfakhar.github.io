/* Sidebar checkbox filters. One DOM card per project, no duplication. */
(() => {
  const root = document.querySelector('.am-catalog');
  if (!root) return;
  const cards = Array.from(root.querySelectorAll('[data-project-card]'));
  const categories = Array.from(root.querySelectorAll('input[data-category-filter]'));
  const types = Array.from(root.querySelectorAll('input[data-type-filter]'));
  const searchInput = root.querySelector('#am-project-search');
  const count = root.querySelector('#am-result-count');
  const empty = root.querySelector('#am-no-results');
  const clearButton = root.querySelector('#am-clear-filters');
  const resetButton = root.querySelector('#am-reset-empty');
  if (!searchInput || !count || !empty || !clearButton || !resetButton) return;

  const params = new URLSearchParams(window.location.search);
  const preselected = new Set((params.get('category') || '').split(',').filter(Boolean));
  const preselectedTypes = new Set((params.get('type') || '').split(',').filter(Boolean));
  categories.forEach(input => { input.checked = preselected.has(input.value); });
  types.forEach(input => { input.checked = preselectedTypes.has(input.value); });

  function update() {
    const selectedCategories = new Set(categories.filter(i => i.checked).map(i => i.value));
    const selectedTypes = new Set(types.filter(i => i.checked).map(i => i.value));
    const query = searchInput.value.trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const tags = (card.dataset.categories || '').split(/\s+/);
      const disciplineMatch = !selectedCategories.size || tags.some(t => selectedCategories.has(t));
      const typeMatch = !selectedTypes.size || selectedTypes.has(card.dataset.projectType);
      const searchMatch = !query || (card.dataset.search || '').toLocaleLowerCase().includes(query);
      const visible = disciplineMatch && typeMatch && searchMatch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    count.textContent = `${shown} of ${cards.length} projects`;
    empty.hidden = shown !== 0;
    clearButton.disabled = !(selectedCategories.size || selectedTypes.size || query);
    const next = new URL(window.location.href);
    if (selectedCategories.size) next.searchParams.set('category', [...selectedCategories].join(','));
    else next.searchParams.delete('category');
    if (selectedTypes.size) next.searchParams.set('type', [...selectedTypes].join(','));
    else next.searchParams.delete('type');
    window.history.replaceState(null, '', next.pathname + next.search + next.hash);
  }
  function clear() {
    [...categories, ...types].forEach(input => { input.checked = false; });
    searchInput.value = '';
    update();
  }
  [...categories, ...types].forEach(input => input.addEventListener('change', update));
  searchInput.addEventListener('input', update);
  clearButton.addEventListener('click', clear);
  resetButton.addEventListener('click', clear);
  update();
})();
