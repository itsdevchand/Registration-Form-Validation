/* ================================================================

   CONTENTS:
   1. DOM references
   2. Password show/hide toggle
   3. Real-time validation (on blur + on input)
   4. Password strength meter
   5. Form submit handler (with simulated async)
   6. Init
   ================================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. DOM REFERENCES
  --------------------------------------------------------------- */

  const form            = document.getElementById('registrationForm');
  const successMessage  = document.getElementById('successMessage');
  const submitBtn       = document.getElementById('submitBtn');

  // Text / Email / Password inputs
  const fields = {
    firstName:       document.getElementById('firstName'),
    lastName:        document.getElementById('lastName'),
    username:        document.getElementById('username'),
    email:           document.getElementById('email'),
    password:        document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    tos:             document.getElementById('tos'),
  };

  // Error message elements
  const errors = {
    firstName:       document.getElementById('firstName-error'),
    lastName:        document.getElementById('lastName-error'),
    username:        document.getElementById('username-error'),
    email:           document.getElementById('email-error'),
    password:        document.getElementById('password-error'),
    confirmPassword: document.getElementById('confirm-error'),
    tos:             document.getElementById('tos-error'),
  };

  // Password strength meter
  const pwBars         = Array.from(document.querySelectorAll('.pw-bar'));
  const pwStrengthLabel = document.getElementById('pwStrengthLabel');

  // Password toggle buttons
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirm  = document.getElementById('toggleConfirm');

  // Shorthand
  const V = window.Validator;

  /* ---------------------------------------------------------------
     2. PASSWORD SHOW / HIDE TOGGLE
  --------------------------------------------------------------- */

  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;

    btn.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Swap icons
      const iconEye    = btn.querySelector('.icon-eye');
      const iconEyeOff = btn.querySelector('.icon-eye-off');
      iconEye.classList.toggle('hidden',  !isPassword);
      iconEyeOff.classList.toggle('hidden', isPassword);

      // Update aria-label
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

      // Return focus to the input for accessibility
      input.focus();
    });
  }

  /* ---------------------------------------------------------------
     3. REAL-TIME VALIDATION HELPERS
  --------------------------------------------------------------- */

  /**
   * Validate a single field and update its UI.
   * Returns true if valid.
   */
  function validateField(name) {
    let result;
    const Vld = V.Validators;

    switch (name) {
      case 'firstName':
        result = Vld.required(fields.firstName.value, 'First name');
        V.applyFieldState(fields.firstName, errors.firstName, result);
        break;

      case 'lastName':
        result = Vld.required(fields.lastName.value, 'Last name');
        V.applyFieldState(fields.lastName, errors.lastName, result);
        break;

      case 'username':
        result = Vld.username(fields.username.value);
        V.applyFieldState(fields.username, errors.username, result);
        break;

      case 'email':
        result = Vld.email(fields.email.value);
        V.applyFieldState(fields.email, errors.email, result);
        break;

      case 'password':
        result = Vld.password(fields.password.value);
        V.applyFieldState(fields.password, errors.password, result);
        // Also re-validate confirm when password changes
        if (fields.confirmPassword.value.length > 0) {
          validateField('confirmPassword');
        }
        break;

      case 'confirmPassword':
        result = Vld.confirmPassword(fields.confirmPassword.value, fields.password.value);
        V.applyFieldState(fields.confirmPassword, errors.confirmPassword, result);
        break;

      case 'tos':
        result = Vld.checked(fields.tos, 'You must accept the terms to continue.');
        // TOS has no input-wrap, manage class on the checkbox itself
        errors.tos.textContent = result.valid ? '' : result.message;
        errors.tos.classList.toggle('visible', !result.valid);
        break;

      default:
        return true;
    }

    return result ? result.valid : true;
  }

  /* ---------------------------------------------------------------
     4. PASSWORD STRENGTH METER
  --------------------------------------------------------------- */

  function handlePasswordStrength() {
    const score = V.scorePassword(fields.password.value);
    V.updateStrengthMeter(score, pwBars, pwStrengthLabel);
  }

  /* ---------------------------------------------------------------
     5. FORM SUBMIT HANDLER
  --------------------------------------------------------------- */

  /**
   * Validate all fields.
   * Returns true only when every field passes.
   */
  function validateAll() {
    const fieldNames = ['firstName','lastName','username','email','password','confirmPassword','tos'];
    // Run all — don't short-circuit so every error is shown at once
    const results = fieldNames.map(name => validateField(name));
    return results.every(Boolean);
  }

  /**
   * Collect form data into a plain object (for logging / API).
   */
  function collectFormData() {
    const interests = Array.from(
      document.querySelectorAll('input[name="interests"]:checked')
    ).map(el => el.value);

    const gender = (document.querySelector('input[name="gender"]:checked') || {}).value || null;

    return {
      firstName:   fields.firstName.value.trim(),
      lastName:    fields.lastName.value.trim(),
      username:    fields.username.value.trim(),
      email:       fields.email.value.trim().toLowerCase(),
      gender,
      interests,
      newsletter:  document.getElementById('newsletter').checked,
    };
  }

  /**
   * Simulate an async API call (replace with real fetch in production).
   * @returns {Promise<{ success: boolean }>}
   */
  function submitToAPI(data) {
    console.log('[Form] Submitting:', data);
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true }), 1400);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateAll()) {
      // Scroll to first error
      const firstError = form.querySelector('.is-error, .error-msg.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the closest input for accessibility
        const input = firstError.closest('.form-group')?.querySelector('input');
        if (input) input.focus();
      }
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.setAttribute('aria-busy', 'true');

    try {
      const data = collectFormData();
      const response = await submitToAPI(data);

      if (response.success) {
        // Hide form, show success
        form.classList.add('hidden');
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        successMessage.focus();
      } else {
        throw new Error('Server returned failure.');
      }
    } catch (err) {
      console.error('[Form] Submission error:', err);
      // Re-enable button and show generic error
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.setAttribute('aria-busy', 'false');
      alert('Something went wrong. Please try again.');
    }
  }

  /* ---------------------------------------------------------------
     6. INIT — Attach all event listeners
  --------------------------------------------------------------- */

  function init() {
    if (!form) {
      console.warn('[Form] Registration form not found in DOM.');
      return;
    }

    /* --- Password toggles --- */
    setupPasswordToggle(togglePassword, fields.password);
    setupPasswordToggle(toggleConfirm,  fields.confirmPassword);

    /* --- Real-time validation: blur (leave field) --- */
    ['firstName','lastName','username','email','password','confirmPassword'].forEach(name => {
      const input = fields[name];
      if (!input) return;

      input.addEventListener('blur', () => validateField(name));
    });

    /* --- Password confirm: also validate on input after first touch --- */
    let confirmTouched = false;
    fields.confirmPassword.addEventListener('blur', () => { confirmTouched = true; });
    fields.confirmPassword.addEventListener('input', () => {
      if (confirmTouched) validateField('confirmPassword');
    });

    /* --- Password strength on every keystroke --- */
    fields.password.addEventListener('input', handlePasswordStrength);

    /* --- TOS checkbox: validate on change --- */
    fields.tos.addEventListener('change', () => validateField('tos'));

    /* --- Form submit --- */
    form.addEventListener('submit', handleSubmit);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
