#!/usr/bin/env node
/**
 * Design-system governance. Fails when a component bypasses the token layer
 * or when the token/Tailwind contract drifts. No runtime dependencies.
 *
 *   npm run check:design
 */
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokenFile = join(root, 'src/styles/tokens.css');
const styleFile = join(root, 'src/styles/index.css');
const tailwindFile = join(root, 'tailwind.config.ts');

const failures = [];
const fail = (message) => failures.push(message);

async function read(path) {
  return readFile(path, 'utf8');
}

async function walk(directory, extensionPattern) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'generated') continue;
      files.push(...await walk(full, extensionPattern));
    } else if (extensionPattern.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const [tokens, styles, tailwind, cssFiles, sourceFiles] = await Promise.all([
  read(tokenFile),
  read(styleFile),
  read(tailwindFile),
  walk(join(root, 'src/styles'), /\.css$/),
  walk(join(root, 'src'), /\.(ts|tsx)$/),
]);

/* 1. Every CSS custom property referenced anywhere must be declared once. */
// Custom properties may share a line (paired size/leading declarations), so
// scan every `--name:` occurrence rather than anchoring to line starts.
const propertyDeclaration = /(--[A-Za-z][A-Za-z0-9_-]*)\s*:/g;
const declared = new Set(
  Array.from(tokens.matchAll(propertyDeclaration), (match) => match[1]),
);
const declarations = Array.from(tokens.matchAll(propertyDeclaration), (match) => match[1]);
const duplicates = declarations.filter((name, index) => declarations.indexOf(name) !== index);
// Progressive-enhancement fallbacks are declared twice (literal followed by
// color-mix); nothing else may be duplicated.
const progressiveFallbacks = new Set(['--ds-glow-primary', '--ds-gradient-primary']);
const unexpectedDuplicates = [...new Set(duplicates)].filter((name) => !progressiveFallbacks.has(name));
if (unexpectedDuplicates.length > 0) fail(`Duplicate token declarations: ${unexpectedDuplicates.join(', ')}`);

const referenceTargets = [tokens, styles, tailwind];
for (const file of cssFiles) if (file !== tokenFile) referenceTargets.push(await read(file));
for (const file of sourceFiles) referenceTargets.push(await read(file));

const referenced = new Set();
for (const text of referenceTargets) {
  for (const match of text.matchAll(/var\(\s*(--[A-Za-z][A-Za-z0-9_-]*)/g)) referenced.add(match[1]);
}
const undeclared = [...referenced].filter((name) => !declared.has(name)).sort();
if (undeclared.length > 0) fail(`Undeclared CSS variables: ${undeclared.join(', ')}`);

/* 2. The H08 server-overridable contract boundary must remain intact. */
const h08Keys = [
  'background', 'foreground', 'muted', 'muted-foreground', 'card', 'border',
  'input', 'ring', 'primary', 'primary-foreground', 'secondary',
  'secondary-foreground', 'accent', 'accent-foreground', 'destructive',
  'destructive-foreground', 'success', 'warning', 'info', 'radius',
];
for (const key of h08Keys) {
  if (!declared.has(`--${key}`)) fail(`H08 contract token --${key} is missing`);
}

/* 3. Required design-system layers must exist. */
const requiredGroups = [
  ['semantic colour', /--ds-color-primary\s*:/],
  ['typography', /--ds-text-sm\s*:/],
  ['line heights', /--ds-leading-sm\s*:/],
  ['weights', /--ds-weight-semibold\s*:/],
  ['spacing unit', /--ds-space-unit\s*:/],
  ['radii', /--ds-radius-2xl\s*:/],
  ['elevation', /--ds-shadow-layered\s*:/],
  ['gradients', /--ds-gradient-auth\s*:/],
  ['motion duration', /--ds-duration-standard\s*:/],
  ['motion easing', /--ds-ease-standard\s*:/],
  ['interaction states', /--ds-state-hover-light\s*:/],
  ['breakpoints', /--ds-breakpoint-lg\s*:/],
  ['chart foundations', /--ds-chart-series-1\s*:/],
];
for (const [label, pattern] of requiredGroups) {
  if (!pattern.test(tokens)) fail(`Missing design-token group: ${label}`);
}
if (!tailwind.includes('screens:')) fail('Tailwind breakpoints are not explicitly documented');
if (!styles.includes('prefers-reduced-motion: reduce')) fail('Reduced-motion override is missing');

/* 4. Tokens must be declared in exactly one stylesheet. */
for (const file of cssFiles) {
  if (file === tokenFile) continue;
  const text = await read(file);
  if (/(--[A-Za-z][A-Za-z0-9_-]*)\s*:/.test(text)) {
    fail(`CSS variables declared outside tokens.css: ${relative(root, file)}`);
  }
}

/* 5. Component sources must not bypass the token layer. */
const colorLiteral = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d|hsla?\(\s*\d/;
const inlineStyle = /style\s*=\s*\{\{/;
const arbitraryValue = /-\[\s*\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|deg|s|ms)\b/;
const heavyBlur = /backdrop-blur-(?:md|lg|xl|2xl|3xl)|backdrop-filter\s*:\s*blur/;
const continuousDecor = /soft-float|animate-\[\s*.*infinite/;
const allowedColorFiles = new Set([
  'src/lib/theme.ts',           // last-resort runtime fallback for meta[theme-color]
  'src/test/fixtures.ts',       // test fixture of the backend contract
]);
for (const file of sourceFiles) {
  const relativePath = relative(root, file).replaceAll('\\', '/');
  if (/\.test\.(ts|tsx)$/.test(relativePath)) continue;
  if (allowedColorFiles.has(relativePath)) continue;
  const text = await read(file);
  if (colorLiteral.test(text)) fail(`Hardcoded colour literal in ${relativePath}`);
  if (inlineStyle.test(text)) fail(`Ordinary inline CSS in ${relativePath}`);
  if (arbitraryValue.test(text)) fail(`Arbitrary spacing/size value in ${relativePath}`);
  if (heavyBlur.test(text)) fail(`Excessive backdrop blur in ${relativePath}`);
  if (continuousDecor.test(text)) fail(`Continuous decorative animation in ${relativePath}`);
}
if (continuousDecor.test(tailwind)) fail('Continuous decorative animation declared in Tailwind config');
if (/backdrop-filter\s*:\s*blur/.test(styles)) fail('Excessive backdrop blur declared in component CSS');

/* 6. Targeted WCAG contrast checks on the token pairs that render small text.
   Transparent foregrounds are blended over their resolved background. This is
   a deterministic token-pair check, not a full page-level WCAG/axe audit. */
const tokenValues = new Map();
for (const match of tokens.matchAll(/(--[A-Za-z][A-Za-z0-9_-]*)\s*:\s*([^;]+);/g)) {
  tokenValues.set(match[1], match[2].trim());
}
function resolveToken(name, depth = 0) {
  if (depth > 12) return '';
  const raw = tokenValues.get(name) ?? '';
  return raw.replace(/var\(\s*(--[A-Za-z][A-Za-z0-9_-]*)\s*\)/g, (_, ref) => resolveToken(ref, depth + 1));
}
function parseColor(name) {
  const value = resolveToken(name).trim();
  const short = value.match(/^#([0-9a-f]{3})$/i);
  if (short) return short[1].split('').map((c) => parseInt(c + c, 16)).concat(1);
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)).concat(1);
  const rgb = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] === undefined ? 1 : Number(rgb[4])];
  return null;
}
const blendOver = (fg, bg) => {
  const alpha = fg[3] ?? 1;
  return [0, 1, 2].map((i) => fg[i] * alpha + bg[i] * (1 - alpha));
};
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
function contrast(foreground, background) {
  const parsedBackground = parseColor(background);
  const parsedForeground = parseColor(foreground);
  if (!parsedBackground || !parsedForeground) return null;
  const bg = blendOver(parsedBackground, [255, 255, 255]);
  const fg = blendOver(parsedForeground, bg);
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
const contrastPairs = [
  ['body ink / canvas', '--ds-color-neutral-ink', '--ds-color-canvas'],
  ['body ink / surface', '--ds-color-neutral-ink', '--ds-color-surface'],
  ['muted ink / surface', '--ds-color-neutral-ink-muted', '--ds-color-surface'],
  ['brand ink / navy', '--ds-color-on-brand', '--brand-navy'],
  ['brand strong / navy', '--ds-color-on-brand-strong', '--brand-navy'],
  ['brand muted / navy', '--ds-color-on-brand-muted', '--brand-navy'],
  ['brand quiet / navy', '--ds-color-on-brand-quiet', '--brand-navy'],
  ['brand faint / navy', '--ds-color-on-brand-faint', '--brand-navy'],
  ['primary ink / primary', '--primary-foreground', '--primary'],
  ['danger ink / danger fill', '--destructive-foreground', '--destructive'],
  ['secondary ink / secondary', '--secondary-foreground', '--secondary'],
  ['accent ink / accent', '--accent-foreground', '--accent'],
  ['gold ink / gold', '--ds-color-accent-foreground', '--ds-color-accent'],
  ['success text / tint', '--ds-color-status-success-ink', '--ds-color-status-success-surface'],
  ['warning text / tint', '--ds-color-status-warning-ink', '--ds-color-status-warning-surface'],
  ['danger text / tint', '--ds-color-status-danger-ink', '--ds-color-status-danger-surface'],
  ['info text / tint', '--ds-color-status-info-ink', '--ds-color-status-info-surface'],
  ['danger fill text / tint', '--destructive', '--ds-color-status-danger-surface'],
  ['danger fill text / surface', '--destructive', '--ds-color-surface'],
];
const contrastResults = [];
for (const [label, foreground, background] of contrastPairs) {
  const ratio = contrast(foreground, background);
  if (ratio === null) {
    fail(`Could not resolve a contrast pair: ${label}`);
  } else {
    contrastResults.push(`${label} ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) fail(`${label} contrast ${ratio.toFixed(2)}:1 is below 4.5:1`);
  }
}

/* 7. Report. */
const summary = [
  `${declared.size} declared tokens`,
  `${referenced.size} referenced variables`,
  `${cssFiles.length} stylesheets`,
  `${sourceFiles.length} TS/TSX files scanned`,
];
if (failures.length > 0) {
  console.error(`Design-system check FAILED (${summary.join(', ')}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Design-system check passed (${summary.join(', ')}).`);
console.log(`Token contrast pairs (${contrastResults.length}, all >= 4.5:1):`);
for (const result of contrastResults) console.log(`  - ${result}`);
