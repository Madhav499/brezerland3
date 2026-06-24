const loader = document.getElementById('pageLoader');
const topbar = document.getElementById('topbar');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const progressBar = document.querySelector('.progress-bar');
const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const testimonialCards = document.querySelectorAll('.testimonial-card');
let activeTestimonial = 0;

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);
  setTimeout(() => {
    reveals.forEach((el, index) => {
      setTimeout(() => el.classList.add('reveal-visible'), 150 + index * 60);
    });
  }, 900);
  setInterval(() => {
    slideTestimonials();
  }, 6500);
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
});

document.querySelectorAll('.navbar a').forEach((link) => {
  link.addEventListener('click', () => {
    navbar.classList.remove('open');
  });
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
