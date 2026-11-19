# EDAM — Permanent Visual Identity & Design System

**Visual direction: "The Institutional Register."** Warm ivory paper, deep
ink-green authority, a single petrol action colour and brass used only as
hairlines, rules and seals. The product is composed like an editorial banking
register — typographic hierarchy, numbered rows and ruled surfaces — rather
than assembled from generic rounded SaaS dashboard cards.

Status: refined on `arena/41408cdf-edam-frontend` for **PR #4 review**. This
document is the product-wide design contract. It does not implement future
business modules, change API contracts, or modify the 19 finalized
`Frontend Handover/` documents. PR #4 remains open and unmerged.

---

## 1. Baseline review and the PR #4 refinement

The merged baseline already had a working token file, Tailwind bridge, Radix UI
kit, permission-aware shell, auth/installation flows and a 27-check responsive
harness. The first design-system pass (commit `c7a0cbb`) fixed a real
dark-on-navy headline defect and centralized tokens, but the PR #4 review
correctly judged the result "a conventional SaaS admin template". This pass
re-art-directs the composition rather than tweaking colours or shadows.

| PR #4 review finding | Resolution |
| --- | --- |
| Generic navy-and-gold SaaS identity. | New warm-ivory / ink-green / petrol / brass-hairline palette; H08 stock fallbacks re-art-directed while server `themeTokens` remains authoritative. |
| Left brand panel was a generic gradient with circles/glow and two cards. | Editorial authority panel: serif wordmark, huge display headline, brass ledger rules, a numbered "operating principles" register, a large faint register numeral and static ruled paper. No circles, glows or motion. |
| Bootstrap form was a flat card with repetitive fields. | Paper sheet with a brass top rule, three numbered sections (`01` credential, `02` identity, `03` access), monospace helper notes, a left-ruled validation alert and a prominent full-width installation action. |
| Dashboard had a generic sidebar, three repetitive intro cards, excessive placeholder prose and an empty chart box. | Numbered "workspace register" navigation; one deep-ink focal `EditorialPanel` with a serif statement and brass `01`; a ruled foundation register instead of three cards; a dark ruled reporting plate with an explicit `NO LIVE DATA` stamp; a compact contract-authority footnote. |
| Sample identity, email, organization, counts and `RPT-001` appeared as if real. | Every mocked value is now unmistakably synthetic and labelled `DEVELOPMENT PREVIEW`; hardcoded endpoint-group/status/category literals were removed from product code. See §10. |
| No visual focal point. | The full-width ink-green workspace statement is the deliberate focal point on every placeholder route. |

**Concise plan executed:** (1) reconsider palette, typography, proportion and
surface treatment; (2) rebuild `tokens.css` values while preserving the five
layer architecture and H08 override boundary; (3) add the smallest set of
genuinely used editorial primitives; (4) re-compose bootstrap, public auth,
shell and dashboard; (5) isolate/label all preview data; (6) capture before /
after screenshots and pixel diff; (7) run all gates and update PR #4 without
merging.

---

## 2. Architecture

```
PublicConfigurationResponse.themeTokens
        │  src/lib/theme.ts  (safe runtime overrides; no invented capabilities)
        ▼
Layer 1  CONTRACT BOUNDARY   H08 keys, re-art-directed stock fallbacks
Layer 2  PRIMITIVES          raw ivory / ink / petrol / brass palette
Layer 3  SEMANTIC COLOURS    --ds-color-*, status inks, --ds-chart-*
Layer 4  SCALES              type / space / radius / elevation / motion /
                            states / layout / breakpoints
Layer 5  RECIPES             gradients, paper sheets, authority panel,
                            reporting plate, ledger rules, shadows, scrollbars
        │
        ▼
tailwind.config.ts  →  utilities  →  index.css recipes  →  TSX
```

`src/styles/tokens.css` is the **only** file allowed to declare a CSS custom
property. `tailwind.config.ts` is the only bridge from utilities to those
variables. `src/styles/index.css` contains composed recipes only. Components
never contain a colour literal, an ordinary `style={{…}}`, or an arbitrary
spacing/size value; `npm run check:design` enforces this.

### Server branding boundary

`src/lib/theme.ts` maps keys from the backend `themeTokens: Map<string,string>`
onto Layer 1. Supported aliases include the H08 set (`primary`, `background`,
`foreground`, `success`, `warning`, `info`, `destructive`, `radius`, `navBg`,
`navText`, `buttonPrimary`, …) plus extended anchors `brandInk`, `brandGold`,
`brandTeal`, `accentWarm`, `canvas`, `danger`, `information`. Unknown
camelCase / kebab-case / `--variable` keys are normalized safely; values with
`; { } < >` are rejected. `useBranding()` continues to expose only
`applicationName`, organization names, `supportEmail` and `defaultLocale`.
No unsupported capability (dark-mode flag, logo upload, invented config) is
assumed.

> **Decision requiring approval:** the H08 stock fallback values were
> re-art-directed (see §3). The finalized H08 handover document still describes
> the earlier Phase 1 blue stock defaults; that document was intentionally not
> modified. Server `themeTokens` overrides remain authoritative.

---

## 3. Token reference

### 3.1 Colour

| Intent | Token | Value |
| --- | --- | --- |
| Canvas / paper | `--ds-color-canvas`, `--ds-color-surface` | `#f5f1e7` / `#fbf8f1` |
| Ink | `--ds-color-neutral-ink`, `--ds-color-neutral-ink-muted` | `#12201c` / `#5c655d` |
| Primary action | `--primary`, `--primary-foreground` | `#0b5d54` / `#ffffff` |
| Secondary / accent | `--secondary`, `--accent` | `#e4ece7` / `#e6f0ec` |
| Signature hairline | `--ds-color-accent` → `--brand-gold` | `#a9783c` (brass) |
| Authority surfaces | `--brand-ink`, `--brand-navy`, `--ds-color-surface-brand-end` | `#081713` / `#0d211c` / `#12352e` |
| Lines | `--ds-color-line`, `--ds-color-line-strong`, `--ds-color-line-accent` | `#ddd6c6` / `#c9c0ae` / brass 55% |
| On-brand ink ramp | `--ds-color-on-brand-{strong,muted,quiet,faint}` | white 0.92 / 0.72 / 0.6 / 0.55 |
| Status | `--success`, `--warning`, `--destructive`, `--info` | green / amber / red / blue |
| Status surfaces + inks | `--ds-color-status-*-surface/-border/-ink` | warm tinted paper + darker text inks |
| Focus / overlay / topbar | `--ds-color-focus`, `--ds-color-overlay`, `--ds-color-topbar` | petrol / ink 62% / ivory 96% |
| Chart foundations | `--ds-chart-series-1…5`, `--ds-chart-grid`, `--ds-chart-grid-strong`, `--ds-chart-axis` | petrol / brass / teal / blue / slate + ruled grid |

Status is never colour alone: `StatusBadge` renders a dot **and** text; the
`preview` badge is dashed and monospace.

### 3.2 Typography

Serif display (`--font-display`) carries headlines and the EDAM wordmark;
Inter (`--font-sans`) carries UI text; `--font-numeric` carries section
indices, references, breadcrumbs, helper notes and stamps. Sizes
`2xs…6xl` with paired line heights, weights 400/500/600/700 and tracking
`display/tight/normal/wide/micro/eyebrow/brand/eyebrow-wide` are all tokenized.

### 3.3 Spacing, layout, radii

One `--ds-space-unit: 0.25rem` drives `--ds-space-0…96`; Tailwind `p-*`,
`m-*`, `gap-*`, `w-*`, `h-*` map to them. Breakpoints `sm 640`, `md 768`,
`lg 1024`, `xl 1280`, `2xl 1536` are mirrored literally in Tailwind.
`--radius: 0.375rem` produces deliberately sharper `sm/md/lg/xl/2xl/pill`
radii than a typical SaaS card.

### 3.4 Elevation, backgrounds, motion, states

`--ds-shadow-soft/elevated/layered/inset/pressed/focus` are restrained
three-part shadows. Composed recipes: `--ds-gradient-auth` (ivory),
`--ds-gradient-brand` (ink-green), `--ds-gradient-surface` (paper),
`--ds-gradient-primary` (petrol, `color-mix()` follows server `--primary`).
Durations `80/150/240/360ms` + shimmer `1.6s`; easings `standard`,
`emphasized`, `exit`. Hover/active/selected/focus/disabled/loading/pressed
states are tokenized. Only purposeful `fade-up`, `shimmer` and `spin` motion
exists; all collapses under `prefers-reduced-motion`. No continuous decorative
movement, WebGL, heavy blur or animation libraries.

---

## 4. Component contracts

| Component | Role |
| --- | --- |
| `Surface` / `surfaceVariants` | `raised/flat/inset/quiet/brand` layered paper primitives. |
| `SectionLabel` | Monospace numbered section rule (`form-section-label`), `paper` or `onBrand` tone. |
| `RegisterRow` | Ruled, numbered, hoverable content row replacing repetitive cards. |
| `EditorialPanel` | Deep-ink focal panel with serif statement, brass rule and `NO LIVE DATA` footer. |
| `PageHeader` | Serif title, monospace eyebrow, preview/status/meta slots, brass ledger rule. |
| `BrandMark` | Brass-ruled serif "E" monogram plate + EDAM wordmark (no generic bank icon). |
| `AmbientCanvas` | Static ruled ledger paper, brass margin rule, corner marks, faint `01`. |
| `DataVizFrame` | Ruled reporting plate with axis ticks (unlabelled) and an explicit `NO LIVE DATA` stamp. |
| `Badge` / `StatusBadge` | Adds `preview` (dashed monospace) variant; status stays dot + text. |
| `Button`, `Input`, `PasswordInput`, `Select*`, `Alert`, `Skeleton`, `Table*`, `Dialog`, `Drawer`, `DropdownMenu`, `Tooltip`, `Toaster`, `Card*`, `FormField` | Existing predictable APIs, refined with the new paper/hairline treatment. `FormField` associates hints/errors with nested controls and now renders a left-ruled error with an icon. |

All new components are used by current screens. No dead code, no
nonfunctional controls, no new dependencies.

---

## 5. Screens improved

- **Installation / bootstrap** — editorial authority panel, balanced 0.9/1.1
  split, three numbered form sections, prominent petrol action, clear
  validation. Field requirements, `X-Installation-Token` header, HTTP 201
  handling and "bootstrap does not sign in" behavior are unchanged.
- **Authentication** — `/login`, `/forgot-password`, `/reset-password`,
  `/change-password`, success cards: consistent paper sheet, serif titles,
  ruled sections, clear errors.
- **Application shell** — numbered register sidebar with brass active rule,
  ivory topbar with serif page title, brass hairline, monogram avatar, drawer
  navigation. Collapse/drawer/permission behavior preserved.
- **Dashboard foundation** — one focal panel, ruled foundation register,
  reporting plate, compact contract footnote. No KPIs, transactions, charts
  with values or fictional activity.
- **All permission-gated placeholder routes** share the same composition.

---

## 6. Responsive behavior

| Range | Behavior |
| --- | --- |
| Desktop ≥1440 / laptop 1024–1439 | Split authority/form canvas; persistent register sidebar; wide focal panel; 3/2-column register + reporting plate. |
| Tablet 768–1023 | Brand panel hidden, drawer navigation, single-column forms, stacked register and reporting plate. |
| Mobile 320–767 | Compact monogram header, one-column ruled form sections, one-column register, drawer, no horizontal scroll, ≥40px touch targets. |

Verified at **1440×900, 1280×800, 834×1112, 768×1024, 390×844, 320×720**
by `scripts/visual-audit.mjs` (30 route/viewport checks) and at 1440×900 /
834×1112 / 390×844 by `scripts/responsive-check.mjs` (27 checks across nine
canonical paths).

---

## 7. Accessibility and performance

Semantic headings, `aria-describedby`/`aria-invalid` on nested controls,
labelled icon buttons and nav links, `role="alert"`, `role="img"` descriptions,
`aria-busy`, visible `:focus-visible` rings, `prefers-reduced-motion`
compliance verified in-browser. `check:design` resolves the CSS variable chain
and verifies **19 token pairs ≥ 4.5:1**. This is a deterministic token-pair
check, **not** a full WCAG/axe audit. No new runtime dependencies, images,
fonts, WebGL, heavy blur or continuous animation; route-level code splitting
retained.

---

## 8. Future-module patterns (documentation only)

Expense requests / details / timelines, approval inbox / workflows, documents,
notifications, reports / exports, admin / configuration and banking operations
all reuse `PageHeader`, `SectionLabel`, `RegisterRow`, `Surface`, `FormField`,
`TableWrapper`, `Badge`, `ConfirmDialog`, `DataVizFrame` and the chart tokens.
These are patterns and tokens only — no Step 2 modules, endpoints, DTOs,
permissions, fake integrations or fabricated business data exist.

---

## 9. Governance and verification

| Command | Purpose |
| --- | --- |
| `npm run check:design` | Every `var(--…)` declared; H08 keys present; all token groups present; no duplicate tokens; no colour literals / inline CSS / arbitrary values / heavy blur / continuous decoration / **hardcoded sample identity, institution, endpoint-group or placeholder-status literals** in product code; 19 WCAG token-pair contrast checks. Runs in `Frontend CI`. |
| `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run types:check` | Standard gates. |
| `npm run responsive:check` | 9 routes × 3 viewports, overflow / touch targets / accessible names / form columns / table scroll / nav / console errors. |
| `npm run visual:audit` | 5 routes × 6 viewports, screenshots, overflow / targets / names / focus / reduced-motion, optional before/after pixel diff. Injects a `DEVELOPMENT PREVIEW` banner into screenshots only. |

Screenshots: `docs/design-system/screenshots/` (refined, desktop/laptop/tablet/
tablet-small/mobile/mobile-small) and `docs/design-system/comparison/before/`
(PR #4 baseline). `visual-audit.json` carries the preview provenance and
per-viewport results.

---

## 10. Displayed data provenance (PR #4 review requirement)

Every value visible in the committed screenshots was traced to its source.

| Displayed value | Source | Classification | Action |
| --- | --- | --- | --- |
| `Preview Session`, `preview.session@example.invalid` | `scripts/visual-audit.mjs` / `scripts/responsive-check.mjs` intercepted `/api/v1/auth/me`; `UserMenu` renders `user.displayName` / `user.email`. | Explicitly labelled development preview (synthetic). | Renamed from a realistic identity to an unmistakably synthetic one; `DEVELOPMENT PREVIEW` banner on every screenshot; provenance in `visual-audit.json`. Product code still renders only backend `/auth/me` data. |
| `Preview Institution`, `support@example.invalid` | Intercepted `/api/v1/public/configuration`; `useBranding()` renders organization / support. | Explicitly labelled development preview (synthetic). | Renamed from "Example Institution"; labelled. No production claim. |
| Notification `2`, approval `3` | Intercepted `/api/v1/notifications/unread-count` and `/api/v1/approvals/count` in the visual/responsive harnesses; `useShellBadges()` polls the documented endpoints only with `notification:view` / `approval:view`. | Explicitly labelled development preview (synthetic counts). | Kept to verify legitimate badge behavior; labelled as mock counts in harness comments and audit metadata. No real institutional counts are claimed. |
| `RPT-001 · report:view` and other endpoint-group badges | Hardcoded `endpointGroup` props in `src/routes/app/*` (PR #4). | Hardcoded placeholder content (contract references, not backend data). | **Removed** from all 9 placeholder routes and from `ModulePlaceholder`. The finalized handover docs remain the authoritative source for those references; they were not modified. |
| `Foundation ready` | Hardcoded `StatusBadge` in `ModulePlaceholder`. | Hardcoded placeholder status. | Replaced with a dashed `DEVELOPMENT PREVIEW` badge. |
| `Commercial banking` | Hardcoded category pill in `PublicLayout`. | Hardcoded descriptor. | Replaced with `Institutional edition` (product edition, not institution data) — still clearly a UI label, not data. |
| `01`, `02`, `03`, `FOUNDATION / 01`, `NO LIVE DATA` | Section indices and empty-state copy in components. | Composition numbering / explicit empty state. | Retained; never presented as business values or dates. |

`design-system-check.mjs` now fails CI if any of the removed realistic
identities, institution names, endpoint-group literals, `Foundation ready`,
`Commercial banking` or `endpointGroup` props reappear in product code.
Test fixtures (`src/test/fixtures.ts`) and harnesses are explicitly labelled
development previews and are not product UI.

---

## 11. Limitations and decisions requiring owner approval

1. **Stock fallback palette re-art-directed.** H08 contract keys and server
   override behavior are preserved, but the literal stock fallbacks changed.
   H08's finalized text still describes the earlier blue defaults; it was not
   edited. Confirm this is acceptable or supply server `themeTokens` for the
   production palette.
2. **Server theme scope.** Only `themeTokens` and public-config text/locale
   fields are applied; `activeThemeName` / `activeThemeType` are not interpreted
   as a dark-mode switch and no dark palette ships.
3. **Contrast verification is targeted**, not a full page-level axe/WCAG 2.1 AA
   certification (19 deterministic token pairs ≥ 4.5:1).
4. **All screenshots are development previews** with intercepted envelopes.
   No live Spring Boot backend, PostgreSQL or production deployment was used;
   no live-backend or production verification is claimed.
5. **Chart foundation is an empty state.** Series colours, ruled grid and axis
   treatments exist as tokens; charting library, exports and real series remain
   future module work.
6. **Validation timing unchanged.** `react-hook-form` still validates on submit
   (field requirements / installation behavior preserved); only the visual
   treatment of messages changed.
7. **No new dependencies**, heavyweight animation, WebGL, heavy blur or
   continuous decorative motion.
