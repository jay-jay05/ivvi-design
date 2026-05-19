/* ============================================================
   carousel.js  –  Carrusel de imágenes en la página de inicio
   Seminario Closet
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');

  if (!track) return; // No estamos en la home

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let   current = 0;
  let   timer;

  /* ---- Crear dots ---- */
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function getDots () {
    return dotsWrap.querySelectorAll('.carousel-dot');
  }

  /* ---- Ir a un slide ---- */
  function goTo (index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';

    getDots().forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  /* ---- Auto-play ---- */
  function startAutoPlay () {
    timer = setInterval(function () { goTo(current + 1); }, 4500);
  }
  function stopAutoPlay () {
    clearInterval(timer);
  }

  prevBtn.addEventListener('click', function () {
    stopAutoPlay();
    goTo(current - 1);
    startAutoPlay();
  });

  nextBtn.addEventListener('click', function () {
    stopAutoPlay();
    goTo(current + 1);
    startAutoPlay();
  });

  startAutoPlay();
});
