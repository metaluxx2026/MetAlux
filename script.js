/* --- MetAlux - Lógica de Mensajes Automáticos --- */

// Año actual
const yearEl = document.querySelector('[data-current-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Configuración de Imágenes (Vaciado por ahora)
const IMAGENES = { herreria: [], tablaroca: [] };

// Construcción de Galerías
function buildGallery(containerId, items, categoria) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = `<div class="gallery__empty"><strong>📷 Próximamente</strong><p>Sube tus fotos a /img/</p></div>`;
    return;
  }
}
buildGallery('gallery-herreria', IMAGENES.herreria, 'herreria');
buildGallery('gallery-tablaroca', IMAGENES.tablaroca, 'tablaroca');

// FORMULARIO CON DATOS EXTRA
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const servicio = document.getElementById('servicio').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    // DATOS EXTRA AUTOMÁTICOS
    const fechaEnvio = new Date().toLocaleString();
    const origenURL = window.location.href;

    const servicioTexto = {
      herreria: '⚒️ Herrería',
      tablaroca: '🪵 Tablaroca',
      ambos: '⚒️+🪵 Ambos',
      otro: '❓ Consulta general'
    }[servicio] || servicio;

    const textoWhatsApp = 
      `*NUEVA COTIZACIÓN — MetAlux* 🛠️\n` +
      `--------------------------\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📞 *Teléfono:* ${telefono}\n` +
      (correo ? `✉️ *Correo:* ${correo}\n` : '') +
      `🔧 *Servicio:* ${servicioTexto}\n` +
      `--------------------------\n` +
      `📝 *Mensaje:* ${mensaje}\n` +
      `--------------------------\n` +
      `🕒 *Fecha:* ${fechaEnvio}\n` +
      `🔗 *Desde:* ${origenURL}`;

    const url = `https://wa.me/3123481597?text=${encodeURIComponent(textoWhatsApp)}`;
    window.open(url, '_blank');
  });
}