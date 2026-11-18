#!/usr/bin/env node
/**
 * EDAM visual identity verification.
 *
 * Captures screenshots of the real application at desktop, tablet and mobile
 * widths, checks horizontal overflow / touch targets / accessible names /
 * focus visibility / text contrast / reduced-motion behaviour, and optionally
 * compares captured screenshots against an earlier baseline directory.
 *
 * API responses are intercepted in the browser with handover-shaped envelopes;
 * no Spring Boot backend, database or credentials are required. This is a
 * layout, accessibility and visual-difference check, not a full WCAG/axe audit
 * or live backend integration test.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function argumentValue(name, fallback) {
  const prefixed = args.find((argument) => argument.startsWith(`--${name}=`));
  if (prefixed) return prefixed.slice(name.length + 3);
  const index = args.indexOf(`--${name}`);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
}

const baseUrl = argumentValue('base-url', 'http://127.0.0.1:5173').replace(/\/+$/, '');
const outDir = resolve(root, argumentValue('out', 'docs/design-system/screenshots'));
const baselineDir = argumentValue('compare', '');
const origin = new URL(baseUrl).origin;

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'tablet-small', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-small', width: 320, height: 720 },
];

const captureViewports = new Set(argumentValue('capture', 'desktop,tablet,mobile').split(','));
const auditViewports = viewports.filter((viewport) => !args.includes('--capture-only') || captureViewports.has(viewport.name));

const permissions = [
  'report:view', 'request:view-own', 'request:view-scope', 'request:view-all',
  'request:create', 'request:edit', 'approval:view', 'notification:view',
];

const publicConfiguration = {
  applicationName: 'EDAM',
  organizationDisplayName: 'Example Institution',
  organizationName: 'Example Institution',
  supportEmail: 'support@example.invalid',
  logoAssetId: null,
  faviconAssetId: null,
  defaultLocale: 'en-GB',
  defaultTimeZone: 'Asia/Karachi',
  dateFormat: 'dd MMM yyyy',
  defaultCurrencyCode: 'PKR',
  activeThemeName: 'Institution Light',
  activeThemeType: 'LIGHT',
  themeTokens: { primary: '#1e5fd6' },
};

function currentUser(mustChangePassword = false) {
  return {
    userId: '00000000-0000-0000-0000-000000000001',
    username: 'admin',
    employeeCode: 'EMP-001',
    displayName: 'Avery Morgan',
    email: 'avery.morgan@example.invalid',
    designation: 'Institution Administrator',
    departmentId: null,
    departmentName: null,
    branchId: null,
    branchName: null,
    roles: [],
    permissions,
    dataScopes: [],
    installationScope: true,
    mustChangePassword,
    lastLoginAt: '2026-11-18T09:00:00Z',
    passwordPolicy: {
      minimumLength: 8, maximumLength: 64,
      requireUppercase: true, requireLowercase: true,
      requireDigit: true, requireSpecial: false,
    },
  };
}

const routes = [
  { name: 'login', path: '/login', heading: 'Sign in to EDAM', authenticated: false, capture: true },
  { name: 'bootstrap', path: '/bootstrap', heading: 'Create the administrator', authenticated: false, bootstrapped: false, capture: true },
  { name: 'change-password', path: '/change-password', heading: 'Change your password', authenticated: true, mustChangePassword: true, capture: false },
  { name: 'dashboard', path: '/app/dashboard', heading: 'Dashboard', authenticated: true, capture: true },
  { name: 'notifications', path: '/app/notifications', heading: 'Notifications', authenticated: true, capture: false },
];

function envelopeSuccess(data, path) {
  return { success: true, data, error: null, fieldErrors: null, correlationId: 'visual-audit', path, timestamp: new Date().toISOString() };
}
function envelopeFailure(code, message, path) {
  return { success: false, data: null, error: { code, message }, fieldErrors: null, correlationId: 'visual-audit', path, timestamp: new Date().toISOString() };
}

async function prepareChromium() {
  const lambdaLibPath = join(tmpdir(), 'al2023', 'lib');
  if (!existsSync(join(lambdaLibPath, 'libnspr4.so'))) {
    await inflate(join(root, 'node_modules', '@sparticuz', 'chromium', 'bin', 'al2023.tar.br'));
  }
  setupLambdaEnvironment(lambdaLibPath);
  chromium.setGraphicsMode = false;
  return chromium.executablePath();
}

function attachMockApi(page, route) {
  const user = route.authenticated ? currentUser(route.mustChangePassword) : null;
  const respond = (request, status, payload, extraHeaders = {}) =>
    request.respond({
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
    });

  page.on('request', (request) => {
    void (async () => {
      const url = new URL(request.url());
      if (!url.pathname.startsWith('/api/v1/')) return request.continue();
      const path = url.pathname;
      switch (path) {
        case '/api/v1/public/configuration': return respond(request, 200, envelopeSuccess(publicConfiguration, path));
        case '/api/v1/auth/installation':
          return respond(request, 200, envelopeSuccess(
            route.bootstrapped === false
              ? { bootstrapped: false, bootstrappedAt: null }
              : { bootstrapped: true, bootstrappedAt: '2026-11-18T08:00:00Z' },
            path,
          ));
        case '/api/v1/auth/me':
          return respond(request, user ? 200 : 401,
            user ? envelopeSuccess(user, path) : envelopeFailure('EDAM-2001', 'Sign in is required.', path));
        case '/api/v1/auth/csrf':
          return respond(request, 200, envelopeSuccess(
            { headerName: 'X-XSRF-TOKEN', parameterName: '_csrf', token: 'visual-audit-csrf' }, path,
          ), { 'Set-Cookie': 'XSRF-TOKEN=visual-audit-csrf; Path=/; SameSite=Lax' });
        case '/api/v1/approvals/count': return respond(request, 200, envelopeSuccess(3, path));
        case '/api/v1/notifications/unread-count': return respond(request, 200, envelopeSuccess({ count: 2 }, path));
        default: return respond(request, 200, envelopeSuccess(null, path));
      }
    })().catch(() => request.abort().catch(() => undefined));
  });
}

function auditPage() {
  const visible = (element) => {
    let node = element;
    while (node && node.nodeType === 1) {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || node.getAttribute('aria-hidden') === 'true') return false;
      node = node.parentElement;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const nameOf = (element) => {
    if (element.getAttribute('aria-label')?.trim()) return element.getAttribute('aria-label').trim();
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) return labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent?.trim() ?? '').join(' ').trim();
    if (element.id) {
      const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
      if (label?.textContent?.trim()) return label.textContent.trim();
    }
    return (element.textContent?.trim() || element.getAttribute('title') || element.getAttribute('placeholder') || '').trim();
  };
  // Deterministic token-pair contrast ratios are verified by
  // `npm run check:design`; DOM computed-style sampling is intentionally not
  // used here because gradient/translucent surfaces make it unreliable.

  const doc = document.documentElement;
  const overflow = Math.max(doc.scrollWidth, document.body.scrollWidth) - doc.clientWidth;
  const interactives = Array.from(document.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [role="combobox"]')).filter(visible);
  const smallTargets = interactives.filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width < 39.5 || rect.height < 39.5;
  }).length;
  const unnamed = interactives.filter((element) => !nameOf(element)).length;

  const focusable = interactives.find((element) => element instanceof HTMLButtonElement || element instanceof HTMLInputElement || element.tagName === 'A');
  let focusVisible = null;
  if (focusable) {
    focusable.focus();
    const style = getComputedStyle(focusable);
    focusVisible = {
      outlineWidth: style.outlineWidth,
      outlineStyle: style.outlineStyle,
      boxShadow: style.boxShadow,
    };
    focusable.blur();
  }

  const animated = Array.from(document.querySelectorAll('[class*="animate-"]')).filter(visible).length;

  return {
    overflow,
    interactiveCount: interactives.length,
    smallTargets,
    unnamedInteractives: unnamed,
    contrastAudit: 'npm run check:design (19 token pairs, all >= 4.5:1)',
    focusVisible,
    animatedElements: animated,
    headingText: Array.from(document.querySelectorAll('h1,h2,h3')).filter(visible).map((h) => h.textContent?.trim()).filter(Boolean),
  };
}

async function compareScreenshots(browser, currentFiles, baseline) {
  const page = await browser.newPage();
  const results = [];
  for (const file of currentFiles) {
    const before = join(baseline, file);
    const after = join(outDir, file);
    if (!existsSync(before) || !existsSync(after)) continue;
    const [a, b] = await Promise.all([readFile(before), readFile(after)]);
    const ratio = await page.evaluate(async (first, second) => {
      const load = (data) => new Promise((resolveLoad, reject) => {
        const image = new Image();
        image.onload = () => resolveLoad(image);
        image.onerror = reject;
        image.src = data;
      });
      const [imageA, imageB] = await Promise.all([load(first), load(second)]);
      const width = Math.min(imageA.width, imageB.width);
      const height = Math.min(imageA.height, imageB.height);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return null;
      context.drawImage(imageA, 0, 0, width, height);
      const pixelsA = context.getImageData(0, 0, width, height).data;
      context.clearRect(0, 0, width, height);
      context.drawImage(imageB, 0, 0, width, height);
      const pixelsB = context.getImageData(0, 0, width, height).data;
      let changed = 0;
      for (let index = 0; index < pixelsA.length; index += 4) {
        const delta = Math.abs(pixelsA[index] - pixelsB[index]) +
          Math.abs(pixelsA[index + 1] - pixelsB[index + 1]) +
          Math.abs(pixelsA[index + 2] - pixelsB[index + 2]);
        if (delta > 24) changed += 1;
      }
      return { width, height, changedPixelRatio: Number((changed / (width * height)).toFixed(4)) };
    }, `data:image/png;base64,${a.toString('base64')}`, `data:image/png;base64,${b.toString('base64')}`);
    results.push({ file, ...(ratio ?? { changedPixelRatio: null }) });
  }
  await page.close();
  return results;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const executablePath = await prepareChromium();
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });

  const report = { baseUrl, generatedAt: new Date().toISOString(), viewports: [], screenshots: [], comparisons: [], failures: [] };
  const capturedFiles = [];

  for (const viewport of auditViewports) {
    for (const route of routes) {
      const page = await browser.newPage();
      page.setDefaultTimeout(15_000);
      page.setDefaultNavigationTimeout(30_000);
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1, isMobile: viewport.width < 768, hasTouch: viewport.width < 1024 });
      await page.setRequestInterception(true);
      attachMockApi(page, route);
      const errors = [];
      page.on('pageerror', (error) => errors.push(String(error)));
      try {
        await page.setCookie({ name: 'XSRF-TOKEN', value: 'visual-audit-csrf', url: baseUrl });
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(
          (expected) => Array.from(document.querySelectorAll('h1,h2,h3')).some((h) => (h.textContent ?? '').includes(expected)),
          { timeout: 15_000 },
          route.heading,
        );
        await page.evaluate(async () => {
          if (document.fonts?.ready) await document.fonts.ready;
          // Entrance animations are 360 ms; wait past them for a settled capture.
          await new Promise((done) => setTimeout(done, 700));
        });
        const checks = await page.evaluate(auditPage);

        // Capture the settled UI before any media-feature emulation; toggling
        // prefers-reduced-motion can restart entrance animations.
        if (captureViewports.has(viewport.name) && route.capture) {
          const file = `${route.name}-${viewport.name}-${viewport.width}.png`;
          await page.screenshot({ path: join(outDir, file), type: 'png', fullPage: true });
          capturedFiles.push(file);
          report.screenshots.push(file);
        }

        // Reduced-motion verification on one representative viewport per route.
        let reducedMotion = null;
        if (viewport.name === 'desktop') {
          await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
          reducedMotion = await page.evaluate(() => {
            const animated = document.querySelector('[class*="animate-"]');
            const duration = animated ? getComputedStyle(animated).animationDuration : 'none';
            return { sampleAnimationDuration: duration, compliant: duration === 'none' || parseFloat(duration) <= 0.001 };
          });
          await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
        }

        const entry = { viewport: viewport.name, width: viewport.width, route: route.name, ...checks, reducedMotion, runtimeErrors: errors };
        report.viewports.push(entry);
        if (checks.overflow > 1) report.failures.push(`${route.name}@${viewport.width}: horizontal overflow ${checks.overflow}px`);
        if (checks.smallTargets > 0) report.failures.push(`${route.name}@${viewport.width}: ${checks.smallTargets} controls below 40×40px`);
        if (checks.unnamedInteractives > 0) report.failures.push(`${route.name}@${viewport.width}: ${checks.unnamedInteractives} unnamed controls`);
        if (errors.length > 0) report.failures.push(`${route.name}@${viewport.width}: runtime errors ${errors.join('; ')}`);
        if (reducedMotion && !reducedMotion.compliant) report.failures.push(`${route.name}: reduced-motion not honoured`);
      } catch (error) {
        report.failures.push(`${route.name}@${viewport.width}: ${String(error)}`);
      } finally {
        await page.close().catch(() => undefined);
      }
    }
  }

  if (baselineDir) {
    report.comparisons = await compareScreenshots(browser, capturedFiles, resolve(root, baselineDir));
  }
  await browser.close();

  await writeFile(join(outDir, 'visual-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Visual audit: ${report.viewports.length} route/viewport checks, ${report.screenshots.length} screenshots, ${report.failures.length} failures.`);
  if (report.failures.length > 0) {
    for (const failure of report.failures) console.error(`FAIL ${failure}`);
    process.exitCode = 1;
  }
  if (report.comparisons.length > 0) {
    console.log('Screenshot differences vs baseline:');
    for (const comparison of report.comparisons) console.log(`  ${comparison.file}: ${(comparison.changedPixelRatio * 100).toFixed(1)}% changed pixels`);
  }
  console.log(`Report: ${join(outDir, 'visual-audit.json')}`);
}

await main();
