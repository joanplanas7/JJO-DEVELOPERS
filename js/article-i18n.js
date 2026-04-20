const articleFooterByLang = {
  es: 'Desarrollamos soluciones digitales',
  en: 'We develop digital solutions',
  ca: 'Desenvolupem solucions digitals'
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

const articleHomeByLang = {
  es: 'Volver a JJO',
  en: 'Back to JJO',
  ca: 'Tornar a JJO'
};

function getArticleSlug() {
  const file = window.location.pathname.split('/').pop() || '';
  return file.replace('.html', '');
}

function injectArticleDesignStyles() {
  if (document.querySelector('link[href$="articles.css"]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/articles.css';
  link.dataset.jjoArticleDesign = 'true';
  document.head.appendChild(link);
}

function injectArticleLangStyles() {
  if (document.getElementById('article-lang-styles')) return;

  const style = document.createElement('style');
  style.id = 'article-lang-styles';
  style.textContent = `
    .articulo-body li::before {
      content: '->' !important;
    }

    .article-lang-switcher {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
      margin-left: auto;
      padding: 6px 10px;
      border: 1px solid #1f1f1f;
      border-radius: 999px;
      background: rgba(20, 20, 20, 0.92);
    }

    .article-lang-btn {
      background: none;
      border: none;
      color: #888;
      font-size: 0.8rem;
      font-weight: 700;
      font-family: inherit;
      line-height: 1;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 4px;
    }

    .article-lang-btn.active {
      color: #b8f000;
    }

    .article-lang-btn:hover {
      color: #b8f000;
    }

    .article-lang-sep {
      color: #444;
      user-select: none;
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
  const header = document.querySelector('header');
  if (!header) return;

  if (!document.querySelector('.article-home-link')) {
    const homeButton = document.createElement('a');
    homeButton.className = 'article-home-link';
    homeButton.href = 'https://jjodevelopers.com/';
    homeButton.textContent = articleHomeByLang.es;
    header.prepend(homeButton);
  }

  if (document.querySelector('.article-lang-switcher')) return;

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
    homeLink.classList.add('article-brand-link');
    homeLink.innerHTML = 'JJO<span class="logo-dot">.</span>';
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

function stripHtml(html) {
  const element = document.createElement('div');
  element.innerHTML = html || '';
  return normalizeCorruptedText(element.textContent || '').replace(/\s+/g, ' ').trim();
}

function getCanonicalUrl() {
  return document.querySelector('link[rel="canonical"]')?.href || window.location.href.split('#')[0];
}

function getOgImage() {
  return document.querySelector('meta[property="og:image"]')?.getAttribute('content') || 'https://jjodevelopers.com/img/logojjo.png';
}

function parseSpanishArticleDate(meta) {
  const months = {
    enero: '01',
    febrero: '02',
    marzo: '03',
    abril: '04',
    mayo: '05',
    junio: '06',
    julio: '07',
    agosto: '08',
    septiembre: '09',
    setiembre: '09',
    octubre: '10',
    noviembre: '11',
    diciembre: '12'
  };
  const normalized = stripHtml(meta).toLowerCase();
  const match = normalized.match(/(\d{1,2})\s+(?:de\s+)?([a-záéíóúñ]+)\s+(?:de\s+)?(\d{4})/i);
  if (!match) return '2026-03-01';

  const day = match[1].padStart(2, '0');
  const month = months[match[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '')] || '03';
  return `${match[3]}-${month}-${day}`;
}

function upsertJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

function updateArticleStructuredData(lang, translation, spanishSnapshot) {
  const canonical = getCanonicalUrl();
  const title = stripHtml(translation.title);
  const category = stripHtml(translation.category);
  const description = stripHtml(translation.metaDescription);
  const published = spanishSnapshot.datePublished || parseSpanishArticleDate(spanishSnapshot.meta);

  upsertJsonLd('article-structured-data', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical
        },
        headline: title,
        description,
        image: [getOgImage()],
        datePublished: published,
        dateModified: '2026-04-20',
        author: {
          '@type': 'Organization',
          name: 'JJO Developers',
          url: 'https://jjodevelopers.com/'
        },
        publisher: {
          '@type': 'Organization',
          name: 'JJO Developers',
          logo: {
            '@type': 'ImageObject',
            url: 'https://jjodevelopers.com/img/logojjo.png'
          }
        },
        articleSection: category,
        inLanguage: lang,
        url: canonical
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'en' ? 'Home' : lang === 'ca' ? 'Inici' : 'Inicio',
            item: 'https://jjodevelopers.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'en' ? 'Articles' : lang === 'ca' ? 'Articles' : 'Artículos',
            item: 'https://jjodevelopers.com/articulos/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: canonical
          }
        ]
      }
    ]
  });
}

function setActiveArticleLang(lang) {
  document.querySelectorAll('.article-lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const homeButton = document.querySelector('.article-home-link');
  if (homeButton) {
    homeButton.textContent = articleHomeByLang[lang] || articleHomeByLang.es;
  }
}

function ensureArticleFooterStructure() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  if (footer.querySelector('.article-footer-brand')) {
    footer.querySelectorAll('[data-article-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
    return;
  }

  const brand = document.createElement('div');
  brand.className = 'article-footer-brand';
  brand.innerHTML = `
    <span class="article-footer-logo">JJO<span class="logo-dot">.</span></span>
    <p class="article-footer-copy">© <span data-article-year></span> — <span data-article-footer-desc>Desarrollamos soluciones digitales</span></p>
  `;

  const links = document.createElement('div');
  links.className = 'article-footer-links';
  links.innerHTML = `
    <a href="/aviso-legal.html" data-article-footer="legal">Aviso legal</a>
    <a href="/politica-privacidad.html" data-article-footer="privacy">Política de privacidad</a>
    <a href="/politica-cookies.html" data-article-footer="cookies">Política de cookies</a>
    <button type="button" data-open-cookie-settings data-article-footer="manage">Cambiar cookies</button>
  `;

  footer.innerHTML = '';
  footer.appendChild(brand);
  footer.appendChild(links);

  footer.querySelectorAll('[data-article-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function setArticleFooterLinks(lang) {
  const labels = articleFooterLinksByLang[lang] || articleFooterLinksByLang.es;
  const legal = document.querySelector('[data-article-footer="legal"]');
  const privacy = document.querySelector('[data-article-footer="privacy"]');
  const cookies = document.querySelector('[data-article-footer="cookies"]');
  const manage = document.querySelector('[data-article-footer="manage"]');

  if (legal) legal.textContent = labels.legal;
  if (privacy) privacy.textContent = labels.privacy;
  if (cookies) cookies.textContent = labels.cookies;
  if (manage) manage.textContent = labels.manage;
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
  const footerDescEl = document.querySelector('[data-article-footer-desc]');
  if (footerDescEl) {
    footerDescEl.textContent = articleFooterByLang[lang] || articleFooterByLang.es;
  }
  if (footerEl) {
    const yearEl = footerEl.querySelector('[data-article-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  setArticleFooterLinks(lang);
  setActiveArticleLang(lang);
  updateArticleStructuredData(lang, translation, spanishSnapshot);
  window.dispatchEvent(new CustomEvent('jjo:language-changed', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', () => {
  const slug = getArticleSlug();
  const articleTranslations = window.articleTranslations?.[slug];

  injectArticleDesignStyles();
  injectArticleLangStyles();
  normalizeArticleChrome();
  ensureArticleFooterStructure();
  loadComplianceScript();

  if (!articleTranslations) return;

  const spanishSnapshot = {
    metaTitle: normalizeCorruptedText(document.title),
    metaDescription: normalizeCorruptedText(document.querySelector('meta[name="description"]')?.getAttribute('content') || ''),
    category: normalizeCorruptedText(document.querySelector('.categoria')?.innerHTML || ''),
    title: normalizeCorruptedText(document.querySelector('.articulo-hero h1')?.innerHTML || ''),
    meta: normalizeCorruptedText(document.querySelector('.articulo-hero .meta')?.innerHTML || ''),
    body: normalizeCorruptedText(document.querySelector('.articulo-body')?.innerHTML || '')
  };
  spanishSnapshot.datePublished = parseSpanishArticleDate(spanishSnapshot.meta);

  ensureArticleLangSwitcher((lang) => setArticleLanguage(lang, spanishSnapshot, articleTranslations));

  const savedLang = localStorage.getItem('jjo-lang') || 'es';
  setArticleLanguage(savedLang, spanishSnapshot, articleTranslations);
});
