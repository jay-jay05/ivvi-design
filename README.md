# Seminario Closet – Proyecto HTML puro

Conversión del proyecto Vue 3 + Vite a HTML/CSS/JS estático.  
No requiere Node.js, npm ni ningún bundler. Funciona directamente en el navegador.

---

## Estructura de archivos

```
seminario-closet/
│
├── index.html              ← Página principal (home)
├── probador.html           ← Probador Virtual con RA
│
└── src/
    ├── styles/
    │   ├── main.css        ← Reset + grid layout global
    │   ├── navbar.css      ← Barra de navegación
    │   ├── home.css        ← Hero + carrusel (solo home)
    │   └── probador.css    ← Página del probador virtual
    │
    ├── scripts/
    │   ├── navbar.js       ← Menú hamburguesa (mobile)
    │   ├── carousel.js     ← Carrusel automático
    │   ├── contact.js      ← Formulario de contacto
    │   └── probadorSketch.js  ← Sketch p5.js + ml5 (RA)
    │
    └── assets/
        └── images/
            ├── fotocamisa1.png   ← ¡Debes añadir tus imágenes aquí!
            ├── fotocamisa2.png
            └── fotocamisa3.png
```

---

## Cómo usar

### 1. Añadir las imágenes de las prendas

Coloca tus imágenes PNG con fondo transparente en:

```
src/assets/images/fotocamisa1.png
src/assets/images/fotocamisa2.png
src/assets/images/fotocamisa3.png
```

También puedes añadir iconos de redes sociales (SVG):
```
src/assets/images/tiktok-icon.svg
src/assets/images/instagram-icon.svg
src/assets/images/youtube-icon.svg
```

### 2. Abrir el proyecto

**Opción A – VS Code + Live Server (recomendado)**
1. Abre la carpeta `seminario-closet/` en VS Code.
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho en `index.html` → *Open with Live Server*.
4. El sitio abre en `http://127.0.0.1:5500`.

> ⚠️ El Probador Virtual necesita `localhost` (no `file://`) para acceder a la cámara.

**Opción B – Python (si tienes Python instalado)**
```bash
cd seminario-closet
python -m http.server 5500
# Luego abre http://localhost:5500 en el navegador
```

---

## Páginas

| Archivo | Descripción |
|---|---|
| `index.html` | Home: hero, carrusel, galería, video, formulario, mapa, footer |
| `probador.html` | Probador Virtual AR con cámara + BodyPose (ml5.js + p5.js) |

---

## Dependencias externas (CDN)

| Librería | Versión | Uso |
|---|---|---|
| ml5.js | 1.x | Detección de poses (BodyPose MoveNet) |
| p5.js | 2.1.1 | Canvas y renderizado |

No se necesita instalar nada más.

---

## Notas

- El probador pide permiso de **cámara** al cargar la página; acéptalo.
- Las imágenes PNG de las camisetas deben tener **fondo transparente** para que el efecto de superposición sea correcto.
- Los marcadores rojos en los hombros son temporales; puedes quitarlos comentando `drawMarkers(poses)` en `probadorSketch.js`.
