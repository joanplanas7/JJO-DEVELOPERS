function scrollToSection(id) {
  const section = document.getElementById(id);
  section.scrollIntoView({ behavior: 'smooth' });
}

// Menú hamburguesa para móviles
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show");
});

// Cerrar menú al pulsar un enlace
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
  });
});


const añoActual = new Date().getFullYear();
document.getElementById("anio").textContent = añoActual;

// Animaciones de scroll (Intersection Observer)
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Stagger para grupos de cards
document.querySelectorAll('.equipo-cards, .cards-propias').forEach(container => {
  container.querySelectorAll('.equipo-card, .card-propia').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });
});

// Observar todos los elementos con fade-up
document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));