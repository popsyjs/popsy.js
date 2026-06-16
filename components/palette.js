/**
 * ╔═══════════════════════════════════════════╗
 * ║     Popsy.js — Command Palette ⌨️          ║
 * ╚═══════════════════════════════════════════╝
 *
 * A lightweight, keyboard-driven command palette.
 * No dependencies needed.
 *
 * ─── HOW TO USE ──────────────────────────────
 *
 *  <script src="https://cdn.jsdelivr.net/gh/popsyjs/popsy.js@latest/popsy.js"></script>
 *
 * ─── BASIC ───────────────────────────────────
 *
 *  Popsy.palette([
 *    { label: 'Dashboard', action: () => location.href = '/dashboard' },
 *    { label: 'Settings',  action: () => location.href = '/settings' },
 *  ])
 *
 * ─── WITH OPTIONS ────────────────────────────
 *
 *  Popsy.palette(commands, {
 *    placeholder: 'Search commands...',   // input placeholder   (default: 'Search commands...')
 *    hotkey:      'k',                    // Ctrl/Cmd + key      (default: 'k')
 *  })
 *
 * ─── COMMAND SHAPE ───────────────────────────
 *
 *  {
 *    label:    'Go to Dashboard',   // required — display text
 *    action:   () => { ... },       // required — called on select
 *    icon:     'home',              // optional — built-in name or raw <svg> string
 *    category: 'Navigate',         // optional — group header label
 *    shortcut: 'G D',              // optional — right-side hint badge
 *  }
 *
 * ─── BUILT-IN ICONS ──────────────────────────
 *
 *  'home' | 'user' | 'settings' | 'copy' | 'docs' |
 *  'logout' | 'moon' | 'plus' | 'bug' | 'keyboard' | 'project'
 *
 * ─── CONTROL API ─────────────────────────────
 *
 *  Popsy.palette.open()            // open
 *  Popsy.palette.open('settings')  // open pre-filled with a query
 *  Popsy.palette.close()           // close
 *
 * ─── EXAMPLES ────────────────────────────────
 *
 *  // Open on button click
 *  document.querySelector('#cmd-btn').onclick = () => Popsy.palette.open()
 *
 *  // Pre-fill a search query
 *  Popsy.palette.open('new')
 *
 *  // Custom hotkey (Ctrl/Cmd + P)
 *  Popsy.palette(commands, { hotkey: 'p' })
 *
 *  // With categories and shortcuts
 *  Popsy.palette([
 *    { label: 'Dashboard', icon: 'home',     category: 'Navigate', shortcut: 'G D', action: () => {} },
 *    { label: 'New Post',  icon: 'plus',     category: 'Actions',                   action: () => {} },
 *    { label: 'Log Out',   icon: 'logout',   category: 'Account',                   action: () => {} },
 *  ])
 *
 * ─────────────────────────────────────────────
 */

Popsy.palette = (function () {
  // Stub open/close so callers don't throw before init
  function noop() {}
  const api = function palette(commands, options) { init(commands, options); };
  api.open  = noop;
  api.close = noop;

  const ICONS = {
    home:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
    user:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
    copy:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    docs:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    logout:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    moon:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    plus:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    bug:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 2 1.88 1.88M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>`,
    keyboard: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>`,
    project:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  };

  const ICON_DEFAULT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;

  function resolveIcon(icon) {
    if (!icon) return ICON_DEFAULT;
    if (icon.trim().startsWith('<')) return icon;
    return ICONS[icon] || ICON_DEFAULT;
  }

  // Tracks the current instance so re-calling Popsy.palette() tears down the old one
  let _teardown = null;

  function init(commands, options = {}) {
    // Tear down any existing instance
    if (_teardown) { _teardown(); _teardown = null; }

    const placeholder = options.placeholder || 'Search commands...';
    const hotkey      = options.hotkey      || 'k';

    // ── Inject placeholder colour once ──────────────────────────
    if (!document.getElementById('popsy-palette-style')) {
      const s = document.createElement('style');
      s.id = 'popsy-palette-style';
      s.textContent = '#popsy-palette-input::placeholder{color:#444}';
      document.head.appendChild(s);
    }

    // ── DOM ─────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'popsy-palette-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.45)',
      'backdrop-filter:blur(4px)', 'z-index:99999',
      'display:flex', 'align-items:flex-start', 'justify-content:center',
      'padding-top:14vh',
      'opacity:0', 'transition:opacity 0.15s ease', 'pointer-events:none',
    ].join(';');

    const modal = document.createElement('div');
    modal.style.cssText = [
      'width:100%', 'max-width:560px',
      'background:#1c1c1e', 'border:1px solid #2e2e32', 'border-radius:14px',
      'overflow:hidden', 'box-shadow:0 24px 60px rgba(0,0,0,0.5)',
      'transform:scale(0.96) translateY(-6px)', 'transition:transform 0.15s ease',
      'font-family:sans-serif',
    ].join(';');

    // Search row
    const searchRow = document.createElement('div');
    searchRow.style.cssText = 'display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid #2e2e32;';
    searchRow.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';

    const input = document.createElement('input');
    input.id = 'popsy-palette-input';
    input.type = 'text';
    input.placeholder = placeholder;
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.style.cssText = 'flex:1;background:none;border:none;outline:none;font-size:15px;color:#f0f0f0;font-family:sans-serif;';

    const escBadge = document.createElement('span');
    escBadge.textContent = 'esc';
    escBadge.style.cssText = 'font-size:11px;color:#444;background:#2a2a2e;border:1px solid #3a3a3e;border-radius:4px;padding:2px 7px;font-family:monospace;flex-shrink:0;';

    searchRow.appendChild(input);
    searchRow.appendChild(escBadge);

    // Results list
    const list = document.createElement('div');
    list.style.cssText = 'max-height:340px;overflow-y:auto;padding:6px;';

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = 'border-top:1px solid #2e2e32;padding:8px 16px;display:flex;gap:16px;align-items:center;';
    const kb = (key) => `<kbd style="background:#2a2a2e;border:1px solid #3a3a3e;border-radius:3px;padding:1px 5px;color:#555;font-size:10px;">${key}</kbd>`;
    const hint = (keys, label) => `<span style="display:flex;align-items:center;gap:4px;font-size:11px;color:#444;font-family:monospace;">${keys.map(kb).join('')} ${label}</span>`;
    footer.innerHTML = hint(['↑', '↓'], 'navigate') + hint(['↵'], 'run') + hint(['esc'], 'close');

    modal.appendChild(searchRow);
    modal.appendChild(list);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // ── State ────────────────────────────────────────────────────
    let isOpen    = false;
    let activeIdx = 0;
    let filtered  = [];

    // ── Render ───────────────────────────────────────────────────
    function render() {
      list.innerHTML = '';

      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'padding:40px 20px;text-align:center;color:#555;font-size:14px;';
        empty.textContent = 'No results found';
        list.appendChild(empty);
        return;
      }

      // Group by category
      const groups = {};
      filtered.forEach((cmd) => {
        const g = cmd.category || 'General';
        if (!groups[g]) groups[g] = [];
        groups[g].push(cmd);
      });

      let idx = 0;
      for (const [group, items] of Object.entries(groups)) {
        const groupLabel = document.createElement('div');
        groupLabel.style.cssText = 'font-size:10px;color:#555;letter-spacing:0.1em;text-transform:uppercase;padding:10px 12px 4px;font-family:monospace;';
        groupLabel.textContent = group;
        list.appendChild(groupLabel);

        items.forEach((cmd) => {
          const i = idx++;
          const active = i === activeIdx;

          const item = document.createElement('div');
          item.style.cssText = `display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;cursor:pointer;background:${active ? '#6366f1' : 'transparent'};transition:background 0.1s;`;

          const iconWrap = document.createElement('div');
          iconWrap.style.cssText = `width:32px;height:32px;background:${active ? 'rgba(255,255,255,0.15)' : '#2a2a2e'};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${active ? '#fff' : '#aaa'};transition:background 0.1s;`;
          iconWrap.innerHTML = resolveIcon(cmd.icon);

          const labelEl = document.createElement('div');
          labelEl.style.cssText = `flex:1;font-size:14px;color:${active ? '#fff' : '#e0e0e0'};`;
          labelEl.textContent = cmd.label;

          const badge = document.createElement('div');
          badge.style.cssText = `font-size:11px;font-family:monospace;color:${active ? '#c7d2fe' : '#555'};background:${active ? 'rgba(255,255,255,0.1)' : '#2a2a2e'};border:1px solid ${active ? '#818cf8' : '#3a3a3e'};border-radius:4px;padding:2px 7px;`;
          badge.textContent = cmd.shortcut || (cmd.category || 'General');

          item.appendChild(iconWrap);
          item.appendChild(labelEl);
          item.appendChild(badge);

          // Use closure copy of `i` — avoid stale activeIdx in mouseenter
          item.addEventListener('mouseenter', () => { activeIdx = i; render(); });
          item.addEventListener('click', () => { close(); cmd.action(); });

          list.appendChild(item);

          if (active) {
            // Defer so the element is in the DOM before scrolling
            setTimeout(() => item.scrollIntoView({ block: 'nearest' }), 0);
          }
        });
      }
    }

    // ── Filter ───────────────────────────────────────────────────
    function filter(q) {
      const query = q.toLowerCase().trim();
      filtered = query
        ? commands.filter((c) =>
            c.label.toLowerCase().includes(query) ||
            (c.category || '').toLowerCase().includes(query)
          )
        : commands.slice();
      activeIdx = 0;
      render();
    }

    // ── Open / Close ─────────────────────────────────────────────
    function open(query) {
      isOpen = true;
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      modal.style.transform = 'scale(1) translateY(0)';
      input.value = query || '';
      filter(input.value);
      setTimeout(() => input.focus(), 50);
    }

    function close() {
      isOpen = false;
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      modal.style.transform = 'scale(0.96) translateY(-6px)';
      input.blur();
    }

    // ── Events ───────────────────────────────────────────────────
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    input.addEventListener('input', () => filter(input.value));

    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === hotkey) {
        e.preventDefault();
        isOpen ? close() : open();
        return;
      }
      if (!isOpen) return;
      if (e.key === 'Escape')    { close(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); render(); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); return; }
      if (e.key === 'Enter' && filtered[activeIdx]) { close(); filtered[activeIdx].action(); }
    }
    document.addEventListener('keydown', onKeyDown);

    // ── Expose on api ────────────────────────────────────────────
    api.open  = open;
    api.close = close;

    // ── Teardown for future re-init ──────────────────────────────
    _teardown = () => {
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
      api.open  = noop;
      api.close = noop;
    };
  }

  return api;
}());
