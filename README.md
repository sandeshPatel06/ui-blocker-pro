<div align="center">
  <img src="icons/128.png" alt="UI Blocker Pro — hide elements and fade distractions on any website" width="96" height="96">
  <h1>UI Blocker Pro</h1>
  <p><strong>Fade, hide &amp; declutter any UI element on any website</strong><br>
  Chrome &amp; Firefox extension · Manifest V3 · Privacy-friendly (no tracking)</p>
  <p>
    <img alt="Chrome 121+" src="https://img.shields.io/badge/Chrome-121%2B-yellow?logo=googlechrome&amp;logoColor=white">
    <img alt="Firefox 121+" src="https://img.shields.io/badge/Firefox-121%2B-orange?logo=firefox&amp;logoColor=white">
    <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-635BFF?logo=googlechrome&amp;logoColor=white">
    <img alt="Version 1.2" src="https://img.shields.io/badge/version-1.2-fffc00?labelColor=1c1917">
    <img alt="No tracking" src="https://img.shields.io/badge/no-tracking-10b981?logo=securityscorecard&amp;logoColor=white">
  </p>
</div>

---

## What is UI Blocker Pro?

**UI Blocker Pro** is a free cross-browser extension that lets you **fade, dim or hide distracting elements** on any web page — cookie banners, sticky headers, autoplay videos, image walls, sidebars, popups, ads-like overlays — without breaking the page.

Instead of blocking content aggressively (which breaks sites), it adjusts **opacity**, giving you a calm, focused, decluttered browsing experience. Rules can be limited to **specific domains**, so your favorite sites always look exactly how you want them.

---

## ✨ Features

| Feature | What it does |
|---|---|
| 🎚️ **Image opacity slider** | Fade all `<img>` elements from 0% (invisible) to 100% (normal) |
| 🎬 **Video opacity slider** | Dim `<video>` players while keeping the page usable |
| 🎯 **Custom CSS selectors** | Target exact elements — `.cookie-banner, #sidebar, div.overlay` — with their own opacity level |
| 🌐 **Per-domain rules** | Enable your rules only on chosen websites (whitelist/blacklist mode) |
| 👀 **Hover-peek** | Fade low-opacity elements back on hover so you can still reach them |
| ⚡ **Live filters** | Update filters instantly — no reload needed |
| 💾 **Persistent settings** | Everything is saved with `storage.sync` — settings follow your browser profile |
| 🌗 **Light & dark theme** | Match your system theme, or pick manually in Settings |
| 🚫 **Non-invasive** | Pure CSS opacity changes — nothing is blocked, removed or tracked |

---

## 📦 Installation

> Not published on the stores yet — install it as a developer build (takes ~30 seconds).

### Chrome / Edge / Brave (unpacked)

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this project folder.
5. Pin **UI Blocker Pro** to the toolbar.

### Firefox (temporary add-on, Firefox 121+)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**
3. Select the `manifest.json` file in this folder.
4. After code changes, click the **↻ Reload** button next to the extension to see them.

---

## 🧭 How to use

1. **Click the toolbar icon** → the popup opens with opacity sliders for images, videos and custom selectors.
2. Drag a slider → press **Update Filters** to apply instantly (or **Save Settings** to persist).
3. Add sites under **Domains** to scope your rules — e.g. only `news.example.com`.
4. For fine control, open **Settings** (right-click the icon → Options), add CSS selectors like `.modal, #onboarding, .cookie-consent` and set their opacity.

**Tip:** Right-click → *Inspect* on any annoying element to find its class or ID, then paste it into Custom Selectors.

---

## 🔒 Privacy & permissions

**No analytics. No tracking. No data leaves your browser.**

| Permission | Why it's needed |
|---|---|
| `storage` | Save your sliders, selectors and domain rules |
| `scripting` + `host_permissions <all_urls>` | Inject the opacity CSS into pages you visit |
| `tabs` | Detect the active site to apply per-domain rules |

That's all. The extension never reads page content, never sends network requests, and works fully offline.

---

## ❓ FAQ

**Does UI Blocker Pro block ads or content?**
No. It only changes visual prominence via CSS opacity — the page structure stays intact, so sites keep working.

**Will it slow down my browsing?**
No. It injects a small stylesheet; there is no heavy DOM monitoring or network activity.

**Where are my settings stored?**
In the browser's `storage.sync` API — private to your profile, synced across your own devices where the browser supports it.

**Which browsers are supported?**
Chrome 121+, Edge/Brave/Chromium (same steps as Chrome) and Firefox 121+ (Manifest V3).

**Is it on the Chrome Web Store or Firefox Add-ons (AMO)?**
Not yet — currently distributed as a developer build from this repository. Store releases are planned.

**How is this different from an ad blocker?**
Ad blockers remove requests and DOM nodes (which can break sites). UI Blocker Pro only fades elements you choose — softer, reversible, safer.

---

## 🌍 Browser support

| Browser | Version | Install method |
|---|---|---|
| Google Chrome | 121+ | Load unpacked |
| Microsoft Edge / Brave / Chromium | 121+ | Load unpacked |
| Mozilla Firefox | 121+ | Temporary add-on (`about:debugging`) |

---

## 📁 Project structure

```
ui-blocker-pro/
├── manifest.json      # Manifest V3 (Chrome + Firefox)
├── background.js      # Generates hover-peek / selector styles
├── content.js         # Applies opacity rules, domain matching
├── popup.html/js      # Toolbar popup controls
├── options.html/js    # Full settings page
└── icons/             # 16 / 48 / 128 px extension icons
```

Built with vanilla HTML/CSS/JS — **no frameworks, no build step, no dependencies**.

---

## 📌 Keywords

`UI Blocker Pro` · hide elements on website · fade images · video opacity · custom CSS selector blocker · distraction blocker · declutter browser · hide cookie banner · Chrome extension · Firefox add-on · Manifest V3 · privacy extension · per-site rules
