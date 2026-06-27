/**
 * Breezerland Perfumes — Premium JavaScript Interaction Engine
 * Handles custom cursor tracking, sticky header states, mobile navigation drawer,
 * active multi-page nav links, testimonials auto-slider, and enquiry form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loader = document.getElementById('pageLoader');
  const topbar = document.getElementById('topbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const progressBar = document.querySelector('.progress-bar');
  const backToTop = document.getElementById('backToTop');
  const enquiryForm = document.getElementById('enquiryForm');

  // 1. Loader Hide and Animation Hand-off
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
    }
    if (typeof window.initBreezerlandAnimations === 'function') {
      window.initBreezerlandAnimations();
    }
  }, 800);

  // 2. Custom Cursor Follower (Removed per request)

  // 3. Scroll Interactions: Progress bar, Scrolled Header, and Back-to-Top
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (topbar) {
      const scrollThreshold = window.innerWidth > 1024 ? 100 : 10;
      topbar.classList.toggle('scrolled', scrollTop > scrollThreshold);
    }
    
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollTop > 400);
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Mobile Menu Interactions
  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.classList.add('open');
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const items = mobileMenu.querySelectorAll('.mobile-menu-links li, .mobile-menu-cta-container, .mobile-contact-item, .mobile-menu-whatsapp-container, .mobile-menu-socials');
    items.forEach((it, idx) => {
      it.style.transitionDelay = `${0.05 + idx * 0.03}s`;
      it.style.opacity = '1';
      it.style.transform = 'translateY(0)';
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.classList.remove('open');
    
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    const items = mobileMenu.querySelectorAll('.mobile-menu-links li, .mobile-menu-cta-container, .mobile-contact-item, .mobile-menu-whatsapp-container, .mobile-menu-socials');
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
  });

  // 5. Active Navigation Link Highlighting (Filename-based for Multi-Page)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar a, .mobile-menu-links a, .dropdown-content a');
  
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      // If it is in capabilities dropdown, also highlight parent capabilities button
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const dropdownBtn = parentDropdown.querySelector('.dropdown-btn');
        if (dropdownBtn) dropdownBtn.classList.add('active');
      }
    } else {
      link.classList.remove('active');
    }
  });

  // 6. About Section Tab Toggler
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.about-tab-content');

  if (tabButtons.length) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(content => content.classList.remove('active'));
        const targetId = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // 7. Testimonial Auto Slider with Dots Navigation
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const authorBlock = document.getElementById('testimonialAuthor');
  let currentIdx = 0;
  let autoplayInterval = null;

  if (testimonialCards.length) {
    function updateAuthorBlock(idx) {
      if (!authorBlock) return;
      const card = testimonialCards[idx];
      const name = card.dataset.author || '';
      const loc = card.dataset.location || '';

      // Reset and trigger reflow for smooth text fade-in
      authorBlock.style.animation = 'none';
      authorBlock.offsetHeight;
      authorBlock.style.animation = '';

      authorBlock.innerHTML = `<strong>${name}</strong><span>${loc}</span>`;
    }

    function showTestimonialSlide(idx) {
      testimonialCards[currentIdx]?.classList.remove('active');
      dots[currentIdx]?.classList.remove('active');

      currentIdx = idx;

      testimonialCards[currentIdx]?.classList.add('active');
      dots[currentIdx]?.classList.add('active');

      updateAuthorBlock(currentIdx);
    }

    function nextTestimonialSlide() {
      const nextIdx = (currentIdx + 1) % testimonialCards.length;
      showTestimonialSlide(nextIdx);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextTestimonialSlide, 6500);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showTestimonialSlide(index);
        resetAutoplay();
      });
    });

    startAutoplay();
  }

  // 8. Contact Form Integration (With Mock Luxury Feedback & WhatsApp redirect)
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const fullName = document.getElementById('fullName').value;
      const companyName = document.getElementById('companyName')?.value || 'Not Specified';
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const productInterest = document.getElementById('productInterest').value;
      const quantity = document.getElementById('quantity')?.value || 'Not Specified';
      const message = document.getElementById('message')?.value || '';

      // Perform a elegant B2B alert
      alert(`Thank you, ${fullName}!\nYour B2B inquiry regarding "${productInterest}" has been successfully received.\nOur perfume formulation experts will reach out to you within 24 hours.`);

      // WhatsApp Dynamic URL Construction
      const whatsappText = `Hello Breezerland Perfumes,\n\nI am interested in placing an inquiry for fragrance manufacturing:\n\n*Name:* ${fullName}\n*Company:* ${companyName}\n*Product Interest:* ${productInterest}\n*Quantity:* ${quantity}\n*Phone:* ${phone}\n*Email:* ${email}\n*Requirement:* ${message}\n\nPlease get in touch with me.`;
      
      const whatsappUrl = `https://wa.me/918047672314?text=${encodeURIComponent(whatsappText)}`;
      
      // Reset form
      enquiryForm.reset();
      
      // Redirect in new tab
      window.open(whatsappUrl, '_blank');
    });
  }

  // 9. Search Bar Overlay Toggler
  const searchTriggers = document.querySelectorAll('.nav-search-btn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');

  if (searchOverlay && searchTriggers.length) {
    searchTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        const input = searchOverlay.querySelector('.search-input');
        if (input) input.focus();
      });
    });

    searchClose?.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

  // 10. Floating Contact Widget Logic
  const widgetTrigger = document.getElementById('widgetTrigger');
  const contactPopup = document.getElementById('contactPopup');
  const popupClose = document.getElementById('popupClose');

  if (widgetTrigger && contactPopup) {
    widgetTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      contactPopup.classList.toggle('active');
      const isActive = contactPopup.classList.contains('active');
      contactPopup.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    popupClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWidgetPopup();
    });

    function closeWidgetPopup() {
      contactPopup.classList.remove('active');
      contactPopup.setAttribute('aria-hidden', 'true');
      localStorage.setItem('contact_widget_dismissed', Date.now().toString());
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (contactPopup.classList.contains('active')) {
        if (!contactPopup.contains(e.target) && e.target !== widgetTrigger && !widgetTrigger.contains(e.target)) {
          contactPopup.classList.remove('active');
          contactPopup.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // Escape Key Closure
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        contactPopup.classList.remove('active');
        contactPopup.setAttribute('aria-hidden', 'true');
        if (searchOverlay) searchOverlay.classList.remove('active');
      }
    });

    // Auto open after 8 seconds (if not dismissed within 24 hours)
    const dismissedTime = localStorage.getItem('contact_widget_dismissed');
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (!dismissedTime || (Date.now() - parseInt(dismissedTime, 10)) > oneDayMs) {
      setTimeout(() => {
        if (!contactPopup.classList.contains('active')) {
          contactPopup.classList.add('active');
          contactPopup.setAttribute('aria-hidden', 'false');
        }
      }, 8000);
    }
  }
});
