import type { PublicConfigurationResponse } from '@/api/contracts';

const appliedProperties = new Set<string>();
const unsafeValue = /[;{}<>]/;

const tokenAliases: Record<string, readonly string[]> = {
  background: ['--background'],
  foreground: ['--foreground'],
  muted: ['--muted'],
  mutedForeground: ['--muted-foreground'],
  card: ['--card'],
  surface: ['--card'],
  border: ['--border'],
  input: ['--input'],
  ring: ['--ring'],
  primary: ['--primary'],
  primaryForeground: ['--primary-foreground'],
  secondary: ['--secondary'],
  secondaryForeground: ['--secondary-foreground'],
  accent: ['--accent'],
  accentForeground: ['--accent-foreground'],
  destructive: ['--destructive'],
  destructiveForeground: ['--destructive-foreground'],
  success: ['--success'],
  warning: ['--warning'],
  info: ['--info'],
  error: ['--destructive'],
  radius: ['--radius'],
  text: ['--foreground'],
  heading: ['--foreground'],
  navBg: ['--brand-navy'],
  navText: ['--primary-foreground'],
  buttonPrimary: ['--primary'],
  buttonPrimaryText: ['--primary-foreground'],
};

function normalizeTokenKey(key: string): string | null {
  const trimmed = key.trim();
  if (!/^--?[A-Za-z][A-Za-z0-9_-]*$/.test(trimmed)) return null;
  const withoutPrefix = trimmed.replace(/^--?/, '');
  const kebab = withoutPrefix
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
  return `--${kebab}`;
}

function aliasProperties(key: string): readonly string[] {
  const clean = key.trim().replace(/^--?/, '');
  const normalized = normalizeTokenKey(key);
  const aliases = tokenAliases[clean] ?? [];
  return [...new Set([...(normalized ? [normalized] : []), ...aliases])];
}

export function resetThemeTokens(): void {
  const root = document.documentElement;
  for (const property of appliedProperties) root.style.removeProperty(property);
  appliedProperties.clear();
}

export function applyThemeTokens(tokens: Record<string, string> | null | undefined): void {
  if (!tokens) return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(tokens)) {
    if (!value || unsafeValue.test(value)) continue;
    const properties = aliasProperties(key);
    if (properties.length === 0) continue;
    for (const property of properties) {
      root.style.setProperty(property, value);
      appliedProperties.add(property);
    }
  }
}

export function applyPublicBranding(config: PublicConfigurationResponse): void {
  applyThemeTokens(config.themeTokens);
  document.title = config.applicationName || 'EDAM';
  document.documentElement.lang = config.defaultLocale || 'en-GB';
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    const primary = config.themeTokens?.primary ?? config.themeTokens?.['--primary'];
    themeColor.setAttribute('content', primary && !unsafeValue.test(primary) ? primary : '#0b1f3a');
  }
}
