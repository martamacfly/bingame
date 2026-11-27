# Bingo callejero

Juego de bingo para jugar paseando por la calle. Es una web estática (HTML + CSS + JS, sin dependencias) y además una **PWA**: se puede instalar en el móvil como si fuera una app y funciona sin conexión.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La página |
| `styles.css` | Los estilos |
| `app.js` | La lógica del juego |
| `manifest.webmanifest` | Nombre, colores e iconos de la app instalable |
| `sw.js` | Service worker: guarda la app para usarla sin internet |
| `icons/` | Iconos de la app |

## Bingo de la cena de Navidad

En la carpeta `navidad/` hay otra versión, con su propio estilo, para jugar entre primos en la cena de Navidad: las casillas son frases de la familia y cosas que pasan en la mesa. Se abre en `/navidad/` y también se puede instalar como app.

- Todos usan el mismo **código de mesa**, y cada primo, al poner su nombre, recibe un cartón distinto.
- En «Frases de vuestra familia» se pueden añadir vuestros clásicos; viajan dentro del enlace al compartirlo.
- Al cambiar algo, sube la versión en `navidad/sw.js` (`bingo-navidad-v1` → `-v2`) y el `?v=` de `navidad/index.html`.

## Probar en tu ordenador

```powershell
python -m http.server 5173
```

Y abre http://localhost:5173

## Publicarlo en internet (gratis)

Cualquiera de estas sirve; sube la carpeta tal cual:

- **Netlify Drop** (lo más fácil): entra en https://app.netlify.com/drop y arrastra la carpeta `bingame`. Te da una URL al momento.
- **GitHub Pages**: crea un repositorio, sube los archivos y activa *Settings → Pages → Deploy from branch (main)*.
- **Vercel / Cloudflare Pages**: importa el repositorio o arrastra la carpeta; no necesita configuración de build.

Tiene que servirse por **HTTPS** (todas las anteriores lo hacen) para que se pueda instalar como app.

## Instalarla en el móvil

- **Android (Chrome)**: abre la URL → menú ⋮ → *Instalar aplicación*.
- **iPhone (Safari)**: abre la URL → botón Compartir → *Añadir a pantalla de inicio*.

## Al hacer cambios

Sube el número de versión en `sw.js` (`bingo-v1` → `bingo-v2`) para que los móviles que ya la tienen instalada descarguen la nueva versión.

## ¿Y en Google Play / App Store?

- **Google Play**: se puede empaquetar esta misma PWA con https://www.pwabuilder.com (genera el paquete para Play Store a partir de la URL publicada).
- **App Store**: requiere envolverla con Capacitor y compilar en un Mac con Xcode, más la cuenta de desarrollador de Apple (99 €/año).
