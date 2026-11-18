# H08 — Design System & UI/UX

Tokens map directly from `themeTokens: Map<string,string>` on the public configuration
response to CSS variables on `:root`. Tailwind uses `var(--…)` values. Keys use the snake-cased
names returned by `ThemeResponse.tokens` (server-driven), with fallback values in
`styles/tokens.css` for when tokens are absent (defensive default).

Tokens (with EDAM-stock defaults used if themeTokens missing):
`--background #fff`, `--foreground #0b1220`, `--muted #f5f7fb`, `--muted-foreground #5b6577`,
`--card #fff`, `--border #e2e6ee`, `--primary #1e5fd6`, `--primary-foreground #fff`,
`--secondary #eef2ff`, `--accent #eef6ff`, `--destructive #c93030`, `--success #1f8a4c`,
`--warning #c47a00`, `--info #2563eb`, `--radius .5rem`.

Status colours: Draft (muted), Pending/Submitted (accent), Approved (green), Rejected/Cancelled (red), Returned (amber). Never rely on colour alone (dot + text).

Components: shadcn/ui-based Button, Input, Select, DataTable, StatusBadge, MoneyText (renders
decimal.js values with currency code — `currencyId` references ISO code from currencies lookup),
DateText, UserAvatar, ConfirmDialog, EmptyState, AccessDenied/NotFound/OfflineState, Topbar,
Sidebar, Toaster.

Responsive: `sm/md/lg/xl/2xl`; sidebar collapses below lg; tables horizontal-scroll below md;
forms single-column below md; touch targets ≥ 40×40 px.

Motion: 150 ms transitions; respect `prefers-reduced-motion`.

A11y: semantic HTML, visible focus rings, keyboard-navigable tables/dialogs, WCAG 2.1 AA
contrast, aria-live for toasts, labelled icon buttons.

Icons: Lucide.
