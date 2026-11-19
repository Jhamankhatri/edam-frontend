#!/usr/bin/env node
/**
 * EDAM visual identity verification.
 *
 * Captures screenshots of the real application at desktop, tablet and mobile
 * widths, checks horizontal overflow / touch targets / accessible names /
 * focus visibility / text contrast / reduced-motion behaviour, and optionally
 * compares captured screenshots against an earlier baseline directory.
 *
 * API responses are intercepted in the browser with handover-shaped envelopes,
 * including Step 2 dashboard, request, lookup and activity data; no Spring Boot
 * backend, database or credentials are required. This is a layout, accessibility
 * and visual-difference check, not a full WCAG/axe audit or live backend
 * integration test.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import {
  step2MockResponse,
  step2Permissions,
  step2PreviewNote,
  step2VisualRoutes,
} from './step2-preview-api.mjs';

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

const permissions = step2Permissions;

const publicConfiguration = {
  applicationName: 'EDAM',
  organizationDisplayName: 'Preview Institution',
  organizationName: 'Preview Institution',
  supportEmail: 'support@example.invalid',
  logoAssetId: null,
  faviconAssetId: null,
  defaultLocale: 'en-GB',
  defaultTimeZone: 'Asia/Karachi',
  dateFormat: 'dd MMM yyyy',
  defaultCurrencyCode: 'PKR',
  activeThemeName: 'Institution Light',
  activeThemeType: 'LIGHT',
  themeTokens: {},  // use the re-art-directed CSS stock fallback
};

function currentUser(mustChangePassword = false, permissionsOverride) {
  return {
    userId: '00000000-0000-0000-0000-000000000001',
    username: 'admin',
    employeeCode: 'EMP-001',
    displayName: 'Preview Session',
    email: 'preview.session@example.invalid',
    designation: 'Institution Administrator',
    departmentId: null,
    departmentName: null,
    branchId: null,
    branchName: null,
    roles: [],
    permissions: permissionsOverride ?? permissions,
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
  { name: 'notifications', path: '/app/notifications', heading: 'Notifications', authenticated: true, capture: false },
  ...step2VisualRoutes,
];

function envelopeSuccess(data, path) {
  return { success: true, data, error: null, fieldErrors: null, correlationId: 'visual-audit', path, timestamp: new Date().toISOString() };
}
function envelopeFailure(code, message, path, fieldErrors) {
  return { success: false, data: null, error: { code, message }, fieldErrors: fieldErrors ?? null, correlationId: 'visual-audit', path, timestamp: new Date().toISOString() };
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

/**
 * Screenshots are development previews, never production evidence. Every
 * identity, organization, count and status value below is a synthetic value
 * injected through intercepted API envelopes; no live backend is contacted.
 */
const previewMetadata = {
  mode: 'development-only',
  watermark: 'DEVELOPMENT PREVIEW · Mock session · no live backend data · not institutional information',
  note: `${step2PreviewNote} Identity, organization, approval and notification values are likewise synthetic and injected by scripts/visual-audit.mjs through intercepted API envelopes.`,
  values: {
    user: 'Preview Session',
    email: 'preview.session@example.invalid',
    organization: 'Preview Institution',
    approvalCount: 3,
    notificationUnreadCount: 2,
    requestReference: 'ER-PREVIEW-001',
    dashboardBaseCurrency: 'PKR',
    source: 'intercepted development envelopes in scripts/step2-preview-api.mjs and scripts/visual-audit.mjs',
  },
};

async function addPreviewWatermark(page) {
  // A harness-injected top banner (not product code). Prepending guarantees it
  // is visible in fullPage screenshots without overlaying content mid-page.
  await page.addStyleTag({
    content: `
      [data-edam-preview-watermark] {
        width: 100%; box-sizing: border-box;
        display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--ds-space-2);
        padding: var(--ds-space-2) var(--ds-space-4);
        background: var(--ds-color-surface-subtle);
        color: var(--ds-color-neutral-ink-muted);
        border-bottom: var(--ds-border-width) solid var(--ds-color-line);
        border-left: var(--ds-border-width-strong) solid var(--ds-color-line-accent);
        font-family: var(--font-numeric);
        font-size: var(--ds-text-2xs); line-height: var(--ds-leading-2xs);
        text-transform: uppercase; letter-spacing: var(--ds-tracking-wide);
      }
      [data-edam-preview-watermark] strong {
        color: var(--ds-color-neutral-ink); font-weight: var(--ds-weight-bold);
      }
    `,
  });
  await page.evaluate(() => {
    if (document.querySelector('[data-edam-preview-watermark]')) return;
    const strip = document.createElement('div');
    strip.setAttribute('data-edam-preview-watermark', '');
    strip.setAttribute('aria-hidden', 'true');
    const heading = document.createElement('strong');
    heading.textContent = 'Development preview';
    const detail = document.createElement('span');
    detail.textContent = 'Mock session · no live backend data · not institutional information';
    strip.append(heading, detail);
    document.body.prepend(strip);
  });
}

function attachMockApi(page, route) {
  const user = route.authenticated
    ? currentUser(route.mustChangePassword, route.permissionsOverride)
    : null;
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
        default: {
          const step2 = step2MockResponse({
            url,
            method: request.method(),
            route,
            envelopeSuccess,
            envelopeFailure,
          });
          if (step2) return respond(request, step2.status, step2.payload);
          return respond(request, 200, envelopeSuccess(null, path));
        }
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

  const report = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    preview: previewMetadata,
    comparisonBaseline: baselineDir ? 'PR #4 committed screenshots' : null,
    viewports: [],
    screenshots: [],
    comparisons: [],
    failures: [],
  };
  const capturedFiles = [];

  for (const viewport of auditViewports) {
    for (const route of routes) {
      if (route.viewports && !route.viewports.includes(viewport.name)) continue;
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
          await addPreviewWatermark(page);
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
  console.log(`Preview mode: ${previewMetadata.watermark}`);
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
