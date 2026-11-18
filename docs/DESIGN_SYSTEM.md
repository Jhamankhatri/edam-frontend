# EDAM — Permanent Visual Identity & Design System

Status: foundation delivered for review on `arena/41408cdf-edam-frontend`. This
document is the product-wide design contract. It governs every current screen
and every future module; it does **not** implement future business modules,
change API contracts, or modify the finalized `Frontend Handover/` documents.

---

## 1. Baseline review and implementation plan

The merged baseline already had a working token file, Tailwind bridge, Radix-based
UI kit, permission-aware shell, auth/installation flows and a 27-check responsive
harness. It was **not** replaced. Review found these issues:

| Finding | Resolution |
| --- | --- |
| Base `h1,h2,h3 { @apply text-foreground }` made the desktop brand-panel headline dark-on-navy (effectively invisible). | Headings now inherit their surface's ink; `.auth-brand-panel` owns `--ds-color-on-brand`. Verified by a dedicated contrast sample in the visual audit. |
| Tokens existed but were a flat list with no documented primitives, scales, states or governance. | Rebuilt as five documented layers in `src/styles/tokens.css`; all Tailwind scales now resolve to CSS variables. |
| Flat white app canvas, flat cards, uniform radii. | Layered surface recipes, three-part restrained elevation, subtle gradients and an ambient top-right glow. |
| Infinite decorative `soft-float` animation and an 18px backdrop blur on auth cards. | Removed both; only purposeful entrance/loading motion remains, and all motion collapses under `prefers-reduced-motion`. |
| Form hints/errors were not programmatically associated with controls inside icon wrappers. | `FormField` now decorates nested controls with `aria-describedby` and `aria-invalid`. |
| No repeated page-header or data-presentation pattern; no chart token foundation. | Added `PageHeader`, `Surface`, `DataVizFrame` (explicit empty state, no fabricated values) and chart colour tokens. |
| No automated guard against reintroducing hardcoded colours, inline CSS or arbitrary values. | `scripts/design-system-check.mjs` runs locally and in CI. |

**Concise plan executed:** (1) centralize/document tokens and map every Tailwind
scale to them; (2) add governance to CI; (3) add the smallest set of genuinely
used primitives; (4) refine existing auth, shell, feedback and dashboard screens;
(5) document the system and future-module patterns; (6) add tests, screenshots,
before/after visual comparison and full quality gates; (7) open an unmerged PR.

---

## 2. Architecture

```
PublicConfigurationResponse.themeTokens
        │  src/lib/theme.ts  (safe runtime overrides; no invented capabilities)
        ▼
Layer 1  CONTRACT BOUNDARY   H08 keys, literal stock fallbacks   ── --primary, --background, …
Layer 2  PRIMITIVES          raw palette + alpha steps            ── --ds-palette-*
Layer 3  SEMANTIC COLOURS    intent aliases                      ── --ds-color-*, --ds-chart-*
Layer 4  SCALES              type / space / radius / elevation /
                            motion / states / layout / breakpoints
Layer 5  RECIPES             gradients, surfaces, status, shadows, scrollbars
        │
        ▼
tailwind.config.ts  →  utilities  →  component classes (index.css)  →  TSX
```

`src/styles/tokens.css` is the **only** file allowed to declare a CSS custom
property. `tailwind.config.ts` is the only bridge from utilities to those
variables. `src/styles/index.css` contains composed recipes only. Components
never contain a colour literal, an ordinary `style={{…}}`, or an arbitrary
spacing/size value; `npm run check:design` enforces this.

### Server branding boundary

`src/lib/theme.ts` maps keys from the backend `themeTokens: Map<string,string>`
onto the Layer 1 properties. Supported aliases include the H08 set
(`primary`, `background`, `foreground`, `success`, `warning`, `info`, `destructive`,
`radius`, `navBg`, `navText`, `buttonPrimary`, …) plus the extended brand anchors
`brandInk`, `brandGold`, `brandTeal`, `accentWarm`, `canvas`, `danger`,
`information`. Unknown camelCase / kebab-case / `--variable` keys are normalized
to a CSS variable safely. Unsafe values containing `; { } < >` are rejected.
`useBranding()` continues to expose only `applicationName`, organization names,
`supportEmail` and `defaultLocale`. No unsupported backend configuration
capability (e.g. an invented dark-theme flag or logo upload) is assumed.

---

## 3. Token reference

### 3.1 Colour

| Intent | Token | Fallback |
| --- | --- | --- |
| Primary / primary ink | `--primary`, `--primary-foreground` | `#1e5fd6` / `#ffffff` |
| Secondary / accent | `--secondary`, `--accent` | `#eef2ff` / `#eef6ff` |
| Warm signature accent | `--ds-color-accent` → `--brand-gold` | `#d1a055` |
| Neutral canvas / surface / ink | `--ds-color-canvas`, `--ds-color-surface`, `--ds-color-neutral-ink` | slate-50 / white / `#0b1220` |
| Success / warning / danger / information | `--success`, `--warning`, `--destructive`, `--info` | green / amber / red / blue |
| Status surfaces + borders + text inks | `--ds-color-status-*-surface`, `--ds-color-status-*-border`, `--ds-color-status-*-ink` | tinted pairs, always with text + border; dedicated darker inks for small text |
| On-brand ink hierarchy | `--ds-color-on-brand-{strong,muted,quiet,faint}` | white opacity ramp |
| Lines | `--ds-color-line`, `--ds-color-line-strong`, `--ds-color-line-soft`, `--ds-color-line-on-brand` | hairline ramp |
| Overlay / topbar | `--ds-color-overlay`, `--ds-color-topbar` | navy 60% / white 94% |
| Focus | `--ds-color-focus` → `--ring` | `#1e5fd6` |
| Chart foundations | `--ds-chart-series-1…5`, `--ds-chart-grid`, `--ds-chart-axis` | primary / gold / teal / blue / slate |

Status is never colour alone: `StatusBadge` always renders a dot **and** text.

### 3.2 Typography

| Scale | Token | Size / line height |
| --- | --- | --- |
| `text-2xs` … `text-5xl` | `--ds-text-*`, `--ds-leading-*` | `0.65rem/1rem` … `3rem/3.5rem` |
| Families | `--font-sans`, `--font-display`, `--font-numeric` | Inter stack / Iowan Old Style stack / monospace stack |
| Weights | `--ds-weight-{regular,medium,semibold,bold}` | 400 / 500 / 600 / 700 |
| Tracking | `--ds-tracking-{tight,normal,wide,micro,eyebrow,brand,eyebrow-wide}` | `-0.02em` … `0.22em` |

### 3.3 Spacing, layout, radii

A single `--ds-space-unit: 0.25rem` (4px) drives `--ds-space-0 … --ds-space-96`;
Tailwind `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `space-*` map to them. Documented
breakpoints: `--ds-breakpoint-sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`,
`2xl 1536px` (mirrored literally in `tailwind.config.ts` because CSS variables
cannot drive `@media`). Layout: `--ds-layout-shell-max 96rem`,
`--ds-layout-content-max 76rem`, `--ds-layout-rail`,
`--ds-layout-dialog`, `--ds-layout-drawer`, `--ds-layout-select-min`,
`--ds-layout-table-min`. Radii derive from the H08 `--radius`:
`sm/md/lg/xl/2xl/pill`.

### 3.4 Elevation and backgrounds

`--ds-shadow-soft`, `--ds-shadow-elevated`, `--ds-shadow-layered` (contact line +
mid depth + ambient lift + inset top highlight), `--ds-shadow-inset`,
`--ds-shadow-pressed`, `--ds-shadow-focus`. No heavy glass: auth/feedback cards
are opaque layered surfaces. Composed recipes: `--ds-gradient-auth`,
`--ds-gradient-brand`, `--ds-gradient-surface`, `--ds-gradient-primary`.
`color-mix()` lets the primary gradient follow a server-provided `--primary`
where supported, with a literal fallback declaration for older browsers.

### 3.5 Motion and states

`--ds-duration-instant 80ms`, `fast 150ms`, `standard 240ms`,
`entrance 360ms`, `shimmer 1.6s`; easings `standard`, `emphasized`, `exit`.
States: `--ds-state-hover-light/active-light/selected-light/selected-ink`,
`hover-dark/active-dark/selected-dark`, `disabled-opacity`, `loading-opacity`,
`--ds-focus-ring-{width,offset,color}`. Only purposeful motion exists:
`fade-up` entrance, `shimmer` loading, `spin` loading. All are neutralized by the
global `@media (prefers-reduced-motion: reduce)` override. No continuous
decorative movement, WebGL or heavyweight 3D.

---

## 4. Component contracts

| Component | Variants / API | Notes |
| --- | --- | --- |
| `Button` | `default · secondary · outline · ghost · destructive · link · gold`; `default · sm · lg · icon`; `loading`, `asChild` | Token-driven hover/active/pressed/disabled/loading, `aria-busy`, visible focus ring. |
| `Surface` | `raised · flat · inset · quiet · brand`; `none · sm · md · lg`; `interactive` | Single layered-surface primitive; `surfaceVariants` is exported. |
| `Card` / `CardHeader/Title/Description/Content` | existing API unchanged | Now uses the shared `surface-layered` recipe. |
| `PageHeader` | `eyebrow, title, description, status, meta, actions, id` | One heading hierarchy + signature rule + responsive stacking for all modules. |
| `DataVizFrame` | no props | Chart/data foundation with an explicit empty state; no fabricated values or controls. |
| `AmbientCanvas` | `className?` | Static brand depth (grid, rings, glow); `aria-hidden`, no animation. |
| `Input`, `PasswordInput`, `SelectField`, `SelectTrigger/Content/Item` | existing APIs | Refined borders, layered shadows, hover/focus/disabled states. |
| `Dialog`/`ConfirmDialog`, `Drawer`, `DropdownMenu`, `Tooltip`, `Toaster` | existing APIs | Layered elevation, consistent radii and focus treatment. |
| `Table*` / `TableWrapper` | existing APIs | `overflow-x-auto max-w-full` + `min-w-table` preserved for small screens. |
| `Alert`, `Badge`/`StatusBadge`, `Skeleton`, `FormField` | existing APIs | Semantic alert, dot+text status, token skeleton, described controls. |

All new components are used by current screens; no dead or placeholder controls
were introduced.

---

## 5. Screens improved

- **Installation / initial setup** — `/bootstrap`: layered form card, readable
  brand panel, associated hints, responsive single-column fields.
- **Authentication** — `/login`, `/forgot-password`, `/reset-password`,
  `/change-password`: consistent split brand canvas, refined card/input/button,
  accessible descriptions.
- **Application shell** — `AppShell`, `Sidebar`, `Topbar`, `MobileNav`,
  `UserMenu`, `Breadcrumbs`: gradient navigation rail, gold active indicator,
  elevated topbar, ambient page canvas, preserved collapse/drawer behavior.
- **Dashboard foundation** — `/app/dashboard` and all permission-gated
  placeholder routes: `PageHeader`, layered `Surface` cards, reporting/chart
  empty-state foundation, contract-authority note. No business module is
  implemented and no business data is fabricated.
- **Feedback states** — error, access denied, not found, full-page loader,
  initialization error, auth success: opaque layered cards, tinted icon tiles,
  consistent typography.

---

## 6. Responsive behavior

| Range | Behavior |
| --- | --- |
| Desktop ≥ 1440px | Two-column institutional auth canvas; persistent gradient sidebar; max-width content column with three-up card grid. |
| Laptop 1024–1439px | Same shell; content narrows, grid reflows at `xl`. |
| Tablet 768–1023px | Brand panel hidden; mobile navigation drawer; two-up cards; single-column forms; header metadata wraps. |
| Mobile 320–767px | Compact brand header, one-column forms, one-column cards, drawer navigation, no horizontal scroll, ≥40px touch targets. |

Verified at **1440×900, 1280×800, 834×1112, 768×1024, 390×844 and 320×720**
by `scripts/visual-audit.mjs` (30 route/viewport checks) and at 1440×900 /
834×1112 / 390×844 by the pre-existing `scripts/responsive-check.mjs`
(27 route/viewport checks across nine canonical paths).

---

## 7. Accessibility and performance

- Semantic `h1`/`h2` hierarchy, labelled icon buttons, `aria-label` on nav and
  drawer, `role="alert"`, `role="img"` descriptions, `aria-busy`,
  `aria-invalid`, `aria-describedby` on nested controls.
- Visible `:focus-visible` outline from `--ds-focus-ring-*`; per-control rings
  on branded surfaces; keyboard-operable Radix dialogs/drawers/selects/menus.
- Status uses dot + text, never colour alone. `npm run check:design` resolves
  the CSS variable chain and verifies **19 token pairs** at ≥ 4.5:1 (body,
  muted, brand ink, primary/destructive buttons, status text on tints, gold).
  This is a deterministic token-pair check, **not** a full WCAG/axe audit.
- `prefers-reduced-motion` collapses all animation/transition durations.
- No new runtime dependencies. No images, fonts, WebGL, heavy blur or
  continuous animation. CSS is a single token stylesheet plus component layer;
  production build remains code-split per route.

---

## 8. Future-module patterns (documentation only, not implemented)

| Future module | Reusable pattern supplied now |
| --- | --- |
| Expense requests, request details/timelines | `PageHeader` + `Surface` + `FormField`/`Input`/`SelectField` + `TableWrapper` + `StatusBadge` + timeline-safe status tokens. |
| Approval inbox / workflows | `Surface` cards, `Badge` counts from the existing shell badge hooks, `ConfirmDialog`, `Alert`. |
| Documents / attachments | `Surface` inset/quiet variants, `Button` outline/ghost, status surfaces. |
| Notifications | `Badge`/`StatusBadge`, `Alert`, `Toaster`, topbar badge pattern. |
| Reports / exports | `DataVizFrame` empty-state pattern, `--ds-chart-*` tokens, `TableWrapper`, `PageHeader` actions slot. |
| Admin / configuration, banking operations | `Surface` variants, `SelectField`, `Dialog`, token-driven states and typography. |

These are patterns and tokens only. Step 2 business modules, endpoints, DTOs,
permissions, fake integrations and fabricated business data remain out of scope.

---

## 9. Governance and verification

| Command | Purpose |
| --- | --- |
| `npm run check:design` | `scripts/design-system-check.mjs`: every `var(--…)` declared, H08 keys present, all token groups present, no duplicate tokens, no colour literals / inline CSS / arbitrary values / heavy blur / continuous decoration in TSX, plus 19 WCAG token-pair contrast checks. Runs in `Frontend CI`. |
| `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` | Standard gates. |
| `npm run responsive:check` | 9 routes × 3 viewports with handover-shaped mocked envelopes; overflow, touch targets, accessible names, form columns, table scroll, nav behavior, console/runtime errors. |
| `npm run visual:audit -- --base-url=… --out=…` | `scripts/visual-audit.mjs`: 5 routes × 6 viewports, horizontal overflow, touch targets, accessible names, focus visibility, reduced-motion compliance, screenshots and optional before/after pixel-diff. Contrast is verified separately by `check:design`. |

Screenshots are committed under `docs/design-system/screenshots/`, together with
`visual-audit.json`. The before/after comparison used a captured pre-change
baseline (not committed) and reported changed-pixel ratios per viewport; it is a
visual-difference check, not a full visual-regression service.

---

## 10. Limitations and decisions requiring owner approval

1. **Server theme scope.** Only `themeTokens` (and public configuration text /
   locale fields) are applied. `activeThemeName` / `activeThemeType` are exposed by
   the backend contract but are not interpreted as a dark-mode switch; no dark
   palette is shipped. Approve whether a full dark theme is wanted.
2. **Contrast verification is targeted, not a full WCAG/axe certification.** The
   governance script resolves 19 documented token pairs to ≥ 4.5:1, including
   status text on tinted surfaces and on-brand ink on navy. A dedicated
   axe/WCAG 2.1 AA page-level audit remains a separate task.
3. **No live backend.** Auth/installation flows were verified against
   handover-shaped intercepted envelopes in a real browser and by unit/flow
   tests. No Spring Boot runtime, PostgreSQL or production deployment was used.
4. **Chart foundation is an empty state.** Series colours and axes exist as
   tokens and a frame only; charting library, exports and real series are future
   module work.
5. **No new dependencies.** Motion, layering and governance use existing CSS,
   Tailwind, Radix and `puppeteer-core`/`@sparticuz/chromium` dev tooling.
6. **Brand headline fix changes a base rule.** Headings now inherit their
   surface's colour; any future dark surface must set its own ink explicitly.
