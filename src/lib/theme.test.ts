import { beforeEach, describe, expect, it } from 'vitest';
import { applyPublicBranding, applyThemeTokens, resetThemeTokens } from './theme';
import { publicConfiguration } from '@/test/fixtures';

describe('public branding and theme tokens', () => {
  beforeEach(() => {
    resetThemeTokens();
    document.title = 'EDAM';
    document.documentElement.lang = 'en-GB';
    document.querySelector('meta[name="theme-color"]')?.remove();
  });

  it('maps camelCase, kebab-case and CSS-variable aliases safely', () => {
    applyThemeTokens({
      primary: '#123456',
      navBg: '#abcdef',
      '--accent': '#fedcba',
      danger: 'red; }',
    });

    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#123456');
    expect(document.documentElement.style.getPropertyValue('--brand-navy')).toBe('#abcdef');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#fedcba');
    expect(document.documentElement.style.getPropertyValue('--danger')).toBe('');
  });

  it('applies public configuration branding without secrets or flags', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);

    applyPublicBranding(publicConfiguration);

    expect(document.title).toBe('EDAM');
    expect(document.documentElement.lang).toBe('en-GB');
    expect(meta.content).toBe('#1e5fd6');
  });

  it('creates the theme-color meta when the HTML shell omits a hardcoded color', () => {
    expect(document.querySelector('meta[name="theme-color"]')).toBeNull();

    applyPublicBranding(publicConfiguration);

    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      '#1e5fd6',
    );
  });
});
