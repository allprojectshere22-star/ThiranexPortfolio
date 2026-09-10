// Mobile nav toggle — keeps aria-expanded in sync for screen reader users
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu when a link is chosen
  nav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Accessible contact form validation — no page reload, errors announced via
// aria-live regions tied to each field with aria-describedby.
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  const fields = {
    name: {
      el: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (v) => v.trim().length > 1 || 'Enter your full name.'
    },
    email: {
      el: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.'
    },
    message: {
      el: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (v) => v.trim().length > 9 || 'Message should be at least 10 characters.'
    }
  };

  function validateField(field) {
    const result = field.validate(field.el.value);
    const ok = result === true;
    field.el.setAttribute('aria-invalid', String(!ok));
    field.error.textContent = ok ? '' : result;
    return ok;
  }

  Object.values(fields).forEach((field) => {
    field.el.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const results = Object.values(fields).map(validateField);
    const allValid = results.every(Boolean);

    status.classList.remove('success');
    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('is-visible');
      const firstInvalid = Object.values(fields).find(
        (f) => f.el.getAttribute('aria-invalid') === 'true'
      );
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    status.textContent = 'Thanks — your message is ready to send. Your email app should open next.';
    status.classList.add('is-visible', 'success');

    const subject = encodeURIComponent('Portfolio contact from ' + fields.name.el.value.trim());
    const body = encodeURIComponent(fields.message.el.value.trim() + '\n\n— ' + fields.name.el.value.trim() + ' (' + fields.email.el.value.trim() + ')');
    window.location.href = 'mailto:fedoranissi@gmail.com?subject=' + subject + '&body=' + body;

    form.reset();
  });
})();
