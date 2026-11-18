# H08 — Design System & UI/UX

This design system is an adaptation of `docs/phase-4j/EDAM_UI_UX_DESIGN_SYSTEM.md`, normalized to
Tailwind / shadcn/ui primitives and to the server-driven theming described in H07 §4.

## 1. Design tokens (CSS custom properties)

All tokens are CSS variables set on `:root` so the server can override them via
`PublicConfigurationResponse`. Tailwind maps to them via `theme.extend.colors.*`.

| Token | Purpose | Default (EDAM stock) |
|-------|---------|----------------------|
| `--background` / `--foreground` | Page surface / body text | `#ffffff` / `#0b1220` |
| `--muted` / `--muted-foreground` | Subdued surfaces (cards, table headers) / captions | `#f5f7fb` / `#5b6577` |
| `--card` / `--card-foreground` | Cards | `#ffffff` / `#0b1220` |
| `--border` | Hairlines / inputs | `#e2e6ee` |
| `--input` | Input borders (same as border, kept separate for dark mode) | `#e2e6ee` |
| `--primary` / `--primary-foreground` | Primary actions, active nav | `#1e5fd6` / `#ffffff` |
| `--secondary` / `--secondary-foreground` | Secondary buttons | `#eef2ff` / `#1e3a8a` |
| `--accent` / `--accent-foreground` | Accents (chips, highlights) | `#eef6ff` / `#0c4a9e` |
| `--destructive` / `--destructive-foreground` | Danger actions, errors | `#c93030` / `#ffffff` |
| `--success` / `--warning` / `--info` | Status tones | `#1f8a4c` / `#c47a00` / `#2563eb` |
| `--radius` | Border radius scale | `0.5rem` |
| `--shadow-sm` / `--shadow-md` | Elevation tokens | `0 1px 2px rgba(10,20,40,.06)` / `0 4px 16px rgba(10,20,40,.08)` |
| `--font-sans` | Body font | `Inter, system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-mono` | Code/IDs | `ui-monospace, SFMono-Regular, Menlo, monospace` |

## 2. Typography

| Use | Size | Weight | Line height | Tracking |
|-----|------|--------|-------------|----------|
| Heading 1 (page) | 24 / 1.5rem | 600 | 1.25 | -0.01em |
| Heading 2 (section) | 20 / 1.25rem | 600 | 1.3 | -0.005em |
| Heading 3 (card) | 16 / 1rem | 600 | 1.4 | 0 |
| Body | 14 / 0.875rem | 400 | 1.5 | 0 |
| Body large | 16 / 1rem | 400 | 1.5 | 0 |
| Small / caption | 12 / 0.75rem | 400 | 1.5 | 0 |
| Button label | 14 | 500 | 1 | 0 |
| Table cell | 13 / 0.8125rem | 400 | 1.4 | 0 |
| Monospace IDs | 12 | 400 | 1.5 | 0 |

## 3. Status colour system

| Status | BG | Text | Border |
|--------|----|------|--------|
| Draft | `--muted` | `--muted-foreground` | `--border` |
| Submitted / Pending approval | `--accent` | `--accent-foreground` | transparent |
| Approved | green-50 | `--success` | green-200 |
| Rejected / Cancelled | red-50 | `--destructive` | red-200 |
| Returned | amber-50 | `--warning` | amber-200 |
| Info | blue-50 | `--info` | blue-200 |

Render status as a `<Badge>` with consistent height (22px) and rounded corners (`--radius-sm`).
Never rely on colour alone — include a dot icon and the status text.

## 4. Spacing & density

- 4 px base unit (`p-1` = 4 px).
- Cards default padding `p-6`; tight registers may use `p-4` for cells, `p-3` for headers.
- Two densities: `default` (workspace forms, dashboards) and `compact` (registers with many
  columns) — toggle via a `data-density="compact"` attribute on `<body>`; Tailwind variants
  `compact:p-2` etc.
- Mobile spacing is identical on all axes (not increased); use `gap-4`/`gap-6` consistently.

## 5. Core components

Built on top of shadcn/ui / Radix. Composed variants:

- `<Button>`: variants `primary | secondary | outline | ghost | destructive`; sizes `sm | md | lg | icon`.
- `<Input>`, `<Textarea>`, `<Select>`, `<Checkbox>`, `<RadioGroup>`, `<Switch>` — all bound to
  react-hook-form via a `<FormField>` wrapper that renders label, input, description, and error
  message consistently.
- `<DataTable>`: wraps TanStack Table with column visibility, pagination, filter bar, row
  selection, density toggle, and empty-state slot.
- `<StatusBadge>`: enum-driven badge (§3).
- `<MoneyText>`: formats decimal strings with currency symbol and thousand separators; never
  converts to `number`.
- `<DateText>`: formats instants in user timezone, with `title` tooltip showing full ISO.
- `<UserAvatar>`: shows user initials + fallback coloured by user id hash; uses profile image
  if added later (Phase 3).
- `<ConfirmDialog>`: standardized destructive confirmation with title, description, confirm
  label, and a free-form remarks input when required (e.g. Reject, Revert, Cancel).
- `<EmptyState>`: icon + heading + body + optional CTA.
- `<AccessDenied/>`, `<NotFound/>`, `<OfflineState/>` route feedback components.
- `<Topbar>`, `<Sidebar>`, `<Shell>` layout components with responsive behaviour.
- `<Toaster>` from sonner with branded styling.

## 6. Responsive breakpoints

| Name | Min width | Target |
|------|-----------|--------|
| sm | 640px | Large phones / small tablets (landscape) |
| md | 768px | Tablets (portrait) |
| lg | 1024px | Tablets (landscape) / small laptops |
| xl | 1280px | Laptops / desktops (primary workspace) |
| 2xl | 1536px | Large monitors |

- Primary layout (sidebar + main) collapses to a hamburger drawer below `lg`.
- Tables add horizontal scroll below `md`; do not attempt to stack all columns vertically —
  registers are productivity tools, horizontal scroll is acceptable.
- Forms switch from 2-column to single-column below `md`.
- Touch targets minimum 40×40 px on mobile (WCAG 2.5.5).

## 7. Motion

- Short transitions (150 ms, ease-out) for hover, focus, modal open/close, sidebar slide.
- No motion that disorients; respect `prefers-reduced-motion` (disable transitions when set).
- Skeleton shimmer uses subtle CSS animation; replace with static grey blocks when
  prefers-reduced-motion is set.

## 8. Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<h1>`–`<h6>` hierarchy, `<table>` for registers).
- All interactive elements have discernible focus rings (orange outline) — do not remove outlines.
- Keyboard navigation supported for all interactive flows (approval actions, table rows
  reachable with arrow keys via Radix).
- Colour contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text (verified via Storybook a11y
  tests in H13).
- Modal dialogs trap focus, return focus on close, and are labelled via `aria-labelledby`.
- Form errors linked to inputs via `aria-describedby` and `aria-invalid`.
- Icon-only buttons have accessible names (`aria-label`).
- Toast notifications are announced via `aria-live="polite"`.
- Loading spinners labelled "Loading"; progress bars expose `aria-valuenow`.

## 9. Iconography

- Use **Lucide icons** (MIT, tree-shakable, consistent stroke) across the app.
- Standard mappings: Dashboard = `LayoutDashboard`, Requests = `FileText`, Approvals =
  `CheckSquare`, Documents = `Paperclip`, Reports = `BarChart3`, Admin = `Settings`,
  Notifications = `Bell`, Logout = `LogOut`, Approve = `Check`, Reject = `X`, Forward =
  `ArrowRightCircle`, Revert = `RotateCcw`, Cancel = `XCircle`, Submit = `Send`.
