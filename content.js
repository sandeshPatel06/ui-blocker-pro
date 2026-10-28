const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;

function normalizeDomain(raw) {
  let d = String(raw || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '');
  d = d.split(/[/?#]/)[0];
  d = d.replace(/^www\./, '');
  d = d.replace(/^\.+|\.+$/g, '');
  return d;
}

function hostMatches(host, domain) {
  if (!domain) return false;
  return host === domain || host.endsWith('.' + domain);
}

// Older versions saved hover-reveal rules in storage; never apply them.
const LEGACY_HOVER_REVEAL = /^[^{}]*:hover[^{}]*\{\s*opacity:\s*1\s*!important;\s*\}\s*$/i;

// Create and inject style element
const styleElement = document.createElement('style');
document.head.appendChild(styleElement);

// Function to update styles
function updateStyles(cssRules, excludedDomains = [], isBlockerEnabled = true) {
  const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, '');

  // Check if blocker is globally disabled or current host is excluded
  if (!isBlockerEnabled || excludedDomains.some(d => hostMatches(currentHost, normalizeDomain(d)))) {
    styleElement.textContent = '';
    return;
  }

  let cssText = '';
  (cssRules || []).forEach(rule => {
    if (LEGACY_HOVER_REVEAL.test(rule.rule || '')) return;
    // Apply global rules or exact domain matches
    if (rule.domain === '*' || hostMatches(currentHost, normalizeDomain(rule.domain))) {
      cssText += rule.rule + '\n';
    }
  });

  styleElement.textContent = cssText;
}

// Listen for messages from background script
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStyles') {
    updateStyles(message.cssRules, message.excludedDomains, message.isBlockerEnabled);
  }
});

// Load initial styles
browserAPI.storage.local.get(['cssRules', 'excludedDomains', 'isBlockerEnabled'], (result) => {
  if (result.cssRules) {
    updateStyles(result.cssRules, result.excludedDomains || [], result.isBlockerEnabled !== undefined ? result.isBlockerEnabled : true);
  }
});

