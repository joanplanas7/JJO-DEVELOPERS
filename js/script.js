function scrollToSection(id) {
  const section = document.getElementById(id);
  section.scrollIntoView({ behavior: 'smooth' });
}

// ─── HAMBURGER MENU ───────────────────────────────────────────
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show");
  menuBtn.classList.toggle("open");
});

nav.querySelectorAll("a, .mobile-lang-switcher .lang-btn").forEach(item => {
  item.addEventListener("click", () => {
    nav.classList.remove("show");
    menuBtn.classList.remove("open");
  });
});

// ─── HEADER SCROLL ────────────────────────────────────────────
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.style.borderBottomColor = window.scrollY > 10 ? "#1f1f1f" : "transparent";
}, { passive: true });

// ─── FOOTER YEAR ──────────────────────────────────────────────
document.getElementById("anio").textContent = new Date().getFullYear();

// ─── TEXT SCRAMBLE (hero pretitle) ────────────────────────────
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>—_\\/[]{}=+*^?#@ABCDEFGHIJKLMNabcdefghijklmn0123456789';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const len = newText.length;
    const promise = new Promise(resolve => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const to = newText[i];
      const start = Math.floor(i * 1.4);
      const end = start + Math.floor(Math.random() * 8) + 4;
      this.queue.push({ to, start, end, char: '' });
    }
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let out = '';
    let done = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { to, start, end } = this.queue[i];
      if (this.frame >= end) {
        done++;
        out += to;
      } else if (this.frame >= start) {
        if (!this.queue[i].char || Math.random() < 0.3) {
          this.queue[i].char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        out += `<span style="color:var(--accent);opacity:.45">${this.queue[i].char}</span>`;
      } else {
        out += to;
      }
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) {
      this.resolve();
    } else {
      this.raf = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function animateHeroPretitle() {
  const pretitle = document.querySelector('.hero-pretitle');
  if (!pretitle) return;

  const text = pretitle.textContent.trim();
  pretitle.textContent = '';
  setTimeout(() => new TextScramble(pretitle).setText(text), 500);
}

window.addEventListener('load', animateHeroPretitle);
window.addEventListener('jjo:language-changed', animateHeroPretitle);

// ─── PARTICLE SYSTEM (hero canvas) ───────────────────────────
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const R = [184, 240, 0]; // accent color RGB
  const CONNECT  = 110;    // max distance to draw a line between particles
  const MOUSE_R  = 140;    // mouse influence radius
  const CLICK_R  = 220;    // click shockwave radius
  const EDGE_BOUNCE = 0.82;
  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };

  /* ── Resize canvas to CSS size ── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* ── Particle class ── */
  class Particle {
    constructor() {
      this.x  = Math.random() * (W || 400);
      this.y  = Math.random() * (H || 500);
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r  = Math.random() * 1.8 + 1;
      this.alpha = Math.random() * 0.45 + 0.2;
      this.phase = Math.random() * Math.PI * 2; // for pulse
      this.drift = Math.random() * Math.PI * 2;
    }

    update(t) {
      /* Mouse repulsion */
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d < MOUSE_R) {
        const f = ((MOUSE_R - d) / MOUSE_R) * 1.1;
        this.vx += (dx / d) * f;
        this.vy += (dy / d) * f;
      }

      /* Ambient drift keeps the movement from feeling mechanical */
      const driftT = t * 0.00065 + this.drift;
      this.vx += Math.cos(driftT) * 0.018;
      this.vy += Math.sin(driftT * 1.17) * 0.018;

      /* Damping + speed cap */
      this.vx *= 0.975;
      this.vy *= 0.975;
      const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (spd > 4.2) { this.vx = this.vx / spd * 4.2; this.vy = this.vy / spd * 4.2; }

      this.x += this.vx;
      this.y += this.vy;

      /* Elastic edge bounce */
      if (this.x < 0)  { this.x = 0;  this.vx = Math.abs(this.vx) * EDGE_BOUNCE; this.vy += (Math.random() - 0.5) * 0.18; }
      if (this.x > W)  { this.x = W;  this.vx = -Math.abs(this.vx) * EDGE_BOUNCE; this.vy += (Math.random() - 0.5) * 0.18; }
      if (this.y < 0)  { this.y = 0;  this.vy = Math.abs(this.vy) * EDGE_BOUNCE; this.vx += (Math.random() - 0.5) * 0.18; }
      if (this.y > H)  { this.y = H;  this.vy = -Math.abs(this.vy) * EDGE_BOUNCE; this.vx += (Math.random() - 0.5) * 0.18; }

      /* Pulse size */
      this.rr = this.r + Math.sin(t * 0.002 + this.phase) * 0.6;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.rr), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${R[0]},${R[1]},${R[2]},${this.alpha})`;
      ctx.fill();
    }
  }

  /* ── Init / resize ── */
  function init() {
    resize();
    const N = W < 480 ? 38 : W < 900 ? 55 : 75;
    particles = Array.from({ length: N }, () => new Particle());
  }

  /* ── Draw connections ── */
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      /* Particle–particle lines */
      for (let j = i + 1; j < particles.length; j++) {
        const b   = particles[j];
        const dx  = a.x - b.x, dy = a.y - b.y;
        const d   = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT) {
          const alpha = (1 - d / CONNECT) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${R[0]},${R[1]},${R[2]},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      /* Mouse–particle lines (magnetic field look) */
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < MOUSE_R * 1.4) {
        const alpha = (1 - md / (MOUSE_R * 1.4)) * 0.45;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${R[0]},${R[1]},${R[2]},${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  /* ── Draw mouse glow ── */
  function drawMouseGlow() {
    if (mouse.x < 0 || mouse.x > W + 200) return;
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
    g.addColorStop(0,   `rgba(${R[0]},${R[1]},${R[2]},0.08)`);
    g.addColorStop(1,   `rgba(${R[0]},${R[1]},${R[2]},0)`);
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  /* ── Animate ── */
  let raf;
  function animate(t) {
    ctx.clearRect(0, 0, W, H);
    drawMouseGlow();
    drawLines();
    particles.forEach(p => { p.update(t); p.draw(); });
    raf = requestAnimationFrame(animate);
  }

  /* ── Mouse tracking (relative to canvas, even from outside) ── */
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  /* ── Click shockwave ── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      particles.forEach(p => {
        const dx = p.x - cx, dy = p.y - cy;
        const d  = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < CLICK_R) {
          const f = (1 - d / CLICK_R) * 6;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      });
    });
  }

  /* ── Resize observer ── */
  const ro = new ResizeObserver(() => { init(); });
  ro.observe(canvas);

  init();
  requestAnimationFrame(animate);
})();

// ─── FLOATING HERO BADGES ─────────────────────────────────────
(function initHeroBadges() {
  const box = document.querySelector('.hero-visual');
  const badges = [...document.querySelectorAll('.hero-badge')];
  if (!box || badges.length === 0) return;

  const states = badges.map((badge, index) => ({
    badge,
    x: 0,
    y: 0,
    vx: (index % 2 === 0 ? 1 : -1) * (0.24 + Math.random() * 0.18),
    vy: (index < 2 ? 1 : -1) * (0.2 + Math.random() * 0.16),
    phase: Math.random() * Math.PI * 2,
    spin: Math.random() > 0.5 ? 1 : -1
  }));

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function placeBadges() {
    const boxRect = box.getBoundingClientRect();
    states.forEach((state) => {
      const badgeRect = state.badge.getBoundingClientRect();
      const currentLeft = parseFloat(getComputedStyle(state.badge).left) || 0;
      const currentTop = parseFloat(getComputedStyle(state.badge).top) || 0;
      state.x = clamp(currentLeft, 0, Math.max(0, boxRect.width - badgeRect.width));
      state.y = clamp(currentTop, 0, Math.max(0, boxRect.height - badgeRect.height));
      state.badge.style.right = 'auto';
      state.badge.style.bottom = 'auto';
    });
  }

  let lastTime = performance.now();
  function animateBadges(now) {
    const dt = Math.min((now - lastTime) / 16.67, 2);
    lastTime = now;

    const boxRect = box.getBoundingClientRect();
    states.forEach((state) => {
      const badgeRect = state.badge.getBoundingClientRect();
      const maxX = Math.max(0, boxRect.width - badgeRect.width);
      const maxY = Math.max(0, boxRect.height - badgeRect.height);
      const drift = now * 0.001 + state.phase;

      state.vx += Math.cos(drift * 0.75) * 0.006 * dt;
      state.vy += Math.sin(drift * 0.9) * 0.006 * dt;

      const speed = Math.hypot(state.vx, state.vy);
      if (speed > 0.62) {
        state.vx = state.vx / speed * 0.62;
        state.vy = state.vy / speed * 0.62;
      }

      state.x += state.vx * dt;
      state.y += state.vy * dt;

      if (state.x <= 0 || state.x >= maxX) {
        state.x = clamp(state.x, 0, maxX);
        state.vx *= -1.08;
        state.vy += (Math.random() - 0.5) * 0.08;
      }
      if (state.y <= 0 || state.y >= maxY) {
        state.y = clamp(state.y, 0, maxY);
        state.vy *= -1.08;
        state.vx += (Math.random() - 0.5) * 0.08;
      }

      const bob = Math.sin(drift * 1.8) * 3;
      const tilt = (state.vx * 5 + Math.sin(drift) * 1.5) * state.spin;
      state.badge.style.left = `${state.x}px`;
      state.badge.style.top = `${state.y}px`;
      state.badge.style.transform = `translate3d(0, ${bob}px, 0) rotate(${tilt}deg)`;
    });

    requestAnimationFrame(animateBadges);
  }

  placeBadges();
  new ResizeObserver(placeBadges).observe(box);
  requestAnimationFrame(animateBadges);
})();

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s';
  });
});

// ─── BLOG CARD 3D TILT ────────────────────────────────────────
document.querySelectorAll('.blog-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) scale(1.015)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s';
  });
});

// ─── COUNTER ANIMATION (stats) ────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(p) * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-val[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

const statsEl = document.querySelector('.sobre-stats');
if (statsEl) statsObserver.observe(statsEl);

// ─── CONTACT FORM (Web3Forms) ─────────────────────────────────
const contactForm = document.getElementById('contacto-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const result = document.getElementById('form-result');
    const lang = localStorage.getItem('jjo-lang') || 'es';

    const t = {
      sending: { es: 'Enviando...', en: 'Sending...', ca: 'Enviant...' },
      success: { es: '¡Mensaje enviado! Te contactaremos pronto.', en: "Message sent! We'll be in touch soon.", ca: 'Missatge enviat! Et contactarem aviat.' },
      error:   { es: 'Error al enviar. Inténtalo de nuevo.', en: 'Error sending. Please try again.', ca: "Error en enviar. Torna-ho a intentar." },
      submit:  { es: 'Enviar mensaje', en: 'Send message', ca: 'Enviar missatge' },
    };

    btn.disabled = true;
    btn.textContent = t.sending[lang];
    result.className = 'form-result';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });
      const json = await res.json();
      if (res.ok) {
        result.textContent = t.success[lang];
        result.className = 'form-result success';
        contactForm.reset();
      } else throw new Error(json.message);
    } catch {
      result.textContent = t.error[lang];
      result.className = 'form-result error';
    }

    btn.textContent = t.submit[lang];
    btn.disabled = false;
  });
}

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const cdot  = document.querySelector('.cursor-dot');
  const cring = document.querySelector('.cursor-ring');
  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cdot.style.left = mx + 'px';
    cdot.style.top  = my + 'px';
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cring.style.left = rx + 'px';
    cring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  const hoverTargets = 'a, button, .blog-card, .service-row, .equipo-card, .proceso-item, .ejemplo-card, .whatsapp-float';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cdot.style.opacity  = '0';
    cring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cdot.style.opacity  = '';
    cring.style.opacity = '';
  });
}

// ─── HERO TICKER ─────────────────────────────────────────────
const tickerItems = document.querySelectorAll('.ticker-item');
if (tickerItems.length > 0) {
  let idx = 0;
  setInterval(() => {
    tickerItems[idx].classList.remove('active');
    tickerItems[idx].classList.add('exiting');
    const prev = idx;
    setTimeout(() => tickerItems[prev].classList.remove('exiting'), 500);
    idx = (idx + 1) % tickerItems.length;
    tickerItems[idx].classList.add('active');
  }, 2400);
}

// ─── SCROLL ANIMATIONS (fade-up) ──────────────────────────────
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Stagger for grouped elements
document.querySelectorAll('.equipo-cards, .services-list, .proceso-grid, .ejemplos-grid, .blog-grid').forEach(container => {
  container.querySelectorAll('.equipo-card, .service-row, .proceso-item, .ejemplo-card, .blog-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.11}s`;
  });
});

document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));
