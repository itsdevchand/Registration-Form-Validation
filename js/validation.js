/* ================================================================
   validation.js — Form Validation Module
   100 Days of Code Challenge · Day 01
   ================================================================

   CONTENTS:
   1. Validators — pure functions that return { valid, message }
   2. Field state updater — applies CSS classes + shows/hides errors
   3. Export object: window.Validator
   ================================================================ */

(function (global) {
  'use strict';

  /* ---------------------------------------------------------------
     1. VALIDATORS
     Pure functions: accept a value, return { valid: bool, message: string }
  --------------------------------------------------------------- */

  const Validators = {

    /** Non-empty string */
    required(value, label) {
      const trimmed = value.trim();
      return trimmed.length > 0
        ? { valid: true }
        : { valid: false, message: `${label} is required.` };
    },

    /** Username: 3–20 chars, alphanumeric + underscore */
    username(value) {
      const trimmed = value.trim();
      if (trimmed.length === 0) return { valid: false, message: 'Username is required.' };
      if (trimmed.length < 3)   return { valid: false, message: 'Username must be at least 3 characters.' };
      if (trimmed.length > 20)  return { valid: false, message: 'Username must be 20 characters or fewer.' };
      if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return { valid: false, message: 'Username may only contain letters, numbers, and underscores.' };
      }
      return { valid: true };
    },

    /** Email format validation */
    email(value) {
      const trimmed = value.trim();
      if (trimmed.length === 0) return { valid: false, message: 'Email address is required.' };
      // RFC 5322-inspired (practical subset)
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return re.test(trimmed)
        ? { valid: true }
        : { valid: false, message: 'Enter a valid email address (e.g. jane@example.com).' };
    },

    /** Password: minimum 8 characters */
    password(value) {
      if (value.length === 0) return { valid: false, message: 'Password is required.' };
      if (value.length < 8)   return { valid: false, message: 'Password must be at least 8 characters.' };
      return { valid: true };
    },

    /** Confirm password must match */
    confirmPassword(value, original) {
      if (value.length === 0) return { valid: false, message: 'Please confirm your password.' };
      return value === original
        ? { valid: true }
        : { valid: false, message: 'Passwords do not match.' };
    },

    /** Checkbox must be checked */
    checked(element, message) {
      return element.checked
        ? { valid: true }
        : { valid: false, message };
    },

  };

  /* ---------------------------------------------------------------
     2. PASSWORD STRENGTH SCORER
     Returns 0–4 based on criteria met
  --------------------------------------------------------------- */

  function scorePassword(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8)          score++; // length
    if (/[A-Z]/.test(password))        score++; // uppercase
    if (/[0-9]/.test(password))        score++; // number
    if (/[^A-Za-z0-9]/.test(password)) score++; // special char
    return score;
  }

  const STRENGTH_LEVELS = [
    { label: 'Too weak',  className: 'level-1', barClass: 'strength-1', barsLit: 1 },
    { label: 'Fair',      className: 'level-2', barClass: 'strength-2', barsLit: 2 },
    { label: 'Good',      className: 'level-3', barClass: 'strength-3', barsLit: 3 },
    { label: 'Strong',    className: 'level-4', barClass: 'strength-4', barsLit: 4 },
  ];

  /* ---------------------------------------------------------------
     3. FIELD UI HELPERS
  --------------------------------------------------------------- */

  /**
   * Apply valid/error state to a field.
   * @param {HTMLInputElement} input
   * @param {HTMLElement}      errorEl  — the .error-msg element
   * @param {{ valid: boolean, message?: string }} result
   */
  function applyFieldState(input, errorEl, result) {
    input.classList.toggle('is-valid',  result.valid);
    input.classList.toggle('is-error', !result.valid);

    if (errorEl) {
      errorEl.textContent = result.valid ? '' : (result.message || '');
      errorEl.classList.toggle('visible', !result.valid);
    }
  }

  /**
   * Update the password strength meter UI.
   * @param {number} score   — 0–4
   * @param {HTMLElement[]} bars
   * @param {HTMLElement}   label
   */
  function updateStrengthMeter(score, bars, label) {
    const level = STRENGTH_LEVELS[score - 1]; // undefined when score === 0

    bars.forEach((bar, i) => {
      // Remove all strength classes first
      bar.classList.remove('strength-1','strength-2','strength-3','strength-4');
      if (level && i < level.barsLit) {
        bar.classList.add(level.barClass);
      }
    });

    // Reset label classes
    label.classList.remove('level-1','level-2','level-3','level-4');
    if (score === 0) {
      label.textContent = 'Enter a password';
    } else {
      label.classList.add(level.className);
      label.textContent = level.label;
    }
  }

  /* ---------------------------------------------------------------
     4. EXPORT
  --------------------------------------------------------------- */

  global.Validator = {
    Validators,
    scorePassword,
    updateStrengthMeter,
    applyFieldState,
  };

}(window));
