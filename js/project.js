/* ============================================================
   PROJECT PAGE — project.js
   ============================================================ */

'use strict';

/* ── Reading progress bar ───────────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(to right, var(--c-accent), #D4956A);
    z-index: 9998; transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min((scrollTop / docHeight) * 100, 100) + '%';
  }, { passive: true });
})();

/* ── Hero image subtle parallax ────────────────────────────── */
(function initParallax() {
  const imgWrap = document.querySelector('.pj-hero-img-wrap');
  const img     = document.querySelector('.pj-hero-img');
  if (!imgWrap || !img) return;

  window.addEventListener('scroll', () => {
    const rect     = imgWrap.getBoundingClientRect();
    const inView   = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    const progress = rect.top / window.innerHeight;
    img.style.transform = `translateY(${progress * 24}px) scale(1.04)`;
  }, { passive: true });
})();

/* ── Animate result numbers ─────────────────────────────────── */
(function initResultCounters() {
  const nums = document.querySelectorAll('.pj-result-n, .pj-stat-n');
  if (!nums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      // only animate if it starts with a number
      const numMatch = raw.match(/^[\d.]+/);
      if (!numMatch) return;
      const num    = parseFloat(numMatch[0]);
      const suffix = raw.slice(numMatch[0].length);
      const duration = 1200;
      const start    = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        const v = num % 1 === 0 ? Math.round(e * num) : (e * num).toFixed(1);
        el.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  nums.forEach(n => observer.observe(n));
})();

/* ── Arch node hover glow ───────────────────────────────────── */
(function initArchHover() {
  document.querySelectorAll('.pj-arch-node').forEach(node => {
    node.style.cursor = 'default';
  });
})();