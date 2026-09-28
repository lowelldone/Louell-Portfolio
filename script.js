/* ═══════════════════════════════════════════════════════════
   LOUELL SAGUINDAN PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════ */

(function () {

  // ── Active nav link ──
  // Declared first because onScroll() calls updateActiveNav() immediately.
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    const pos = window.scrollY + 120;
    let cur = '';
    sections.forEach(s => { if (s.offsetTop <= pos) cur = s.id; });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }

  // ── Scroll shadow + back-to-top ──
  const header    = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const y = window.scrollY;
    if (header)    header.classList.toggle('scrolled', y > 20);
    if (backToTop) backToTop.classList.toggle('visible', y > 300);
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile drawer ──
  const hamburger   = document.getElementById('hamburger');
  const drawer      = document.getElementById('mobile-drawer');
  const overlay     = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (!hamburger || !drawer || !overlay) return;
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('open');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!hamburger || !drawer || !overlay) return;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  if (overlay)   overlay.addEventListener('click', closeDrawer);
  mobileLinks.forEach(l => l.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const navHStr = getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim();
      const navH = parseFloat(navHStr) || 72;
      window.scrollTo({ top: el.offsetTop - navH, behavior: 'smooth' });
    });
  });

  // ─────────────────────────────────────────────────────────
  // ANIMATIONS — Professional reveal on scroll & entrance
  // ─────────────────────────────────────────────────────────

  const items = document.querySelectorAll('.animate-in');

  if (items.length) {
    const inViewport = (el) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 20 && r.top < window.innerHeight - 20;
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      });

      // Observe all elements that start below the fold
      items.forEach((el) => {
        if (!inViewport(el)) {
          observer.observe(el);
        }
      });

      // Initial viewport entrance animation:
      // Allow browser to complete initial paint, then gracefully cascade elements in
      requestAnimationFrame(() => {
        setTimeout(() => {
          let visibleIndex = 0;
          items.forEach((el) => {
            if (inViewport(el)) {
              const delay = el.dataset.delay != null
                ? parseInt(el.dataset.delay, 10) * 110
                : visibleIndex * 90;
              visibleIndex++;
              setTimeout(() => {
                el.classList.add('visible');
              }, delay);
            }
          });
        }, 60);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      items.forEach((el) => el.classList.add('visible'));
    }
  }

  // ── Skill bar animation ──
  const fills = Array.from(document.querySelectorAll('.sk-fill'));
  if (fills.length) {
    const fillTargets = fills.map(f => f.style.width || '80%');
    fills.forEach(f => {
      f.style.width = '0%';
    });

    if ('IntersectionObserver' in window) {
      const barObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const group = entry.target;
          const groupFills = Array.from(group.querySelectorAll('.sk-fill'));
          groupFills.forEach((f, i) => {
            const idx = fills.indexOf(f);
            setTimeout(() => {
              f.style.width = idx >= 0 ? fillTargets[idx] : '80%';
            }, 120 + i * 80);
          });
          barObs.unobserve(group);
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.skills-group').forEach((g) => barObs.observe(g));
    } else {
      fills.forEach((f, i) => {
        f.style.width = fillTargets[i];
      });
    }
  }

})();
