/* ============================================================
   contact.js  –  Formulario de contacto
   Seminario Closet
   ============================================================ */

/**
 * Llamado desde el onsubmit del formulario en index.html
 * @param {Event} event
 */
function submitForm (event) {
  event.preventDefault();

  const form    = event.target;
  const nombre  = form.nombre.value.trim();
  const email   = form.email.value.trim();
  const asunto  = form.asunto.value;
  const mensaje = form.mensaje.value.trim();

  // Validación básica
  if (!nombre || !email || !mensaje) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  // Aquí puedes enviar los datos a un backend / servicio externo
  // Por ahora mostramos un mensaje de confirmación
  const btn = form.querySelector('.btn-submit');
  btn.textContent = '✓ Mensaje enviado';
  btn.disabled = true;
  btn.style.background = '#4CAF50';
  btn.style.color = '#fff';

  console.log('Formulario enviado:', { nombre, email, asunto, mensaje });

  // Resetear el formulario después de 3 s
  setTimeout(function () {
    form.reset();
    btn.textContent = 'Enviar mensaje';
    btn.disabled = false;
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}
