---
layout: page
title: about
permalink: /
nav: false
---
<link rel="stylesheet" href="{{ '/assets/css/engineering.css' | relative_url }}">
{% include am-theme-control.html %}

<div class="am-site">
  <section class="am-hero" aria-labelledby="am-hero-title">
    <div class="am-hero-copy">
      <p class="am-eyebrow"><span class="am-dot"></span> ROBOTICS · AUTOMATION · INTELLIGENT MANUFACTURING</p>
      <h1 id="am-hero-title">Engineering intelligent systems <em>for the real world.</em></h1>
      <p class="am-lede">I'm <strong>Amin Mirfakhar</strong>, a Computer Science PhD candidate at Tulane University. I build and study robotic and autonomous systems—from industrial motion platforms to smarter additive manufacturing.</p>
      <div class="am-actions">
        <a class="am-btn am-btn-primary" href="{{ '/projects/' | relative_url }}">Explore projects <span aria-hidden="true">↗</span></a>
        <a class="am-btn am-btn-secondary" href="{{ '/publications/' | relative_url }}">Read publications <span aria-hidden="true">↗</span></a>
      </div>
      <div class="am-meta"><span>PhD Researcher · Tulane University</span><span>New Orleans, Louisiana</span></div>
    </div>
    <div class="am-hero-visual">
      <img class="am-portrait" src="{{ '/assets/img/IMG_3972_Croped.jpg' | relative_url }}" alt="Portrait of Amin Mirfakhar" loading="eager">
      <div class="am-image-label"><span>AM / 01</span><span>DESIGN · CONTROL · RESEARCH</span></div>
    </div>
  </section>

  <section class="am-section" id="focus" aria-labelledby="focus-title">
    <div class="am-section-heading"><p class="am-kicker">01 / WHAT I DO</p><h2 id="focus-title">Research meets engineering.</h2><p>I work at the intersection of robotics, automation, optimization, and manufacturing—connecting rigorous methods with systems that have to work outside the lab.</p></div>
    <div class="am-focus-grid">
      <article class="am-focus"><span class="am-focus-icon">01</span><h3>Robotics & control</h3><p>Kinematics, dynamics, motion planning, and control for robotic systems and industrial platforms.</p></article>
      <article class="am-focus"><span class="am-focus-icon">02</span><h3>Intelligent manufacturing</h3><p>Multi-objective optimization and non-planar toolpath generation for additive manufacturing.</p></article>
      <article class="am-focus"><span class="am-focus-icon">03</span><h3>Industrial automation</h3><p>PLC-based systems, machine vision, hardware integration, and production-oriented automation.</p></article>
    </div>
  </section>

  <section class="am-section am-feature-section" id="featured-projects" aria-labelledby="featured-title">
    <div class="am-section-top"><div><p class="am-kicker">02 / SELECTED WORK</p><h2 id="featured-title">Built to solve hard problems.</h2></div><a class="am-text-link" href="{{ '/projects/' | relative_url }}">All projects ↗</a></div>
    <div class="am-project-grid">
      <a class="am-project-card" href="{{ '/projects/hexapod/' | relative_url }}"><div class="am-project-art"><img src="{{ '/assets/img/engineering/hexapod.svg' | relative_url }}" alt="Technical illustration of a six-axis motion platform" loading="lazy"></div><div class="am-project-body"><div class="am-project-tags">INDUSTRIAL ROBOTICS · 2023–24</div><h3>6-DOF Motion Simulator</h3><p>2.2-ton payload capacity, kinematics and dynamics, PLC programming, and servo integration.</p><span class="am-card-link">View details ↗</span></div></a>
      <a class="am-project-card" href="{{ '/projects/drywall/' | relative_url }}"><div class="am-project-art"><img src="{{ '/assets/img/engineering/drywall.svg' | relative_url }}" alt="Technical illustration of a construction robot and wall panel" loading="lazy"></div><div class="am-project-body"><div class="am-project-tags">CONSTRUCTION ROBOTICS · 2023–24</div><h3>Autonomous Drywall Robot</h3><p>Hardware selection, programming, and interface development for automated construction.</p><span class="am-card-link">View details ↗</span></div></a>
      <a class="am-project-card" href="{{ '/projects/conveyor/' | relative_url }}"><div class="am-project-art"><img src="{{ '/assets/img/engineering/conveyor.svg' | relative_url }}" alt="Technical illustration of machine vision inspection above a conveyor" loading="lazy"></div><div class="am-project-body"><div class="am-project-tags">MACHINE VISION · 2022–23</div><h3>Conveyor Belt Monitoring</h3><p>AI-assisted defect detection with image processing and segmentation for production use.</p><span class="am-card-link">View details ↗</span></div></a>
      <a class="am-project-card" href="{{ '/projects/fdm-printers/' | relative_url }}"><div class="am-project-art"><span class="am-feature-glyph" aria-hidden="true">3D</span></div><div class="am-project-body"><div class="am-project-tags">ACADEMIC PROJECT · 2019</div><h3>Cartesian & Core-XY FDM Printers</h3><p>Designed and built two FDM 3D printer architectures at IUST.</p><span class="am-card-link">View details ↗</span></div></a>
    </div>
  </section>

  <section class="am-section am-research" id="research" aria-labelledby="research-title"><div><p class="am-kicker">03 / CURRENT RESEARCH</p><h2 id="research-title">Beyond flat layers.</h2></div><div><p>At Tulane University, under the supervision of <a href="https://ramgopalmettu.org/">Prof. Ramgopal Mettu</a>, I investigate multi-objective approaches to non-planar 3D printing. The goal is to explore toolpath construction beyond conventional layer-based slicing.</p><a class="am-text-link" href="{{ '/publications/' | relative_url }}">Explore publications ↗</a></div></section>

  <section class="am-section" id="publications" aria-labelledby="pub-title"><div class="am-section-top"><div><p class="am-kicker">04 / RESEARCH OUTPUT</p><h2 id="pub-title">Selected publications.</h2></div><a class="am-text-link" href="{{ '/publications/' | relative_url }}">All publications ↗</a></div>
    <div class="am-pub-list"><article class="am-pub-item"><span class="am-pub-year">2021</span><div><h3>Control of a two-DOF parallel robot with unknown parameters using a novel robust adaptive approach</h3><p>ISA Transactions · Vol. 117, pp. 70–84</p><div class="am-inline-links"><a href="https://doi.org/10.1016/j.isatra.2021.02.001">DOI ↗</a><a href="{{ '/assets/pdf/Controlofatwo-DOFparallelrobotwithunknownparameters.pdf' | relative_url }}">PDF ↗</a></div></div></article>
    <article class="am-pub-item"><span class="am-pub-year">2020</span><div><h3>Control a Drone Using Hand Movement in ROS Based on Single Shot Detector Approach</h3><p>28th Iranian Conference on Electrical Engineering (ICEE)</p><div class="am-inline-links"><a href="https://doi.org/10.1109/ICEE50131.2020.9260864">DOI ↗</a><a href="{{ '/assets/pdf/ControlaDroneUsingHandMovementinROS.pdf' | relative_url }}">PDF ↗</a></div></div></article></div>
  </section>

  <section class="am-contact" id="contact"><p class="am-kicker">05 / GET IN TOUCH</p><h2>Have a challenging robotics problem?</h2><p>I'm interested in research collaborations and engineering conversations around robotics, intelligent manufacturing, and automation.</p><div class="am-actions"><a class="am-btn am-btn-primary" href="mailto:smirfakhar@tulane.edu">Get in touch ↗</a><a class="am-btn am-btn-secondary" href="{{ '/cv/' | relative_url }}">View CV ↗</a><a class="am-btn am-btn-secondary" href="https://github.com/AminMirfakhar">GitHub ↗</a></div></section>
</div>
