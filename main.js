document.addEventListener("DOMContentLoaded", () => {
  // Nav scroll glass effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
});

// Mobile menu toggle handler
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

// Contact form: hand off to WhatsApp with a prefilled message (no backend on this static site)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const text = `Hi Rosto, my name is ${name} (${email}). ${message}`;
      window.open(`https://wa.me/94772004795?text=${encodeURIComponent(text)}`, '_blank');
      form.reset();
    });
  }
});

// ─── SCROLL-REVEAL ANIMATIONS ───
// Fades/slides elements in as they enter the viewport, with a light stagger
// for items that share a parent (e.g. cards in a grid, steps in a timeline).
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Group siblings so cards in the same row/grid stagger instead of popping in together
  const staggerIndex = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    const count = staggerIndex.get(parent) || 0;
    el.style.transitionDelay = prefersReducedMotion ? '0ms' : `${Math.min(count, 5) * 90}ms`;
    staggerIndex.set(parent, count + 1);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach((el) => observer.observe(el));
});

// ─── SUBTLE PARALLAX ON WATERMARK LOGOS ───
// Gives page-hero watermarks (About/Destinations/Services/Reviews/Contact) a
// slow drift as the page scrolls, instead of sitting perfectly static.
document.addEventListener("DOMContentLoaded", () => {
  const watermark = document.querySelector('.faded-bg-logo');
  if (!watermark) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.08, 60);
      watermark.style.transform = `translateY(${offset}px)`;
      ticking = false;
    });
  }, { passive: true });
});