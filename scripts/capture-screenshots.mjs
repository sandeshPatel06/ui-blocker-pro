#!/usr/bin/env node
// Captures README screenshots of the unpacked extension using Playwright + Chromium.
// Usage: npm install && npx playwright install chromium && npm run screenshots

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets', 'screenshots');

const settings = {
  imageOpacity: 35,
  videoOpacity: 30,
  mediaOpacity: 25,
  customOpacity: 0,
  customSelectors: '.cookie-banner, .promo-card, .newsletter-card',
  domains: ['news.ycombinator.com', 'github.com'],
  excludedDomains: ['mail.google.com'],
  applyToAllDomains: false,
  isBlockerEnabled: true,
  theme: 'light',
};

function svgDataUrl({ w, h, label, from, to }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<circle cx="${Math.round(w * 0.74)}" cy="${Math.round(h * 0.28)}" r="${Math.round(h * 0.2)}" fill="rgba(255,255,255,0.35)"/>
<rect x="${Math.round(w * 0.07)}" y="${Math.round(h * 0.6)}" width="${Math.round(w * 0.28)}" height="${Math.round(h * 0.1)}" rx="10" fill="rgba(255,255,255,0.55)"/>
<text x="${Math.round(w * 0.07)}" y="${Math.round(h * 0.93)}" font-family="system-ui, sans-serif" font-size="${Math.round(h * 0.075)}" font-weight="700" fill="#0f172a">${label}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function demoHtml() {
  const hero = svgDataUrl({ w: 960, h: 400, label: 'Hero image', from: '#1d4ed8', to: '#22d3ee' });
  const photo1 = svgDataUrl({ w: 640, h: 360, label: 'Photo one', from: '#f59e0b', to: '#ef4444' });
  const photo2 = svgDataUrl({ w: 640, h: 360, label: 'Photo two', from: '#10b981', to: '#3b82f6' });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Daily Byte — demo page</title>
<style>
  * { box-sizing: border-box; }
  html { scrollbar-width: none; }
  html::-webkit-scrollbar { display: none; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f6f7fb; color: #111827; }
  .topbar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #e5e7eb; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
  .brand { font-weight: 800; letter-spacing: -0.02em; }
  nav a { margin-left: 18px; color: #4b5563; text-decoration: none; font-size: 14px; }
  .wrap { max-width: 1040px; margin: 28px auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 280px; gap: 28px; }
  h1 { font-size: 34px; line-height: 1.15; margin: 0 0 10px; letter-spacing: -0.02em; }
  .lead { color: #4b5563; font-size: 16px; }
  .hero { width: 100%; border-radius: 16px; display: block; margin: 18px 0; border: 1px solid #e5e7eb; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px; }
  .grid img { width: 100%; border-radius: 12px; display: block; border: 1px solid #e5e7eb; }
  .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; margin-bottom: 18px; }
  .promo-card h3, .newsletter-card h3 { margin: 0 0 6px; font-size: 16px; }
  .promo-card p, .newsletter-card p { margin: 0 0 12px; color: #6b7280; font-size: 13px; }
  .promo-card button { border: 0; background: #111827; color: #fff; border-radius: 10px; padding: 9px 12px; width: 100%; font-weight: 600; }
  .newsletter { display: flex; gap: 8px; }
  .newsletter input { flex: 1; min-width: 0; border: 1px solid #d1d5db; border-radius: 10px; padding: 9px 10px; font: inherit; }
  .newsletter button { border: 0; background: #2563eb; color: #fff; border-radius: 10px; padding: 9px 12px; font-weight: 600; }
  .cookie-banner { position: fixed; left: 20px; right: 20px; bottom: 20px; background: #111827; color: #fff; border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 14px; box-shadow: 0 20px 40px -20px rgba(0,0,0,.6); }
  .cookie-banner button { border: 0; background: #f59e0b; color: #111827; padding: 9px 14px; border-radius: 10px; font-weight: 700; }
  .small { color: #6b7280; font-size: 13px; }
</style>
</head>
<body>
  <header class="topbar">
    <div class="brand">The Daily Byte</div>
    <nav><a href="#">Home</a><a href="#">Tech</a><a href="#">Design</a><a href="#">Subscribe</a></nav>
  </header>
  <main class="wrap">
    <article>
      <h1>Build calmer interfaces without breaking the web</h1>
      <p class="lead">A demo page packed with the usual distractions: hero art, a photo wall, promo and newsletter cards, and a cookie banner.</p>
      <img class="hero" src="${hero}" alt="Hero illustration">
      <div class="grid">
        <img src="${photo1}" alt="Photo one">
        <img src="${photo2}" alt="Photo two">
      </div>
    </article>
    <aside>
      <div class="card promo-card">
        <h3>Sponsored: Ship faster</h3>
        <p>An in-your-face promo card that steals attention from the article.</p>
        <button>Learn more</button>
      </div>
      <div class="card newsletter-card">
        <h3>Newsletter</h3>
        <p class="small">Get the top stories in your inbox.</p>
        <div class="newsletter"><input placeholder="you@example.com"><button>Join</button></div>
      </div>
    </aside>
  </main>
  <div class="cookie-banner">
    <span>We use cookies to personalize ads and remember your preferences.</span>
    <button>Accept all</button>
  </div>
</body>
</html>`;
}

async function startDemoServer() {
  const html = demoHtml();
  const server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(html);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  const profileDir = mkdtempSync(path.join(tmpdir(), 'ui-blocker-profile-'));
  const server = await startDemoServer();
  const demoUrl = `http://127.0.0.1:${server.address().port}/`;

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${root}`,
      `--load-extension=${root}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-search-engine-choice-screen',
      '--hide-crash-restore-bubble',
    ],
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });

  try {
    let [worker] = context.serviceWorkers();
    if (!worker) worker = await context.waitForEvent('serviceworker', { timeout: 30_000 });
    const extensionId = new URL(worker.url()).host;

    const options = await context.newPage();
    await options.goto(`chrome-extension://${extensionId}/options.html`);

    let currentSettings = { ...settings };

    async function applySettings(patch) {
      currentSettings = { ...currentSettings, ...patch };
      await options.evaluate((payload) => new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'updateFilters', ...payload }, (response) => {
          if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
          else resolve(response);
        });
      }), currentSettings);
    }

    async function settle(page) {
      await page.waitForLoadState('load');
      await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true));
      await page.waitForTimeout(400);
    }

    async function capturePage(page, file, width, minHeight = 320, { hideStatus = false } = {}) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      if (hideStatus) {
        await page.evaluate(() => {
          const toast = document.getElementById('status');
          if (toast) toast.style.display = 'none';
        });
      }
      const contentHeight = await page.evaluate(() => Math.ceil(Math.max(
        document.body.scrollHeight,
        document.body.getBoundingClientRect().height
      )));
      await page.setViewportSize({ width, height: Math.max(contentHeight, minHeight) });
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(outDir, file) });
    }

    await applySettings({ theme: 'light' });
    await options.reload();
    await settle(options);
    await capturePage(options, 'options-light.png', 1040, 900, { hideStatus: true });

    await applySettings({ theme: 'dark' });
    await options.reload();
    await settle(options);
    await capturePage(options, 'options-dark.png', 1040, 900, { hideStatus: true });

    const popup = await context.newPage();
    await applySettings({ theme: 'light' });
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await settle(popup);
    await capturePage(popup, 'popup-light.png', 320);

    await applySettings({ theme: 'dark' });
    await popup.reload();
    await settle(popup);
    await capturePage(popup, 'popup-dark.png', 320);

    const demo = await context.newPage();
    await demo.setViewportSize({ width: 1100, height: 760 });

    await applySettings({
      theme: 'light',
      applyToAllDomains: true,
      domains: [],
      excludedDomains: [],
      isBlockerEnabled: false,
    });
    await demo.goto(demoUrl);
    await settle(demo);
    await demo.waitForTimeout(300);
    await demo.screenshot({ path: path.join(outDir, 'demo-before.png') });

    await applySettings({ isBlockerEnabled: true });
    await demo.reload();
    await settle(demo);
    await demo.waitForTimeout(600);
    const stylesApplied = await demo.evaluate(() =>
      Array.from(document.querySelectorAll('style')).some(style => style.textContent.includes('opacity:'))
    );
    if (!stylesApplied) throw new Error('Content script styles were not applied on the demo page');
    await demo.screenshot({ path: path.join(outDir, 'demo-after.png') });

    const files = ['popup-light', 'popup-dark', 'options-light', 'options-dark', 'demo-before', 'demo-after'];
    console.log(`Screenshots written to ${path.relative(root, outDir)}/`);
    for (const file of files) console.log(`  ${file}.png`);
  } finally {
    await context.close();
    server.close();
    rmSync(profileDir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
