# 📝 — Registration Form

A fully featured, accessible user registration form built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no dependencies.

---

## 🚀 Live Demo

Open `index.html` directly in your browser — no build step needed.

---

## 📁 Project Structure

```
registration-form/
│
├── index.html          # Main HTML — semantic structure, ARIA attributes
│
├── css/
│   └── style.css       # All styling — tokens, layout, components, responsive
│
├── js/
│   ├── validation.js   # Validation module (pure functions + UI helpers)
│   └── main.js         # Form controller (events, submit, strength meter)
│
└── README.md
```

---

## ✨ Features

### Input Types Used
| Type | Used For |
|------|----------|
| `type="text"` | First name, last name, username |
| `type="email"` | Email address |
| `type="password"` | Password + confirm password |
| `type="radio"` | Gender selection (pill style) |
| `type="checkbox"` | Interests, Terms of Service, Newsletter |

### Validation
- **Required field** checks for name, username, email, password, confirm password, and TOS
- **Username** — 3–20 chars, letters/numbers/underscores only (regex)
- **Email** — RFC-pattern format check
- **Password** — minimum 8 characters
- **Confirm password** — cross-field match check
- **On blur** (when you leave a field) + **on submit** (all at once)
- First error auto-scrolls into view and receives focus

### Password Strength Meter
Four-bar indicator scores the password against:
1. Length ≥ 8 characters
2. Contains uppercase letter
3. Contains a number
4. Contains a special character (`!@#$%` etc.)

### UX Details
- Show/hide password toggle with accessible `aria-label` updates
- Loading spinner on submit button during async call
- Success state replaces the form on completion
- Smooth scroll to first error on failed submit

### Accessibility (a11y)
- All inputs linked to labels via `for` / `id`
- `aria-required`, `aria-describedby` on every required input
- `role="alert"` on error messages (announced by screen readers)
- `aria-live="polite"` on password strength meter
- Keyboard-navigable radio/checkbox groups with `:focus-visible` rings
- `<fieldset>` + `<legend>` for grouped controls
- Reduced-motion media query applied

### Responsive Design
- **Desktop** — two-column split (branding left, form right)
- **Tablet (≤ 900px)** — single column, branding collapses to header
- **Mobile (≤ 560px)** — stacked name fields, single-column checkboxes

---

## 🛠 How to Modify

### Change the color accent
In `css/style.css`, find `:root` and update `--color-accent`:
```css
:root {
  --color-accent: #6c63ff; /* ← change this */
}
```

### Connect to a real API
In `js/main.js`, replace the `submitToAPI` function:
```js
async function submitToAPI(data) {
  const response = await fetch('https://your-api.com/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### Add a new field
1. Add the `<input>` in `index.html` with a unique `id`, `name`, and `aria-describedby`
2. Add a validator case in `js/validation.js` under `Validators`
3. Reference it in `js/main.js` inside `validateAll()` and attach blur/input listeners

---

## 🧪 Testing Checklist

- [ ] Submit empty form → all errors appear
- [ ] Fill valid data → form submits, success message appears
- [ ] Mismatched passwords → inline error on confirm field
- [ ] Weak / strong password → strength meter updates live
- [ ] Tab through all fields → focus rings visible
- [ ] Screen reader → errors announced on field blur
- [ ] Mobile viewport → layout is single-column and usable

---

## 📚 Concepts Practiced

- HTML form semantics (`<form>`, `<fieldset>`, `<legend>`, input types)
- CSS custom properties (design tokens)
- CSS Grid & Flexbox layout
- Vanilla JS module pattern (IIFE)
- DOM manipulation without jQuery
- Form validation — both real-time and on-submit
- Async/await with error handling
- ARIA roles and attributes for accessibility
- Responsive design with media queries

---

## 📄 License

MIT — free to use, modify, and share.
