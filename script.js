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
  // ANIMATIONS — reveal on scroll
  // Elements start at opacity:0 via CSS.
  // Strategy:
  //   1. Elements already in viewport → add .visible immediately (synchronous).
  //   2. Elements below the fold → IntersectionObserver reveals them as they scroll in.
  //   3. Hard fallback at 1200ms for anything still hidden (belt-and-suspenders).
  // ─────────────────────────────────────────────────────────

  const items = document.querySelectorAll('.animate-in');
  if (!items.length) return;

  function inViewport(el) {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  function reveal(el) {
    el.classList.add('visible');
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  items.forEach((el, i) => {
    const delay = el.dataset.delay != null
      ? parseInt(el.dataset.delay, 10) * 100
      : Math.min(i * 60, 300);
    el.style.transitionDelay = delay + 'ms';

    if (inViewport(el)) {
      reveal(el);
    } else {
      observer.observe(el);
    }
  });

  // Hard fallback — anything still hidden after 1.2s gets force-shown
  setTimeout(() => {
    items.forEach(el => { if (!el.classList.contains('visible')) reveal(el); });
  }, 1200);

  // ── Skill bar animation ──
  const fills       = Array.from(document.querySelectorAll('.sk-fill'));
  const fillTargets = fills.map(f => f.style.width || '80%');

  fills.forEach(f => { f.style.width = '0%'; f.style.transition = 'width 0.8s ease'; });

  const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const group = entry.target;
      const groupFills = Array.from(group.querySelectorAll('.sk-fill'));
      groupFills.forEach((f, i) => {
        const idx = fills.indexOf(f);
        setTimeout(() => {
          f.style.width = idx >= 0 ? fillTargets[idx] : '80%';
        }, i * 100);
      });
      barObs.unobserve(group);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-group').forEach(g => barObs.observe(g));

})();
