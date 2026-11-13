---
layout: page
title: projects
permalink: /projects/
description: Explore twelve engineering projects by technical discipline and project type.
nav: true
nav_order: 3
---
<link rel="stylesheet" href="{{ '/assets/css/engineering.css' | relative_url }}">
<div class="am-site am-inner am-catalog">
  <header class="am-page-header">
    <p class="am-kicker">ENGINEERING PORTFOLIO</p>
    <h1>Engineering projects<span class="am-orange">.</span></h1>
    <p>Explore 12 distinct projects across industry, academic research, university engineering, and self-initiated work. Select multiple disciplines and project types; every project appears <strong>only once</strong>.</p>
  </header>
  <section class="am-category-section" aria-labelledby="am-categories-title">
    <div class="am-section-top"><div><p class="am-kicker">EXPLORE DISCIPLINES</p><h2 id="am-categories-title">Engineering categories</h2></div><span class="am-muted am-category-hint">Categories overlap by design</span></div>
    <div class="am-category-grid">
      {% for category in site.data.engineering_categories %}
      {% assign count = 0 %}{% for project in site.data.engineering_projects %}{% if project.categories contains category.id %}{% assign count = count | plus: 1 %}{% endif %}{% endfor %}
      <button type="button" class="am-category-tile" data-category-toggle="{{ category.id }}" aria-pressed="false" aria-controls="am-results">
        <span class="am-category-tile-top"><span>{{ category.label | escape }}</span><span class="am-cat-count">{{ count }}</span></span>
        <span class="am-category-description">{{ category.description | escape }}</span>
      </button>
      {% endfor %}
    </div>
  </section>
  <section class="am-type-section" aria-labelledby="am-types-title">
    <div class="am-section-top"><div><p class="am-kicker">PROFESSIONAL CONTEXT</p><h2 id="am-types-title">Project type</h2><p class="am-muted">Choose the setting in which the work was carried out. Select multiple types if needed.</p></div></div>
    <div class="am-type-grid" role="group" aria-label="Filter by project type">
      {% for type in site.data.engineering_project_types %}
      {% assign count = 0 %}{% for project in site.data.engineering_projects %}{% if project.project_type == type.id %}{% assign count = count | plus: 1 %}{% endif %}{% endfor %}
      <button type="button" class="am-type-tile" data-type-toggle="{{ type.id }}" aria-pressed="false" aria-controls="am-results">
        <strong>{{ type.label | escape }}</strong><span class="am-type-count">{{ count }}</span>
        <small>{{ type.description | escape }}</small>
      </button>
      {% endfor %}
    </div>
  </section>
  <section class="am-filter-section" aria-labelledby="am-results-title">
    <div class="am-section-top"><div><p class="am-kicker">PROJECT DIRECTORY</p><h2 id="am-results-title">All projects</h2><p class="am-muted">Within each filter group, selections are combined with OR. Between disciplines and project types, both filters must match. Each project is displayed once.</p></div><button id="am-clear-filters" class="am-clear-button" type="button">Clear filters</button></div>
    <div class="am-filter-tools"><label class="am-search-label" for="am-project-search">Search projects</label><input id="am-project-search" type="search" placeholder="Search titles, descriptions, or technologies…" autocomplete="off"/><p id="am-result-count" class="am-muted" role="status" aria-live="polite"></p></div>
    <div id="am-results" class="am-project-grid">
      {% for project in site.data.engineering_projects %}
      <article class="am-project-card" data-project-card data-categories="{{ project.categories | join: ' ' }}" data-project-type="{{ project.project_type }}" data-search="{{ project.title | append: ' ' | append: project.summary | append: ' ' | append: project.technologies | downcase | escape }}">
        {% if project.image != empty and project.image %}
          <a href="{{ project.url | relative_url }}" class="am-project-art"><img src="{{ '/assets/img/engineering/' | append: project.image | relative_url }}" alt="Conceptual illustration for {{ project.title | escape }}" loading="lazy"></a>
        {% else %}
          <a href="{{ project.url | relative_url }}" class="am-project-art am-project-placeholder"><span aria-hidden="true">{{ project.title | slice: 0, 1 | escape }}</span><span class="am-placeholder-caption">Engineering project</span></a>
        {% endif %}
        <div class="am-project-body"><div class="am-project-meta">{% for type in site.data.engineering_project_types %}{% if type.id == project.project_type %}<span class="am-context-badge am-context-{{ type.id }}">{{ type.label | escape }}</span>{% endif %}{% endfor %}<span class="am-project-tags">{{ project.organization | escape }} · {{ project.period | escape }}</span></div>
        <h3><a href="{{ project.url | relative_url }}">{{ project.title | escape }}</a></h3>
        <p>{{ project.summary | escape }}</p>
        <div class="am-chips">{% for category in site.data.engineering_categories %}{% if project.categories contains category.id %}<span>{{ category.label | escape }}</span>{% endif %}{% endfor %}</div>
        <a class="am-card-link" href="{{ project.url | relative_url }}" aria-label="Read about {{ project.title | escape }}">View project →</a></div>
      </article>
      {% endfor %}
    </div>
    <p id="am-no-results" class="am-empty-state" hidden>No projects match those filters. <button type="button" id="am-reset-empty">Show all projects</button></p>
  </section>
</div>
<script src="{{ '/assets/js/engineering-project-filter.js' | relative_url }}" defer></script>
