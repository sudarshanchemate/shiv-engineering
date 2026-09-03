/* =========================================================
   SHIV ENGINEERING — site scripts
   =========================================================
   >>> STEP 1: EDIT THESE DETAILS AND THE WHOLE SITE UPDATES <<<
   Every phone link, WhatsApp button, email link, address and
   service area on the page is filled in from this one object.
   ========================================================= */
const SITE = {
  // Phone number for the "Call Now" buttons.
  // Use full international format for `phoneDial` (no spaces, no brackets).
  phoneDial: '+910000000000',
  phoneDisplay: '+91 00000 00000',

  // WhatsApp number in international format WITHOUT '+' or spaces.
  // Example for India: '919876543210'
  whatsappNumber: '910000000000',
  whatsappDisplay: '+91 00000 00000',

  // Pre-filled message when someone taps a WhatsApp button.
  whatsappMessage: 'Hello Shiv Engineering, I need assistance regarding my DG set. Please contact me.',

  email: 'info@shivengineering.in',
  emailSubject: 'DG Set Enquiry — Shiv Engineering',

  address: '[Your business address]',
  serviceArea: '[Your service area / city / districts]'
};

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------------------------------------------------
     1. Inject contact details everywhere
     --------------------------------------------------------- */
  const waBase = 'https://wa.me/' + SITE.whatsappNumber;
  const waLink = waBase + '?text=' + encodeURIComponent(SITE.whatsappMessage);

  $$('[data-phone-link]').forEach(el => { el.href = 'tel:' + SITE.phoneDial; });
  $$('[data-phone-text]').forEach(el => { el.textContent = SITE.phoneDisplay; });

  $$('[data-whatsapp-link]').forEach(el => {
    el.href = waLink;
    el.target = '_blank';
    el.rel = 'noopener';
  });
  $$('[data-whatsapp-text]').forEach(el => { el.textContent = SITE.whatsappDisplay; });

  $$('[data-email-link]').forEach(el => {
    el.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(SITE.emailSubject);
  });
  $$('[data-email-text]').forEach(el => { el.textContent = SITE.email; });

  $$('[data-address-text]').forEach(el => { el.textContent = SITE.address; });
  $$('[data-area-text]').forEach(el => { el.textContent = SITE.serviceArea; });

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     2. Mobile navigation
     --------------------------------------------------------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    });

    $$('a', nav).forEach(a => a.addEventListener('click', closeNav));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------------------------------------------------------
     3. Sticky header shadow
     --------------------------------------------------------- */
  const header = $('#header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     4. Scroll reveal + animated counters
     --------------------------------------------------------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    const duration = 1100;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const revealItems = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
        const delay = Math.min(siblings.indexOf(el), 5) * 70;
        setTimeout(() => {
          el.classList.add('is-visible');
          const num = el.querySelector('[data-count]');
          if (num) countUp(num);
        }, delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------
     5. Nav scroll-spy
     --------------------------------------------------------- */
  const navLinks = $$('.nav a[href^="#"]:not(.btn)');
  const sections = navLinks
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => spy.observe(section));
  }

  /* ---------------------------------------------------------
     6. Quote form -> WhatsApp enquiry
     ---------------------------------------------------------
     The site is static (no server), so the form composes the
     enquiry and hands it to WhatsApp. To email the enquiry to
     a server instead, replace the submit handler with a POST
     to your backend or a form service (Formspree, Web3Forms).
     --------------------------------------------------------- */
  const form = $('#quoteForm');
  const status = $('#formStatus');

  const validators = {
    name: v => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    mobile: v => (/^[+\d][\d\s-]{8,15}$/.test(v.trim()) ? '' : 'Enter a valid mobile number.'),
    location: v => (v.trim().length >= 2 ? '' : 'Please enter your city or site location.'),
    service: v => (v ? '' : 'Please select the service you need.')
  };

  function validateField(field) {
    const rule = validators[field.name];
    if (!rule) return true;
    const msg = rule(field.value);
    const wrap = field.closest('.field');
    const errEl = wrap ? wrap.querySelector('[data-error-for="' + field.name + '"]') : null;
    if (wrap) wrap.classList.toggle('has-error', Boolean(msg));
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  if (form) {
    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const wrap = field.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (status) { status.textContent = ''; status.classList.remove('is-error'); }

      let firstInvalid = null;
      Object.keys(validators).forEach(name => {
        const field = form.elements[name];
        if (field && !validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (status) {
          status.textContent = 'Please complete the highlighted fields.';
          status.classList.add('is-error');
        }
        return;
      }

      const val = n => (form.elements[n] && form.elements[n].value.trim()) || '—';
      const lines = [
        'New DG enquiry — Shiv Engineering',
        '',
        'Name: ' + val('name'),
        'Company: ' + val('company'),
        'Mobile: ' + val('mobile'),
        'Location: ' + val('location'),
        'DG Brand: ' + val('brand'),
        'DG Capacity: ' + val('capacity'),
        'Required Service: ' + val('service'),
        '',
        'Message: ' + val('message')
      ];

      const url = waBase + '?text=' + encodeURIComponent(lines.join('\n'));
      const win = window.open(url, '_blank', 'noopener');

      if (status) {
        status.textContent = win
          ? 'Opening WhatsApp with your enquiry…'
          : 'Please allow pop-ups, or contact us on ' + SITE.phoneDisplay + '.';
        status.classList.toggle('is-error', !win);
      }
      if (win) form.reset();
    });
  }
})();
