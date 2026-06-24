const loader = document.getElementById('pageLoader');
const topbar = document.getElementById('topbar');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const progressBar = document.querySelector('.progress-bar');
const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const testimonialCards = document.querySelectorAll('.testimonial-card');
let activeTestimonial = 0;

function initAnimationsAndHeader() {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1200);
  setTimeout(() => {
    reveals.forEach((el, index) => {
      setTimeout(() => el.classList.add('reveal-visible'), 150 + index * 60);
    });
  }, 600);
  setInterval(() => {
    slideTestimonials();
  }, 6500);
  // ensure topbar and mobile menu behavior is correct on load
  updateTopbarForViewport();
}

document.addEventListener('DOMContentLoaded', () => {
  // run early so the header padding is applied before paint on mobile
  updateTopbarForViewport();
  initAnimationsAndHeader();
});

window.addEventListener('load', () => {
  // re-evaluate after all resources are loaded in case layout changed
  updateTopbarForViewport();
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  topbar.classList.toggle('scrolled', scrollTop > 28);
});

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('open');
  menuToggle.classList.toggle('open');
  const open = navbar.classList.contains('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  // prevent background scrolling when mobile menu is open
  document.documentElement.style.overflow = open ? 'hidden' : '';
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.navbar a').forEach((link) => {
  link.addEventListener('click', () => {
    navbar.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  });
});

// Keep header fixed on small screens and adjust body padding so content doesn't hide
function updateTopbarForViewport() {
  if (!topbar) return;
  const mobileBreakpoint = 820;
  if (window.innerWidth <= mobileBreakpoint) {
    topbar.classList.add('mobile-fixed');
    // compute actual height and set CSS variable so CSS placement matches
    const h = topbar.offsetHeight || parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height')) || 84;
    document.documentElement.style.setProperty('--topbar-height', h + 'px');
    document.body.style.paddingTop = h + 'px';
  } else {
    topbar.classList.remove('mobile-fixed');
    document.body.style.paddingTop = '';
    // ensure nav is closed when switching to desktop
    if (navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.classList.remove('open');
    }
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
}

window.addEventListener('resize', () => {
  updateTopbarForViewport();
});

function slideTestimonials() {
  testimonialCards[activeTestimonial]?.classList.remove('active');
  activeTestimonial = (activeTestimonial + 1) % testimonialCards.length;
  testimonialCards[activeTestimonial]?.classList.add('active');
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

reveals.forEach((el) => revealObserver.observe(el));

const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you! Your inquiry is ready to send.');
  });
}
