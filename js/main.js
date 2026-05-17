/* ============================================================
   PORTFOLIO — main.js
   ============================================================ */

"use strict";

/* ── Custom Cursor ──────────────────────────────────────────── */
const canvas = document.getElementById("trail");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

document.addEventListener("mousemove", (e) => {
  particles.push({
    x: e.clientX,
    y: e.clientY,
    size: 8,
  });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, index) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c88245";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#c88245";

    p.size -= 0.2;

    if (p.size <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

/* ── Scroll-triggered Nav ───────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    },
    { passive: true },
  );

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.classList.toggle("open");
      menu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    menu.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("open");
        menu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }
})();

/* ── Scroll Reveal ──────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el, i) => {
    // Stagger siblings in the same parent
    const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = idx * 0.1 + "s";
    observer.observe(el);
  });
})();

/* ── Active Nav Link Highlighting ───────────────────────────── */
(function initActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.style.color =
              link.getAttribute("href") === "#" + id ? "var(--c-ink)" : "";
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ── Skill Card Tilt ────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ── Smooth Scroll for anchor links ─────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-h",
          ),
        ) || 72;
      window.scrollTo({ top: target.offsetTop - navH, behavior: "smooth" });
    });
  });
})();

/* ── Animate stats counter ──────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll(".stat-n");
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
        const suffix = raw.replace(/[0-9.]/g, "");
        let start = 0;
        const duration = 1400;
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * num) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );

  stats.forEach((s) => observer.observe(s));
})();
