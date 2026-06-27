// Elements
const loader = document.getElementById('pageLoader');
const topbar = document.getElementById('topbar');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const progressBar = document.querySelector('.progress-bar');
// 1. Initial Page Load and Early Layout Computations
function initAnimationsAndHeader() {
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
    if (typeof window.initBreezerlandAnimations === 'function') {
      window.initBreezerlandAnimations();
    }
  }, 1000);

  updateTopbarForViewport();
}

document.addEventListener('DOMContentLoaded', () => {
  updateTopbarForViewport();
  initAnimationsAndHeader();
  setupAboutTabs();
  setupTestimonials();
});

window.addEventListener('load', () => {
  updateTopbarForViewport();
});

// 2. Scroll Indicator & Header Transparency Scrolled State
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;

  if (topbar) {
    topbar.classList.toggle('scrolled', scrollTop > 40);
  }
});

// 3. Mobile Navigation Slider Drawer
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 1024;
    if (isMobile && mobileMenu) {
      openMobileMenu();
      return;
    }
    // Fallback toggle for normal viewport widths if toggled
    navbar.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });
}

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  if (menuToggle) menuToggle.classList.add('open');
  
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  const items = mobileMenu.querySelectorAll('.mobile-nav a');
  items.forEach((it, i) => {
    it.style.transitionDelay = `${60 + i * 40}ms`;
    it.style.opacity = '1';
    it.style.transform = 'none';
  });
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (menuToggle) menuToggle.classList.remove('open');
  
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
  updateTopbarForViewport();
});

// Keep header fixed on small viewports and manage body padding
function updateTopbarForViewport() {
  if (!topbar) return;
  const mobileBreakpoint = 820;
  if (window.innerWidth <= mobileBreakpoint) {
    const h = topbar.offsetHeight || 72;
    document.documentElement.style.setProperty('--topbar-height', h + 'px');
    document.body.style.paddingTop = h + 'px';
  } else {
    document.body.style.paddingTop = '';
  }
}

// 4. About Section Tab Toggler
function setupAboutTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.about-tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states from buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active state to clicked button
      btn.classList.add('active');

      // Hide all contents
      tabContents.forEach(content => content.classList.remove('active'));
      // Show corresponding content based on data-tab attribute
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// 5. Testimonial Slider & Manual Dots Navigation
function setupTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const authorBlock = document.getElementById('testimonialAuthor');
  let currentIdx = 0;
  let intervalId = null;

  if (!cards.length) return;

  /** Update the author block and replay its fade-in animation */
  function updateAuthor(idx) {
    const block = document.getElementById('testimonialAuthor');
    if (!block) return;
    const card = cards[idx];
    const name = card.dataset.author || '';
    const loc  = card.dataset.location || '';

    // Reset animation by removing and re-adding the class
    block.style.animation = 'none';
    block.offsetHeight; // force reflow
    block.style.animation = '';

    block.innerHTML = `<strong>${name}</strong><span>${loc}</span>`;
  }

  function showSlide(idx) {
    // Remove active from current
    cards[currentIdx]?.classList.remove('active');
    dots[currentIdx]?.classList.remove('active');

    currentIdx = idx;

    // Activate new slide
    cards[currentIdx]?.classList.add('active');
    dots[currentIdx]?.classList.add('active');

    // Sync the author block below the dots
    updateAuthor(currentIdx);
  }

  function nextSlide() {
    const next = (currentIdx + 1) % cards.length;
    showSlide(next);
  }

  function startAutoplay() {
    intervalId = setInterval(nextSlide, 6500);
  }

  function resetAutoplay() {
    clearInterval(intervalId);
    startAutoplay();
  }

  // Wire up dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetAutoplay();
    });
  });

  startAutoplay();
}

// 6. Active Navigation Highlighting on Scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.navbar a, .mobile-nav a');

function updateActiveNavLinks(activeId) {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${activeId}`);
  });
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      updateActiveNavLinks(visible.target.id);
    }
  }, { threshold: 0.25, rootMargin: '-20% 0px -50% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
}

// 8. Smooth Scrolling behavior for Navigation Links
const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    
    event.preventDefault();
    const isMobileNav = anchor.closest('.mobile-nav');
    const scrollToTarget = () => {
      let offset = 80;
      if (window.innerWidth <= 820) {
        offset = topbar ? topbar.offsetHeight : 72;
      }
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    };

    if (isMobileNav) {
      closeMobileMenu();
      setTimeout(scrollToTarget, 350);
      return;
    }
    
    scrollToTarget();
  });
});

// 9. Contact Form Submit Mock
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('fullName').value;
    alert(`Thank you, ${name}! Your inquiry has been mock-submitted. We will contact you within 24 hours.`);
    enquiryForm.reset();
  });
}
