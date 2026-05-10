/* ============================================
   FRESH GROUND SOUND — Shared Nav + Cursor
   ============================================ */

// ── Custom Cursor
const cursor     = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .btn-primary, .btn-ghost').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '16px';
    cursor.style.height = '16px';
    cursorRing.style.width   = '48px';
    cursorRing.style.height  = '48px';
    cursorRing.style.opacity = '1';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
    cursorRing.style.width   = '32px';
    cursorRing.style.height  = '32px';
    cursorRing.style.opacity = '0.6';
  });
});

// ── Nav scroll state
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Mobile Nav
const hamburger = document.createElement('button');
hamburger.className = 'nav-hamburger';
hamburger.setAttribute('aria-label', 'Open navigation');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.innerHTML = '<span></span><span></span><span></span>';
nav.appendChild(hamburger);

const overlay = document.createElement('div');
overlay.className = 'mobile-nav-overlay';
overlay.setAttribute('aria-hidden', 'true');
overlay.innerHTML = `
  <ul class="mobile-nav-links">
    <li><a href="index.html"${currentPage === 'index.html' ? ' class="active"' : ''}>Home</a></li>
    <li><a href="artists.html"${currentPage === 'artists.html' ? ' class="active"' : ''}>Artists</a></li>
    <li><a href="equipment.html"${currentPage === 'equipment.html' ? ' class="active"' : ''}>Equipment</a></li>
    <li><a href="about.html"${currentPage === 'about.html' ? ' class="active"' : ''}>About</a></li>
    <li><a href="contact.html"${currentPage === 'contact.html' ? ' class="active"' : ''}>Book a Session</a></li>
  </ul>
  <a href="tel:8056442579" class="mobile-nav-phone-link">(805) 644-2579</a>
`;
document.body.appendChild(overlay);

function openMobileNav() {
  overlay.classList.add('is-open');
  hamburger.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  overlay.classList.remove('is-open');
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  overlay.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeMobileNav();
});

overlay.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileNav);
  // cursor hover effects
  a.addEventListener('mouseenter', () => {
    cursor.style.width = '16px'; cursor.style.height = '16px';
    cursorRing.style.width = '48px'; cursorRing.style.height = '48px';
    cursorRing.style.opacity = '1';
  });
  a.addEventListener('mouseleave', () => {
    cursor.style.width = '8px'; cursor.style.height = '8px';
    cursorRing.style.width = '32px'; cursorRing.style.height = '32px';
    cursorRing.style.opacity = '0.6';
  });
});
