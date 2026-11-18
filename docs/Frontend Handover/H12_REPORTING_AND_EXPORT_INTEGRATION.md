# H12 — Reporting & Export Integration

Source: `com.edam.reporting.controller.ReportingController`, `ReportingDtos.java`,
`ReportingService.java` (including `streamExcel()` SXSSF writer).

## 1. Endpoints (RPT-*)

| ID | Method | Path | Perm | Purpose |
|----|--------|------|------|---------|
| RPT-001 | GET | `/api/v1/reporting/dashboard` | `report:view` | Dashboard summary (metric cards, distributions, trend) |
| RPT-002 | POST | `/api/v1/reporting/expense-requests/export` | `report:export` | Stream a CSV or XLSX export of the expense-requests register |
| RPT-003 | GET | `/api/v1/reporting/expense-requests/register` | `report:view` | Paginated register view (with totals + available columns) |
| RPT-004 | GET | `/api/v1/reporting/reports` | `dashboard:manage` | Catalogue of available (system-defined) reports |
| RPT-005 | GET | `/api/v1/reporting/widgets` | `dashboard:manage` | Catalogue of configurable dashboard widgets |

## 2. Dashboard (RPT-001)

Returns `DashboardSummary`:

| Field | Type | Notes |
|-------|------|-------|
| `baseCurrencyCode` | string | Installation default currency (ISO code) — all monetary values on the dashboard are in this currency, converted using the exchange rate at submission time |
| `metrics` | `MetricCard[]` | Scalar KPI cards: key, label, value, unit, subtitle |
| `byStatus` | `DistributionRow[]` | Count + amount grouped by request status |
| `byDepartment` | `DistributionRow[]` | Grouped by department |
| `byCategory` | `DistributionRow[]` | Grouped by expense category |
| `byExpenseType` | `DistributionRow[]` | OPEX vs CAPEX (plus STA if configured) |
| `trend` | `TrendPoint[]` | Time-bucketed series (bucket start/end, count, amount) — line/area chart |

UX notes:
- Render metric cards in a responsive grid (4 across on xl, 2 on md, 1 on mobile).
- Distributions render as horizontal bar charts or donut (byStatus).
- Trend renders as a `<Recharts LineChart/AreaChart>` with a date-range control; default is
  MTD, switchable to QTD/YTD/Last-90/Custom.
- All amounts use `<MoneyText currency={baseCurrencyCode} />`.

## 3. Register report (RPT-003)

Accepts `ReportFilter` + standard paging (`page`, `size`, `sort`):

```ts
interface ReportFilter {
  departmentId?: UUID;
  branchId?: UUID;
  categoryId?: UUID;
  subcategoryId?: UUID;
  requesterId?: UUID;
  expenseType?: "OPEX" | "CAPEX";
  status?: Status;
  from?: Instant;      // submittedAt ≥ from
  to?: Instant;        // submittedAt ≤ to  (must be ≥ from, else 400 VALIDATION_FAILED)
  currency?: string;   // ISO code
  search?: string;     // free-text (requestNumber / requester / title)
}
```

Response: `RegisterResponse { rows: RegisterRow[], total, page, size, totals: RegisterTotals, availableColumns: string[] }`.

- `RegisterTotals` gives aggregate counts/amounts (all in base currency) for the current
  filter — use them to render summary chips above the table.
- `availableColumns` lets the UI populate the column-chooser; server decides which columns the
  caller is allowed to see based on permissions/configuration.
- All filters AND together. Empty filter returns everything in the user's data scope.

## 4. Export (RPT-002) — **XLSX is IMPLEMENTED; PDF/print are NOT**

⚠️ **Important correction from the prior handover:** XLSX (Excel) **is** implemented, via
`ExportFormat.EXCEL` and `ReportingService.streamExcel()` using Apache POI SXSSF streaming
(so it handles very large result sets without buffering the whole workbook in memory). Only
**PDF** and **print-friendly rendering** are not implemented.

Request body:
```ts
interface ExportRequest {
  reportKey: "expense-requests" | ... ;  // start with "expense-requests"; extend per catalogue
  filter: ReportFilter;
  format: "CSV" | "EXCEL";
}
```

Response: a raw binary stream (no `ApiResponse` envelope), with:
- CSV: `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename=…`
- XLSX: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
  `Content-Disposition: attachment; filename=…`

Frontend download flow:
1. User clicks "Export" → opens dialog; chooses format (CSV/XLSX) and confirms filters.
2. POST with body; `responseType: 'blob'` (axios) or `fetch().then(r => r.blob())`.
3. Read filename from `Content-Disposition` (parse `filename*=UTF-8''…` first, fall back to `filename=…`).
4. Create object URL, click a hidden `<a download>` pointing at it, then revoke.
5. Show a progress indicator during the stream; for very large files, the server flushes the
   first bytes quickly, so browser-native download progress is sufficient.

PDF / print buttons in the export dialog must be rendered as **disabled with tooltip "Coming
soon"** (see H15 open decision).

## 5. Idempotency & safety for exports

- Exports are read-only queries; `Idempotency-Key` is not required (POST is used because the
  filter payload may exceed URL length limits).
- CSRF header IS required (it's a POST).
- Do NOT cache export blobs in localStorage/sessionStorage; they can be large. Cache only via
  browser HTTP cache (server sets appropriate `Cache-Control: no-store` for exports).

## 6. Widget catalogues (RPT-004, RPT-005)

Admin-only (`dashboard:manage`) endpoints that return catalogues of available reports and
dashboard widgets for configuration UI. Phase 2.
