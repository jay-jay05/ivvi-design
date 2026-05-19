/* ============================================================
   probadorSketch.js  –  Sketch p5.js con ml5 BodyPose
   Probador Virtual de Realidad Aumentada  –  Seminario Closet

   Dependencias (cargadas en probador.html):
     - ml5@1  (unpkg)
     - p5@2   (jsDelivr)
   ============================================================ */

/* ---- Variables del sketch ---- */
const s = 1.33333333333   // relación de aspecto 4:3 (width / height)

let cnv

// Prendas de vestir
let camisetas = {}
let camiseta1, camiseta2, camiseta3
let currentCamiseta = null

// ml5 BodyPose
let bodyPose
let poses = []

// Captura de video
let video
const vScale = 4   // el video se captura más pequeño y se escala al canvas

/* ============================================================
   SETUP
   ============================================================ */
async function setup () {
  // Contenedor del canvas
  const container = document.getElementById('probadorCanvas')
  const parentW   = container.parentNode.offsetWidth || window.innerWidth

  cnv = createCanvas(parentW, parentW / s)
  cnv.parent('probadorCanvas')

  // Ocultar el loader si ya estaba
  ocultarLoader()

  // Inicializar BodyPose con MoveNet Lightning (más rápido)
  try {
    bodyPose = await ml5.bodyPose('MoveNet', {
      modelType: 'SINGLEPOSE_LIGHTNING'
    })
  } catch (err) {
    console.error('Error cargando ml5 BodyPose:', err)
    mostrarEstado('Error al cargar el modelo de IA. Recarga la página.')
    ocultarLoader()
    return
  }

  // Captura de video
  video = createCapture(VIDEO)
  video.size(width / vScale, height / vScale)
  video.hide()

  // Detectar poses en el video
  bodyPose.detectStart(video, gotPoses)

  // Cargar imágenes de las camisetas
  try {
    camiseta1 = await loadImage('src/assets/images/gssf.png')
    camiseta2 = await loadImage('src/assets/images/fotocamisa2.png')
    camiseta3 = await loadImage('src/assets/images/fotocamisa3.png')
  } catch (err) {
    console.warn('No se pudieron cargar algunas imágenes de prendas:', err)
  }

  camisetas = {
    'Diseño 1': camiseta1,
    'Diseño 2': camiseta2,
    'Diseño 3': camiseta3
  }

  ocultarLoader()
  mostrarEstado('Listo. Selecciona una prenda.')
  console.log('setup completado')
}

/* ============================================================
   DRAW  –  Bucle principal
   ============================================================ */
function draw () {
  // Fondo con el frame del video
  image(video, 0, 0, width, height)

  // Dibujar marcadores de hombros
  drawMarkers(poses)

  // ==== PROBADOR REAL USANDO HOMBROS ====
  if (poses.length && currentCamiseta && camisetas[currentCamiseta]) {

    const { left_shoulder, right_shoulder } = poses[0]

    if (left_shoulder.confidence > 0.2 && right_shoulder.confidence > 0.2) {

      // Ajustar coordenadas al escalado del video → canvas
      const lsX = left_shoulder.x  * vScale
      const lsY = left_shoulder.y  * vScale
      const rsX = right_shoulder.x * vScale
      const rsY = right_shoulder.y * vScale

      // Centro geométrico entre los dos hombros
      const centerX = (lsX + rsX) / 2
      const centerY = (lsY + rsY) / 2

      // Ancho proporcional a la distancia inter-hombros
      const ancho = dist(lsX, lsY, rsX, rsY) * 2

      // Ángulo de inclinación (descomenta para rotación realista)
      // const angle = atan2(rsY - lsY, rsX - lsX)

      // ==== DIBUJAR CAMISETA ====
      push()
      translate(centerX, centerY + 140)   // bajar al área del pecho
      // rotate(angle)                     // rotación opcional
      imageMode(CENTER)
      image(camisetas[currentCamiseta], 0, 0, ancho * 1.5, ancho * 1.5)
      pop()
    }
  }
}

/* ============================================================
   REDIMENSIONAR CANVAS
   ============================================================ */
function windowResized () {
  const container = document.getElementById('probadorCanvas')
  if (!container) return
  const parentW = container.parentNode.offsetWidth || window.innerWidth
  resizeCanvas(parentW, parentW / s)
  if (video) video.size(width / vScale, height / vScale)
}

/* ============================================================
   CALLBACKS
   ============================================================ */

/**
 * Llamado desde los botones de prenda en probador.html
 * @param {string|null} nombre  – 'Diseño 1' | 'Diseño 2' | 'Diseño 3' | null
 */
function onPrendaClick (nombre) {
  currentCamiseta = nombre

  // Actualizar UI: resaltar card seleccionada
  document.querySelectorAll('.prenda-card').forEach(function (card) {
    card.classList.remove('selected')
  })
  if (nombre) {
    const idx = { 'Diseño 1': 1, 'Diseño 2': 2, 'Diseño 3': 3 }[nombre]
    const card = document.getElementById('card-' + idx)
    if (card) card.classList.add('selected')
    mostrarEstado('Prenda: ' + nombre)
  } else {
    mostrarEstado('Sin prenda seleccionada')
  }

  console.log('Prenda seleccionada:', nombre, '| Poses activas:', poses.length)
}

/** Recibe los resultados de BodyPose */
function gotPoses (results) {
  poses = results
}

/* ============================================================
   MARCADORES DE HOMBROS
   ============================================================ */
function drawMarkers (poses) {
  if (!poses.length) return

  fill('red')
  noStroke()

  for (const pose of poses) {
    const { left_shoulder, right_shoulder } = pose

    if (right_shoulder.confidence > 0.2) {
      circle(right_shoulder.x * vScale, right_shoulder.y * vScale, 20)
    }
    if (left_shoulder.confidence > 0.2) {
      circle(left_shoulder.x * vScale, left_shoulder.y * vScale, 20)
    }
  }
}


/* ============================================================
   UTILIDADES DE UI
   ============================================================ */
function ocultarLoader () {
  const loader = document.getElementById('probadorLoader')
  if (loader) loader.classList.add('hidden')
}

function mostrarEstado (texto) {
  const el = document.getElementById('estadoTexto')
  if (el) el.textContent = texto
}
