/**
 * ╔═══════════════════════════════════════════╗
 * ║         Popsy.js — Confetti 🎉            ║
 * ╚═══════════════════════════════════════════╝
 *
 * Launches a confetti burst from the center of the screen.
 * No dependencies needed.
 *
 * ─── HOW TO USE ──────────────────────────────
 *
 *  <script src="https://cdn.jsdelivr.net/gh/popsyjs/popsy.js@main/popsy.js"></script>
 *
 * ─── BASIC ───────────────────────────────────
 *
 *  Popsy.confetti()
 *
 * ─── WITH OPTIONS ────────────────────────────
 *
 *  Popsy.confetti({
 *    count:  120,                          // number of dots   (default: 80)
 *    colors: ['#f00', '#0f0', '#00f']      // custom colors    (default: rainbow)
 *  })
 *
 * ─── EXAMPLES ────────────────────────────────
 *
 *  // On button click
 *  <button onclick="Popsy.confetti()">🎉 Celebrate</button>
 *
 *  // On page load
 *  window.onload = () => Popsy.confetti()
 *
 *  // Custom colors only
 *  Popsy.confetti({ colors: ['#ff6b6b', '#ffd93d', '#6bcb77'] })
 *
 *  // More dots
 *  Popsy.confetti({ count: 200 })
 *
 * ─────────────────────────────────────────────
 */

Popsy.confetti = function (options = {}) {
  const count = options.count || 80;
  const colors = options.colors || ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 8 + 5;
    dot.style.cssText = `
      position:fixed; top:50%; left:50%;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:50%; pointer-events:none; z-index:9999;
    `;
    document.body.appendChild(dot);
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 300 + 100;
    dot.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`, opacity: 0 }
    ], { duration: 1000 + Math.random() * 500, easing: 'ease-out' }).onfinish = () => dot.remove();
  }
};
