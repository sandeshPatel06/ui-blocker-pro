const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;
let debounceTimer;
let statusTimer;

document.addEventListener('DOMContentLoaded', () => {
  const imageOpacitySlider = document.getElementById('imageOpacity');
  const videoOpacitySlider = document.getElementById('videoOpacity');
  const mediaOpacitySlider = document.getElementById('mediaOpacity');
  const customOpacitySlider = document.getElementById('customOpacity');
  const opacityValues = document.querySelectorAll('.opacity-value');
  const customSelectors = document.getElementById('customSelectors');
  const status = document.getElementById('status');
  const domainList = document.getElementById('domainList');
  const excludeList = document.getElementById('excludeList');
  const addDomainBtn = document.getElementById('addDomainBtn');
  const addExcludeBtn = document.getElementById('addExcludeBtn');
  const updateBtn = document.getElementById('updateBtn');
  const saveBtn = document.getElementById('saveBtn');
  const applyToAllDomainsCheckbox = document.getElementById('applyToAllDomains');
  const globalPowerToggle = document.getElementById('globalPowerToggle');
  const domainSection = document.getElementById('domainSection');
  const themeToggle = document.getElementById('themeToggle');

  function debounceUpdateFilters() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      updateFilters();
    }, 150);
  }

  function applyStep(btn, useDebounce = false) {
    const input = document.getElementById(btn.dataset.input);
    const step = parseInt(btn.dataset.step);
    const newVal = Math.min(100, Math.max(0, parseInt(input.value) + step));
    input.value = newVal;
    setSliderFill(input);

    const label = input.closest('.control').querySelector('.val');
    if (label) label.textContent = `${newVal}%`;
    if (useDebounce) debounceUpdateFilters();
    else updateFilters();
  }

  document.querySelectorAll('.step-btn').forEach(btn => {
    let holdTimeout = null;
    let repeatInterval = null;

    function clearHold() {
      clearTimeout(holdTimeout);
      clearInterval(repeatInterval);
      holdTimeout = null;
      repeatInterval = null;
    }

    btn.addEventListener('pointerdown', () => {
      clearHold();
      applyStep(btn);
      holdTimeout = setTimeout(() => {
        repeatInterval = setInterval(() => applyStep(btn, true), 60);
      }, 400);
    });
    btn.addEventListener('pointerup', clearHold);
    btn.addEventListener('pointercancel', clearHold);
    btn.addEventListener('pointerleave', clearHold);
    window.addEventListener('blur', clearHold);

    btn.addEventListener('click', (event) => {
      if (event.detail === 0) applyStep(btn);
    });
  });

  function setSliderFill(slider) {
    slider.style.setProperty('--fill', `${slider.value}%`);
  }

  function themeIcon(theme) {
    const svgAttrs = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    if (theme === 'dark') {
      return `<svg ${svgAttrs}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
    return `<svg ${svgAttrs}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }

  // Load saved settings
  function loadSettings() {
    browserAPI.storage.local.get(['imageOpacity', 'videoOpacity', 'mediaOpacity', 'customOpacity', 'customSelectors', 'domains', 'excludedDomains', 'applyToAllDomains', 'isBlockerEnabled', 'theme'], (result) => {
      if (result.imageOpacity !== undefined) {
        imageOpacitySlider.value = result.imageOpacity;
        opacityValues[0].textContent = `${result.imageOpacity}%`;
      }
      if (result.videoOpacity !== undefined) {
        videoOpacitySlider.value = result.videoOpacity;
        opacityValues[1].textContent = `${result.videoOpacity}%`;
      }
      if (result.mediaOpacity !== undefined) {
        mediaOpacitySlider.value = result.mediaOpacity;
        opacityValues[2].textContent = `${result.mediaOpacity}%`;
      }
      if (result.customOpacity !== undefined) {
        customOpacitySlider.value = result.customOpacity;
        opacityValues[3].textContent = `${result.customOpacity}%`;
      }
      if (result.customSelectors) {
        customSelectors.value = result.customSelectors;
      }
      if (result.applyToAllDomains !== undefined) {
        applyToAllDomainsCheckbox.checked = result.applyToAllDomains;
        toggleDomainSection(result.applyToAllDomains);
      }
      if (result.isBlockerEnabled !== undefined) {
        globalPowerToggle.checked = result.isBlockerEnabled;
      }

      const theme = result.theme || 'auto';
      applyTheme(theme);

      setSliderFill(imageOpacitySlider);
      setSliderFill(videoOpacitySlider);
      setSliderFill(mediaOpacitySlider);
      setSliderFill(customOpacitySlider);

      domainList.innerHTML = '';
      excludeList.innerHTML = '';
      if (result.domains) {
        result.domains.forEach(domain => addDomainItem(domainList, domain));
      }
      if (result.excludedDomains) {
        result.excludedDomains.forEach(domain => addDomainItem(excludeList, domain));
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    if (theme === 'light') document.documentElement.classList.add('light-theme');
    if (theme === 'dark') document.documentElement.classList.add('dark-theme');

    themeToggle.innerHTML = themeIcon(theme);
  }

  // Toggle Theme
  themeToggle.addEventListener('click', () => {
    // 2-state toggle between light and dark
    const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' :
      document.documentElement.classList.contains('light-theme') ? 'light' :
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply and Save
    applyTheme(nextTheme);
    browserAPI.storage.local.set({ theme: nextTheme });
    showStatus(`Switched to ${nextTheme} mode`);
  });

  // Toggle domain section visibility
  function toggleDomainSection(applyToAll) {
    domainSection.classList.toggle('is-disabled', applyToAll);
    domainSection.style.pointerEvents = applyToAll ? 'none' : 'auto';
    domainSection.setAttribute('aria-disabled', applyToAll ? 'true' : 'false');
  }

  // Update opacity value display
  function updateOpacity(slider, valueDisplay) {
    valueDisplay.textContent = `${slider.value}%`;
    setSliderFill(slider);
  }

  // Save settings to storage
  function saveSettings(silent = false) {
    const settings = {
      imageOpacity: parseInt(imageOpacitySlider.value),
      videoOpacity: parseInt(videoOpacitySlider.value),
      mediaOpacity: parseInt(mediaOpacitySlider.value),
      customOpacity: parseInt(customOpacitySlider.value),
      customSelectors: customSelectors.value,
      domains: getDomainsList(domainList),
      excludedDomains: getDomainsList(excludeList),
      applyToAllDomains: applyToAllDomainsCheckbox.checked,
      isBlockerEnabled: globalPowerToggle.checked
    };

    browserAPI.storage.local.set(settings, () => {
      if (!silent) showStatus('Profile Saved', 'success');
    });
  }

  // Update filters
  function updateFilters() {
    browserAPI.storage.local.get(['theme'], (themeResult) => {
      browserAPI.runtime.sendMessage({
        action: 'updateFilters',
        imageOpacity: parseInt(imageOpacitySlider.value),
        videoOpacity: parseInt(videoOpacitySlider.value),
        mediaOpacity: parseInt(mediaOpacitySlider.value),
        customOpacity: parseInt(customOpacitySlider.value),
        customSelectors: customSelectors.value,
        domains: getDomainsList(domainList),
        excludedDomains: getDomainsList(excludeList),
        applyToAllDomains: applyToAllDomainsCheckbox.checked,
        isBlockerEnabled: globalPowerToggle.checked,
        theme: themeResult.theme || 'auto'
      }, (response) => {
        if (browserAPI.runtime.lastError) {
          console.warn('Communication error:', browserAPI.runtime.lastError);
        }
        showStatus('Filters Updated', 'success');
      });
    });
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status';
    if (type === 'success' || type === 'error') {
      status.classList.add(type);
    }
    status.classList.add('show');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.className = 'status'; }, 3000);
  }

  function normalizeDomain(raw) {
    let domain = String(raw).trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '');
    const cutIndex = domain.search(/[/?#]/);
    if (cutIndex !== -1) domain = domain.slice(0, cutIndex);
    if (domain.startsWith('www.')) domain = domain.slice(4);
    domain = domain.replace(/^\.+|\.+$/g, '');
    return domain;
  }

  function getDomainsList(listElement) {
    const domainInputs = listElement.querySelectorAll('input[type="text"]');
    return Array.from(domainInputs).map(input => {
      const normalized = normalizeDomain(input.value);
      if (normalized) input.value = normalized;
      return normalized;
    }).filter(Boolean);
  }

  function addDomainItem(listElement, domain = '') {
    const domainItem = document.createElement('div');
    domainItem.className = 'domain-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = domain;
    input.placeholder = 'example.com';

    input.addEventListener('blur', () => {
      if (input.value.trim()) input.value = normalizeDomain(input.value);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      input.value = normalizeDomain(input.value);
      const newInput = addDomainItem(listElement);
      newInput.focus();
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-domain btn btn-outline';
    removeBtn.title = 'Remove';
    removeBtn.setAttribute('aria-label', 'Remove website');
    removeBtn.textContent = '×';

    removeBtn.addEventListener('click', () => domainItem.remove());

    domainItem.appendChild(input);
    domainItem.appendChild(removeBtn);
    listElement.appendChild(domainItem);
    return input;
  }

  addDomainBtn.addEventListener('click', () => addDomainItem(domainList));
  addExcludeBtn.addEventListener('click', () => addDomainItem(excludeList));
  applyToAllDomainsCheckbox.addEventListener('change', () => toggleDomainSection(applyToAllDomainsCheckbox.checked));

  imageOpacitySlider.addEventListener('input', () => {
    updateOpacity(imageOpacitySlider, opacityValues[0]);
    debounceUpdateFilters();
  });
  videoOpacitySlider.addEventListener('input', () => {
    updateOpacity(videoOpacitySlider, opacityValues[1]);
    debounceUpdateFilters();
  });
  mediaOpacitySlider.addEventListener('input', () => {
    updateOpacity(mediaOpacitySlider, opacityValues[2]);
    debounceUpdateFilters();
  });
  customOpacitySlider.addEventListener('input', () => {
    updateOpacity(customOpacitySlider, opacityValues[3]);
    debounceUpdateFilters();
  });

  saveBtn.addEventListener('click', () => saveSettings());
  updateBtn.addEventListener('click', () => {
    saveSettings(true);
    updateFilters();
  });

  globalPowerToggle.addEventListener('change', () => {
    saveSettings(true);
    updateFilters();
  });

  setSliderFill(imageOpacitySlider);
  setSliderFill(videoOpacitySlider);
  setSliderFill(mediaOpacitySlider);
  setSliderFill(customOpacitySlider);

  loadSettings();
});
