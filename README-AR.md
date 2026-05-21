# LOOK LAB IVVI — Realidad Aumentada
## Guía de estructura y mantenimiento

---

## Estructura de carpetas

```
ivvi-design/
│
├── ar/
│   ├── ar-unificado.html        ← Página AR (solo HTML, sin estilos ni lógica)
│   │
│   ├── markers/                 ← Imágenes marcadoras (una por diseño)
│   │   ├── rosa.png
│   │   ├── girasol.png
│   │   ├── glox.png
│   │   ├── ballena.png
│   │   └── fly.png
│   │
│   ├── models/                  ← Modelos 3D de cada camiseta
│   │   ├── rosa.glb
│   │   ├── girasol.glb
│   │   ├── glox.glb
│   │   ├── ballena.glb
│   │   └── fly.glb
│   │
│   └── targets/                 ← Archivo .mind compilado con TODOS los marcadores
│       └── targets-todos.mind
│
├── src/
│   ├── styles/
│   │   ├── ar.css               ← Todos los estilos de la experiencia AR
│   │   ├── main.css
│   │   ├── home.css
│   │   └── ...
│   │
│   └── scripts/
│       ├── ar.js                ← Toda la lógica AR + configuración de diseños
│       ├── carousel.js
│       └── ...
│
├── assets/
├── coi-serviceworker.js
├── index.html
├── disenios-ra.html
└── ...
```

---

## Cómo agregar un nuevo diseño

Sigue estos pasos **en orden**. Solo necesitas editar 2 archivos y recompilar el `.mind`.

### Paso 1 — Agrega los archivos del nuevo diseño

```
ar/markers/nuevo-diseño.png     ← imagen marcadora (frente de la camiseta)
ar/models/nuevo-diseño.glb      ← modelo 3D de la camiseta
```

### Paso 2 — Recompila el archivo .mind

Ve a: https://hiukim.github.io/mind-ar-js-doc/tools/compile

Sube **todas** las imágenes de `ar/markers/` en este orden exacto:
```
0 → rosa.png
1 → girasol.png
2 → glox.png
3 → ballena.png
4 → fly.png
5 → nuevo-diseño.png    ← nueva al final
```
> ⚠ El orden importa. Debe coincidir con el `targetIndex` en el HTML y el índice en `DISEÑOS[]` en ar.js.

Descarga el `.mind` y reemplaza `ar/targets/targets-todos.mind`.

### Paso 3 — Edita `src/scripts/ar.js`

Agrega un objeto al final del array `DISEÑOS`:

```js
const DISEÑOS = [
  // ... diseños existentes ...

  /* ── 5 · Nuevo diseño ── */
  {
    nombre:      'NombreNuevo',
    coleccion:   'Diseño 06 · Nombre Colección',
    emoji:       '🌿',
    color:       '#2ECC71',          // color del acento HUD
    escala:      '0.09 0.09 0.09',   // escala del modelo 3D
    descripcion: [
      `<span class="capital">T</span>exto editorial del primer párrafo...`,
      `Segundo párrafo con <em>énfasis</em> en palabras clave.`,
    ],
  },
];
```

### Paso 4 — Edita `ar/ar-unificado.html`

**4a.** En `<a-assets>`, agrega el modelo:
```html
<a-asset-item id="model-nuevodiseño" src="models/nuevo-diseño.glb"></a-asset-item>
```

**4b.** Copia el bloque de un target existente y ajusta los 3 valores marcados:
```html
<!-- 5 · Nuevo diseño -->
<a-entity mindar-image-target="targetIndex: 5" id="target-5">  <!-- ← cambia el 5 -->
  <a-gltf-model
    src="#model-nuevodiseño"                                     <!-- ← cambia el id -->
    position="0 0.05 0"
    scale="0 0 0"
    animation__aparecer="property:scale; from:0 0 0; to:0.09 0.09 0.09; dur:600; easing:easeOutElastic; startEvents:model-aparecer"
    animation__flotar="property:position; from:0 0.05 0; to:0 0.07 0; dur:2300; easing:easeInOutSine; loop:true; dir:alternate"
    animation__rotar="property:rotation; from:-4 -6 -2; to:4 6 2; dur:4100; easing:easeInOutSine; loop:true; dir:alternate"
  ></a-gltf-model>
</a-entity>
```

✅ Listo. La cámara detectará el nuevo marcador y mostrará su modelo 3D.

---

## Ajustar la escala de un modelo

Si el modelo 3D aparece muy grande o muy pequeño, cambia el valor `escala` en `DISEÑOS[]` de `ar.js` **y** el atributo `to:` de `animation__aparecer` en el bloque `<a-entity>` del HTML.

Por ejemplo para hacerlo más pequeño:
```js
// ar.js
escala: '0.06 0.06 0.06',
```
```html
<!-- ar-unificado.html -->
animation__aparecer="... to:0.06 0.06 0.06; ..."
```

---

## Compilar el .mind — referencia rápida

| Paso | Acción |
|------|--------|
| 1 | Ir a https://hiukim.github.io/mind-ar-js-doc/tools/compile |
| 2 | Subir todas las imágenes de `ar/markers/` en orden |
| 3 | Esperar la compilación (puede tardar ~1 min con muchas imágenes) |
| 4 | Descargar el `.mind` |
| 5 | Reemplazar `ar/targets/targets-todos.mind` |

---

## Requisitos técnicos

- La página debe servirse desde **HTTPS** o **localhost** (la cámara requiere origen seguro)
- El `coi-serviceworker.js` en la raíz es necesario para que MindAR funcione (SharedArrayBuffer)
- Navegadores soportados: **Chrome** (Android/iOS) y **Safari** (iOS 15.4+)

---

## Archivos que NO debes editar

| Archivo | Razón |
|---------|-------|
| `coi-serviceworker.js` | Headers de seguridad requeridos por el navegador |
| CDN de A-Frame y MindAR | Versiones fijas para estabilidad |

---

*LOOK LAB IVVI · 2026*
