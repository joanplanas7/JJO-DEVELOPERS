(function () {
  const CONSENT_KEY = 'jjo-cookie-consent';
  const langKey = 'jjo-lang';
  let analyticsLoaded = false;
  let uiRoot = null;

  const translations = {
    es: {
      bannerTitle: 'Usamos cookies y tecnologías similares',
      bannerBody: 'Solo activamos analítica si la aceptas. Las preferencias de idioma y consentimiento se guardan como almacenamiento técnico para que la web funcione correctamente.',
      acceptAll: 'Aceptar analítica',
      rejectAll: 'Rechazar analítica',
      configure: 'Configurar',
      panelTitle: 'Configuración de cookies',
      panelBody: 'Puedes decidir si activamos la analítica de Google para medir visitas y mejorar la web.',
      necessaryTitle: 'Técnicas y necesarias',
      necessaryText: 'Siempre activas. Incluyen las preferencias de idioma y el registro de tu consentimiento.',
      analyticsTitle: 'Analítica',
      analyticsText: 'Google Analytics y Google Tag Manager, solo después de tu aceptación.',
      alwaysOn: 'Siempre activas',
      save: 'Guardar selección',
      policy: 'Política de cookies'
    },
    en: {
      bannerTitle: 'We use cookies and similar technologies',
      bannerBody: 'We only enable analytics if you accept it. Language and consent preferences are stored as technical storage so the site works properly.',
      acceptAll: 'Accept analytics',
      rejectAll: 'Reject analytics',
      configure: 'Manage',
      panelTitle: 'Cookie settings',
      panelBody: 'You can decide whether we enable Google analytics to measure visits and improve the website.',
      necessaryTitle: 'Technical and necessary',
      necessaryText: 'Always active. They include language preferences and your consent record.',
      analyticsTitle: 'Analytics',
      analyticsText: 'Google Analytics and Google Tag Manager, only after your acceptance.',
      alwaysOn: 'Always active',
      save: 'Save selection',
      policy: 'Cookie policy'
    },
    ca: {
      bannerTitle: 'Fem servir cookies i tecnologies similars',
      bannerBody: 'Només activem l’analítica si l’acceptes. Les preferències d’idioma i consentiment es guarden com a emmagatzematge tècnic perquè la web funcioni correctament.',
      acceptAll: 'Acceptar analítica',
      rejectAll: 'Rebutjar analítica',
      configure: 'Configurar',
      panelTitle: 'Configuració de cookies',
      panelBody: 'Pots decidir si activem l’analítica de Google per mesurar visites i millorar la web.',
      necessaryTitle: 'Tècniques i necessàries',
      necessaryText: 'Sempre actives. Inclouen les preferències d’idioma i el registre del teu consentiment.',
      analyticsTitle: 'Analítica',
      analyticsText: 'Google Analytics i Google Tag Manager, només després de la teva acceptació.',
      alwaysOn: 'Sempre actives',
      save: 'Guardar selecció',
      policy: 'Política de cookies'
    }
  };

  function getLang() {
    return localStorage.getItem(langKey) || document.documentElement.lang || 'es';
  }

  function t() {
    return translations[getLang()] || translations.es;
  }

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  }

  function hasAnalyticsConsent() {
    return !!readConsent()?.analytics;
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0]?.trim();
      if (!name) return;
      if (!name.startsWith('_ga') && name !== '_gid' && name !== '_gat') return;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
    });
    window['ga-disable-G-N2S0G1BNN0'] = true;
  }

  function loadAnalytics() {
    if (analyticsLoaded || !hasAnalyticsConsent()) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-N2S0G1BNN0');

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-N2S0G1BNN0';
    document.head.appendChild(gaScript);

    const gtmScript = document.createElement('script');
    gtmScript.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WSP2ZN4N');`;
    document.head.appendChild(gtmScript);
  }

  function ensureStyles() {
    if (document.getElementById('jjo-cookie-styles')) return;
    const style = document.createElement('style');
    style.id = 'jjo-cookie-styles';
    style.textContent = `
      .cookie-ui-root {
        position: fixed;
        inset: auto 18px 18px 18px;
        z-index: 1200;
        pointer-events: none;
      }
      .cookie-card,
      .cookie-panel {
        max-width: 520px;
        margin-left: auto;
        border: 1px solid #1f1f1f;
        border-radius: 8px;
        background: rgba(20, 20, 20, 0.98);
        color: #f2efea;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        pointer-events: auto;
      }
      .cookie-card {
        padding: 22px;
      }
      .cookie-card h2,
      .cookie-panel h2 {
        margin: 0 0 10px;
        font-size: 1.1rem;
        color: #f2efea;
      }
      .cookie-card p,
      .cookie-panel p {
        margin: 0;
        color: #c9c3ba;
        font-size: 0.93rem;
      }
      .cookie-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }
      .cookie-btn {
        border: 1px solid #1f1f1f;
        border-radius: 8px;
        background: transparent;
        color: #f2efea;
        font: inherit;
        font-size: 0.92rem;
        font-weight: 600;
        cursor: pointer;
        padding: 10px 16px;
      }
      .cookie-btn:hover {
        border-color: rgba(184, 240, 0, 0.45);
        color: #b8f000;
      }
      .cookie-btn-primary {
        background: #b8f000;
        color: #111;
        border-color: #b8f000;
      }
      .cookie-btn-primary:hover {
        color: #111;
        background: #96c800;
        border-color: #96c800;
      }
      .cookie-policy-link {
        color: #b8f000;
        text-decoration: none;
      }
      .cookie-policy-link:hover {
        color: #96c800;
      }
      .cookie-panel {
        display: none;
        padding: 24px;
      }
      .cookie-panel.open {
        display: block;
      }
      .cookie-option {
        margin-top: 18px;
        padding: 16px;
        border: 1px solid #1f1f1f;
        border-radius: 8px;
        background: #080808;
      }
      .cookie-option-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 8px;
      }
      .cookie-option-head strong {
        font-size: 0.98rem;
      }
      .cookie-badge {
        color: #888;
        font-size: 0.8rem;
      }
      .cookie-switch {
        position: relative;
        width: 46px;
        height: 26px;
        border: none;
        border-radius: 999px;
        background: #2a2a2a;
        cursor: pointer;
      }
      .cookie-switch::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f2efea;
        transition: transform 0.2s ease;
      }
      .cookie-switch.active {
        background: #b8f000;
      }
      .cookie-switch.active::after {
        transform: translateX(20px);
      }
      @media (max-width: 640px) {
        .cookie-ui-root {
          inset: auto 12px 12px 12px;
        }
        .cookie-card,
        .cookie-panel {
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function closeUi() {
    if (uiRoot) {
      uiRoot.innerHTML = '';
    }
  }

  function saveConsent(analytics) {
    writeConsent({
      analytics,
      updatedAt: new Date().toISOString()
    });
    if (analytics) {
      window['ga-disable-G-N2S0G1BNN0'] = false;
      loadAnalytics();
    } else {
      clearAnalyticsCookies();
    }
    closeUi();
    window.dispatchEvent(new CustomEvent('jjo:cookie-consent-updated', { detail: readConsent() }));
  }

  function renderPanel() {
    const copy = t();
    const analytics = !!readConsent()?.analytics;

    uiRoot.innerHTML = `
      <div class="cookie-panel open" role="dialog" aria-modal="true" aria-label="${copy.panelTitle}">
        <h2>${copy.panelTitle}</h2>
        <p>${copy.panelBody}</p>
        <div class="cookie-option">
          <div class="cookie-option-head">
            <strong>${copy.necessaryTitle}</strong>
            <span class="cookie-badge">${copy.alwaysOn}</span>
          </div>
          <p>${copy.necessaryText}</p>
        </div>
        <div class="cookie-option">
          <div class="cookie-option-head">
            <strong>${copy.analyticsTitle}</strong>
            <button class="cookie-switch${analytics ? ' active' : ''}" type="button" data-cookie-toggle-analytics aria-pressed="${analytics}"></button>
          </div>
          <p>${copy.analyticsText}</p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn-primary" type="button" data-cookie-save>${copy.save}</button>
          <button class="cookie-btn" type="button" data-cookie-reject>${copy.rejectAll}</button>
          <a class="cookie-policy-link" href="/politica-cookies.html">${copy.policy}</a>
        </div>
      </div>
    `;

    const toggle = uiRoot.querySelector('[data-cookie-toggle-analytics]');
    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-pressed', String(toggle.classList.contains('active')));
    });

    uiRoot.querySelector('[data-cookie-save]')?.addEventListener('click', () => {
      saveConsent(!!toggle?.classList.contains('active'));
    });

    uiRoot.querySelector('[data-cookie-reject]')?.addEventListener('click', () => saveConsent(false));
  }

  function renderBanner() {
    const copy = t();
    uiRoot.innerHTML = `
      <div class="cookie-card" role="dialog" aria-live="polite" aria-label="${copy.bannerTitle}">
        <h2>${copy.bannerTitle}</h2>
        <p>${copy.bannerBody}</p>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn-primary" type="button" data-cookie-accept>${copy.acceptAll}</button>
          <button class="cookie-btn" type="button" data-cookie-reject>${copy.rejectAll}</button>
          <button class="cookie-btn" type="button" data-cookie-open>${copy.configure}</button>
        </div>
      </div>
    `;

    uiRoot.querySelector('[data-cookie-accept]')?.addEventListener('click', () => saveConsent(true));
    uiRoot.querySelector('[data-cookie-reject]')?.addEventListener('click', () => saveConsent(false));
    uiRoot.querySelector('[data-cookie-open]')?.addEventListener('click', renderPanel);
  }

  function ensureRoot() {
    if (uiRoot) return;
    uiRoot = document.createElement('div');
    uiRoot.className = 'cookie-ui-root';
    document.body.appendChild(uiRoot);
  }

  function openPreferences() {
    ensureRoot();
    renderPanel();
  }

  function refreshIfVisible() {
    if (!uiRoot || !uiRoot.innerHTML) return;
    if (uiRoot.querySelector('.cookie-panel')) {
      renderPanel();
    } else if (!readConsent()) {
      renderBanner();
    }
  }

  function init() {
    ensureStyles();
    ensureRoot();

    if (hasAnalyticsConsent()) {
      loadAnalytics();
    } else if (!readConsent()) {
      renderBanner();
    }

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-cookie-settings]');
      if (!trigger) return;
      event.preventDefault();
      openPreferences();
    });

    window.addEventListener('jjo:language-changed', refreshIfVisible);
  }

  window.JJOCookies = {
    openPreferences,
    hasAnalyticsConsent,
    getConsent: readConsent
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
