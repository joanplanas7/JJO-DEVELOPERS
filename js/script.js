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

// Formulario de contacto (Web3Forms)
const contactForm = document.getElementById('contacto-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const result = document.getElementById('form-result');
    const lang = localStorage.getItem('jjo-lang') || 'es';

    const sendingText = { es: 'Enviando...', en: 'Sending...', ca: 'Enviant...' };
    const successText = { es: '¡Mensaje enviado! Te contactaremos pronto.', en: "Message sent! We'll get back to you soon.", ca: 'Missatge enviat! Et contactarem aviat.' };
    const errorText   = { es: 'Error al enviar. Inténtalo de nuevo.', en: 'Error sending. Please try again.', ca: "Error en enviar. Torna-ho a intentar." };

    btn.disabled = true;
    btn.textContent = sendingText[lang];
    result.className = 'form-result';

    try {
      const data = Object.fromEntries(new FormData(contactForm));
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (res.ok) {
        result.textContent = successText[lang];
        result.className = 'form-result success';
        contactForm.reset();
      } else {
        throw new Error(json.message);
      }
    } catch {
      result.textContent = errorText[lang];
      result.className = 'form-result error';
    }

    const submitLabels = { es: 'Enviar mensaje', en: 'Send message', ca: 'Enviar missatge' };
    btn.textContent = submitLabels[lang];
    btn.disabled = false;
  });
}

// Animaciones de scroll (Intersection Observer)
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Stagger para grupos de cards y pasos
document.querySelectorAll('.equipo-cards, .cards-propias, .proceso-steps, .ejemplos-grid').forEach(container => {
  container.querySelectorAll('.equipo-card, .card-propia, .proceso-step, .ejemplo-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
  });
});

// Observar todos los elementos con fade-up
document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));