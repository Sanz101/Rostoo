/* ────────────────────────────────────────────────────────────────
   ROSTO — SITE CONTENT DATA
   Edit ONLY this block to add/remove destinations or gallery photos.
   Drop photos in /images using the naming pattern: D1, D2… (destinations),
   H1, H2… (hotel), WR1, WR2… (water rafting), then add/remove an entry.
   ──────────────────────────────────────────────────────────────── */
const ROSTO_DESTINATIONS = [
  { image: 'images/D1.jpg', name: 'Temple of the Sacred Tooth Relic', distance: 'Located right in Kandy (0 km)',
    description: "Sri Lanka's most sacred Buddhist shrine, nestled beside the scenic Kandy Lake, featuring gorgeous traditional architecture and rich cultural heritage." },
  { image: 'images/D8.jpg', name: 'Sigiriya Rock Fortress', distance: 'Approx. 90 km from Kandy (2.5 hours drive)',
    description: 'An ancient palace and fortress complex sitting atop a massive 200-meter-high rock column, surrounded by stunning water gardens and frescoes.' },
  { image: 'images/D3.jpg', name: 'Nuwara Eliya & Tea Gardens', distance: 'Approx. 75 km from Kandy (2.5 hours drive)',
    description: "Known as 'Little England', featuring cascading waterfalls, misty green hills, and sprawling world-famous Ceylon tea plantations." },
  { image: 'images/D5.jpg', name: 'Kitulgala Adventure Base', distance: 'Approx. 55 km from Kandy (1.5 hours drive)',
    description: 'The premier location for white-water rafting, rainforest trekking, and outdoor adventure sports along the Kelani River.' }
  // Add more: { image: 'images/D5.jpg', name: '...', distance: '...', description: '...' },
];
const ROSTO_HOTEL_IMAGES = ['images/H1.png','images/H2.png','images/H3.png','images/H4.png','images/H5.png','images/H6.png'];
const ROSTO_RAFTING_IMAGES = ['images/WR1.jpg','images/WR2.jpg','images/WR3.jpg','images/WR4.jpg','images/WR5.jpg','images/WR6.jpg'];

const ROSTO_GALLERIES = {
  hotel:   { title: 'Partner Hotel Accommodations Collection', images: ROSTO_HOTEL_IMAGES },
  rafting: { title: 'Water Rafting & Adventure Park Collection', images: ROSTO_RAFTING_IMAGES }
};

/* ─── RENDERERS ─── */
function renderDestinationsGrid(targetSelector, limit) {
  const grid = document.querySelector(targetSelector);
  if (!grid) return;
  const items = typeof limit === 'number' ? ROSTO_DESTINATIONS.slice(0, limit) : ROSTO_DESTINATIONS;
  grid.innerHTML = items.map((d) => `
    <div class="destination-card reveal-on-scroll">
      <img src="${d.image}" alt="${d.name}" loading="lazy" decoding="async">
      <div class="destination-info">
        <h3>${d.name}</h3>
        <p class="distance-tag">${d.distance}</p>
        <p>${d.description}</p>
      </div>
    </div>`).join('');
  observeReveal(grid.querySelectorAll('.reveal-on-scroll'));
}

function renderImagePreviewGroup(containerId, images, label, galleryKey) {
  const el = document.getElementById(containerId);
  if (!el || !images.length) return;
  const subs = images.slice(1, 4);
  const remaining = images.length - 1 - subs.length;
  el.innerHTML = `
    <div class="main-thumb-wrapper">
      <img src="${images[0]}" alt="${label} main view" loading="lazy" decoding="async">
      <div class="gallery-overlay-badge">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span>Explore all ${images.length} ${label.toLowerCase()} photos</span>
      </div>
    </div>
    <div class="sub-thumbs-row">
      ${subs.map((s) => `<div class="sub-thumb"><img src="${s}" alt="" loading="lazy" decoding="async"></div>`).join('')}
      ${remaining > 0 ? `<div class="sub-thumb more-count">+${remaining}</div>` : ''}
    </div>`;
  if (galleryKey) { el.style.cursor = 'pointer'; el.addEventListener('click', () => openGalleryModal(galleryKey)); }
}

/* ─── GALLERY MODAL ─── */
function openGalleryModal(type) {
  const modal = document.getElementById('galleryModal'), title = document.getElementById('modalTitle'), grid = document.getElementById('modalGrid');
  const data = ROSTO_GALLERIES[type];
  if (!modal || !title || !grid || !data) return;
  title.innerText = data.title;
  grid.innerHTML = data.images.map((src, i) => `<div class="modal-img-card" style="animation-delay:${i * 0.05}s"><img src="${src}" alt="Gallery image ${i + 1}" loading="lazy" decoding="async"></div>`).join('');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeGalleryModal() {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGalleryModal(); });

/* ─── MOBILE MENU ─── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu'), burger = document.getElementById('hamburger');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && burger && !burger.contains(e.target)) menu.classList.remove('open');
});

/* ─── CONTACT FORM → WhatsApp ─── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = `Hi Rosto, my name is ${form.name.value.trim()} (${form.email.value.trim()}). ${form.message.value.trim()}`;
    window.open(`https://wa.me/94772004795?text=${encodeURIComponent(text)}`, '_blank');
    form.reset();
  });
});

/* ─── SCROLL-REVEAL ENGINE (one shared observer) ─── */
let __rostoObserver = null;
const __rostoSeen = new WeakSet();
function observeReveal(elements) {
  const list = Array.from(elements || []);
  if (!list.length) return;
  // Safety net: if IntersectionObserver is unavailable, never leave content hidden
  if (!('IntersectionObserver' in window)) { list.forEach((el) => el.classList.add('is-visible')); return; }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!__rostoObserver) {
    __rostoObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); __rostoObserver.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  }
  const idx = new Map();
  list.forEach((el) => {
    if (__rostoSeen.has(el)) return;
    __rostoSeen.add(el);
    const n = idx.get(el.parentElement) || 0;
    el.style.transitionDelay = reduce ? '0ms' : `${Math.min(n, 6) * 80}ms`;
    idx.set(el.parentElement, n + 1);
    __rostoObserver.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', () => observeReveal(document.querySelectorAll('.reveal-on-scroll')));

/* ─── NAVBAR STATE ON SCROLL (one passive, rAF-batched listener) ─── */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let ticking = false, last = null;
  function tick() {
    const s = window.scrollY > 40;
    if (s !== last) { nav.classList.toggle('scrolled', s); last = s; }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
  tick();
});

/* ─── PAGE TRANSITION (fade/blur out, then go to the next page) ─── */
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('pageTransition');
  const link = e.target.closest('a');
  if (!overlay || !link) return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  if (link.target === '_blank' || link.hasAttribute('download')) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const url = new URL(link.href, location.href);
  if (url.protocol !== location.protocol || url.host !== location.host) return; // external link
  if (url.pathname === location.pathname && url.search === location.search) return; // same page

  e.preventDefault();
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  overlay.classList.add('is-leaving');
  setTimeout(() => { window.location.href = url.href; }, 5);
});

// When the user presses the browser Back button, the old page can be restored
// still covered by the overlay. This uncovers it.
window.addEventListener('pageshow', (e) => {
  const overlay = document.getElementById('pageTransition');
  if (e.persisted && overlay) overlay.classList.remove('is-leaving');
});
