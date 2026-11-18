# H14 — Phased Roadmap

The frontend ships in four phases. Each phase produces working, demonstrable software. Phase 0
(this package) is documentation only — no code.

## Phase 0 — Documentation blueprint (this handover) ✅

**Scope:** This document package.
**Done when:**
- 18 consolidated Markdown files (00_README + H01–H17) complete and internally consistent.
- 10 verified inaccuracies from `docs/Frontend Integration/` corrected (see 00_README §Correction log).
- Coverage matrix (H16) shows 100% of Phase-1 endpoints mapped to screens/flows.
- Backend working tree untouched at `93a89eb`.
**This phase is COMPLETE with the delivery of this directory.**

## Phase 1 — Core workspace (target: 4–6 weeks)

**Goal:** Requester + Approver happy path — the smallest set that lets a real institution pilot
EDAM end-to-end.

**In scope:**
- App scaffolding: React 18 + TS + Vite + TanStack Query/Router + Tailwind + shadcn/ui (H07).
- Authentication flows W1–W3 (login, logout, bootstrap, forgot/reset, forced password change).
- Dashboard (Workspace) with metric cards and trend (RPT-001).
- My Requests & All Requests registers (REQ-001), Request detail (REQ-003 + timeline REQ-005).
- Create & edit request wizard (REQ-002, REQ-004) — OPEX and CAPEX paths, validation.
- Submit, Cancel actions (REQ-006, REQ-007) including resubmission from RETURNED state.
- Approval inbox (APL-001, APL-002) + case file (APL-003) with Approve/Reject/Forward/Revert (APL-004–008).
- Documents tab on requests: upload (DOC-001), list (DOC-002), signed-URL download (DOC-003, DOC-004), scan-status polling, delete (DOC-006).
- CSV + XLSX export for requests register (RPT-002, RPT-003).
- Design system primitives (H08), Shell layout, responsive behaviour down to tablet.
- Notifications: basic inbox (NTF list).
- OpenAPI codegen wired into CI.
- MSW handlers for all Phase-1 endpoints.
- Playwright E2E covering W1–W14.

**Out of scope:** Admin modules, dashboard configurability, PDF, print, websockets, PWA, dark
mode, offline mode, custom reports.

**Done gate:**
- All W1–W14 E2E pass against the backend at `93a89eb` (or a later accepted baseline).
- Lighthouse budgets met on login/dashboard/register/case-file routes.
- 0 TypeScript errors at `strict`; 0 ESLint errors.
- No `any` types in app code (outside generated code).

## Phase 2 — Admin & configuration (target: 6–8 weeks)

**Goal:** All admin modules needed for go-live: user management, roles, organization, master
data, expense configuration, approval limits, committees, delegation, workflow configuration
(without publishing), business rules (read + edit without publish), communication settings,
branding, audit log (view only).

- Reports dashboard widget configurability (RPT-004, RPT-005).
- Audit log viewer + export (AUD-*).
- Integrations: read + connection test (INT-* test).
- PDF and print marked as "Coming soon" in UI.
- Email template editor (TPL-*) and SMTP test (SMT-*).

**Done gate:** Admin can configure a fresh institution from scratch through the UI (excluding
workflow publishing — workflows pre-seeded in Phase 2).

## Phase 3 — Operations hardening & scale

- Workflow publish/retire/versioning (WF publish).
- Business rule publish (BR publish).
- Execute/retry integrations (INT execute).
- Audit export (AUD export).
- Websockets/SSE for real-time approval badges (replacing 60 s polling).
- Global search across requests/documents/users.
- Dark mode (the tokens already support it via CSS vars).
- Offline/draft-sync indicators (no offline submission yet).
- Performance: virtualized registers (10k+ rows), bundle-splitting per admin module.
- Accessibility audit sign-off (WCAG 2.1 AA).

## Phase 4 — Growth & analytics

- Custom report builder (instead of only system reports).
- PDF export & print-friendly views.
- PWA with offline support for form drafts.
- Personal dashboard layout customization per user.
- Localization/RTL.
- Integration event webhooks UI.
- SSO / SAML integration (backend + frontend).

## Cross-phase principles

- **Trunk-based development.** Short-lived feature branches behind feature flags (driven by
  `/public/configuration` feature flags so individual pilots can toggle).
- **Definition of done:** types generated, tests added, E2E for the workflow, accessibility
  checks, docs updated.
- **Baseline bump:** when the backend moves past `93a89eb`, update this handover and bump the
  baseline in H01; do NOT silently drift.
