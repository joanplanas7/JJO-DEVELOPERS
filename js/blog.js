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
    cdot.style.left = mx + 'px'; cdot.style.top = my + 'px';
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    cring.style.left = rx + 'px'; cring.style.top = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  document.querySelectorAll('a, button, .blog-card, .featured-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => { cdot.style.opacity = '0'; cring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cdot.style.opacity = ''; cring.style.opacity = ''; });
}

// ─── HEADER SCROLL ────────────────────────────────────────────
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.style.borderBottomColor = window.scrollY > 10 ? "#1f1f1f" : "transparent";
}, { passive: true });

// ─── HAMBURGER MENU ───────────────────────────────────────────
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show");
  menuBtn.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    menuBtn.classList.remove("open");
  });
});

// ─── FOOTER YEAR ──────────────────────────────────────────────
document.getElementById("anio").textContent = new Date().getFullYear();

// ─── FILTER POSTS ─────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const allCards = document.querySelectorAll('.blog-card, .featured-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    allCards.forEach(card => {
      const cat = card.dataset.category || '';
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
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

// ─── MAGNETIC CTA BUTTON ─────────────────────────────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s';
  });
});

// ─── LOAD MORE (placeholder) ──────────────────────────────────
const loadMoreBtn = document.querySelector('.btn-loadmore');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    // When you have more posts, show them here
    // For now just animate the button
    loadMoreBtn.textContent = '...';
    setTimeout(() => {
      const lang = localStorage.getItem('jjo-lang') || 'es';
      const labels = { es: 'No hay más artículos', en: 'No more articles', ca: "No hi ha més articles" };
      loadMoreBtn.textContent = labels[lang];
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.4';
      loadMoreBtn.style.cursor = 'default';
    }, 600);
  });
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────────
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

// Stagger blog cards
document.querySelectorAll('.blog-grid').forEach(grid => {
  grid.querySelectorAll('.blog-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
});

document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));
