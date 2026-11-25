
/*
 * Engineering Projects Directory
 * Filters:
 * - Technical disciplines
 * - Project types
 * - Software and skills
 * - Search
 */

(() => {
  const root = document.querySelector('.am-catalog');
  if (!root) return;

  const cards = Array.from(
    root.querySelectorAll('[data-project-card]')
  );

  const categories = Array.from(
    root.querySelectorAll('[data-category-filter]')
  );

  const types = Array.from(
    root.querySelectorAll('[data-type-filter]')
  );

  const searchInput =
    root.querySelector('#am-project-search');

  const count =
    root.querySelector('#am-result-count');

  const empty =
    root.querySelector('#am-no-results');

  const clearButton =
    root.querySelector('#am-clear-filters');

  const resetButton =
    root.querySelector('#am-reset-empty');

  if (
    !searchInput ||
    !count ||
    !empty ||
    !clearButton ||
    !resetButton
  ) {
    return;
  }

  // Read filters from the page URL
  const params = new URLSearchParams(
    window.location.search
  );

  const preselectedCategories = new Set(
    (params.get('category') || '')
      .split(',')
      .filter(Boolean)
  );

  const preselectedTypes = new Set(
    (params.get('type') || '')
      .split(',')
      .filter(Boolean)
  );

  let selectedSkill = params.get('skill') || '';

  // Restore category selections
  categories.forEach(input => {
    input.checked =
      preselectedCategories.has(input.value);
  });

  // Restore project type selections
  types.forEach(input => {
    input.checked =
      preselectedTypes.has(input.value);
  });

  // Main filtering function
  function update() {
    const selectedCategories = new Set(
      categories
        .filter(input => input.checked)
        .map(input => input.value)
    );

    const selectedTypes = new Set(
      types
        .filter(input => input.checked)
        .map(input => input.value)
    );

    const query = searchInput.value
      .trim()
      .toLocaleLowerCase();

    let shown = 0;

    cards.forEach(card => {
      const disciplineTags =
        (card.dataset.categories || '')
          .split(/\s+/)
          .filter(Boolean);

      const skillTags =
        (card.dataset.skills || '')
          .split(/\s+/)
          .filter(Boolean);

      // Existing discipline checkbox filtering
      const disciplineMatch =
        !selectedCategories.size ||
        disciplineTags.some(tag =>
          selectedCategories.has(tag)
        );

      // Existing project type filtering
      const typeMatch =
        !selectedTypes.size ||
        selectedTypes.has(
          card.dataset.projectType
        );

      // Existing search filtering
      const searchMatch =
        !query ||
        (card.dataset.search || '')
          .toLocaleLowerCase()
          .includes(query);

      // NEW: skill filtering
      const skillMatch =
        !selectedSkill ||
        skillTags.includes(selectedSkill);

      // All active filters must match
      const visible =
        disciplineMatch &&
        typeMatch &&
        searchMatch &&
        skillMatch;

      card.hidden = !visible;

      if (visible) {
        shown++;
      }
    });

    // Update results counter
    count.textContent =
      `${shown} of ${cards.length} projects`;

    // Show empty state
    empty.hidden = shown !== 0;

    // Enable Clear Filters when anything is active
    clearButton.disabled = !(
      selectedCategories.size ||
      selectedTypes.size ||
      query ||
      selectedSkill
    );

    // Keep URL synchronized
    const next = new URL(window.location.href);

    if (selectedCategories.size) {
      next.searchParams.set(
        'category',
        [...selectedCategories].join(',')
      );
    } else {
      next.searchParams.delete('category');
    }

    if (selectedTypes.size) {
      next.searchParams.set(
        'type',
        [...selectedTypes].join(',')
      );
    } else {
      next.searchParams.delete('type');
    }

    if (selectedSkill) {
      next.searchParams.set(
        'skill',
        selectedSkill
      );
    } else {
      next.searchParams.delete('skill');
    }

    window.history.replaceState(
      null,
      '',
      next.pathname + next.search + next.hash
    );
  }

  // Reset all filters, including the selected skill
  function clear() {
    [...categories, ...types].forEach(input => {
      input.checked = false;
    });

    searchInput.value = '';
    selectedSkill = '';

    update();
  }

  // Listen for checkbox changes
  [...categories, ...types].forEach(input => {
    input.addEventListener('change', update);
  });

  // Listen for search input
  searchInput.addEventListener('input', update);

  // Clear filters buttons
  clearButton.addEventListener('click', clear);
  resetButton.addEventListener('click', clear);

  // Apply URL filters on initial page load
  update();
})();
