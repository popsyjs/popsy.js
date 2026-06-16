/**
 * ╔═══════════════════════════════════════════╗
 * ║          Popsy.js — Toast 🔔              ║
 * ╚═══════════════════════════════════════════╝
 *
 * Shows a notification toast in the bottom-right corner.
 * No dependencies needed.
 *
 * ─── HOW TO USE ──────────────────────────────
 *
 *  <script src="https://cdn.jsdelivr.net/gh/popsyjs/popsy.js@latest/popsy.js"></script>
 *
 * ─── BASIC ───────────────────────────────────
 *
 *  Popsy.toast('Hello!')
 *
 * ─── WITH OPTIONS ────────────────────────────
 *
 *  Popsy.toast('Message', {
 *    type:     'success',   // 'success' | 'error' | 'info'   (default: 'success')
 *    duration:  3000        // time in ms before it hides      (default: 3000)
 *  })
 *
 * ─── EXAMPLES ────────────────────────────────
 *
 *  // Green success toast
 *  Popsy.toast('Saved successfully!')
 *
 *  // Red error toast
 *  Popsy.toast('Something went wrong', { type: 'error' })
 *
 *  // Blue info toast
 *  Popsy.toast('Did you know?', { type: 'info' })
 *
 *  // Stays for 6 seconds
 *  Popsy.toast('Welcome back!', { duration: 6000 })
 *
 *  // On form submit
 *  form.addEventListener('submit', () => {
 *    Popsy.toast('Form submitted!', { type: 'success' })
 *  })
 *
 * ─────────────────────────────────────────────
 */

Popsy.toast = function (message, options = {}) {
  const type = options.type || 'success';
  const duration = options.duration || 3000;
  const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:30px; right:30px;
    background:${colors[type] || colors.success};
    color:#fff; padding:12px 22px; border-radius:8px;
    font-size:15px; font-family:sans-serif;
    box-shadow:0 4px 15px rgba(0,0,0,0.2);
    opacity:0; transition:opacity 0.3s ease; z-index:9999;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = 1; }, 20);
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 300);
  }, duration);
};
