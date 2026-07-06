let prefersReducedMotion = false;

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion preference
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize all modules
  initHeroParticles();
  initAchievementsOrbit();
  initPortraitParallax();
  initRecognitionCarousel();
  initStatsCounter();
  initTimelineMilestones();
  initQuoteReveal();
  initMobileScrollAnimations();
});

/* ==========================================================================
   CANVAS HERO PARTICLES
   ========================================================================== */
function initHeroParticles() {
  const w = window.innerWidth;
  const canvasId = w < 768 ? 'mobileHeroParticles' : 'heroParticles';
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  let smokeClouds = [];

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Gold Particle Class
  class GoldParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // start scattered
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.speedY = Math.random() * 0.4 + 0.1; // slow float
      this.speedX = Math.random() * 0.2 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir = 1;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      // Twinkle opacity
      this.opacity += this.twinkleSpeed * this.twinkleDir;
      if (this.opacity >= 0.8) this.twinkleDir = -1;
      if (this.opacity <= 0.2) this.twinkleDir = 1;

      // Reset when off screen
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184, 146, 77, ${this.opacity})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#B8924D';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Smoke Cloud Class
  class SmokeCloud {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 100;
      this.radius = Math.random() * 80 + 60; // large soft circles
      this.speedY = Math.random() * 0.3 + 0.1;
      this.speedX = Math.random() * 0.1 - 0.05;
      this.opacity = Math.random() * 0.04 + 0.01; // very subtle
      this.growSpeed = Math.random() * 0.05 + 0.01;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.radius += this.growSpeed;

      // Fade out slowly in upper half
      if (this.y < canvas.height * 0.6) {
        this.opacity -= 0.0002;
      }

      if (this.y < -150 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      // Soft radial gradient for smoke look
      const grad = ctx.createRadialGradient(
        this.x, this.y, this.radius * 0.1,
        this.x, this.y, this.radius
      );
      grad.addColorStop(0, `rgba(216, 195, 165, ${this.opacity})`);
      grad.addColorStop(1, 'rgba(252, 250, 247, 0)');
      
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // Initialize arrays
  const particleCount = window.innerWidth < 768 ? 20 : 50;
  const smokeCount = window.innerWidth < 768 ? 4 : 10;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldParticle());
  }
  for (let i = 0; i < smokeCount; i++) {
    smokeClouds.push(new SmokeCloud());
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw smoke first (background layer)
    for (let smoke of smokeClouds) {
      smoke.update();
      smoke.draw();
    }

    // Draw gold particles on top
    for (let part of particles) {
      part.update();
      part.draw();
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();

  // Clean up animation on navigate
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
}

/* ==========================================================================
   ACHIEVEMENTS ORBIT SYSTEM (WITH MODAL AND RESPONSIVE MODES)
   ========================================================================== */
const achievementsData = [
  {
    id: "rolling-stone",
    title: "Hear Summergold's Reflective Debut Single \"Off\"",
    publication: "Rolling Stone India",
    year: "2021",
    description: "Featured in Rolling Stone India's music showcase, highlighting the creative duo Summergold (composed of Parth Patadiya and Harshvardhan Gadhvi) and their debut single 'Off'. The publication celebrated the track's pensive, acoustic folk texture and philosophical lyrics reflecting human vulnerability.",
    link: "https://rollingstoneindia.com/hear-summergolds-reflective-debut-single-off/",
    image: "../IMG_7260_opt.webp"
  },
  {
    id: "tedx-recognition",
    title: "TEDx Excellence Recognition",
    publication: "TEDx Platform",
    year: "2020",
    description: "Honored for creative leadership, visual arts development, and perfume branding direction. Parth's participation on the TEDx stage explored the boundaries of brand storytelling and sensory innovation, translating abstract narrative ideas into concrete luxury fragrance compositions.",
    link: "../contact.html",
    image: "../TEDx_opt.webp"
  },
  {
    id: "jamsphere",
    title: "Han Sino & Parth Patadiya Collaborate on \"A Murder In Me: The SCoRe\"",
    publication: "JamSphere Magazine",
    year: "2017",
    description: "Featured in JamSphere's independent review list for the film soundtrack of 'A Murder In Me', directed by Parth Patadiya. Composed in partnership with spoken word artist and Nu Jazz producer Han Sino, the soundtrack received high praise for its haunting, dark, and highly emotional scores.",
    link: "https://jamsphere.com/reviews/han-sino-a-murder-in-me-the-score-is-deliciously-dark-and-hauntingly-poignant",
    image: "../TEDx_award_opt.webp"
  },
  {
    id: "tuneloud",
    title: "Cinematic Film Score Review Spotlight",
    publication: "TuneLoud Magazine",
    year: "2017",
    description: "Highlighted by TuneLoud for the cinematic design and sonic storytelling behind 'A Murder In Me'. The editorial detail focused on how Parth Patadiya's tense, visual OCD short film direction worked in sync with Han Sino's poignant musical compositions to elevate the sensory atmosphere.",
    link: "https://jamsphere.com/reviews/han-sino-a-murder-in-me-the-score-is-deliciously-dark-and-hauntingly-poignant",
    image: "../IMG_7260_opt.webp"
  },
  {
    id: "music",
    title: "Summergold — Ephemeral Voices EP Production",
    publication: "Bandcamp / Spotify",
    year: "2021",
    description: "Released as a multidisciplinary sensory project. The EP tracks blend acoustic guitar loops, organic ambient noise, and atmospheric layering to translate the olfactory journey of Breezerland perfumes into a coherent auditory format, establishing a template for premium B2B branding.",
    link: "https://rollingstoneindia.com/rs-daily-music-playlist-november-2020/",
    image: "../TEDx_stage_opt.webp"
  },
  {
    id: "awards",
    title: "Artistic Creative Direction Recognition",
    publication: "Breezerland Showcase",
    year: "2022",
    description: "Awarded and recognized within the creative industry for pioneering a sensory-first brand strategy. Parth Patadiya's work combines film direction, music composition, and fragrance formulation into a single artistic process, shaping the signature formulations of Breezerland's luxury perfume clients.",
    link: "../contact.html",
    image: "../TEDx_stage_opt.webp"
  }
];

function initAchievementsOrbit() {
  const orbitWrapper = document.getElementById('orbitWrapper');
  const cards = document.querySelectorAll('.orbit-card');
  const modalOverlay = document.getElementById('cdModalOverlay');
  const modalClose = document.getElementById('cdModalClose');
  const centerpiece = document.getElementById('portraitCenterpiece');
  
  if (!orbitWrapper || !cards.length) return;

  // Modal trigger on click
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const achievementId = card.getAttribute('data-id');
      const data = achievementsData.find(d => d.id === achievementId);
      if (data) {
        openCdModal(data);
      }
    });
  });

  // Modal close trigger
  if (modalClose) {
    modalClose.addEventListener('click', closeCdModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCdModal();
    });
  }
  
  // Centerpiece portrait click opens generic director profile card
  if (centerpiece) {
    centerpiece.addEventListener('click', () => {
      openCdModal({
        title: "Parth Patadiya",
        publication: "Creative Director",
        year: "FOUNDER & BRAND ARCHITECT",
        description: "Parth Patadiya is the creative visionary behind Breezerland's signature olfactory identity. Seamlessly combining his background in film composition, sound engineering, and luxury marketing, he elevates commercial perfume contract manufacturing into a multi-sensory storytelling medium. Under his direction, every fragrance compound is crafted not just as a mixture of aromatic molecules, but as a luxury experience that helps brands establish strong emotional connections with their consumers.",
        link: "../contact.html",
        image: "../CREATIVE_DIRECTOR_opt.webp"
      });
    });
  }

  // Modal open function
  function openCdModal(data) {
    const modalImage = document.getElementById('cdModalImg');
    const modalTitle = document.getElementById('cdModalTitle');
    const modalPub = document.getElementById('cdModalPub');
    const modalYear = document.getElementById('cdModalYear');
    const modalDesc = document.getElementById('cdModalDesc');
    const modalBtn = document.getElementById('cdModalBtn');

    if (modalImage) modalImage.src = data.image;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalPub) modalPub.textContent = data.publication;
    if (modalYear) modalYear.textContent = data.year;
    if (modalDesc) modalDesc.textContent = data.description;
    
    if (modalBtn) {
      // Clear event listeners on clone or re-binding
      const newBtn = modalBtn.cloneNode(true);
      newBtn.addEventListener('click', () => {
        window.open(data.link, '_blank', 'noopener,noreferrer');
      });
      modalBtn.parentNode.replaceChild(newBtn, modalBtn);
    }

    if (modalOverlay) {
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCdModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }
}

/* ==========================================================================
   PORTRAIT PARALLAX (MOUSE MOVEMENT TRACKING)
   ========================================================================== */
function initPortraitParallax() {
  const container = document.getElementById('orbitSection');
  const target = document.getElementById('portraitCenterpiece');
  
  if (!container || !target || prefersReducedMotion) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse X position inside container
    const y = e.clientY - rect.top;  // mouse Y position inside container

    const percentX = (x / rect.width) - 0.5; // -0.5 to 0.5
    const percentY = (y / rect.height) - 0.5; // -0.5 to 0.5

    // Move centerpiece slightly based on mouse
    const moveX = percentX * 35; // max 35px shift
    const moveY = percentY * 35; // max 35px shift

    if (window.gsap) {
      gsap.to(target, {
        x: moveX,
        y: moveY,
        rotation: percentX * 5, // slight tilt
        duration: 0.8,
        ease: "power2.out"
      });
    }
  });

  container.addEventListener('mouseleave', () => {
    // Reset positions on mouse exit
    if (window.gsap) {
      gsap.to(target, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)"
      });
    }
  });
}

/* ==========================================================================
   FEATURED RECOGNITION (TEDx CAROUSEL AND LIGHTBOX BINDING)
   ========================================================================== */
function initRecognitionCarousel() {
  const carousel = document.getElementById('recognitionCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.prev-btn');
  const nextBtn = carousel.querySelector('.next-btn');
  
  if (slides.length < 2) return;

  let activeIndex = 0;

  function updateCarousel() {
    slides.forEach((slide, idx) => {
      slide.className = 'carousel-slide'; // reset classes
      
      // Calculate relative position index in a loop
      let diff = idx - activeIndex;
      
      // Handle bounds wrap-around for infinite carousel feel
      if (diff === -1 || (activeIndex === 0 && idx === slides.length - 1)) {
        slide.classList.add('left-slide');
      } else if (diff === 1 || (activeIndex === slides.length - 1 && idx === 0)) {
        slide.classList.add('right-slide');
      } else if (idx === activeIndex) {
        slide.classList.add('center-slide');
      }
    });
  }

  // Button clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % slides.length;
      updateCarousel();
    });
  }

  // Slide clicks (clicking a preview slide makes it active, center clicks open lightbox)
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', (e) => {
      if (slide.classList.contains('center-slide')) {
        // If center slide, extract image and caption details and trigger global openLightbox
        const img = slide.querySelector('img');
        const caption = slide.querySelector('.carousel-caption-text')?.textContent || '';
        if (img && typeof window.openLightbox === 'function') {
          window.openLightbox(img.getAttribute('src'), caption);
        }
      } else {
        // Focus the clicked slide
        activeIndex = idx;
        updateCarousel();
      }
    });
  });

  // Swipe support for touch screens
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // threshold
      if (diff > 0) {
        // swipe left -> next
        activeIndex = (activeIndex + 1) % slides.length;
      } else {
        // swipe right -> prev
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      }
      updateCarousel();
    }
  }, { passive: true });

  // Initial set
  updateCarousel();
}

/* ==========================================================================
   ACHIEVEMENT STATISTICS (ANIMATING NUMBERS ON SCROLL)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  function startCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isPlus = el.getAttribute('data-plus') === 'true';
    const isFloat = el.getAttribute('data-float') === 'true';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentVal = easedProgress * target;

      if (isFloat) {
        el.textContent = currentVal.toFixed(1) + (isPlus ? '+' : '');
      } else {
        el.textContent = Math.floor(currentVal) + (isPlus ? '+' : '');
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = target + (isPlus ? '+' : '');
      }
    }

    requestAnimationFrame(updateNumber);
  }

  // Use Intersection Observer for triggering counters on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target); // trigger once
      }
    });
  }, { threshold: 0.1 });

  statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   TIMELINE MILESTONES (HORIZONTAL NODE EXPANSIONS)
   ========================================================================== */
function initTimelineMilestones() {
  const nodes = document.querySelectorAll('.timeline-node');
  nodes.forEach(node => {
    // Basic accessibility accessibility state
    node.setAttribute('tabindex', '0');
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.focus();
      }
    });
  });
}

/* ==========================================================================
   QUOTE SECTION (ANIMATED TEXT REVEAL)
   ========================================================================== */
function initQuoteReveal() {
  const quoteText = document.querySelector('.quote-text');
  const quoteAuthor = document.querySelector('.quote-author-line');
  
  if (!quoteText) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger reveal by splitting words or simply animating opacity of the block
        if (window.gsap) {
          gsap.fromTo(quoteText, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
          );
        } else {
          quoteText.style.opacity = '1';
        }
        
        if (quoteAuthor) {
          setTimeout(() => {
            quoteAuthor.classList.add('visible');
          }, 600);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(quoteText.parentElement);
}

/* ==========================================================================
   MOBILE SCROLL STORYTELLING (INTERSECTION OBSERVER)
   ========================================================================== */
function initMobileScrollAnimations() {
  const w = window.innerWidth;
  if (w >= 768) return; // Only run on mobile!
  
  const cards = document.querySelectorAll('.mobile-story-card');
  if (!cards.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    observer.observe(card);
  });
}
