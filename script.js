/* script.js — Mini Proyecto interactive logic */

(function () {
  'use strict';

  // ─── Feature cards data ────────────────────────────────────────────────────
  // Fill in titles/descriptions once content is ready.
  const FEATURES = [
    { icon: '⚙️', title: '', description: '' },
    { icon: '🛡️', title: '', description: '' },
    { icon: '📊', title: '', description: '' },
    { icon: '🔗', title: '', description: '' },
    { icon: '📝', title: '', description: '' },
    { icon: '🚀', title: '', description: '' },
  ];

  // ─── Stat counter targets ──────────────────────────────────────────────────
  // Update these values once real data is available.
  const STAT_TARGETS = {
    0: 0,   // Usuarios
    1: 0,   // Módulos
    2: 0,   // Versiones
    3: 0,   // Tickets cerrados
  };

  // =========================================================================
  // 1. Render feature cards
  // =========================================================================
  function renderFeatures() {
    const grid = document.getElementById('featuresGrid');
    if (!grid) return;

    grid.innerHTML = FEATURES.map((f) => `
      <article class="feature-card">
        <div class="feature-icon" aria-hidden="true">${f.icon}</div>
        <h3 class="feature-title">${f.title}</h3>
        <p class="feature-desc">${f.description}</p>
      </article>
    `).join('');
  }

  // =========================================================================
  // 2. Responsive nav toggle
  // =========================================================================
  function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = nav.classList.toggle('open');
      toggle.classList.toggle('open', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
    });

    // Close nav when a link is clicked (mobile)
    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 3. Active nav link on scroll (Intersection Observer)
  // =========================================================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  // =========================================================================
  // 4. Gallery filter
  // =========================================================================
  function initGalleryFilter() {
    const filterContainer = document.getElementById('galleryFilters');
    const galleryGrid = document.getElementById('galleryGrid');
    if (!filterContainer || !galleryGrid) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  }

  // =========================================================================
  // 5. Animated stat counters (triggered when stats section enters viewport)
  // =========================================================================
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  function initStatCounters() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;
          counters.forEach((el, i) => {
            const target = STAT_TARGETS[i] ?? parseInt(el.dataset.target, 10) ?? 0;
            animateCounter(el, target, 1200);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  }

  // =========================================================================
  // 6. Contact form validation
  // =========================================================================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name:    { el: document.getElementById('inputName'),    err: document.getElementById('errorName') },
      email:   { el: document.getElementById('inputEmail'),   err: document.getElementById('errorEmail') },
      message: { el: document.getElementById('inputMessage'), err: document.getElementById('errorMessage') },
    };
    const feedback = document.getElementById('formFeedback');

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function setError(field, message) {
      field.el.classList.add('invalid');
      field.err.textContent = message;
    }

    function clearError(field) {
      field.el.classList.remove('invalid');
      field.err.textContent = '';
    }

    // Live validation on blur
    Object.values(fields).forEach((field) => {
      field.el.addEventListener('blur', () => {
        if (field.el.value.trim()) clearError(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Name
      if (!fields.name.el.value.trim()) {
        setError(fields.name, 'El nombre es obligatorio.');
        valid = false;
      } else {
        clearError(fields.name);
      }

      // Email
      if (!fields.email.el.value.trim()) {
        setError(fields.email, 'El correo es obligatorio.');
        valid = false;
      } else if (!validateEmail(fields.email.el.value.trim())) {
        setError(fields.email, 'Introduce un correo válido.');
        valid = false;
      } else {
        clearError(fields.email);
      }

      // Message
      if (!fields.message.el.value.trim()) {
        setError(fields.message, 'El mensaje es obligatorio.');
        valid = false;
      } else {
        clearError(fields.message);
      }

      if (!valid) return;

      // Simulate submission (replace with real fetch/API call when ready)
      feedback.classList.remove('error');
      feedback.classList.add('form-feedback', 'success');
      feedback.textContent = '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.';
      form.reset();
    });
  }

  // =========================================================================
  // 7. Back-to-top button
  // =========================================================================
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 8. Set current year in footer
  // =========================================================================
  function setCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 9. Reveal animations on scroll (fade-in)
  // =========================================================================
  function initRevealAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll(
      '.about-block, .feature-card, .gallery-item, .team-card, .contact-item, .stat-item'
    );

    targets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // =========================================================================
  // Init all on DOM ready
  // =========================================================================
  function init() {
    renderFeatures();
    initNavToggle();
    initScrollSpy();
    initGalleryFilter();
    initStatCounters();
    initContactForm();
    initBackToTop();
    setCurrentYear();
    initRevealAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
