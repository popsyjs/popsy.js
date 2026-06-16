/**
 * ╔═══════════════════════════════════════════╗
 * ║         Popsy.js — Tooltip 💬             ║
 * ╚═══════════════════════════════════════════╝
 *
 * Attaches a lightweight tooltip to any element.
 * No dependencies needed.
 *
 * ─── HOW TO USE ──────────────────────────────
 *
 *  <script src="https://cdn.jsdelivr.net/gh/popsyjs/popsy.js@main/popsy.js"></script>
 *
 * ─── BASIC ───────────────────────────────────
 *
 *  Popsy.tooltip('#myBtn', 'Hello!')
 *
 * ─── WITH OPTIONS ────────────────────────────
 *
 *  Popsy.tooltip('#myBtn', 'Hello!', {
 *    position: 'top',       // 'top' | 'bottom' | 'left' | 'right'  (default: 'top')
 *    bg:       '#18181b',   // background color                       (default: '#18181b')
 *    color:    '#ffffff',   // text color                             (default: '#ffffff')
 *    delay:    0            // show delay in ms                       (default: 0)
 *  })
 *
 * ─── EXAMPLES ────────────────────────────────
 *
 *  // Basic top tooltip
 *  Popsy.tooltip('#saveBtn', 'Save your changes')
 *
 *  // Bottom positioned
 *  Popsy.tooltip('#icon', 'Click to expand', { position: 'bottom' })
 *
 *  // Custom colors
 *  Popsy.tooltip('#badge', 'Pro feature', { bg: '#6366f1', color: '#fff' })
 *
 *  // With delay
 *  Popsy.tooltip('#avatar', 'Your profile', { delay: 300 })
 *
 *  // Works with any element
 *  Popsy.tooltip(document.querySelector('.icon'), 'Settings', { position: 'right' })
 *
 * ─────────────────────────────────────────────
 */

Popsy.tooltip = function (target, text, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const position = options.position || 'top';
  const bg = options.bg || '#18181b';
  const color = options.color || '#ffffff';
  const delay = options.delay || 0;

  let tip = null;
  let showTimer = null;

  const show = () => {
    showTimer = setTimeout(() => {
      tip = document.createElement('div');
      tip.textContent = text;
      tip.style.cssText = `
        position:fixed; z-index:9999;
        background:${bg}; color:${color};
        padding:6px 12px; border-radius:6px;
        font-size:13px; font-family:sans-serif; font-weight:500;
        white-space:nowrap; pointer-events:none;
        opacity:0; transition:opacity 0.15s ease;
        box-shadow:0 4px 12px rgba(0,0,0,0.25);
      `;
      document.body.appendChild(tip);

      const rect = el.getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const gap = 8;

      let top, left;
      if (position === 'bottom') {
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tw / 2;
      } else if (position === 'left') {
        top = rect.top + rect.height / 2 - th / 2;
        left = rect.left - tw - gap;
      } else if (position === 'right') {
        top = rect.top + rect.height / 2 - th / 2;
        left = rect.right + gap;
      } else {
        top = rect.top - th - gap;
        left = rect.left + rect.width / 2 - tw / 2;
      }

      tip.style.top = top + 'px';
      tip.style.left = left + 'px';
      requestAnimationFrame(() => { tip.style.opacity = '1'; });
    }, delay);
  };

  const hide = () => {
    clearTimeout(showTimer);
    if (tip) {
      tip.style.opacity = '0';
      const t = tip;
      setTimeout(() => { t.remove(); }, 150);
      tip = null;
    }
  };

  el.addEventListener('mouseenter', show);
  el.addEventListener('mouseleave', hide);
  el.addEventListener('click', hide);
};
