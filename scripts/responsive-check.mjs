#!/usr/bin/env node
/**
 * Headless responsive verification for Phase 1 / Step 1.
 *
 * It checks public auth screens, the password-change screen and permission-gated
 * app-shell foundations at desktop, tablet and mobile widths. Backend-shaped API
 * responses are intercepted in the browser so the check does not need a running
 * Spring Boot service. This is a layout/behaviour smoke check, not a replacement
 * for a full axe/WCAG audit or live end-to-end backend integration.
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
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

const baseUrl = argumentValue('base-url', process.env.RESPONSIVE_BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '');
const outputPath = argumentValue('output', '');
const origin = new URL(baseUrl).origin;

const viewports = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: 'tablet', width: 834, height: 1112, isMobile: false, hasTouch: true },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const permissions = [
  'report:view',
  'request:view-own',
  'request:view-scope',
  'request:view-all',
  'request:create',
  'request:edit',
  'approval:view',
  'notification:view',
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

function currentUser(mustChangePassword) {
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
      minimumLength: 8,
      maximumLength: 64,
      requireUppercase: true,
      requireLowercase: true,
      requireDigit: true,
      requireSpecial: false,
    },
  };
}

const routes = [
  {
    name: 'Login',
    path: '/login',
    expectedHeading: 'Sign in to EDAM',
    authenticated: false,
    bootstrapped: true,
    mustChangePassword: false,
    shell: false,
  },
  {
    name: 'Bootstrap',
    path: '/bootstrap',
    expectedHeading: 'Create the administrator',
    authenticated: false,
    bootstrapped: false,
    mustChangePassword: false,
    shell: false,
  },
  {
    name: 'Forgot password',
    path: '/forgot-password',
    expectedHeading: 'Reset your password',
    authenticated: false,
    bootstrapped: true,
    mustChangePassword: false,
    shell: false,
  },
  {
    name: 'Reset password',
    path: '/reset-password?token=responsive-check-token',
    expectedHeading: 'Set your password',
    authenticated: false,
    bootstrapped: true,
    mustChangePassword: false,
    shell: false,
  },
  {
    name: 'Change password',
    path: '/change-password',
    expectedHeading: 'Change your password',
    authenticated: true,
    bootstrapped: true,
    mustChangePassword: true,
    shell: false,
  },
  {
    name: 'Dashboard',
    path: '/app/dashboard',
    expectedHeading: 'Dashboard',
    authenticated: true,
    bootstrapped: true,
    mustChangePassword: false,
    shell: true,
  },
  {
    name: 'My Requests',
    path: '/app/requests/mine',
    expectedHeading: 'My Requests',
    authenticated: true,
    bootstrapped: true,
    mustChangePassword: false,
    shell: true,
  },
  {
    name: 'Approval Inbox',
    path: '/app/approvals',
    expectedHeading: 'Approval Inbox',
    authenticated: true,
    bootstrapped: true,
    mustChangePassword: false,
    shell: true,
  },
  {
    name: 'Notifications',
    path: '/app/notifications',
    expectedHeading: 'Notifications',
    authenticated: true,
    bootstrapped: true,
    mustChangePassword: false,
    shell: true,
  },
];

function envelopeSuccess(data, path) {
  return {
    success: true,
    data,
    correlationId: 'responsive-check-correlation',
    path,
    timestamp: new Date().toISOString(),
  };
}

function envelopeFailure(code, message, path) {
  return {
    success: false,
    error: { code, message },
    correlationId: 'responsive-check-correlation',
    path,
    timestamp: new Date().toISOString(),
  };
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

function describeElement(element) {
  const rect = element.getBoundingClientRect();
  const label =
    element.getAttribute('aria-label') ??
    element.getAttribute('title') ??
    element.getAttribute('name') ??
    element.getAttribute('placeholder') ??
    (element.textContent ?? '').trim().slice(0, 70) ??
    element.id;
  return {
    tag: element.tagName.toLowerCase(),
    label: label || '(unnamed)',
    className: String(element.className ?? '').slice(0, 100),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

async function preInteractionAudit(page, expectedWidth) {
  return page.evaluate((width) => {
    const isVisible = (element) => {
      let node = element;
      while (node && node.nodeType === 1) {
        const style = getComputedStyle(node);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          Number(style.opacity) === 0 ||
          node.getAttribute('aria-hidden') === 'true'
        ) {
          return false;
        }
        node = node.parentElement;
      }
      if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      );
    };
    const sidebar = Array.from(document.querySelectorAll('aside')).find((element) =>
      String(element.className ?? '').includes('shrink-0'),
    );
    const mobileNavButton = document.querySelector('button[aria-label="Open navigation"]');
    return {
      viewportWidth: window.innerWidth,
      expectedWidth: width,
      viewportMatches: Math.abs(window.innerWidth - width) <= 1,
      desktopSidebarVisible: sidebar ? isVisible(sidebar) : false,
      mobileNavVisible: mobileNavButton ? isVisible(mobileNavButton) : false,
    };
  }, expectedWidth);
}

async function fullAudit(page, preInteraction) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((done) => setTimeout(done, 160));
  });

  return page.evaluate((pre) => {
    const isVisible = (element) => {
      let node = element;
      while (node && node.nodeType === 1) {
        const style = getComputedStyle(node);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          Number(style.opacity) === 0 ||
          node.getAttribute('aria-hidden') === 'true'
        ) {
          return false;
        }
        node = node.parentElement;
      }
      if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      );
    };

    const describe = (element) => {
      const rect = element.getBoundingClientRect();
      const label =
        element.getAttribute('aria-label') ??
        element.getAttribute('title') ??
        element.getAttribute('name') ??
        element.getAttribute('placeholder') ??
        (element.textContent ?? '').trim().slice(0, 70) ??
        element.id;
      return {
        tag: element.tagName.toLowerCase(),
        label: label || '(unnamed)',
        className: String(element.className ?? '').slice(0, 100),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    };

    const accessibleName = (element) => {
      const ariaLabel = element.getAttribute('aria-label')?.trim();
      if (ariaLabel) return ariaLabel;
      const labelledBy = element.getAttribute('aria-labelledby')?.trim();
      if (labelledBy) {
        const text = labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
          .filter(Boolean)
          .join(' ');
        if (text) return text;
      }
      if (element.id) {
        const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
        const labelText = label?.textContent?.trim();
        if (labelText) return labelText;
      }
      const parentLabel = element.closest('label');
      if (parentLabel?.textContent?.trim()) return parentLabel.textContent.trim();
      const ownText = element.textContent?.trim();
      if (ownText) return ownText;
      const title = element.getAttribute('title')?.trim();
      if (title) return title;
      const value = element.getAttribute('value')?.trim();
      if (value) return value;
      const placeholder = element.getAttribute('placeholder')?.trim();
      if (placeholder) return placeholder;
      return '';
    };

    const doc = document.documentElement;
    const body = document.body;
    const clientWidth = doc.clientWidth;
    const overflow = Math.max(doc.scrollWidth, body.scrollWidth) - clientWidth;
    const offenders =
      overflow > 1
        ? Array.from(document.querySelectorAll('*'))
            .filter(isVisible)
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.right > window.innerWidth + 1 || rect.left < -1;
            })
            .slice(0, 6)
            .map(describe)
        : [];

    const interactiveSelector =
      'a[href], button, input, select, textarea, [role="button"], [role="link"], [role="combobox"]';
    const interactives = Array.from(new Set(document.querySelectorAll(interactiveSelector))).filter(isVisible);
    // CSS transforms can produce 39.996px for a nominal 40px control; allow half a pixel.
    const minimumTouchTarget = 39.5;
    const smallTargets = interactives
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width < minimumTouchTarget || rect.height < minimumTouchTarget;
      })
      .map(describe);
    const unnamedInteractives = interactives
      .filter((element) => !accessibleName(element))
      .map(describe);

    const forms = Array.from(document.querySelectorAll('form')).filter(isVisible);
    const multiColumnFormGrids = forms.flatMap((form) =>
      Array.from(form.querySelectorAll('*'))
        .concat(form)
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.display === 'grid' || style.display === 'inline-grid';
        })
        .filter((element) => isVisible(element))
        .map((element) => ({
          columns: getComputedStyle(element).gridTemplateColumns,
          className: String(element.className ?? '').slice(0, 100),
        }))
        .filter((entry) => entry.columns && entry.columns !== 'none' && entry.columns.split(/\s+/).length > 1),
    );

    const tables = Array.from(document.querySelectorAll('table')).filter(isVisible);
    const tableScrollStatus = tables.map((table) => {
      let scrollable = false;
      let node = table;
      while (node && node.nodeType === 1) {
        const overflowX = getComputedStyle(node).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll') {
          scrollable = true;
          break;
        }
        node = node.parentElement;
      }
      return { scrollable, width: Math.round(table.getBoundingClientRect().width) };
    });

    const primaryNavVisible = Array.from(
      document.querySelectorAll('nav[aria-label="Primary navigation"]'),
    ).some(isVisible);

    return {
      viewportWidth: pre.viewportWidth,
      expectedWidth: pre.expectedWidth,
      viewportMatches: pre.viewportMatches,
      clientWidth,
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      overflow,
      offenders,
      interactiveCount: interactives.length,
      smallTargets,
      unnamedInteractives,
      formCount: forms.length,
      multiColumnFormGrids,
      tableCount: tables.length,
      tablesWithoutHorizontalScroll: tableScrollStatus.filter((table) => !table.scrollable).length,
      desktopSidebarVisible: pre.desktopSidebarVisible,
      mobileNavVisible: pre.mobileNavVisible,
      primaryNavVisible,
      headingText: Array.from(document.querySelectorAll('h1,h2,h3'))
        .filter(isVisible)
        .map((heading) => heading.textContent?.trim())
        .filter(Boolean),
    };
  }, preInteraction);
}

function attachMockApi(page, route, observability) {
  const user = route.authenticated ? currentUser(route.mustChangePassword) : null;

  const respond = async (request, status, payload, extraHeaders = {}) => {
    await request.respond({
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin',
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
    });
  };

  page.on('request', (request) => {
    void (async () => {
      const url = new URL(request.url());
      if (!url.pathname.startsWith('/api/v1/')) {
        await request.continue();
        return;
      }
      const path = url.pathname;
      const method = request.method().toUpperCase();
      switch (path) {
        case '/api/v1/public/configuration':
          await respond(request, 200, envelopeSuccess(publicConfiguration, path));
          return;
        case '/api/v1/auth/installation':
          await respond(
            request,
            200,
            envelopeSuccess(
              route.bootstrapped
                ? { bootstrapped: true, bootstrappedAt: '2026-11-18T08:00:00Z' }
                : { bootstrapped: false, bootstrappedAt: null },
              path,
            ),
          );
          return;
        case '/api/v1/auth/me':
          if (!user) {
            await respond(request, 401, envelopeFailure('EDAM-2001', 'Sign in is required.', path));
          } else {
            await respond(request, 200, envelopeSuccess(user, path));
          }
          return;
        case '/api/v1/auth/csrf':
          await respond(
            request,
            200,
            envelopeSuccess(
              {
                headerName: 'X-XSRF-TOKEN',
                parameterName: '_csrf',
                token: 'responsive-check-csrf',
              },
              path,
            ),
            { 'Set-Cookie': 'XSRF-TOKEN=responsive-check-csrf; Path=/; SameSite=Lax' },
          );
          return;
        case '/api/v1/approvals/count':
          await respond(request, 200, envelopeSuccess(3, path));
          return;
        case '/api/v1/notifications/unread-count':
          await respond(request, 200, envelopeSuccess({ count: 2 }, path));
          return;
        default:
          observability.unexpectedApiRequests.push(`${method} ${path}`);
          await respond(request, 200, envelopeSuccess(null, path));
      }
    })().catch((error) => {
      observability.runtimeErrors.push(`Request interception failed: ${String(error)}`);
      void request.abort().catch(() => undefined);
    });
  });
}

async function runCheck(browser, route, viewport) {
  const page = await browser.newPage();
  page.setDefaultTimeout(15_000);
  page.setDefaultNavigationTimeout(30_000);
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
  });
  await page.setRequestInterception(true);

  const observability = {
    runtimeErrors: [],
    consoleErrors: [],
    failedRequests: [],
    httpErrors: [],
    unexpectedApiRequests: [],
  };
  attachMockApi(page, route, observability);

  page.on('pageerror', (error) => observability.runtimeErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const location = message.location()?.url ?? '';
    observability.consoleErrors.push({ text: message.text(), location });
  });
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? 'unknown failure';
    if (request.url().includes('/api/v1/') || failure.includes('ERR_ABORTED')) return;
    observability.failedRequests.push({ url: request.url(), failure });
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    let path = '';
    try {
      path = new URL(response.url()).pathname;
    } catch {
      path = response.url();
    }
    if (path.startsWith('/api/v1/') || path.includes('favicon.ico')) return;
    observability.httpErrors.push({ status: response.status(), url: response.url() });
  });

  const context = `${route.name} / ${viewport.name} ${viewport.width}×${viewport.height}`;
  const failures = [];
  let checks = null;
  let drawerError = null;

  try {
    await page.setCookie({
      name: 'XSRF-TOKEN',
      value: 'responsive-check-csrf',
      url: baseUrl,
    });
    await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      (expected) =>
        Array.from(document.querySelectorAll('h1,h2,h3')).some((heading) =>
          (heading.textContent ?? '').includes(expected),
        ),
      { timeout: 15_000 },
      route.expectedHeading,
    );

    const preInteraction = await preInteractionAudit(page, viewport.width);

    if (route.shell && viewport.width < 1024 && preInteraction.mobileNavVisible) {
      try {
        await page.click('button[aria-label="Open navigation"]');
        await page.waitForFunction(
          () => {
            const visible = (element) => {
              let node = element;
              while (node && node.nodeType === 1) {
                const style = getComputedStyle(node);
                if (
                  style.display === 'none' ||
                  style.visibility === 'hidden' ||
                  Number(style.opacity) === 0 ||
                  node.getAttribute('aria-hidden') === 'true'
                ) {
                  return false;
                }
                node = node.parentElement;
              }
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
            };
            return Array.from(document.querySelectorAll('nav[aria-label="Primary navigation"]')).some(visible);
          },
          { timeout: 6_000 },
        );
        await new Promise((done) => setTimeout(done, 220));
      } catch (error) {
        drawerError = String(error);
      }
    }

    checks = await fullAudit(page, preInteraction);

    if (!checks.viewportMatches) {
      failures.push({ reason: `Viewport width ${checks.viewportWidth}px did not match ${viewport.width}px` });
    }
    if (checks.overflow > 1) {
      failures.push({
        reason: `Horizontal overflow ${checks.overflow}px`,
        details: checks.offenders,
      });
    }
    if (checks.smallTargets.length > 0) {
      failures.push({ reason: 'Interactive controls below 40×40px', details: checks.smallTargets });
    }
    if (checks.unnamedInteractives.length > 0) {
      failures.push({ reason: 'Interactive controls missing accessible names', details: checks.unnamedInteractives });
    }
    if (viewport.width < 768 && checks.multiColumnFormGrids.length > 0) {
      failures.push({ reason: 'Visible form uses multiple columns below md', details: checks.multiColumnFormGrids });
    }
    if (viewport.width < 768 && checks.tablesWithoutHorizontalScroll > 0) {
      failures.push({ reason: `${checks.tablesWithoutHorizontalScroll} table(s) lack a horizontal-scroll wrapper below md` });
    }
    if (route.shell) {
      if (viewport.width >= 1024) {
        if (!checks.desktopSidebarVisible) failures.push({ reason: 'Desktop sidebar is not visible at lg or above' });
        if (checks.mobileNavVisible) failures.push({ reason: 'Mobile navigation trigger is visible on desktop' });
      } else {
        if (checks.desktopSidebarVisible) failures.push({ reason: 'Desktop sidebar remains visible below lg' });
        if (!checks.mobileNavVisible) failures.push({ reason: 'Mobile navigation trigger is hidden below lg' });
      }
      if (!checks.primaryNavVisible) failures.push({ reason: 'Primary navigation is not accessible in the active layout' });
      if (drawerError) failures.push({ reason: `Mobile navigation drawer did not open: ${drawerError}` });
    } else {
      if (checks.desktopSidebarVisible || checks.mobileNavVisible || checks.primaryNavVisible) {
        failures.push({ reason: 'Public/change-password screen unexpectedly renders app-shell navigation' });
      }
    }
    if (observability.runtimeErrors.length > 0) {
      failures.push({ reason: 'Browser runtime errors', details: observability.runtimeErrors });
    }
    const unexpectedConsoleErrors = observability.consoleErrors.filter(({ text, location }) => {
      if (text.includes('status of 401')) return false;
      if (text.includes('favicon.ico') || location.includes('favicon.ico')) return false;
      return true;
    });
    if (unexpectedConsoleErrors.length > 0) {
      failures.push({ reason: 'Unexpected browser console errors', details: unexpectedConsoleErrors });
    }
    if (observability.failedRequests.length > 0) {
      failures.push({ reason: 'Unexpected failed requests', details: observability.failedRequests });
    }
    if (observability.httpErrors.length > 0) {
      failures.push({ reason: 'Unexpected HTTP errors', details: observability.httpErrors });
    }
    if (observability.unexpectedApiRequests.length > 0) {
      failures.push({ reason: 'Unexpected API calls', details: observability.unexpectedApiRequests });
    }
  } catch (error) {
    let bodyText = '';
    try {
      bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 400) ?? '');
    } catch {
      bodyText = '(body unavailable)';
    }
    failures.push({ reason: `Page check failed: ${String(error)}`, details: { bodyText } });
  } finally {
    await page.close().catch(() => undefined);
  }

  const result = {
    context,
    route: route.name,
    path: route.path,
    viewport: viewport.name,
    width: viewport.width,
    height: viewport.height,
    status: failures.length === 0 ? 'passed' : 'failed',
    checks,
    failures: failures.map((failure) => ({ context, ...failure })),
  };
  console.log(`${result.status === 'passed' ? 'PASS' : 'FAIL'} ${context}`);
  for (const failure of result.failures) {
    console.log(`  - ${failure.reason}`);
  }
  return result;
}

async function main() {
  if (args.includes('--help')) {
    console.log('Usage: node scripts/responsive-check.mjs [--base-url=http://127.0.0.1:5173] [--output=/tmp/responsive.json]');
    return;
  }

  const executablePath = await prepareChromium();
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: 'shell',
    defaultViewport: { width: viewports[0].width, height: viewports[0].height },
    protocolTimeout: 60_000,
  });

  const results = [];
  try {
    for (const viewport of viewports) {
      console.log(`\n${viewport.name.toUpperCase()} ${viewport.width}×${viewport.height}`);
      for (const route of routes) {
        results.push(await runCheck(browser, route, viewport));
      }
    }
  } finally {
    await browser.close().catch(() => undefined);
  }

  const failures = results.flatMap((result) => result.failures);
  const routeSummaries = routes.map((route) => {
    const routeResults = results.filter((result) => result.route === route.name);
    return {
      name: route.name,
      path: route.path,
      passed: routeResults.filter((result) => result.status === 'passed').length,
      total: routeResults.length,
      viewports: routeResults.map((result) => ({
        name: result.viewport,
        status: result.status,
        overflow: result.checks?.overflow ?? null,
        interactiveCount: result.checks?.interactiveCount ?? null,
        smallTargets: result.checks?.smallTargets.length ?? null,
        formCount: result.checks?.formCount ?? null,
        tableCount: result.checks?.tableCount ?? null,
        desktopSidebarVisible: result.checks?.desktopSidebarVisible ?? null,
        mobileNavVisible: result.checks?.mobileNavVisible ?? null,
        primaryNavVisible: result.checks?.primaryNavVisible ?? null,
      })),
    };
  });

  const report = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    browser: {
      name: 'Chromium headless shell (@sparticuz/chromium)',
      executablePath,
    },
    mockApi: 'Handover-shaped session, configuration, installation and badge envelopes intercepted in-browser; no live backend required.',
    touchTargetPolicy: 'Minimum 40×40 CSS px; 0.5px subpixel tolerance for transformed controls.',
    viewports,
    totals: {
      checks: results.length,
      passed: results.filter((result) => result.status === 'passed').length,
      failed: failures.length > 0 ? results.filter((result) => result.status === 'failed').length : 0,
      failureDetails: failures.length,
      routes: routes.length,
      interactiveControlsInspected: results.reduce((sum, result) => sum + (result.checks?.interactiveCount ?? 0), 0),
      formsInspected: results.reduce((sum, result) => sum + (result.checks?.formCount ?? 0), 0),
      tablesInspected: results.reduce((sum, result) => sum + (result.checks?.tableCount ?? 0), 0),
    },
    routeSummaries,
    failures,
  };

  console.log(`\nResponsive summary: ${report.totals.passed}/${report.totals.checks} route/viewport checks passed.`);
  console.log(`Inspected ${report.totals.interactiveControlsInspected} interactive controls, ${report.totals.formsInspected} forms and ${report.totals.tablesInspected} data tables.`);
  if (failures.length > 0) console.log(`${failures.length} failure detail(s) recorded.`);

  if (outputPath) {
    const target = isAbsolute(outputPath) ? outputPath : resolve(root, outputPath);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`JSON report: ${target}`);
  }
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
