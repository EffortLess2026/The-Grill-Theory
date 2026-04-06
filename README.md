# The Grill Theory — Landing Page

Prototipo de landing page premium para **The Grill Theory**, restaurante de hamburguesas gourmet con sede en Bogotá, Colombia. Diseñado con una estética de minimalismo oscuro, tipografía editorial y micro-interacciones de alto nivel.

---

## Vista previa

> Abre `index.html` directamente en el navegador. No requiere servidor ni dependencias.

---

## Estructura del proyecto

```
The-Grill-Theory/
├── index.html   # Estructura semántica HTML5
├── style.css    # Estilos en CSS puro (sin frameworks)
└── script.js    # JavaScript vanilla modular
```

---

## Secciones

| Sección | Descripción |
|---------|-------------|
| **Hero** | Layout split 50/50 — imagen izquierda, texto editorial derecha con tipografía serif + outline |
| **Marquee** | Cinta animada con atributos del restaurante |
| **Menú** | Lista editorial interactiva — hover revela imagen del plato |
| **Historia** | Layout 2 columnas con parallax en la imagen y pull quote |
| **Stats** | Contadores animados con easing al entrar al viewport |
| **Reseñas** | Carrusel con barra de progreso, controles en la parte superior, autoplay y swipe táctil |
| **CTA** | Sección de reserva con imagen de fondo y llamada a la acción |
| **Footer** | Minimalista con navegación y datos del restaurante |

---

## Características técnicas

### CSS
- **Design tokens** completos en `:root` (colores, tipografía, espaciado, curvas de animación)
- **Sin frameworks** — CSS puro con Custom Properties, Flexbox y CSS Grid
- **Grain texture** animada vía SVG fractalNoise para sensación de película analógica
- **Animaciones** con `clip-path`, `opacity`, `transform` y `transition` con bezier personalizado
- **Responsive** con breakpoints en 1024px, 768px y 480px

### JavaScript
- **Intersection Observer** para revelar elementos al hacer scroll
- **Loader** de entrada con barra de progreso
- **Navbar** que cambia de estilo al hacer scroll (glassmorphism)
- **Menu preview** con `position: fixed` que sigue el cursor dentro del viewport
- **Parallax** en la sección Historia (solo desktop)
- **Contador animado** con easing `easeOutQuart`
- **Carrusel** con autoplay, pausa en hover, swipe táctil y navegación por teclado
- **Efecto magnético** en botones `.btn-magnetic`

### Fuentes (Google Fonts)
- `Cormorant Garamond` — titulares serif
- `Inter` — textos y UI

---

## Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#0a0a0a` | Fondo principal |
| `--bg-2` | `#111111` | Fondo secundario |
| `--gold` | `#c9a84c` | Acento principal |
| `--white` | `#f2ede4` | Texto en titulares |
| `--text` | `#9a9488` | Texto de cuerpo |

---

## Cómo usar

```bash
# Clonar o descargar el repositorio
# Abrir index.html en cualquier navegador moderno
open index.html
```

No requiere Node.js, bundler ni instalación de dependencias. Todas las fuentes se cargan desde Google Fonts (requiere conexión a internet).

---

## Créditos

- Imágenes: [Unsplash](https://unsplash.com)
- Tipografía: [Google Fonts](https://fonts.google.com)
- Desarrollado como prototipo UI/UX premium para The Grill Theory © 2026
