/* yt-shell.js — injects redesigned header, footer, Tailwind, Google Fonts, and styling into every tool page */
(function () {
  const TOOLS = [
    { id: 'acd',          label: 'Event Dashboard',            path: 'https://acd.toolforge.org/', icon: '👥', cat: 'wiki', desc: 'Quickly create Wikipedia accounts for workshop/editathon participants, bypassing IP throttle limits. Includes a live editor leaderboard and contribution statistics.' },
    { id: 'anubad-shuddhi', label: 'Anubad Shuddhi',      path: 'https://anubad-shuddhi.toolforge.org/', icon: '✍️', cat: 'wiki', desc: 'An AI-based web tool to improve machine translation quality and reduce linguistic rigidity in Bangla Wikipedia.' },
    { id: 'ip',          label: 'IP Information Viewer',   path: '/ip',          icon: '🌐', cat: 'ip', desc: 'Detect VPNs & proxies, and check Wikimedia global block status for any IP address.' },
    { id: 'ipmulti',     label: 'Multi-IP Checker',        path: '/ipmulti',     icon: '📋', cat: 'ip', desc: 'Paste a list of IPs to check proxy/VPN status and metadata for all of them at once.' },
    { id: 'ip-calc',     label: 'IP Range Calculator',     path: '/ip-calc',     icon: '🔢', cat: 'ip', desc: 'Calculate the smallest CIDR range that covers a list of IP addresses. Supports IPv4/IPv6.' },
    { id: 'ip-cidr',     label: 'CIDR Subnet Calculator',  path: '/ip-cidr',     icon: '🗂️', cat: 'ip', desc: 'Expand any CIDR notation into its full subnet details — network, host range, and count.' },
    { id: 'ipinfo',      label: 'Simple IP Tool',          path: '/ipinfo',      icon: '🌐', cat: 'ip', desc: 'Basic IP information and location map using the free ipinfo.io API.' },
    { id: 'urldecoder',  label: 'URL Decoder',             path: '/urldecoder',  icon: '🔗', cat: 'wiki', desc: 'Decode percent-encoded and UTF-encoded Wikipedia URLs into readable text.' },
    { id: 'wc',          label: 'Word Counter',            path: '/wc',          icon: '📝', cat: 'wiki', desc: 'Generate a wikitext table with word counts broken down by article section.' },
    { id: 'wcl',         label: 'Grouped Word Counter',    path: '/wcl',         icon: '📝', cat: 'wiki', desc: 'Scan list of articles from a URL, group by user, and calculate word counts.' },
    { id: 'dupchecker',  label: 'Duplicate Line Detector', path: '/dupchecker',  icon: '📋', cat: 'wiki', desc: 'Find duplicate lines of text in any Wikimedia project page.' },
    { id: 'onthisday',   label: 'On This Day',             path: '/onthisday',   icon: '📆', cat: 'wiki', desc: 'Browse today\'s historical events, birthdays, and anniversaries from Bangla Wikipedia.' },
    { id: 'pulse',       label: 'Edit Pulse',              path: '/pulse',       icon: '📡', cat: 'wiki', desc: 'Live feed of recent edits on Bangla Wikipedia — see who is editing in real time.' },
    { id: 'wiki-harmony',label: 'WikiHarmony',             path: '/wiki-harmony',icon: '🎵', cat: 'wiki', desc: 'An audio-visual experience that turns live Wikipedia edits into music.' },
    { id: 'bndate',      label: 'Bangla Date Converter',   path: '/bndate',      icon: '📅', cat: 'date', desc: 'Convert dates between the Bengali calendar and the Gregorian calendar, both directions.' }
  ];

  // Ingress styles & scripts into head (no-op since they are statically injected in HTML head)
  function prepareHead() {
    // Statically handled in page heads for reliable render
  }

  function inject() {
    // -- Find base path
    let base = '/';
    const scripts = document.querySelectorAll('script[src*="yt-shell"]');
    if (scripts.length) {
      const src = scripts[scripts.length - 1].getAttribute('src');
      if (src && src.startsWith('..')) {
        base = '../';
      }
    }

    // -- Header Injection
    const header = document.createElement('header');
    header.className = 'bg-surface dark:bg-surface-dim w-full top-0 sticky z-50 border-b border-border-subtle';
    header.innerHTML = `
      <div class="flex justify-between items-center px-gutter py-base max-w-container-max mx-auto h-14">
        <div class="flex items-center gap-stack-md">
          <a href="${base}" class="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim no-underline">YTools</a>
          <nav class="hidden md:flex gap-stack-md items-center h-full">
            <a class="font-body-md text-body-md text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim pb-1 cursor-pointer active:opacity-80 no-underline" href="${base}">All Tools</a>
            <a class="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 no-underline" href="https://meta.wikimedia.org/wiki/User:Yahya" target="_blank" rel="noopener">Maintainer</a>
            <a class="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 no-underline" href="https://github.com/UserYahya/YTools" target="_blank" rel="noopener">GitHub</a>
          </nav>
        </div>
        <div class="flex items-center gap-stack-sm">
          <div class="hidden sm:flex items-center bg-surface-container-low border border-border-subtle px-stack-sm py-1 rounded">
            <span class="material-symbols-outlined text-on-surface-variant scale-75">search</span>
            <input class="bg-transparent border-none focus:ring-0 text-body-sm w-32 lg:w-64 py-0" placeholder="Search tools..." type="text" id="shellSearchInput"/>
          </div>
          <a href="https://meta.wikimedia.org/wiki/User:Yahya" target="_blank" rel="noopener" class="material-symbols-outlined text-primary p-1 hover:bg-surface-container transition-colors rounded cursor-pointer no-underline">account_circle</a>
        </div>
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    // -- Header Search Logic
    const searchInput = document.getElementById('shellSearchInput');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = searchInput.value.trim();
          if (val) {
            // Check if we are on index.html (has local search input)
            const mainSearch = document.getElementById('search') || document.querySelector('input[placeholder*="Find a tool"]');
            if (mainSearch) {
              mainSearch.value = val;
              mainSearch.dispatchEvent(new Event('input', { bubbles: true }));
              mainSearch.focus();
            } else {
              window.location.href = `${base}?q=${encodeURIComponent(val)}`;
            }
          }
        }
      });
    }

    // -- Footer Injection
    const footer = document.createElement('footer');
    footer.className = 'bg-surface-subtle dark:bg-surface-container-lowest border-t border-border-subtle w-full mt-stack-lg';
    footer.innerHTML = `
      <div class="flex flex-col md:flex-row justify-between items-center px-gutter py-stack-md max-w-container-max mx-auto gap-stack-sm">
        <div class="flex flex-col gap-1 items-center md:items-start">
          <span class="font-label-md text-label-md text-on-surface">YTools</span>
          <span class="font-body-sm text-body-sm text-text-secondary dark:text-on-surface-variant">Maintained by the Wikimedia Community</span>
        </div>
        <div class="flex flex-wrap justify-center gap-stack-md">
          <a class="font-body-sm text-body-sm text-text-secondary dark:text-on-surface-variant hover:underline hover:text-primary transition-all no-underline" href="https://toolforge.org/" target="_blank" rel="noopener">Toolforge</a>
          <a class="font-body-sm text-body-sm text-text-secondary dark:text-on-surface-variant hover:underline hover:text-primary transition-all no-underline" href="https://github.com/UserYahya/YTools" target="_blank" rel="noopener">GitHub</a>
          <a class="font-body-sm text-body-sm text-text-secondary dark:text-on-surface-variant hover:underline hover:text-primary transition-all no-underline" href="https://meta.wikimedia.org/wiki/User_talk:Yahya" target="_blank" rel="noopener">Feedback</a>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  // Pre-prepare head immediately
  prepareHead();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  window.YT_TOOLS = TOOLS;
})();


