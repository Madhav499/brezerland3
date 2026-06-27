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
    prepElements('.product-category-card');
    prepElements('.feature-card');
    prepElements('.feature-icon', { opacity: 0, scale: 0.82, rotation: -6 });
    prepElements('.timeline-step .step-badge', { opacity: 0, scale: 0.7 });
    prepElements('.timeline-step .timeline-content', { opacity: 0, y: getDistance(34), scale: 0.97 });
    prepElements('.industry-card', { opacity: 0, y: getDistance(36), scale: 0.94 });
    prepElements('.factsheet-container', { opacity: 0, y: getDistance(36) });
    prepElements('.footer-grid > div', { opacity: 0, y: getDistance(36) });
    prepElements('.footer-socials a', { opacity: 0, y: getDistance(12) });
    prepElements('.footer-note', { opacity: 0, y: getDistance(20) });

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

    gsap.to('.feature-card', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: getDuration(1),
      ease: 'power3.out',
      stagger: getStagger(0.1),
      scrollTrigger: scrollTriggerConfig('.feature-grid', 'top 82%')
    });

    gsap.to('.feature-icon', {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: getDuration(0.95),
      ease: 'back.out(1.4)',
      stagger: getStagger(0.1),
      scrollTrigger: scrollTriggerConfig('.feature-grid', 'top 82%')
    });

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

  function playHeroAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    gsap.set('.hero', { opacity: 0 });
    gsap.set('.hero-overlay', { opacity: 0 });
    gsap.set('.hero-glow', { opacity: 0, scale: 0.92 });
    gsap.set('.hero .eyebrow', { opacity: 0, y: getDistance(24) });
    gsap.set('.hero h1 .heading-line-inner', { opacity: 0, y: '110%' });
    gsap.set('.hero-copy-top > p', { opacity: 0, y: getDistance(26) });
    gsap.set('.hero-actions .btn', { opacity: 0, scale: 0.92 });
    gsap.set('.trust-badges span', { opacity: 0, y: getDistance(16) });
    gsap.set('.hero-image-container', { opacity: 0, scale: 1.05 });
    gsap.set('.hero-particle', { opacity: 0, scale: 0.85 });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .to('.hero', {
        opacity: 1,
        duration: getDuration(1.1),
        ease: 'power2.out'
      })
      .to('.hero-overlay', {
        opacity: 0.15,
        duration: getDuration(1),
        ease: 'power2.out'
      }, 0)
      .to('.hero-glow', {
        opacity: 1,
        scale: 1,
        duration: getDuration(1.15),
        ease: 'power2.out'
      }, 0.05)
      .to('.hero .eyebrow', {
        opacity: 1,
        y: 0,
        duration: getDuration(0.9)
      }, 0.15)
      .to('.hero h1 .heading-line-inner', {
        opacity: 1,
        y: 0,
        duration: getDuration(1.05),
        ease: 'expo.out',
        stagger: getStagger(0.14)
      }, 0.28)
      .to('.hero-copy-top > p', {
        opacity: 1,
        y: 0,
        duration: getDuration(0.95)
      }, 0.48)
      .to('.hero-actions .btn', {
        opacity: 1,
        scale: 1,
        duration: getDuration(0.85),
        ease: 'expo.out',
        stagger: getStagger(0.1)
      }, 0.62)
      .to('.trust-badges span', {
        opacity: 1,
        y: 0,
        duration: getDuration(0.75),
        stagger: getStagger(0.08)
      }, 0.78)
      .to('.hero-image-container', {
        opacity: 1,
        scale: 1,
        duration: getDuration(1.2),
        ease: 'power2.out'
      }, 0.35)
      .to('.hero-particle', {
        opacity: 1,
        scale: 1,
        duration: getDuration(1),
        stagger: getStagger(0.12)
      }, 0.55);
  }

  function initGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      showAllContent();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    prepareHeadingLines('.hero h1');
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

    if (prefersReducedMotion) {
      showAllContent();
      return;
    }

    playHeroAnimation();
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
