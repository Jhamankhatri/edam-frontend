import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { resetThemeTokens } from '@/lib/theme';
import { resetBackendState, server } from './server';

class ResizeObserverMock implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

class PointerEventMock extends MouseEvent {
  readonly pointerId = 1;
  readonly pointerType = 'mouse';
  readonly isPrimary = true;
  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
  }
}

class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

function clearCookies(): void {
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim();
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`;
  }
}

// Node's fetch requires an absolute URL; browser-facing app code intentionally uses relative /api/v1 URLs.
// Resolve only at the network boundary so tests preserve the real relative-URL behavior.
const nodeFetch = globalThis.fetch.bind(globalThis);
Object.defineProperty(globalThis, 'fetch', {
  writable: true,
  value: (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const resolved =
      typeof input === 'string' && input.startsWith('/')
        ? new URL(input, window.location.href).toString()
        : input;
    return nodeFetch(resolved, init);
  },
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(globalThis, 'PointerEvent', {
  writable: true,
  value: PointerEventMock,
});
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
Object.defineProperty(window, 'scrollTo', { writable: true, value: vi.fn() });
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { writable: true, value: vi.fn() });
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', { writable: true, value: vi.fn(() => false) });
Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { writable: true, value: vi.fn() });
Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', { writable: true, value: vi.fn() });

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  resetBackendState();
  resetThemeTokens();
  clearCookies();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
  resetThemeTokens();
  clearCookies();
});
afterAll(() => server.close());
