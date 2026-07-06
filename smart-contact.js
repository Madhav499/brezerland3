/**
 * Breezerland — Unified Smart Contact System
 * Reusable utility script for form validation, choice modal dialogue, and formatted API redirection.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Global Config
  const WHATSAPP_NUMBER = '918780872023';
  const EMAIL_RECIPIENT = 'info@breezerland.in';

  // Field display mapping for labels in formatted messages
  const FIELD_LABEL_MAP = {
    'fullName': 'Name',
    'companyName': 'Company',
    'phone': 'Phone',
    'email': 'Email',
    'cityCountry': 'City / Country',
    'productInterest': 'Product/Service',
    'quantity': 'Quantity',
    'message': 'Message'
  };

  // 1. FORM VALIDATION UTILITIES
  function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    } 
    // Email check
    else if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    } 
    // Phone check
    else if (input.type === 'tel' && value) {
      const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number (10-15 digits).';
      }
    }

    // Toggle styling & inline message
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      // Clean existing error
      const existingError = formGroup.querySelector('.inline-error-msg');
      if (existingError) existingError.remove();

      if (!isValid) {
        input.classList.add('invalid');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'inline-error-msg';
        errorSpan.textContent = errorMessage;
        formGroup.appendChild(errorSpan);
      } else {
        input.classList.remove('invalid');
      }
    }

    return isValid;
  }

  function validateForm(form) {
    let isFormValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Validate field
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    // If invalid, focus first error input
    if (!isFormValid) {
      const firstError = form.querySelector('.invalid');
      if (firstError) firstError.focus();
    }

    return isFormValid;
  }

  // Real-time inline field validation on input changes
  document.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea, select')) {
      // Only validate if it has been marked invalid or is required
      if (e.target.classList.contains('invalid') || e.target.hasAttribute('required')) {
        validateField(e.target);
      }
    }
  });

  // 2. MODAL & FOCUS TRAP CONTROLLER
  let modalInstance = null;
  let previouslyFocusedElement = null;
  let currentActiveForm = null;

  function createModal() {
    if (document.getElementById('smartContactModal')) return;

    const modal = document.createElement('div');
    modal.id = 'smartContactModal';
    modal.className = 'smart-contact-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="smart-contact-modal-overlay"></div>
      <div class="smart-contact-modal-content">
        <button class="smart-contact-close" aria-label="Close choice modal">✕</button>
        <h3 class="smart-contact-title">Choose Your Preferred Communication</h3>
        <p class="smart-contact-subtitle">Your inquiry is ready. Select how you'd like to send it.</p>
        
        <div class="smart-contact-actions">
          <button class="smart-contact-btn btn-whatsapp" id="smartBtnWhatsApp" aria-label="Continue with WhatsApp">
            <span class="btn-icon">🟢</span>
            <span class="btn-text">Continue with WhatsApp</span>
            <span class="btn-loader"></span>
          </button>
          <button class="smart-contact-btn btn-email" id="smartBtnEmail" aria-label="Continue with Email">
            <span class="btn-icon">✉️</span>
            <span class="btn-text">Continue with Email</span>
            <span class="btn-loader"></span>
          </button>
        </div>
        
        <div class="smart-contact-status" id="smartContactStatus" aria-live="polite">Preparing your message...</div>
        
        <button class="smart-contact-cancel" id="smartBtnCancel" aria-label="Cancel contact form submission">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.smart-contact-close').addEventListener('click', closeModal);
    modal.querySelector('#smartBtnCancel').addEventListener('click', closeModal);
    modal.querySelector('.smart-contact-modal-overlay').addEventListener('click', closeModal);

    // Event hooks for channels
    modal.querySelector('#smartBtnWhatsApp').addEventListener('click', () => handleChoice('whatsapp'));
    modal.querySelector('#smartBtnEmail').addEventListener('click', () => handleChoice('email'));

    modalInstance = modal;
  }

  function getFocusableElements() {
    if (!modalInstance) return [];
    return Array.from(modalInstance.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // Escape key and tab key capture inside modal
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'Tab') {
      trapFocus(e);
    }
  }

  function openModal(form) {
    createModal();
    currentActiveForm = form;
    previouslyFocusedElement = document.activeElement;

    // Reset status
    const statusEl = document.getElementById('smartContactStatus');
    statusEl.classList.remove('visible');
    
    // Enable buttons
    const buttons = modalInstance.querySelectorAll('.smart-contact-btn');
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('loading');
    });

    modalInstance.classList.add('active');
    modalInstance.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus WhatsApp button first
    const whatsappBtn = document.getElementById('smartBtnWhatsApp');
    if (whatsappBtn) whatsappBtn.focus();

    // Listeners
    document.addEventListener('keydown', handleKeydown);
  }

  function closeModal() {
    if (!modalInstance) return;
    modalInstance.classList.remove('active');
    modalInstance.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleKeydown);

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    currentActiveForm = null;
  }

  // 3. CHANNEL REDIRECTION HANDLERS
  function parseFormData(form) {
    const data = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.name && input.value.trim()) {
        const key = FIELD_LABEL_MAP[input.name] || FIELD_LABEL_MAP[input.id] || input.name;
        data[key] = input.value.trim();
      }
    });
    return data;
  }

  function buildWhatsAppMessage(data) {
    let msg = 'Hello Breezerland,\n\nI would like to connect with your team.\n\n';
    
    for (const [key, value] of Object.entries(data)) {
      msg += `${key}:\n${value}\n\n`;
    }
    
    msg += 'Thank you.';
    return msg;
  }

  function buildMailBody(data, senderName) {
    let body = 'Hello Breezerland,\n\n';
    
    for (const [key, value] of Object.entries(data)) {
      body += `${key}:\n${value}\n\n`;
    }
    
    body += `Regards,\n${senderName || 'Visitor'}`;
    return body;
  }

  function handleChoice(channel) {
    if (!currentActiveForm) return;

    // UI Loading feedback
    const btn = document.getElementById(channel === 'whatsapp' ? 'smartBtnWhatsApp' : 'smartBtnEmail');
    const otherBtn = document.getElementById(channel === 'whatsapp' ? 'smartBtnEmail' : 'smartBtnWhatsApp');
    const statusEl = document.getElementById('smartContactStatus');

    btn.disabled = true;
    btn.classList.add('loading');
    otherBtn.disabled = true;
    statusEl.classList.add('visible');

    const data = parseFormData(currentActiveForm);
    const senderName = data['Name'] || '';
    const productOrService = data['Product/Service'] || '';

    setTimeout(() => {
      if (channel === 'whatsapp') {
        const text = buildWhatsAppMessage(data);
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      } else {
        const subject = data['Subject'] || (productOrService ? `Breezerland Business Inquiry - ${productOrService}` : 'Breezerland Business Inquiry');
        const body = buildMailBody(data, senderName);
        const mailto = `mailto:${EMAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
      }

      // Complete execution flow
      setTimeout(() => {
        closeModal();
        currentActiveForm.reset();
      }, 500);

    }, 500); // 500ms spinner delay
  }

  // 4. GLOBAL INTERCEPTOR
  document.addEventListener('submit', (e) => {
    const form = e.target;
    // Exclude header search elements
    if (form.classList.contains('search-box') || form.id === 'searchOverlay') return;

    e.preventDefault();

    if (validateForm(form)) {
      openModal(form);
    }
  });

  // Expose global utilities
  window.BreezerlandSmartContact = {
    validateForm,
    openModal,
    closeModal,
    buildWhatsAppMessage,
    buildMailBody
  };

});
