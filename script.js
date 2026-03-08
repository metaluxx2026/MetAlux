/* =========================================================
   MetAlux – script.js
   Galería dinámica con Lightbox
   Lee imágenes desde /img/ (prefijos: herreria_ y tablaroca_)
   ========================================================= */

// --- Año actual en footer ---
const yearEl = document.querySelector('[data-current-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Configuración de imágenes ----
// Agrega aquí los nombres exactos de tus fotos dentro de /img/
// Prefija con "herreria_" o "tablaroca_" para que aparezcan en la sección correcta.
// Ejemplo: "herreria_puerta1.jpg", "tablaroca_sala.jpg"

const IMAGENES = {
  herreria: [
    // Pon aquí los nombres de tus imágenes de herrería
    // Ejemplo:
    // { src: "img/herreria_1.jpg", alt: "Portón de herrería" },
    // { src: "img/herreria_2.jpg", alt: "Puerta de forja" },
  ],
  tablaroca: [
    // Pon aquí los nombres de tus imágenes de tablaroca
    // Ejemplo:
    { src: img/Muebles para TV 1.JPG , alt:  Mueble de Tv  },
    // { src: "img/tablaroca_2.jpg", alt: "Plafón terminado" },
  ],
};

// ---- Construcción de galerías ----
function buildGallery(containerId, items, categoria) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="gallery__empty">
        <strong style="color:var(--gold)">📷 Próximamente</strong>
        <p>Sube tus fotos a la carpeta <code>/img/</code> y agrégalas en <code>script.js</code> para verlas aquí.</p>
      </div>`;
    return;
  }

  items.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'gallery__item';
    item.dataset.index = index;
    item.dataset.cat = categoria;
    item.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" loading="lazy" />
      <div class="gallery__overlay"><span>${img.alt}</span></div>
    `;
    item.addEventListener('click', () => openLightbox(categoria, index));
    container.appendChild(item);
  });
}

buildGallery('gallery-herreria',  IMAGENES.herreria,  'herreria');
buildGallery('gallery-tablaroca', IMAGENES.tablaroca, 'tablaroca');

// ---- Lightbox ----
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lb-img');
const lbCaption  = document.getElementById('lb-caption');
const lbClose    = document.getElementById('lb-close');
const lbPrev     = document.getElementById('lb-prev');
const lbNext     = document.getElementById('lb-next');

let currentCat   = 'herreria';
let currentIndex = 0;

function openLightbox(cat, index) {
  currentCat   = cat;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const imgs = IMAGENES[currentCat];
  if (!imgs || imgs.length === 0) return;
  const item = imgs[currentIndex];
  lbImg.src         = item.src;
  lbImg.alt         = item.alt;
  lbCaption.textContent = item.alt;

  lbPrev.style.display = imgs.length > 1 ? '' : 'none';
  lbNext.style.display = imgs.length > 1 ? '' : 'none';
}

function navigate(dir) {
  const imgs = IMAGENES[currentCat];
  currentIndex = (currentIndex + dir + imgs.length) % imgs.length;
  updateLightbox();
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => navigate(-1));
lbNext.addEventListener('click',  () => navigate(1));

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   navigate(-1);
  if (e.key === 'ArrowRight')  navigate(1);
});

// ---- Formulario de cotización ----
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', e => {
    e.preventDefault();

    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo   = document.getElementById('correo').value.trim();
    const servicio = document.getElementById('servicio').value;
    const mensaje  = document.getElementById('mensaje').value.trim();

    if (!nombre || !telefono || !servicio || !mensaje) {
      alert('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    const servicioTexto = {
      herreria:  'Herrería (puertas, portones, ventanas)',
      tablaroca: 'Tablaroca (muros, plafones, divisiones)',
      ambos:     'Herrería + Tablaroca',
      otro:      'Consulta general',
    }[servicio] || servicio;

    const texto =
      `*Solicitud de cotización — MetAlux*\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📞 *Teléfono:* ${telefono}\n` +
      (correo ? `✉️ *Correo:* ${correo}\n` : '') +
      `🔧 *Servicio:* ${servicioTexto}\n\n` +
      `📝 *Descripción del proyecto:*\n${mensaje}`;

    const url = `https://wa.me/3123481597?text=${encodeURIComponent(texto)}`;

    // Usar anchor para evitar bloqueo de popup en navegadores
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
