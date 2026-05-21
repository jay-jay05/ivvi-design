/**
 * ar.js — LOOK LAB IVVI · Realidad Aumentada
 * Lógica completa de ar-unificado.html
 *
 * ════════════════════════════════════════════════════════
 * PARA AGREGAR UN NUEVO DISEÑO:
 *   1. Agrega un objeto al array DISEÑOS al final de la lista
 *   2. Agrega su <a-asset-item> en ar-unificado.html
 *   3. Agrega su <a-entity mindar-image-target> en ar-unificado.html
 *   4. Recompila targets/targets-todos.mind con la nueva imagen
 *      → https://hiukim.github.io/mind-ar-js-doc/tools/compile
 * ════════════════════════════════════════════════════════
 */

'use strict';

/* ════════════════════════════════════════════════════════
   CONFIGURACIÓN DE DISEÑOS
   · Orden = targetIndex del .mind compilado
   · color: color hex del acento HUD
   · escala: escala del modelo GLB sobre el marcador
   · descripcion: array de párrafos (admite HTML)
════════════════════════════════════════════════════════ */
const DISEÑOS = [
  /* ── 0 · Rosa ─────────────────────────────────────── */
  {
    nombre:      'Rosa',
    coleccion:   'Diseño 01 · Colección Esencial',
    emoji:       '🌹',
    color:       '#E8374A',
    escala:      '0.4 0.4 0.4',
    descripcion: [
      `<span class="capital">L</span>a <em>rosa</em> ha sido símbolo de elegancia y pasión
       a lo largo de los siglos. En esta colección la reinterpretamos bajo un concepto
       de minimalismo funcional: líneas limpias que encuadran su esencia sin restarle intensidad.`,
      `Los <em>acentos en rojo</em> no son solo un recurso estético — son una declaración.
       Cada detalle está diseñado para que la prenda hable por sí misma.`,
    ],
  },

  /* ── 1 · Girasol ───────────────────────────────────── */
  {
    nombre:      'Girasol',
    coleccion:   'Diseño 02 · Edición Moderna',
    emoji:       '🌻',
    color:       '#E8A020',
    escala:      '0.4 0.4 0.4',
    descripcion: [
      `<span class="capital">E</span>l <em>girasol</em> siempre mira hacia la luz. Este diseño
       captura esa energía vital y la transforma en una pieza que irradia calidez en cada hilo.`,
      `Los <em>acentos en dorado</em> evocan el sol al mediodía: directos, generosos y sin reservas.
       Una prenda para quienes eligen brillar.`,
    ],
  },

  /* ── 2 · Gloxinia ──────────────────────────────────── */
  {
    nombre:      'Gloxinia',
    coleccion:   'Diseño 03 · Elegancia Contemporánea',
    emoji:       '🌸',
    color:       '#8B44C0',
    escala:      '0.4 0.4 0.4',
    descripcion: [
      `<span class="capital">L</span>a <em>gloxinia</em> florece en sombra y en silencio.
       Su belleza es discreta, profunda — la de quien no necesita anunciarse para ser recordado.`,
      `Los <em>acentos en morado</em> recorren cada curva del diseño como una firma.
       Sofisticación sin esfuerzo, elegancia sin artificios.`,
    ],
  },

  /* ── 3 · Ballena ───────────────────────────────────── */
  {
    nombre:      'Ballena',
    coleccion:   'Diseño 04 · Edición Mar',
    emoji:       '🐋',
    color:       '#2A7FCC',
    escala:      '0.4 0.4 0.4',
    descripcion: [
      `<span class="capital">L</span>a <em>ballena</em> navega en silencio por aguas profundas.
       Este diseño captura esa majestuosidad marina: imponente, serena, sin artificio.`,
      `Los <em>acentos en azul</em> evocan el océano en toda su profundidad. Una prenda para
       quienes llevan el mar por dentro.`,
    ],
  },

  /* ── 4 · Fly ───────────────────────────────────────── */
  {
    nombre:      'Fly',
    coleccion:   'Diseño 05 · Edición Urbana',
    emoji:       '🦋',
    color:       '#4DAA70',
    escala:      '0.4 0.4 0.4',
    descripcion: [
      `<span class="capital">V</span>olar es una forma de ver el mundo desde otro ángulo.
       La colección <em>Fly</em> nace de esa libertad: diseño limpio, actitud sin límites.`,
      `Los <em>acentos en verde</em> son una declaración de movimiento constante.
       Para quienes no se quedan quietos.`,
    ],
  },

  /* ── 5 · (Próximo diseño — ejemplo) ────────────────── */
  // {
  //   nombre:      'NombreNuevo',
  //   coleccion:   'Diseño 06 · Nombre Colección',
  //   emoji:       '🌿',
  //   color:       '#2ECC71',
  //   escala:      '0.09 0.09 0.09',
  //   descripcion: [
  //     `<span class="capital">T</span>exto editorial del nuevo diseño...`,
  //   ],
  // },
];


/* ════════════════════════════════════════════════════════
   ESTADO INTERNO
════════════════════════════════════════════════════════ */
let arStarted     = false;
let usandoFrontal = false;
let targetActivo  = -1;
let streamPrueba  = null;


/* ════════════════════════════════════════════════════════
   REFERENCIAS DOM
════════════════════════════════════════════════════════ */
const overlayInicio  = document.getElementById('overlay-inicio');
const overlayLoading = document.getElementById('overlay-loading');
const overlayAR      = document.getElementById('overlay-ar');
const overlayInfo    = document.getElementById('overlay-info');
const overlayError   = document.getElementById('overlay-error');
const escena         = document.getElementById('escena-ar');
const scanPrompt     = document.getElementById('scan-prompt');
const scanFrame      = document.getElementById('scan-frame');
const badgeActivo    = document.getElementById('badge-activo');
const hintTap        = document.getElementById('hint-tap');
const hudTag         = document.getElementById('hud-tag');
const zonaTap        = document.getElementById('zona-tap');
const camSelector    = document.getElementById('cam-selector');
const btnCamTrasera  = document.getElementById('btn-cam-trasera');
const btnCamFrontal  = document.getElementById('btn-cam-frontal');
const panelEtiqueta  = document.getElementById('panel-etiqueta-txt');
const panelTitulo    = document.getElementById('panel-titulo-txt');
const panelCuerpo    = document.getElementById('panel-cuerpo-txt');


/* ════════════════════════════════════════════════════════
   SPLASH — chips de diseños generados desde DISEÑOS[]
════════════════════════════════════════════════════════ */
(function generarChips() {
  const container = document.getElementById('splash-markers');
  if (!container) return;
  container.innerHTML = DISEÑOS.map(d => `
    <span class="splash-marker-chip">
      <span class="dot-color" style="background:${d.color}"></span>${d.nombre}
    </span>
  `).join('');
})();


/* ════════════════════════════════════════════════════════
   COLOR DE ACENTO — cambia el HUD según el diseño activo
════════════════════════════════════════════════════════ */
function aplicarColor(color) {
  overlayAR.style.setProperty('--tag-color', color);
  overlayInfo.style.setProperty('--tag-color', color);
  document.querySelectorAll('.dot').forEach(d => (d.style.background = color));
}

function resetColor() {
  overlayAR.style.removeProperty('--tag-color');
  overlayInfo.style.removeProperty('--tag-color');
  document.querySelectorAll('.dot').forEach(d => (d.style.background = ''));
}


/* ════════════════════════════════════════════════════════
   PERMISO DE CÁMARA
════════════════════════════════════════════════════════ */
async function pedirPermiso(facing) {
  try {
    if (streamPrueba) {
      streamPrueba.getTracks().forEach(t => t.stop());
      streamPrueba = null;
    }
    streamPrueba = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    streamPrueba.getTracks().forEach(t => t.stop());
    streamPrueba = null;
    return true;
  } catch (err) {
    console.error('[AR] Permiso cámara:', err.name);
    overlayError.classList.add('visible');
    return false;
  }
}


/* ════════════════════════════════════════════════════════
   ARRANQUE AR
════════════════════════════════════════════════════════ */
document.getElementById('btn-iniciar').addEventListener('click', async () => {
  const ok = await pedirPermiso('environment');
  if (!ok) return;

  overlayInicio.classList.add('saliendo');
  setTimeout(() => overlayInicio.classList.add('oculto'), 500);

  overlayLoading.classList.add('visible');
  escena.style.opacity       = '1';
  escena.style.pointerEvents = 'all';

  iniciarAR();
});

function iniciarAR() {
  if (arStarted) return;
  arStarted = true;

  escena.addEventListener('arReady', () => {
    overlayLoading.classList.remove('visible');
    overlayAR.classList.add('visible');
    camSelector.classList.add('visible');
  });

  escena.addEventListener('arError', () => {
    overlayLoading.classList.remove('visible');
    overlayError.classList.add('visible');
  });

  /* Registrar eventos por cada target definido en DISEÑOS */
  DISEÑOS.forEach((diseño, i) => {
    const entidad = document.getElementById(`target-${i}`);
    if (!entidad) return;

    /* TARGET ENCONTRADO */
    entidad.addEventListener('targetFound', () => {
      targetActivo = i;

      /* Animar aparición — el modelo está dentro del pivot */
      const modelo = entidad.querySelector('a-gltf-model');
      if (modelo) modelo.emit('model-aparecer');

      /* HUD */
      aplicarColor(diseño.color);
      hudTag.textContent      = `${diseño.emoji} ${diseño.nombre}`;
      badgeActivo.textContent = `✦ ${diseño.nombre} detectado`;
      hudTag.classList.add('visible');
      badgeActivo.classList.add('visible');
      hintTap.classList.add('visible');
      zonaTap.classList.add('activa');
      scanPrompt.classList.add('oculto');
      scanFrame.classList.add('oculto');
    });

    /* TARGET PERDIDO */
    entidad.addEventListener('targetLost', () => {
      if (targetActivo !== i) return;
      targetActivo = -1;

      /* Ocultar modelo y resetear pivot a posición base */
      const modelo = entidad.querySelector('a-gltf-model');
      const pivot  = document.getElementById(`pivot-${i}`);
      if (modelo) modelo.setAttribute('scale', '0 0 0');
      if (pivot)  pivot.setAttribute('position', '0 0.15 0');

      /* Resetear HUD */
      resetColor();
      hudTag.classList.remove('visible');
      badgeActivo.classList.remove('visible');
      hintTap.classList.remove('visible');
      zonaTap.classList.remove('activa');
      scanPrompt.classList.remove('oculto');
      scanFrame.classList.remove('oculto');
    });
  });
}


/* ════════════════════════════════════════════════════════
   CAMBIO DE CÁMARA (trasera ↔ frontal)
════════════════════════════════════════════════════════ */
btnCamTrasera.addEventListener('click', () => { if (usandoFrontal)  cambiarCamara(false); });
btnCamFrontal.addEventListener('click', () => { if (!usandoFrontal) cambiarCamara(true);  });

function cambiarCamara(frontal) {
  usandoFrontal = frontal;
  btnCamTrasera.classList.toggle('activa', !frontal);
  btnCamFrontal.classList.toggle('activa',  frontal);

  const sys = escena.systems?.['mindar-image-system'];
  if (!sys) return;
  sys.stop();

  setTimeout(() => {
    const vid = document.querySelector('video[autoplay]');
    if (vid?.srcObject) vid.srcObject.getTracks().forEach(t => t.stop());

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: frontal ? 'user' : 'environment' },
          width: { ideal: 1280 }, height: { ideal: 720 },
        },
        audio: false,
      })
      .then(stream => {
        if (vid) { vid.srcObject = stream; vid.play().catch(() => {}); }
        sys.start();
      })
      .catch(err => {
        console.error('[AR] Cambio cámara:', err);
        /* Revertir estado si falla */
        usandoFrontal = !frontal;
        btnCamTrasera.classList.toggle('activa', frontal);
        btnCamFrontal.classList.toggle('activa', !frontal);
      });
  }, 400);
}


/* ════════════════════════════════════════════════════════
   PANEL INFO
════════════════════════════════════════════════════════ */
zonaTap.addEventListener('click', abrirPanel);

function abrirPanel() {
  if (targetActivo < 0) return;
  const d = DISEÑOS[targetActivo];

  panelEtiqueta.textContent = d.coleccion;
  panelTitulo.textContent   = d.nombre;
  panelCuerpo.innerHTML     = d.descripcion.map(p => `<p>${p}</p>`).join('');

  overlayInfo.classList.add('visible');
  zonaTap.classList.remove('activa');
  hintTap.classList.remove('visible');
}

document.getElementById('btn-cerrar-info').addEventListener('click', cerrarPanel);

function cerrarPanel() {
  overlayInfo.classList.remove('visible');
  if (targetActivo >= 0) {
    zonaTap.classList.add('activa');
    hintTap.classList.add('visible');
  }
}

/* Cerrar tocando el backdrop */
overlayInfo.addEventListener('click', e => {
  if (e.target === overlayInfo) cerrarPanel();
});


/* ════════════════════════════════════════════════════════
   REINTENTAR
════════════════════════════════════════════════════════ */
function reintentar() {
  overlayError.classList.remove('visible');
  overlayInicio.classList.remove('oculto', 'saliendo');
}
/* Exponemos reintentar() al HTML (onclick="reintentar()") */
window.reintentar = reintentar;


/* ════════════════════════════════════════════════════════
   ADVERTENCIA HTTPS
════════════════════════════════════════════════════════ */
if (
  location.protocol !== 'https:' &&
  location.hostname  !== 'localhost' &&
  location.hostname  !== '127.0.0.1'
) {
  console.warn('[AR] ⚠ Requiere HTTPS o localhost para acceder a la cámara.');
}