const loader = document.getElementById('pageLoader');
const topbar = document.getElementById('topbar');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileBackdrop = document.getElementById('mobileBackdrop');
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
  // On mobile, open the slide-in mobile menu; on desktop keep old behaviour
  const isMobile = window.innerWidth <= 1024;
  if (isMobile && mobileMenu) {
    openMobileMenu();
    return;
  }
  navbar.classList.toggle('open');
  menuToggle.classList.toggle('open');
  const open = navbar.classList.contains('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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

// Mobile menu functions
function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  // lock scrolling
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  // staggered reveal for items
  const items = mobileMenu.querySelectorAll('.mobile-nav a');
  items.forEach((it, i) => {
    it.style.transitionDelay = `${80 + i * 60}ms`;
    it.style.opacity = '1';
    it.style.transform = 'none';
  });
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  const items = mobileMenu.querySelectorAll('.mobile-nav a');
  items.forEach((it) => {
    it.style.transitionDelay = '';
    it.style.opacity = '';
    it.style.transform = '';
  });
}

if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

const sectionLinks = document.querySelectorAll('.navbar a, .mobile-nav a');
function updateActiveNavLinks(activeId) {
  sectionLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    link.classList.toggle('active', targetId === `#${activeId}`);
  });
}

if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

// close on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ensure in-case of window resize we close the mobile menu when switching to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

// update active section state while scrolling
const observedSections = document.querySelectorAll('main section[id]');
if (observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      updateActiveNavLinks(visible.target.id);
    }
  }, { threshold: 0.35, rootMargin: '-25% 0px -50% 0px' });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

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

// run once immediately (covers cases where DOMContentLoaded already occurred)
try {
  updateTopbarForViewport();
} catch (e) {
  // ignore
}

// re-run shortly after to catch late layout shifts (fonts/images)
setTimeout(() => updateTopbarForViewport(), 600);

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
    if (!target) return;
    event.preventDefault();
    const isMobileNavLink = anchor.closest('.mobile-nav');
    const isDesktopNavLink = anchor.closest('.navbar');
    const scrollToTarget = () => target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (isMobileNavLink) {
      closeMobileMenu();
      setTimeout(scrollToTarget, 300);
      return;
    }

    if (isDesktopNavLink && navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    scrollToTarget();
  });
});

const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you! Your inquiry is ready to send.');
  });
}
