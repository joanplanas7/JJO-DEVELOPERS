const articleFooterByLang = {
  es: '© 2026 JJO · Desarrollamos soluciones digitales',
  en: '© 2026 JJO · We develop digital solutions',
  ca: '© 2026 JJO · Desenvolupem solucions digitals'
};

const articleFooterLinksByLang = {
  es: {
    legal: 'Aviso legal',
    privacy: 'Política de privacidad',
    cookies: 'Política de cookies',
    manage: 'Cambiar cookies'
  },
  en: {
    legal: 'Legal notice',
    privacy: 'Privacy policy',
    cookies: 'Cookie policy',
    manage: 'Change cookies'
  },
  ca: {
    legal: 'Avís legal',
    privacy: 'Política de privacitat',
    cookies: 'Política de cookies',
    manage: 'Canviar cookies'
  }
};

function getArticleSlug() {
  const file = window.location.pathname.split('/').pop() || '';
  return file.replace('.html', '');
}

function injectArticleLangStyles() {
  if (document.getElementById('article-lang-styles')) return;

  const style = document.createElement('style');
  style.id = 'article-lang-styles';
  style.textContent = `
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    header a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    header a::before {
      content: '\\2190';
      color: inherit;
    }

    .articulo-body li::before {
      content: '\\2192' !important;
    }

    .article-lang-switcher {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
      margin-left: auto;
      padding: 6px 10px;
      border: 1px solid #1f2937;
      border-radius: 999px;
      background: #0f172a;
    }

    .article-lang-btn {
      background: none;
      border: none;
      color: #666;
      font-size: 0.8rem;
      font-weight: 700;
      font-family: inherit;
      line-height: 1;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 4px;
    }

    .article-lang-btn.active {
      color: #60a5fa;
    }

    .article-lang-btn:hover {
      color: #93c5fd;
    }

    .article-lang-sep {
      color: #333;
      user-select: none;
    }

    .article-footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px 18px;
      margin-bottom: 12px;
    }

    .article-footer-links a,
    .article-footer-links button {
      border: none;
      background: none;
      padding: 0;
      color: #8b95a7;
      font: inherit;
      text-decoration: none;
      cursor: pointer;
    }

    .article-footer-links a:hover,
    .article-footer-links button:hover {
      color: #60a5fa;
    }

    @media (max-width: 640px) {
      header {
        flex-direction: column;
        align-items: flex-start;
      }

      .article-lang-switcher {
        margin-left: 0;
      }
    }
  `;

  document.head.appendChild(style);
}

function ensureArticleLangSwitcher(onChange) {
  if (document.querySelector('.article-lang-switcher')) return;

  const header = document.querySelector('header');
  if (!header) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'article-lang-switcher';
  wrapper.innerHTML = `
    <button class="article-lang-btn" data-lang="es">ES</button>
    <span class="article-lang-sep">|</span>
    <button class="article-lang-btn" data-lang="en">EN</button>
    <span class="article-lang-sep">|</span>
    <button class="article-lang-btn" data-lang="ca">CA</button>
  `;

  wrapper.querySelectorAll('.article-lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => onChange(btn.dataset.lang));
  });

  header.appendChild(wrapper);
}

function normalizeArticleChrome() {
  const homeLink = document.querySelector('header a');
  if (homeLink) {
    homeLink.textContent = 'JJO';
  }
}

function normalizeCorruptedText(text) {
  if (!text) return text;

  const replacements = [
    ['c�mo', 'cómo'],
    ['C�mo', 'Cómo'],
    ['m�s', 'más'],
    ['M�s', 'Más'],
    ['r�pido', 'rápido'],
    ['r�pida', 'rápida'],
    ['gesti�n', 'gestión'],
    ['atenci�n', 'atención'],
    ['automatizaci�n', 'automatización'],
    ['Automatizaci�n', 'Automatización'],
    ['informaci�n', 'información'],
    ['clasificaci�n', 'clasificación'],
    ['conversi�n', 'conversión'],
    ['inter�s', 'interés'],
    ['intenci�n', 'intención'],
    ['recepci�n', 'recepción'],
    ['asignaci�n', 'asignación'],
    ['publicaci�n', 'publicación'],
    ['dise�ado', 'diseñado'],
    ['dise�ada', 'diseñada'],
    ['dise�o', 'diseño'],
    ['P�ginas', 'Páginas'],
    ['p�ginas', 'páginas'],
    ['p�gina', 'página'],
    ['Se�ales', 'Señales'],
    ['se�ales', 'señales'],
    ['fr�o', 'frío'],
    ['d�a', 'día'],
    ['d�as', 'días'],
    ['tambi�n', 'también'],
    ['seg�n', 'según'],
    ['autom�tico', 'automático'],
    ['autom�tica', 'automática'],
    ['autom�ticamente', 'automáticamente'],
    ['m�vil', 'móvil'],
    ['aqu�', 'aquí'],
    ['ah�', 'ahí'],
    ['tendr�a', 'tendría'],
    ['�tiles', 'útiles'],
    ['qu�', 'qué'],
    ['Qu�', 'Qué'],
    ['por qu�', 'por qué'],
    ['Por qu�', 'Por qué'],
    ['cu�nto', 'cuánto'],
    ['Cu�nto', 'Cuánto'],
    ['�rea', 'área'],
    ['�reas', 'áreas'],
    ['operaci�n', 'operación'],
    ['expresi�n', 'expresión'],
    ['situaci�n', 'situación'],
    ['relaci�n', 'relación'],
    ['revisi�n', 'revisión'],
    ['evoluci�n', 'evolución'],
    ['aplicaci�n', 'aplicación'],
    ['soluci�n', 'solución'],
    ['integraci�n', 'integración'],
    ['Documentaci�n', 'Documentación'],
    ['condici�n', 'condición'],
    [' â€œ', ' “'],
    ['â€', '”'],
    ['â†', '←'],
    ['â†’', '→'],
    ['Â·', '·'],
    ['Â©', '©']
  ];

  let output = text;
  replacements.forEach(([from, to]) => {
    output = output.replaceAll(from, to);
  });

  return output;
}

function setActiveArticleLang(lang) {
  document.querySelectorAll('.article-lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function ensureArticleFooterStructure() {
  const footer = document.querySelector('footer');
  if (!footer || footer.querySelector('.article-footer-copy')) return;

  const existingCopy = footer.querySelector('p')?.innerHTML || footer.textContent.trim();

  const copy = document.createElement('p');
  copy.className = 'article-footer-copy';
  copy.innerHTML = normalizeCorruptedText(existingCopy);

  const links = document.createElement('div');
  links.className = 'article-footer-links';
  links.innerHTML = `
    <a href="/aviso-legal.html" data-article-footer="legal">Aviso legal</a>
    <a href="/politica-privacidad.html" data-article-footer="privacy">Política de privacidad</a>
    <a href="/politica-cookies.html" data-article-footer="cookies">Política de cookies</a>
    <button type="button" data-open-cookie-settings data-article-footer="manage">Cambiar cookies</button>
  `;

  footer.innerHTML = '';
  footer.appendChild(links);
  footer.appendChild(copy);
}

function setArticleFooterLinks(lang) {
  const labels = articleFooterLinksByLang[lang] || articleFooterLinksByLang.es;
  document.querySelector('[data-article-footer="legal"]').textContent = labels.legal;
  document.querySelector('[data-article-footer="privacy"]').textContent = labels.privacy;
  document.querySelector('[data-article-footer="cookies"]').textContent = labels.cookies;
  document.querySelector('[data-article-footer="manage"]').textContent = labels.manage;
}

function loadComplianceScript() {
  if (window.JJOCookies || document.querySelector('script[data-jjo-cookie-script]')) return;
  const script = document.createElement('script');
  script.src = '../js/cookie-consent.js';
  script.dataset.jjoCookieScript = 'true';
  document.head.appendChild(script);
}

function setArticleLanguage(lang, spanishSnapshot, articleTranslations) {
  const translation = lang === 'es' ? spanishSnapshot : articleTranslations[lang];
  if (!translation) return;

  localStorage.setItem('jjo-lang', lang);
  document.documentElement.lang = lang;
  document.title = translation.metaTitle;

  const descriptionEl = document.querySelector('meta[name="description"]');
  if (descriptionEl) {
    descriptionEl.setAttribute('content', translation.metaDescription);
  }

  const categoryEl = document.querySelector('.categoria');
  if (categoryEl) {
    categoryEl.innerHTML = translation.category;
  }

  const titleEl = document.querySelector('.articulo-hero h1');
  if (titleEl) {
    titleEl.innerHTML = translation.title;
  }

  const metaEl = document.querySelector('.articulo-hero .meta');
  if (metaEl) {
    metaEl.innerHTML = translation.meta;
  }

  const bodyEl = document.querySelector('.articulo-body');
  if (bodyEl) {
    bodyEl.innerHTML = translation.body;
  }

  const footerEl = document.querySelector('.article-footer-copy');
  if (footerEl) {
    footerEl.innerHTML = articleFooterByLang[lang] || articleFooterByLang.es;
  }

  setArticleFooterLinks(lang);
  setActiveArticleLang(lang);
  window.dispatchEvent(new CustomEvent('jjo:language-changed', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', () => {
  const slug = getArticleSlug();
  const articleTranslations = window.articleTranslations?.[slug];
  if (!articleTranslations) return;

  injectArticleLangStyles();
  normalizeArticleChrome();
  ensureArticleFooterStructure();
  loadComplianceScript();

  const spanishSnapshot = {
    metaTitle: normalizeCorruptedText(document.title),
    metaDescription: normalizeCorruptedText(document.querySelector('meta[name="description"]')?.getAttribute('content') || ''),
    category: normalizeCorruptedText(document.querySelector('.categoria')?.innerHTML || ''),
    title: normalizeCorruptedText(document.querySelector('.articulo-hero h1')?.innerHTML || ''),
    meta: normalizeCorruptedText(document.querySelector('.articulo-hero .meta')?.innerHTML || ''),
    body: normalizeCorruptedText(document.querySelector('.articulo-body')?.innerHTML || '')
  };

  ensureArticleLangSwitcher((lang) => setArticleLanguage(lang, spanishSnapshot, articleTranslations));

  const savedLang = localStorage.getItem('jjo-lang') || 'es';
  setArticleLanguage(savedLang, spanishSnapshot, articleTranslations);
});
