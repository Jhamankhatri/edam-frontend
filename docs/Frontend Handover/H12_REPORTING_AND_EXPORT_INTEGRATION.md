# H12 — Reporting & Export Integration

## Dashboard (RPT-001)
- `GET /reporting/dashboard` accepts 13 filter params (departmentId, branchId, categoryId,
  subcategoryId, requesterId, expenseType, currency, status, from, to, search, lookbackDays).
- Response: `DashboardResponse { generatedAt, currency, baseCurrencyCode, kpis, distributions[],
  trend[] }`. KPI values are numbers (BigDecimal); `distribution.percentage` is double.

## Register (RPT-003)
- `GET /reporting/expense-requests/register` returns `RegisterResponse` (NOT PageResponse).
- Default: page=0, size=50, sort=submittedAt,desc; cap 500 rows (server-side).
- Totals block gives count + baseAmount for total/pending/approved/rejected/returned/cancelled.
- `availableColumns` drives column toggles.
- Filter model mirrors dashboard filter (no `lookbackDays`).

## Export (RPT-002)
- `POST /reporting/expense-requests/export` with `ExportRequest { reportKey, filter, format }`.
- `format: "CSV" | "EXCEL"` (PDF NOT implemented; print NOT implemented).
- Response: raw bytes (CSV: `text/csv; charset=UTF-8` with BOM + formula-injection protection;
  XLSX: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` via SXSSF).
- Server enforces `EXPORT_ROW_LIMIT` → 400 EDAM-1001 if exceeded; error message cites the
  matched count so the UI can show "Too many results: narrow the filter".
- Trigger browser download: create `URL.createObjectURL(blob)` on the response body; attach to
  anchor with the `Content-Disposition` filename; revoke after click.
- PDF/print buttons must render as disabled "Coming soon" (OD-1).
- **Audit export is NOT implemented** — there is no endpoint; `audit:export` permission is
  reserved for future use and has no UI in Phase 1.
