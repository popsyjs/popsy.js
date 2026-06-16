/**
 * ╔═══════════════════════════════════════════╗
 * ║          Popsy.js — Copy Button📋         ║
 * ╚═══════════════════════════════════════════╝
 *
 * Creates a styled copy button and injects it into any container.
 * Three presets: 'default', 'api', 'simple'  — all fully customizable.
 * No dependencies needed.
 *
 * ─── HOW TO USE ──────────────────────────────
 *
 *  <script src="https://cdn.jsdelivr.net/gh/popsyjs/popsy.js@latest/popsy.js"></script>
 *
 *  <div id="target"></div>
 *  <script>
 *    Popsy.copy({ value: 'Hello!', target: '#target' })
 *  </script>
 *
 * ─── PRESETS ─────────────────────────────────
 *
 *  preset: 'default'   Dark pill button with copy icon  (default)
 *  preset: 'api'       Monospace dark button for API keys / tokens
 *  preset: 'simple'    Plain text-only link-style button
 *
 * ─── ALL OPTIONS ─────────────────────────────
 *
 *  Popsy.copy({
 *    value:    'text to copy',   // (required) the text that gets copied
 *    target:   '#myDiv',         // CSS selector or DOM element to inject into
 *    preset:   'default',        // 'default' | 'api' | 'simple'   (default: 'default')
 *    label:    'Copy',           // button label                    (default: 'Copy')
 *    copied:   'Copied!',        // label shown after copy          (default: 'Copied!')
 *    duration:  2000,            // ms before label resets          (default: 2000)
 *    bg:       '#18181b',        // background color                (overrides preset)
 *    color:    '#ffffff',        // text / icon color               (overrides preset)
 *    radius:   '6px',            // border radius                   (overrides preset)
 *    fontSize: '13px',           // font size                       (overrides preset)
 *  })
 *
 * ─── EXAMPLES ────────────────────────────────
 *
 *  // 1. Simple copy button — minimal, link style
 *  Popsy.copy({
 *    value:  'Hello world!',
 *    target: '#myDiv',
 *    preset: 'simple'
 *  })
 *
 *  // 2. API key button — dark, monospace
 *  Popsy.copy({
 *    value:  'sk-abc123xyz',
 *    target: '#keyBox',
 *    preset: 'api',
 *    label:  'Copy API key',
 *    copied: 'Copied!'
 *  })
 *
 *  // 3. Default button with custom colors
 *  Popsy.copy({
 *    value:  'npm install popsy.js',
 *    target: '#installBox',
 *    bg:     '#6366f1',
 *    color:  '#ffffff',
 *    label:  'Copy install command'
 *  })
 *
 *  // 4. No target — returns the button so you place it yourself
 *  const btn = Popsy.copy({ value: 'https://mysite.com/referral/abc' })
 *  document.querySelector('#somewhere').appendChild(btn)
 *
 * ─────────────────────────────────────────────
 */

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