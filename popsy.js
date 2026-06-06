const Popsy = {};

// ── SMOOTH SCROLL ─────────────────────────────────────────
// Requires Lenis CDN loaded before popsy.js
// Usage: Popsy.smoothScroll()
Popsy.smoothScroll = function() {
  if (typeof Lenis === 'undefined') {
    console.warn('Popsy: Lenis not loaded! Add Lenis CDN before popsy.js');
    return;
  }
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};


// ── CUSTOM CURSOR ─────────────────────────────────────────
// No dependency needed
// Usage: Popsy.cursor()
// Usage: Popsy.cursor({ color: '#ff6b6b', size: 20 })
Popsy.cursor = function(options = {}) {
  const color = options.color || '#ff6b6b';
  const size  = options.size  || 20;

  // hide default cursor
  document.body.style.cursor = 'none';

  const dot = document.createElement('div');
  dot.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, opacity 0.3s ease;
  `;
  document.body.appendChild(dot);

  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  // scale up on hover over buttons/links
  document.querySelectorAll('a, button').forEach(el => {
    el.style.cursor = 'none';
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
};


// ── CONFETTI ──────────────────────────────────────────────
// No dependency needed
// Usage: Popsy.confetti()
// Usage: Popsy.confetti({ count: 120, colors: ['#f00', '#0f0'] })
Popsy.confetti = function(options = {}) {
  const count  = options.count  || 80;
  const colors = options.colors || ['#f00','#0f0','#00f','#ff0','#f0f','#0ff'];

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 8 + 5;
    dot.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(dot);

    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 300 + 100;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    dot.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 500,
      easing: 'ease-out'
    }).onfinish = () => dot.remove();
  }
};


// ── TOAST ─────────────────────────────────────────────────
// No dependency needed
// Usage: Popsy.toast('Saved!')
// Usage: Popsy.toast('Error!', { type: 'error' })
// Usage: Popsy.toast('Info!',  { type: 'info', duration: 5000 })
Popsy.toast = function(message, options = {}) {
  const type     = options.type     || 'success';
  const duration = options.duration || 3000;
  const colors   = {
    success: '#22c55e',
    error:   '#ef4444',
    info:    '#3b82f6'
  };

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px; right: 30px;
    background: ${colors[type] || colors.success};
    color: #fff;
    padding: 12px 22px;
    border-radius: 8px;
    font-size: 15px;
    font-family: sans-serif;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 9999;
  `;
  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = 1; }, 20);
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 300);
  }, duration);
};
