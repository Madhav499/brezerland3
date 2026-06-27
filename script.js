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

  // 2. Custom Cursor Follower (For Desktop)
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  
  if (cursor && follower && window.innerWidth > 1024) {
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });
    
    // Follower animation loop with slight lag for premium breathing feel
    function animateFollower() {
      const dx = mouseX - posX;
      const dy = mouseY - posY;
      
      posX += dx * 0.15;
      posY += dy * 0.15;
      
      follower.style.left = posX + 'px';
      follower.style.top = posY + 'px';
      
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Interactive element hover scale triggers
    const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, .product-category-card, .feature-card, .industry-card, .testimonial-card, .tab-btn, .factsheet-table td a');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
      });
    });
  }

  // 3. Scroll Interactions: Progress bar, Scrolled Header, and Back-to-Top
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (topbar) {
      topbar.classList.toggle('scrolled', scrollTop > 40);
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

  // 4. Mobile Navigation Slide Drawer
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileMenu) {
        if (mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      }
    });
  }

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.classList.add('open');
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const items = mobileMenu.querySelectorAll('.mobile-nav a, .mobile-ctas a');
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

    const items = mobileMenu.querySelectorAll('.mobile-nav a, .mobile-ctas a');
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
  const navLinks = document.querySelectorAll('.navbar a, .mobile-nav a, .dropdown-content a');
  
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
});
