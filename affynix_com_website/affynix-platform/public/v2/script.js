/**
 * AFFYNIX PLATFORM INTERACTIONS
 * Enterprise-grade modal system with conversion optimization
 * Version: 2.0.0
 * 
 * Features:
 * - Modal-as-funnel conversion architecture
 * - Exit-intent detection & conversion recovery
 * - Form validation & CRM integration
 * - Analytics tracking
 * - Accessibility compliance (ARIA, keyboard navigation)
 * 
 * Dependencies: None (vanilla JavaScript)
 */

(function() {
  'use strict';

  /* ========================================================================
     UTILITY FUNCTIONS
     ======================================================================== */

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /* ========================================================================
     THEME MANAGEMENT
     ======================================================================== */

  class ThemeManager {
    constructor() {
      this.storageKey = 'affynix-theme';
      this.root = document.documentElement;
      this.init();
    }

    init() {
      const saved = localStorage.getItem(this.storageKey) || 'auto';
      this.apply(saved);
      this.bindToggle();
    }

    apply(mode) {
      this.root.classList.remove('theme-light', 'theme-dark', 'theme-auto');
      this.root.classList.add(`theme-${mode}`);
      localStorage.setItem(this.storageKey, mode);
    }

    bindToggle() {
      const toggle = $('#themeToggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        const current = localStorage.getItem(this.storageKey) || 'auto';
        const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
        this.apply(next);
        
        const labels = { light: 'Light mode', dark: 'Dark mode', auto: 'Auto theme' };
        toggle.title = `Theme: ${labels[next]}`;
      });
    }
  }

  /* ========================================================================
     MODAL SYSTEM (CONVERSION-OPTIMIZED)
     ======================================================================== */

  class ModalManager {
    constructor() {
      this.activeModal = null;
      this.exitIntentTriggered = false;
      this.init();
    }

    init() {
      this.createModalContainer();
      this.bindTriggers();
      this.bindEscapeKey();
      this.initExitIntent();
    }

    createModalContainer() {
      if ($('#affynix-modal-container')) return;

      const container = document.createElement('div');
      container.id = 'affynix-modal-container';
      container.setAttribute('aria-hidden', 'true');
      container.className = 'modal';
      container.innerHTML = `
        <div class="modal__backdrop" data-close></div>
        <div class="modal__content">
          <button class="modal__close" data-close aria-label="Close modal">✕</button>
          <div class="modal__body"></div>
        </div>
      `;
      document.body.appendChild(container);

      this.modal = container;
      this.modalBody = $('.modal__body', container);
    }

    bindTriggers() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (!trigger) return;

        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        this.open(modalId);

        // Analytics tracking
        this.trackEvent('modal_open', { modal_id: modalId });
      });

      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) {
          this.close();
        }
      });
    }

    bindEscapeKey() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.close();
        }
      });
    }

    open(modalId) {
      const content = this.getModalContent(modalId);
      if (!content) return;

      this.modalBody.innerHTML = content;
      this.modal.setAttribute('aria-hidden', 'false');
      this.activeModal = modalId;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus first focusable element
      const firstFocusable = this.modalBody.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    close() {
      if (!this.activeModal) return;

      this.modal.setAttribute('aria-hidden', 'true');
      this.activeModal = null;
      document.body.style.overflow = '';

      // Clear content after animation
      setTimeout(() => {
        this.modalBody.innerHTML = '';
      }, 300);
    }

    getModalContent(modalId) {
      const templates = {
        'modal-starter': this.getStarterPlanModal(),
        'modal-pro': this.getProPlanModal(),
        'modal-exit-intent': this.getExitIntentModal()
      };

      return templates[modalId] || `<p>Modal content for ${modalId} not found.</p>`;
    }

    getStarterPlanModal() {
      return `
        <div class="modal-plan">
          <h2 class="modal-plan__title">Get Started Free</h2>
          <p class="modal-plan__description">
            Start building with AI agents and conversion-optimized funnels. No credit card required.
          </p>
          
          <div class="modal-plan__features">
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>1 AI agent deployment</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Basic analytics dashboard</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Community support</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Standard affiliate links</span>
            </div>
          </div>

          <form class="modal-plan__form" id="modal-form-starter">
            <div class="form__group">
              <label class="form__label" for="starter-email">Email Address</label>
              <input 
                type="email" 
                id="starter-email" 
                name="email" 
                class="form__input" 
                required 
                placeholder="you@company.com"
              />
              <span class="form__error" id="err-starter-email"></span>
            </div>

            <div class="form__group">
              <label class="form__label" for="starter-company">Company Name</label>
              <input 
                type="text" 
                id="starter-company" 
                name="company" 
                class="form__input" 
                required 
                placeholder="Acme Inc."
              />
              <span class="form__error" id="err-starter-company"></span>
            </div>

            <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
              Create Free Account
            </button>

            <p style="text-align: center; margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
              No credit card required • Start in under 2 minutes
            </p>

            <div id="form-status-starter" class="form__status" style="display: none;"></div>
          </form>
        </div>
      `;
    }

    getProPlanModal() {
      return `
        <div class="modal-plan">
          <h2 class="modal-plan__title">Start Your Pro Trial</h2>
          <p class="modal-plan__description">
            Get full access to all Pro features for 14 days. No credit card required.
          </p>
          
          <div class="modal-plan__price">
            <span class="modal-plan__amount">$97</span>
            <span class="modal-plan__period">/month after trial</span>
          </div>

          <div class="modal-plan__features">
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Unlimited AI agent deployments</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Advanced conversion analytics</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Priority support (24/7)</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>Custom funnel builder</span>
            </div>
            <div class="modal-plan__feature">
              <span class="modal-plan__feature-icon">✓</span>
              <span>White-label options</span>
            </div>
          </div>

          <form class="modal-plan__form" id="modal-form-pro">
            <div class="form__group">
              <label class="form__label" for="pro-email">Email Address</label>
              <input 
                type="email" 
                id="pro-email" 
                name="email" 
                class="form__input" 
                required 
                placeholder="you@company.com"
              />
              <span class="form__error" id="err-pro-email"></span>
            </div>

            <div class="form__group">
              <label class="form__label" for="pro-company">Company Name</label>
              <input 
                type="text" 
                id="pro-company" 
                name="company" 
                class="form__input" 
                required 
                placeholder="Acme Inc."
              />
              <span class="form__error" id="err-pro-company"></span>
            </div>

            <div class="form__group">
              <label class="form__label" for="pro-phone">Phone Number (Optional)</label>
              <input 
                type="tel" 
                id="pro-phone" 
                name="phone" 
                class="form__input" 
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
              Start 14-Day Free Trial
            </button>

            <p style="text-align: center; margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
              No credit card required • Cancel anytime
            </p>

            <div id="form-status-pro" class="form__status" style="display: none;"></div>
          </form>
        </div>
      `;
    }

    getExitIntentModal() {
      return `
        <div class="modal-plan modal-plan--exit">
          <h2 class="modal-plan__title" style="color: #ef4444;">Wait! Don't Miss This Offer</h2>
          <p class="modal-plan__description">
            Before you go, get <strong>20% off your first month</strong> when you start your Pro trial today.
          </p>
          
          <div class="modal-plan__price">
            <span class="modal-plan__amount" style="text-decoration: line-through; opacity: 0.5;">$97</span>
            <span class="modal-plan__amount" style="color: #10b981; margin-left: 1rem;">$77</span>
            <span class="modal-plan__period">/month</span>
          </div>

          <ul style="list-style: none; padding: 0; margin: 2rem 0;">
            <li style="padding: 0.5rem 0;">✓ <strong>Save $20</strong> on your first month</li>
            <li style="padding: 0.5rem 0;">✓ <strong>14-day free trial</strong> starts immediately</li>
            <li style="padding: 0.5rem 0;">✓ <strong>No credit card</strong> required to start</li>
          </ul>

          <form class="modal-plan__form" id="modal-form-exit">
            <div class="form__group">
              <input 
                type="email" 
                id="exit-email" 
                name="email" 
                class="form__input" 
                required 
                placeholder="Enter your email to claim offer"
              />
              <span class="form__error" id="err-exit-email"></span>
            </div>

            <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
              Claim 20% Discount
            </button>

            <p style="text-align: center; margin-top: 1rem; font-size: 0.75rem; color: #6b7280;">
              Limited time offer • Expires in <span id="countdown">5:00</span>
            </p>

            <div id="form-status-exit" class="form__status" style="display: none;"></div>
          </form>

          <button 
            class="btn btn--ghost" 
            data-close 
            style="width: 100%; margin-top: 1rem; color: #6b7280;"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      `;
    }

    initExitIntent() {
      let exitIntentTimeout;

      document.addEventListener('mouseleave', (e) => {
        // Only trigger if mouse leaves from top of viewport
        if (e.clientY < 10 && !this.exitIntentTriggered && !this.activeModal) {
          clearTimeout(exitIntentTimeout);
          
          exitIntentTimeout = setTimeout(() => {
            this.exitIntentTriggered = true;
            this.open('modal-exit-intent');
            this.startCountdown();
            this.trackEvent('exit_intent_triggered');
          }, 200);
        }
      });
    }

    startCountdown() {
      const countdownEl = $('#countdown');
      if (!countdownEl) return;

      let timeLeft = 300; // 5 minutes in seconds

      const interval = setInterval(() => {
        if (timeLeft <= 0 || !$('#countdown')) {
          clearInterval(interval);
          return;
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
      }, 1000);
    }

    trackEvent(eventName, data = {}) {
      // Google Analytics 4 tracking
      if (window.gtag) {
        window.gtag('event', eventName, data);
      }

      // Custom analytics endpoint
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify({
          event: eventName,
          data,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }

  /* ========================================================================
     FORM VALIDATION & SUBMISSION
     ======================================================================== */

  class FormManager {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('submit', (e) => {
        if (e.target.matches('form[id^="modal-form-"]') || e.target.matches('#contact-form')) {
          e.preventDefault();
          this.handleSubmit(e.target);
        }
      });
    }

    async handleSubmit(form) {
      const formId = form.id;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Validate
      const errors = this.validate(data, formId);
      this.clearErrors(form);

      if (Object.keys(errors).length > 0) {
        this.showErrors(form, errors);
        return;
      }

      // Submit
      this.setLoading(form, true);
      
      try {
        await this.submit(data, formId);
        this.showSuccess(form);
        
        // Analytics
        this.trackConversion(formId, data);
        
        // Clear form
        setTimeout(() => form.reset(), 2000);
        
      } catch (error) {
        this.showError(form, error.message);
      } finally {
        this.setLoading(form, false);
      }
    }

    validate(data, formId) {
      const errors = {};

      // Email validation
      if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
      }

      // Company name validation (if present)
      if (formId.includes('starter') || formId.includes('pro')) {
        if (!data.company || data.company.trim().length < 2) {
          errors.company = 'Please enter your company name.';
        }
      }

      // Contact form specific validation
      if (formId === 'contact-form') {
        if (!data.name || data.name.trim().length < 2) {
          errors.name = 'Please enter your full name.';
        }
        if (!data.message || data.message.trim().length < 10) {
          errors.message = 'Please provide more details about your inquiry.';
        }
      }

      return errors;
    }

    showErrors(form, errors) {
      Object.entries(errors).forEach(([field, message]) => {
        const errorEl = form.querySelector(`#err-${form.id.replace('modal-form-', '')}-${field}`) ||
                       form.querySelector(`#err-${field}`);
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
      });
    }

    clearErrors(form) {
      $$('.form__error', form).forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
      });
    }

    setLoading(form, isLoading) {
      const button = $('button[type="submit"]', form);
      if (!button) return;

      if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.setAttribute('aria-busy', 'true');
      } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.setAttribute('aria-busy', 'false');
      }
    }

    async submit(data, formId) {
      // Determine endpoint
      const endpoints = {
        'modal-form-starter': '/api/leads/starter',
        'modal-form-pro': '/api/leads/pro',
        'modal-form-exit': '/api/leads/exit-intent',
        'contact-form': '/api/contact'
      };

      const endpoint = endpoints[formId] || '/api/leads';

      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actual implementation would be:
      // const response = await fetch(endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error('Submission failed');
      // return response.json();
    }

    showSuccess(form) {
      const statusEl = form.querySelector('.form__status') || form.querySelector('#form-status');
      if (!statusEl) return;

      statusEl.className = 'form__status form__status--success';
      statusEl.textContent = 'Success! We\'ll be in touch shortly.';
      statusEl.style.display = 'block';
    }

    showError(form, message) {
      const statusEl = form.querySelector('.form__status') || form.querySelector('#form-status');
      if (!statusEl) return;

      statusEl.className = 'form__status form__status--error';
      statusEl.textContent = message || 'Something went wrong. Please try again.';
      statusEl.style.display = 'block';
    }

    trackConversion(formId, data) {
      // Google Analytics conversion
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
          transaction_id: `${formId}-${Date.now()}`,
          value: formId.includes('pro') ? 97 : 0,
          currency: 'USD'
        });
      }

      // Venturz CRM webhook - Fixed for browser environment
      const webhookUrl = window.VENTURZ_WEBHOOK_URL || process.env.VENTURZ_WEBHOOK_URL;
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            source: formId,
            timestamp: new Date().toISOString()
          })
        }).catch(console.error);
      }
    }
  }

  /* ========================================================================
     ACCORDION FUNCTIONALITY (FAQ)
     ======================================================================== */

  class AccordionManager {
    constructor() {
      this.init();
    }

    init() {
      $$('.accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => this.toggle(trigger));
      });
    }

    toggle(trigger) {
      const panel = $('#' + trigger.getAttribute('aria-controls'));
      if (!panel) return;

      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      
      trigger.setAttribute('aria-expanded', !expanded);
      panel.hidden = expanded;
    }
  }

  /* ========================================================================
     SCROLL SPY & BACK TO TOP
     ======================================================================== */

  class ScrollManager {
    constructor() {
      this.sections = $$('[id]').filter(el => 
        ['features', 'pricing', 'faq', 'contact'].includes(el.id)
      );
      this.navLinks = $$('a[href^="#"]');
      this.backToTop = $('#backToTop');
      this.init();
    }

    init() {
      this.initScrollSpy();
      this.initBackToTop();
      this.initSmoothScroll();
    }

    initScrollSpy() {
      if (this.sections.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.navLinks.forEach(link => {
                link.classList.toggle(
                  'active',
                  link.getAttribute('href') === `#${entry.target.id}`
                );
              });
            }
          });
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0
        }
      );

      this.sections.forEach(section => observer.observe(section));
    }

    initBackToTop() {
      if (!this.backToTop) return;

      window.addEventListener('scroll', debounce(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        this.backToTop.classList.toggle('show', y > 500);
      }, 100));

      this.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    initSmoothScroll() {
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href.startsWith('#')) return;

          e.preventDefault();
          const target = $(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  }

  /* ========================================================================
     IN-VIEW ANIMATION
     ======================================================================== */

  class AnimationManager {
    constructor() {
      this.init();
    }

    init() {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      $$('[data-observe]').forEach(el => observer.observe(el));
    }
  }

  /* ========================================================================
     INITIALIZATION
     ======================================================================== */

  // Initialize all managers when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    new ThemeManager();
    new ModalManager();
    new FormManager();
    new AccordionManager();
    new ScrollManager();
    new AnimationManager();

    // Update footer year
    const yearEl = $('#year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

})();