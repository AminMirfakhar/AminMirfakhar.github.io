---
layout: page
title: projects
permalink: /projects/
description: 
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
  <div class="am-directory-layout">
    <aside class="am-filter-sidebar" aria-label="Project filters">
      <div class="am-filter-sidebar-heading">
        <div><span class="am-filter-icon" aria-hidden="true">☷</span><strong>Refine Projects</strong></div>
        <button id="am-clear-filters" class="am-sidebar-clear" type="button">Clear Filters</button>
      </div>
      <details class="am-filter-group" open>
        <summary>Technical Disciplines <span class="am-accordion-indicator" aria-hidden="true"></span></summary>
        <fieldset class="am-filter-options">
          <legend class="am-visually-hidden">Filter by technical disciplines</legend>
          {% for category in site.data.engineering_categories %}
          {% assign count = 0 %}{% for project in site.data.engineering_projects %}{% if project.categories contains category.id %}{% assign count = count | plus: 1 %}{% endif %}{% endfor %}
          <label class="am-filter-option">
            <input type="checkbox" value="{{ category.id | escape }}" data-category-filter>
            <span class="am-filter-option-name">{{ category.label | escape }}</span>
            <span class="am-option-count" aria-label="{{ count }} projects">{{ count }}</span>
          </label>
          {% endfor %}
        </fieldset>
      </details>
      <details class="am-filter-group" open>
        <summary>Project Type <span class="am-accordion-indicator" aria-hidden="true"></span></summary>
        <fieldset class="am-filter-options">
          <legend class="am-visually-hidden">Filter by professional project type</legend>
          {% for type in site.data.engineering_project_types %}
          {% assign count = 0 %}{% for project in site.data.engineering_projects %}{% if project.project_type == type.id %}{% assign count = count | plus: 1 %}{% endif %}{% endfor %}
          <label class="am-filter-option">
            <input type="checkbox" value="{{ type.id | escape }}" data-type-filter>
            <span class="am-filter-option-name">{{ type.label | escape }}</span>
            <span class="am-option-count" aria-label="{{ count }} projects">{{ count }}</span>
          </label>
          {% endfor %}
        </fieldset>
      </details>
      <p class="am-filter-help">Select multiple options. Projects are never duplicated in the results.</p>
    </aside>
    <section class="am-filter-section" aria-labelledby="am-results-title">
      <div class="am-section-top">
        <div><p class="am-kicker">PROJECT DIRECTORY</p><h2 id="am-results-title">All projects</h2></div>
        <p id="am-result-count" class="am-muted" role="status" aria-live="polite"></p>
      </div>
      <div class="am-filter-tools">
        <label class="am-search-label" for="am-project-search">Search projects</label>
        <input id="am-project-search" type="search" placeholder="Search projects or technologies…" autocomplete="off">
      </div>
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
</div>
<script src="{{ '/assets/js/engineering-project-filter.js' | relative_url }}" defer></script>
