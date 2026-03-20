/* yt-shell.js — injects shared header & footer into every tool page */
(function () {
  const BASE = (function () {
    const scripts = document.querySelectorAll('script[src*="yt-shell"]');
    if (scripts.length) {
      const src = scripts[scripts.length - 1].src;
      return src.replace(/\/[^/]*$/, '/..').replace(/\/\.$/, '');
    }
    return '..';
  })();

  const TOOLS = [
    { id: 'ip',          label: 'IP Information',       path: '/ip',          icon: '🌐', cat: 'ip' },
    { id: 'ipmulti',     label: 'Multi-IP Checker',     path: '/ipmulti',     icon: '📋', cat: 'ip' },
    { id: 'ip-calc',     label: 'IP Range Calculator',  path: '/ip-calc',     icon: '🔢', cat: 'ip' },
    { id: 'ip-whois',    label: 'IP WHOIS Lookup',      path: '/ip-whois',    icon: '🔍', cat: 'ip' },
    { id: 'ip-cidr',     label: 'CIDR Subnet Tool',     path: '/ip-cidr',     icon: '🗂️', cat: 'ip' },
    { id: 'urldecoder',  label: 'URL Decoder',          path: '/urldecoder',  icon: '🔗', cat: 'wiki' },
    { id: 'wc',          label: 'Word Counter',         path: '/wc',          icon: '📝', cat: 'wiki' },
    { id: 'bndate',      label: 'Bangla Date Converter',path: '/bndate',      icon: '📅', cat: 'wiki' },
    { id: 'onthisday',   label: 'On This Day',          path: '/onthisday',   icon: '📆', cat: 'wiki' },
    { id: 'pulse',       label: 'Edit Pulse',           path: '/pulse',       icon: '📡', cat: 'wiki' },
    { id: 'wiki-harmony',label: 'WikiHarmony',          path: '/wiki-harmony',icon: '🎵', cat: 'wiki' },
  ];

  function inject() {
    // -- Header
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <a href="/" class="site-header__logo">
        <div class="site-header__logo-icon">Y</div>
        <span class="site-header__wordmark"><span>Y</span>Tools</span>
      </a>
      <div class="site-header__search" id="hdrSearch" style="display:none">
        <span class="site-header__search-icon">🔍</span>
        <input type="text" placeholder="Search tools…" aria-label="Search tools" id="hdrSearchInput">
      </div>
      <nav class="site-header__nav">
        <a href="/">All tools</a>
        <a href="https://meta.wikimedia.org/wiki/User:Yahya" target="_blank" rel="noopener">Maintainer</a>
      </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    // -- Footer
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      &copy; 2024–2025 <a href="https://meta.wikimedia.org/wiki/User:Yahya" target="_blank" rel="noopener">Muhammad Yahya</a> —
      Hosted on <a href="https://toolforge.org/" target="_blank" rel="noopener">Toolforge</a> ·
      <a href="https://github.com/UserYahya/YTools" target="_blank" rel="noopener">GitHub</a>
    `;
    document.body.appendChild(footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  window.YT_TOOLS = TOOLS;
})();
