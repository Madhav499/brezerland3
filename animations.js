/**
 * Breezerland — Premium GSAP + ScrollTrigger animations
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function isTablet() {
    return window.innerWidth <= 1024;
  }

  function getDistance(base) {
    if (prefersReducedMotion) return 0;
    if (isMobile()) return base * 0.45;
    if (isTablet()) return base * 0.72;
    return base;
  }

  function getDuration(base) {
    if (prefersReducedMotion) return 0;
    return isMobile() ? Math.min(base, 0.9) : base;
  }

  function getStagger(base) {
    if (prefersReducedMotion) return 0;
    return isMobile() ? Math.max(base * 0.75, 0.08) : base;
  }

  function cardFrom(extraY) {
    return {
      opacity: 0,
      y: getDistance(extraY || 40),
      scale: 0.96
    };
  }

  function scrollTriggerConfig(trigger, start) {
    return {
      trigger,
      start: start || 'top 82%',
      once: true,
      invalidateOnRefresh: true
    };
  }

  function prepareHeadingLines(selector) {
    document.querySelectorAll(selector).forEach((heading) => {
      if (heading.querySelector('.heading-line')) return;

      const text = heading.textContent.trim();
      const parts = text.split(/\s—\s/);

      if (parts.length > 1) {
        heading.innerHTML = parts
          .map((part, index) => {
            const prefix = index > 0 ? '— ' : '';
            return `<span class="heading-line"><span class="heading-line-inner">${prefix}${part.trim()}</span></span>`;
          })
          .join('');
        return;
      }

      const words = text.split(/\s+/);
      if (words.length <= 4) return;

      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ');
      const line2 = words.slice(mid).join(' ');
      heading.innerHTML = [
        `<span class="heading-line"><span class="heading-line-inner">${line1}</span></span>`,
        `<span class="heading-line"><span class="heading-line-inner">${line2}</span></span>`
      ].join('');
    });
  }

  function splitTextIntoSpans(selector) {
    document.querySelectorAll(selector).forEach((heading) => {
      if (heading.querySelector('.char-span')) return;

      const text = heading.textContent.trim();
      heading.innerHTML = '';

      const words = text.split(/\s+/);
      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        for (let char of word) {
          const letterSpan = document.createElement('span');
          letterSpan.className = 'char-span';
          letterSpan.textContent = char;
          wordSpan.appendChild(letterSpan);
        }

        heading.appendChild(wordSpan);

        if (wordIdx < words.length - 1) {
          heading.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  function showAllContent() {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      el.classList.add('reveal-visible');
    });
    document.documentElement.classList.remove('js-gsap-pending');
  }

  function prepElements(selector, fromVars) {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.set(el, fromVars || cardFrom());
    });
  }

  function revealOnScroll(target, fromVars, toVars, trigger, start) {
    return gsap.fromTo(
      target,
      fromVars,
      {
        ...toVars,
        scrollTrigger: scrollTriggerConfig(trigger || target, start)
      }
    );
  }

  function animateSectionHeading(sectionSelector) {
    const heading = document.querySelector(`${sectionSelector} .section-heading`);
    if (!heading) return;

    const label = heading.querySelector('.section-label');
    const title = heading.querySelector('h2');
    const copy = heading.querySelector('p');
    const lineInners = title ? title.querySelectorAll('.heading-line-inner') : [];

    if (lineInners.length) {
      if (label) gsap.set(label, { opacity: 0, y: getDistance(28) });
      if (copy) gsap.set(copy, { opacity: 0, y: getDistance(28) });
      gsap.set(lineInners, { opacity: 0, y: '110%' });

      const headingTl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig(heading, 'top 85%')
      });

      if (label) {
        headingTl.to(label, { opacity: 1, y: 0, duration: getDuration(1), ease: 'power3.out' });
      }

      headingTl.to(
        lineInners,
        {
          opacity: 1,
          y: 0,
          duration: getDuration(1.05),
          ease: 'expo.out',
          stagger: getStagger(0.14)
        },
        label ? '-=0.7' : 0
      );

      if (copy) {
        headingTl.to(
          copy,
          { opacity: 1, y: 0, duration: getDuration(0.95), ease: 'power2.out' },
          '-=0.65'
        );
      }

      return;
    }

    const items = [label, title, copy].filter(Boolean);
    prepElements(items, { opacity: 0, y: getDistance(28) });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: getDuration(1),
      ease: 'power3.out',
      stagger: getStagger(0.12),
      scrollTrigger: scrollTriggerConfig(heading, 'top 85%')
    });
  }

  function setupImageParallax() {
    if (prefersReducedMotion || isMobile()) return;

    const parallaxAmount = isTablet() ? 5 : 8;

    document.querySelectorAll('.about-img-main, .hero-img-main, .prod-card-image img').forEach((img) => {
      const trigger = img.closest('section') || img.parentElement;
      gsap.to(img, {
        yPercent: -parallaxAmount,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });
  }

  function setupDecorativeLoops() {
    if (prefersReducedMotion) return;

    gsap.to('.hero-glow', {
      scale: 1.08,
      opacity: 0.85,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.utils.toArray('.hero-particle').forEach((particle, index) => {
      gsap.to(particle, {
        y: `+=${12 + index * 4}`,
        x: `+=${6 + index * 2}`,
        duration: 5 + index,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.6
      });
    });
  }

  function setupScrollAnimations() {
    // General scroll reveal trigger
    gsap.utils.toArray('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => el.classList.add('reveal-visible')
      });
    });

    if (document.querySelector('.product-category-card')) prepElements('.product-category-card');
    if (document.querySelector('.feature-card')) prepElements('.feature-card');
    if (document.querySelector('.feature-icon')) prepElements('.feature-icon', { opacity: 0, scale: 0.82, rotation: -6 });
    if (document.querySelector('.timeline-step')) {
      prepElements('.timeline-step .step-badge', { opacity: 0, scale: 0.7 });
      prepElements('.timeline-step .timeline-content', { opacity: 0, y: getDistance(34), scale: 0.97 });
    }
    if (document.querySelector('.industry-card')) prepElements('.industry-card', { opacity: 0, y: getDistance(36), scale: 0.94 });
    if (document.querySelector('.factsheet-container')) prepElements('.factsheet-container', { opacity: 0, y: getDistance(36) });
    if (document.querySelector('.footer-grid > div')) prepElements('.footer-grid > div', { opacity: 0, y: getDistance(36) });
    if (document.querySelector('.footer-socials a')) prepElements('.footer-socials a', { opacity: 0, y: getDistance(12) });
    if (document.querySelector('.footer-note')) prepElements('.footer-note', { opacity: 0, y: getDistance(20) });

    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
      gsap.set(timelineLine, { scaleY: 0, transformOrigin: 'top center' });
    }

    /* ── About ── */
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      gsap.set(['.about-media', '.about-copy'], { opacity: 0 });
      gsap.set('.about-media', { x: -getDistance(70) });
      gsap.set('.about-copy', { x: getDistance(70) });
      gsap.set('.location-info', { opacity: 0, y: getDistance(20) });
      gsap.set('.about-tab-buttons', { opacity: 0, y: getDistance(16) });
      prepElements('.counters article');

      gsap.timeline({
        scrollTrigger: scrollTriggerConfig(aboutSection, 'top 78%')
      })
        .to('.about-media', {
          x: 0,
          opacity: 1,
          duration: getDuration(1.1),
          ease: 'power3.out'
        })
        .to('.about-copy', {
          x: 0,
          opacity: 1,
          duration: getDuration(1.1),
          ease: 'power3.out'
        }, '-=0.75')
        .to('.location-info', {
          opacity: 1,
          y: 0,
          duration: getDuration(0.85),
          ease: 'power2.out'
        }, '-=0.55')
        .to('.about-tab-buttons', {
          opacity: 1,
          y: 0,
          duration: getDuration(0.8),
          ease: 'power2.out'
        }, '-=0.45')
        .to('.counters article', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: getDuration(0.9),
          ease: 'power3.out',
          stagger: getStagger(0.12)
        }, '-=0.35');
    }

    const factsheet = document.querySelector('.factsheet-container');
    if (factsheet) {
      revealOnScroll(
        factsheet,
        { opacity: 0, y: getDistance(36) },
        { opacity: 1, y: 0, duration: getDuration(1), ease: 'power3.out' },
        factsheet,
        'top 85%'
      );
    }

    /* ── Products ── */
    animateSectionHeading('#products');

    gsap.utils.toArray('.product-category-card').forEach((card, index) => {
      revealOnScroll(
        card,
        cardFrom(44),
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: getDuration(1.05),
          ease: 'power3.out',
          delay: index * 0.02
        },
        card,
        'top 88%'
      );

      const image = card.querySelector('.prod-card-image img');
      if (image) {
        gsap.set(image, { scale: 1.06, opacity: 0 });
        gsap.to(image, {
          scale: 1,
          opacity: 1,
          duration: getDuration(1.15),
          ease: 'power2.out',
          scrollTrigger: scrollTriggerConfig(card, 'top 88%')
        });
      }
    });

    /* ── Why Choose ── */
    animateSectionHeading('#why');

    if (document.querySelector('.feature-card')) {
      gsap.to('.feature-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: getDuration(1),
        ease: 'power3.out',
        stagger: getStagger(0.1),
        scrollTrigger: scrollTriggerConfig('.feature-grid', 'top 82%')
      });
    }

    if (document.querySelector('.feature-icon')) {
      gsap.to('.feature-icon', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: getDuration(0.95),
        ease: 'back.out(1.4)',
        stagger: getStagger(0.1),
        scrollTrigger: scrollTriggerConfig('.feature-grid', 'top 82%')
      });
    }

    /* ── Process Timeline ── */
    animateSectionHeading('#process');

    const timeline = document.querySelector('.timeline');
    if (timeline) {
      if (timelineLine) {
        gsap.to(timelineLine, {
          scaleY: 1,
          duration: getDuration(1.2),
          ease: 'power2.out',
          scrollTrigger: scrollTriggerConfig(timeline, 'top 78%')
        });
      }

      gsap.utils.toArray('.timeline-step').forEach((step, index) => {
        gsap.to(step.querySelector('.step-badge'), {
          opacity: 1,
          scale: 1,
          duration: getDuration(0.75),
          ease: 'back.out(1.6)',
          scrollTrigger: scrollTriggerConfig(step, 'top 88%')
        });

        gsap.to(step.querySelector('.timeline-content'), {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: getDuration(0.95),
          ease: 'power3.out',
          delay: index * 0.02,
          scrollTrigger: scrollTriggerConfig(step, 'top 88%')
        });
      });
    }

    /* ── Industries ── */
    animateSectionHeading('#industries');

    gsap.utils.toArray('.industry-card').forEach((card, index) => {
      gsap.set(card, {
        opacity: 0,
        y: getDistance(36),
        scale: 0.94,
        rotation: index % 2 === 0 ? 2.5 : -2.5
      });

      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: getDuration(1),
        ease: 'power3.out',
        scrollTrigger: scrollTriggerConfig(card, 'top 90%')
      });
    });

    /* ── Testimonials ── */
    const testimonials = document.querySelector('#testimonials');
    if (testimonials) {
      gsap.set('#testimonials .section-heading', { opacity: 0, y: getDistance(30) });
      gsap.set('.testimonial-card.active', { opacity: 0, y: getDistance(40) });
      gsap.set('.testimonial-card.active .testimonial-stars', { opacity: 0 });
      gsap.set('.testimonial-card.active p', { opacity: 0, y: getDistance(18) });
      gsap.set('.testimonial-dots .dot', { opacity: 0, scale: 0.85 });
      gsap.set('#testimonialAuthor', { opacity: 0, y: getDistance(14) });

      const testTl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig(testimonials, 'top 78%')
      });

      testTl
        .to('#testimonials .section-heading', {
          opacity: 1,
          y: 0,
          duration: getDuration(0.95),
          ease: 'power3.out'
        })
        .to('.testimonial-card.active', {
          opacity: 1,
          y: 0,
          duration: getDuration(1.05),
          ease: 'power3.out'
        }, '-=0.45')
        .to('.testimonial-card.active .testimonial-stars', {
          opacity: 1,
          duration: getDuration(0.7),
          ease: 'power2.out'
        }, '-=0.55')
        .to('.testimonial-card.active p', {
          opacity: 1,
          y: 0,
          duration: getDuration(0.85),
          ease: 'power2.out'
        }, '-=0.35')
        .to('.testimonial-dots .dot', {
          opacity: 1,
          scale: 1,
          duration: getDuration(0.55),
          ease: 'power2.out',
          stagger: getStagger(0.08)
        }, '-=0.25')
        .to('#testimonialAuthor', {
          opacity: 1,
          y: 0,
          duration: getDuration(0.8),
          ease: 'power2.out'
        }, '-=0.15');
    }

    /* ── Contact ── */
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      gsap.set('.contact-copy', { opacity: 0, x: -getDistance(55) });
      gsap.set('.contact-form-container', { opacity: 0, x: getDistance(55) });
      prepElements('.contact-form .form-group', { opacity: 0, y: getDistance(22) });
      prepElements('.contact-form .form-actions .btn', { opacity: 0, scale: 0.94 });

      gsap.timeline({
        scrollTrigger: scrollTriggerConfig(contactSection, 'top 78%')
      })
        .to('.contact-copy', {
          opacity: 1,
          x: 0,
          duration: getDuration(1.05),
          ease: 'power3.out'
        })
        .to('.contact-form-container', {
          opacity: 1,
          x: 0,
          duration: getDuration(1.05),
          ease: 'power3.out'
        }, '-=0.75')
        .to('.contact-form .form-group', {
          opacity: 1,
          y: 0,
          duration: getDuration(0.85),
          ease: 'power2.out',
          stagger: getStagger(0.1)
        }, '-=0.55')
        .to('.contact-form .form-actions .btn', {
          opacity: 1,
          scale: 1,
          duration: getDuration(0.85),
          ease: 'expo.out',
          stagger: getStagger(0.1)
        }, '-=0.35');
    }

    /* ── Footer ── */
    const footer = document.querySelector('.footer');
    if (footer) {
      gsap.to('.footer-grid > div', {
        opacity: 1,
        y: 0,
        duration: getDuration(1),
        ease: 'power3.out',
        stagger: getStagger(0.12),
        scrollTrigger: scrollTriggerConfig(footer, 'top 88%')
      });

      gsap.to('.footer-socials a', {
        opacity: 1,
        y: 0,
        duration: getDuration(0.75),
        ease: 'power2.out',
        stagger: getStagger(0.1),
        scrollTrigger: scrollTriggerConfig(footer, 'top 88%')
      });

      gsap.to('.footer-note', {
        opacity: 1,
        y: 0,
        duration: getDuration(0.9),
        ease: 'power2.out',
        scrollTrigger: scrollTriggerConfig('.footer-note', 'top 95%')
      });
    }

    setupImageParallax();
    setupDecorativeLoops();
  }

  let heroRevealed = false;
  let revealTimer = null;

  function revealHeroContent() {
    if (heroRevealed) return;
    heroRevealed = true;

    if (revealTimer) clearTimeout(revealTimer);
    window.removeEventListener('scroll', handleInitialScroll);

    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.classList.remove('hero-hidden');

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Set initial states for hero copy elements to allow smooth GSAP control dynamically
    const hasCharSpan = document.querySelector('.hero h1 .char-span');
    const hasHeroP = document.querySelector('.hero-copy-top > p') || document.querySelector('.hero-copy > p');
    const hasActions = document.querySelector('.hero-actions .btn');
    const hasBadges = document.querySelector('.trust-badges span');

    if (hasCharSpan) gsap.set('.hero h1 .char-span', { opacity: 0, y: 40, filter: 'blur(6px)' });
    if (hasHeroP) gsap.set(hasHeroP, { opacity: 0, y: 30 });
    if (hasActions) gsap.set('.hero-actions .btn', { opacity: 0, scale: 0.9 });
    if (hasBadges) gsap.set('.trust-badges span', { opacity: 0, y: 20 });

    if (hasCharSpan) {
      heroTl.to('.hero h1 .char-span', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.03,
        ease: 'power4.out'
      });
    }
    if (hasHeroP) {
      heroTl.to(hasHeroP, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out'
      }, hasCharSpan ? '-=0.45' : 0);
    }
    if (hasActions) {
      heroTl.to('.hero-actions .btn', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out'
      }, hasHeroP ? '-=0.55' : 0);
    }
    if (hasBadges) {
      heroTl.to('.trust-badges span', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out'
      }, hasActions ? '-=0.45' : 0);
    }
  }

  function handleInitialScroll() {
    if (window.scrollY > 10) {
      revealHeroContent();
    }
  }

  function setupHeroRevealTrigger() {
    if (prefersReducedMotion) {
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.remove('hero-hidden');
      return;
    }

    // Scroll trigger
    window.addEventListener('scroll', handleInitialScroll, { passive: true });

    // Timeout trigger: 1.8 seconds after loader finishes
    revealTimer = setTimeout(() => {
      revealHeroContent();
    }, 1800);
  }

  function setupVideoParallax() {
    if (prefersReducedMotion || isMobile()) return;

    const video = document.querySelector('.hero-video');
    if (!video) return;

    gsap.to(video, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  function initGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      showAllContent();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      splitTextIntoSpans('.hero h1');
    } else {
      prepareHeadingLines('.hero h1');
    }
    prepareHeadingLines('.section-heading h2');

    if (prefersReducedMotion) {
      showAllContent();
      return;
    }

    setupScrollAnimations();
  }

  window.initBreezerlandAnimations = function () {
    if (typeof gsap === 'undefined') {
      showAllContent();
      return;
    }

    const video = document.querySelector('.hero-video');
    if (prefersReducedMotion && video) {
      video.removeAttribute('autoplay');
      video.pause();
      const sources = video.querySelectorAll('source');
      sources.forEach(source => source.removeAttribute('src'));
      video.load();
    }

    if (prefersReducedMotion) {
      showAllContent();
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.remove('hero-hidden');
      return;
    }

    setupHeroRevealTrigger();
    setupVideoParallax();
    ScrollTrigger.refresh();
    document.documentElement.classList.remove('js-gsap-pending');
  };

  document.addEventListener('DOMContentLoaded', initGsap);

  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    if (event.matches) {
      showAllContent();
      if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    }
  });
})();
