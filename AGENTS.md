# Repository Guidelines

## Estructura del proyecto y organización
Este repositorio contiene una web estática corporativa. En la raíz están las páginas principales como `index.html`, las páginas legales, `robots.txt`, `sitemap.xml` y `CNAME`. Los estilos compartidos viven en `css/`, la lógica de cliente en `js/` y los recursos gráficos en `img/`. El contenido del blog está en `articulos/` como archivos HTML independientes, con `articulos/index.html` como índice.

## Comandos de desarrollo y revisión
No hay pipeline de build ni `package.json` en este repositorio. El trabajo se hace directamente sobre archivos estáticos y se puede revisar en local con un servidor simple:

```powershell
python -m http.server 8000
```

Abre `http://localhost:8000` para comprobar navegación, recursos y traducciones. Usa `rg --files` para revisar la estructura y `rg "data-i18n"` para localizar textos traducibles.

## Estilo de código y convenciones
Sigue el estilo actual del proyecto: indentación de 2 espacios en HTML, CSS y JavaScript; HTML semántico; y scripts pequeños en JavaScript vanilla para manipulación del DOM. Mantén nombres de archivo en minúsculas y con guiones, por ejemplo `automatizar-leads-ia.html` o `politica-privacidad.html`. Evita crear carpetas nuevas en la raíz salvo que la estructura realmente lo exija.

## Guía de pruebas
No hay suite de pruebas automatizadas, así que la validación es manual. Antes de abrir una PR, carga la web en local y revisa la portada, al menos un artículo y cada página legal o de contenido modificada. Comprueba enlaces rotos, diseño responsive, cambio de idioma y cualquier comportamiento afectado del formulario o del banner de cookies.

## Commits y pull requests
El historial reciente usa mensajes cortos y directos en español, como `fix traducciones`, `cambio de numero` o `mejoras para el SEO`. Mantén commits pequeños y centrados en un solo cambio. Las PR deben incluir un resumen breve, páginas o scripts afectados, capturas si hay cambios visuales y una nota con las comprobaciones manuales realizadas.

## Seguridad y contenido
No subas secretos ni claves API. Las integraciones externas, como el endpoint del formulario de contacto, deben seguir siendo configurables y conviene probarlas después de cualquier cambio. Al añadir contenido, conserva URLs canónicas, metadatos y enlazado interno para no degradar el SEO.
