const Popsy = {};

// ── CONFETTI ──────────────────────────────────────────────
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

// ── TOAST ─────────────────────────────────────────────────
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



// ── Copy Button ─────────────────────────────────────────────────

// ── TOOLTIP ───────────────────────────────────────────────

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



// ── Copy Button ─────────────────────────────────────────────────

Popsy.copy = function (options = {}) {
  const presets = {
    default: { bg: '#18181b', color: '#ffffff', radius: '6px', fontSize: '13px', fontFamily: 'sans-serif', padding: '6px 14px', icon: true },
    api: { bg: '#0f172a', color: '#94a3b8', radius: '6px', fontSize: '13px', fontFamily: 'monospace', padding: '6px 14px', icon: true },
    simple: { bg: 'transparent', color: '#6366f1', radius: '4px', fontSize: '13px', fontFamily: 'sans-serif', padding: '4px 6px', icon: false },
  };

  const preset = presets[options.preset] || presets.default;
  const value = options.value || '';
  const label = options.label || 'Copy';
  const copied = options.copied || 'Copied!';
  const duration = options.duration || 2000;

  const bg = options.bg || preset.bg;
  const color = options.color || preset.color;
  const radius = options.radius || preset.radius;
  const fontSize = options.fontSize || preset.fontSize;

  const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`;

  const btn = document.createElement('button');
  btn.style.cssText = `
    display: inline-flex; align-items: center; gap: 6px;
    padding: ${preset.padding};
    background: ${bg}; color: ${color};
    border: ${options.preset === 'simple' ? `1px solid transparent` : 'none'};
    border-radius: ${radius};
    font-size: ${fontSize}; font-family: ${preset.fontFamily}; font-weight: 500;
    cursor: pointer; user-select: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
    ${options.preset !== 'simple' ? 'box-shadow: 0 1px 4px rgba(0,0,0,0.18);' : ''}
  `;

  const renderLabel = (icon, text) => {
    btn.innerHTML = '';
    if (preset.icon) {
      const iconEl = document.createElement('span');
      iconEl.innerHTML = icon;
      btn.appendChild(iconEl);
    }
    const textEl = document.createElement('span');
    textEl.textContent = text;
    btn.appendChild(textEl);
  };

  renderLabel(iconSVG, label);

  btn.onmouseenter = () => { btn.style.opacity = '0.82'; };
  btn.onmouseleave = () => { btn.style.opacity = '1'; };
  btn.onmousedown = () => { btn.style.transform = 'scale(0.95)'; };
  btn.onmouseup = () => { btn.style.transform = 'scale(1)'; };

  btn.onclick = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      renderLabel(checkSVG, copied);
      btn.style.opacity = '0.7';
      setTimeout(() => {
        renderLabel(iconSVG, label);
        btn.style.opacity = '1';
      }, duration);
    });
  };

  const target = options.target
    ? (typeof options.target === 'string' ? document.querySelector(options.target) : options.target)
    : null;

  if (target) target.appendChild(btn);

  return btn;
};